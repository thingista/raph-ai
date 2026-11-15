/**
 * AETHER // Pure-JS From-Scratch Neural Language Model
 * Implements a Word-Level Neural Network with:
 *  - Learnable Token Embedding Matrix E (V x D)
 *  - Exponentially Decayed Positional Context Pooling (Context Window = 4)
 *  - Dense Hidden Layer (D x H) + Tanh Activation
 *  - Output Logits Layer (H x V) + Softmax
 *  - Analytical Backpropagation (Cross-Entropy Gradient Descent)
 *  - Hybrid Neural + Interpolated N-Gram Prior for smooth low-resource fluency
 */

const DEFAULT_NEURAL_CORPUS = `
Artificial intelligence is the science of building intelligent machines that reason, learn from experience, and solve complex problems.
A neural network learns patterns by adjusting synaptic weights through backpropagation and gradient descent.
Deep learning transformers use self attention to connect concepts across space and time.
Quantum computing harnesses superposition and entanglement to explore vast computational states simultaneously.
Mathematics is the universal language of nature, describing motion, energy, entropy, and information theory.
In computer science, clean algorithms and data structures turn abstract logic into fast, reliable software systems.
Curiosity drives discovery: every question opens a new horizon of knowledge, creativity, and human understanding.
Raph AI runs completely from scratch inside your browser without any external API keys or cloud dependencies.
When an autonomous agent reasons step by step, it breaks difficult goals into clear verifiable actions.
Science combines empirical observation with mathematical deduction to uncover the fundamental laws of the cosmos.
`.trim();

class FromScratchNeuralLM {
  constructor(embedDim = 24) {
    this.corpusText = DEFAULT_NEURAL_CORPUS;
    this.embedDim = embedDim;
    this.hiddenDim = embedDim;
    this.contextSize = 4;
    this.vocab = [];
    this.wordToIdx = new Map();
    this.epochs = 0;
    this.lossHistory = [];
    this.ngramCounts = new Map(); // contextKey -> Map(nextIdx -> count)

    this.initNetwork(this.corpusText, this.embedDim);
  }

  tokenizeCorpus(text) {
    return text
      .replace(/([.,!?;:])/g, " $1 ")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .filter(Boolean);
  }

  randn(scale = 0.15) {
    // Box-Muller transform from scratch
    const u1 = Math.max(1e-7, Math.random());
    const u2 = Math.random();
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2) * scale;
  }

  initNetwork(corpusText, embedDim = 24) {
    this.corpusText = corpusText || DEFAULT_NEURAL_CORPUS;
    this.embedDim = Number(embedDim) || 24;
    this.hiddenDim = this.embedDim;
    this.epochs = 0;
    this.lossHistory = [];

    const tokens = this.tokenizeCorpus(this.corpusText);
    const unique = Array.from(new Set(tokens.map(t => t.toLowerCase())));
    if (!unique.includes("<unk>")) unique.unshift("<unk>");

    this.vocab = unique;
    this.wordToIdx.clear();
    this.vocab.forEach((w, i) => this.wordToIdx.set(w, i));

    const V = this.vocab.length;
    const D = this.embedDim;
    const H = this.hiddenDim;

    // Weight matrices stored in flat Float64Arrays for fast numeric compute
    this.E = new Float64Array(V * D);
    this.W1 = new Float64Array(D * H);
    this.b1 = new Float64Array(H);
    this.W2 = new Float64Array(H * V);
    this.b2 = new Float64Array(V);

    const scaleD = 1 / Math.sqrt(D);
    const scaleH = 1 / Math.sqrt(H);

    for (let i = 0; i < this.E.length; i++) this.E[i] = this.randn(scaleD);
    for (let i = 0; i < this.W1.length; i++) this.W1[i] = this.randn(scaleD);
    for (let i = 0; i < this.W2.length; i++) this.W2[i] = this.randn(scaleH);

    // Prepare training sequences & N-gram structural prior
    this.samples = [];
    this.ngramCounts.clear();

    const idxSeq = tokens.map(t => this.wordToIdx.get(t.toLowerCase()) ?? 0);
    for (let i = 1; i < idxSeq.length; i++) {
      const start = Math.max(0, i - this.contextSize);
      const ctx = idxSeq.slice(start, i);
      const target = idxSeq[i];
      this.samples.push({ ctx, target });

      // Record bigram & trigram counts for hybrid smoothing
      const biKey = String(ctx[ctx.length - 1]);
      if (!this.ngramCounts.has(biKey)) this.ngramCounts.set(biKey, new Map());
      const biMap = this.ngramCounts.get(biKey);
      biMap.set(target, (biMap.get(target) || 0) + 1);

      if (ctx.length >= 2) {
        const triKey = `${ctx[ctx.length - 2]},${ctx[ctx.length - 1]}`;
        if (!this.ngramCounts.has(triKey)) this.ngramCounts.set(triKey, new Map());
        const triMap = this.ngramCounts.get(triKey);
        triMap.set(target, (triMap.get(target) || 0) + 1);
      }
    }

    // Do a quick warm-start of 15 epochs so the model is immediately useful
    this.trainEpochs(15, 0.09);
  }

  getParamCount() {
    return this.E.length + this.W1.length + this.b1.length + this.W2.length + this.b2.length;
  }

  // Forward pass for a single context array of token indices
  forward(ctxIndices) {
    const V = this.vocab.length;
    const D = this.embedDim;
    const H = this.hiddenDim;

    // 1. Positional-weighted pooling of context embeddings
    const x = new Float64Array(D);
    const weights = [];
    let weightSum = 0;
    for (let i = 0; i < ctxIndices.length; i++) {
      // More recent tokens receive higher attention weight
      const dist = ctxIndices.length - 1 - i;
      const w = Math.exp(-0.45 * dist);
      weights.push(w);
      weightSum += w;
    }
    for (let i = 0; i < ctxIndices.length; i++) {
      const w = weights[i] / (weightSum || 1);
      const tokIdx = ctxIndices[i];
      const offset = tokIdx * D;
      for (let d = 0; d < D; d++) {
        x[d] += w * this.E[offset + d];
      }
    }

    // 2. Hidden layer: h = tanh(x · W1 + b1)
    const h = new Float64Array(H);
    for (let j = 0; j < H; j++) {
      let sum = this.b1[j];
      for (let d = 0; d < D; d++) {
        sum += x[d] * this.W1[d * H + j];
      }
      h[j] = Math.tanh(sum);
    }

    // 3. Output logits: z = h · W2 + b2
    const logits = new Float64Array(V);
    let maxLogit = -Infinity;
    for (let k = 0; k < V; k++) {
      let sum = this.b2[k];
      for (let j = 0; j < H; j++) {
        sum += h[j] * this.W2[j * V + k];
      }
      logits[k] = sum;
      if (sum > maxLogit) maxLogit = sum;
    }

    // 4. Numerically stable Softmax
    const probs = new Float64Array(V);
    let expSum = 0;
    for (let k = 0; k < V; k++) {
      const e = Math.exp(logits[k] - maxLogit);
      probs[k] = e;
      expSum += e;
    }
    for (let k = 0; k < V; k++) {
      probs[k] /= expSum;
    }

    return { x, h, probs, weights, weightSum };
  }

  // Analytical Backpropagation step on all samples
  trainEpochs(numEpochs = 25, lr = 0.08) {
    const V = this.vocab.length;
    const D = this.embedDim;
    const H = this.hiddenDim;

    if (this.samples.length === 0) return { loss: 0, perplexity: 1 };

    let lastLoss = 0;

    for (let ep = 0; ep < numEpochs; ep++) {
      let totalLoss = 0;

      for (const sample of this.samples) {
        const { ctx, target } = sample;
        const { x, h, probs, weights, weightSum } = this.forward(ctx);

        const pTarget = Math.max(1e-9, probs[target]);
        totalLoss += -Math.log(pTarget);

        // dL/dz = probs - one_hot(target)
        const dz = new Float64Array(V);
        for (let k = 0; k < V; k++) dz[k] = probs[k];
        dz[target] -= 1.0;

        // Backprop into W2, b2 and compute dh
        const dh = new Float64Array(H);
        for (let j = 0; j < H; j++) {
          let gradH = 0;
          const hj = h[j];
          const rowOffset = j * V;
          for (let k = 0; k < V; k++) {
            const g = dz[k];
            gradH += g * this.W2[rowOffset + k];
            this.W2[rowOffset + k] -= lr * hj * g;
          }
          dh[j] = gradH * (1 - hj * hj); // derivative of tanh(u) is 1 - tanh^2(u)
        }
        for (let k = 0; k < V; k++) {
          this.b2[k] -= lr * dz[k];
        }

        // Backprop into W1, b1 and compute dx
        const dx = new Float64Array(D);
        for (let d = 0; d < D; d++) {
          let gradX = 0;
          const xd = x[d];
          const rowOffset = d * H;
          for (let j = 0; j < H; j++) {
            const g = dh[j];
            gradX += g * this.W1[rowOffset + j];
            this.W1[rowOffset + j] -= lr * xd * g;
          }
          dx[d] = gradX;
        }
        for (let j = 0; j < H; j++) {
          this.b1[j] -= lr * dh[j];
        }

        // Backprop into Embedding table E for each context token
        for (let i = 0; i < ctx.length; i++) {
          const w = weights[i] / (weightSum || 1);
          const tokIdx = ctx[i];
          const offset = tokIdx * D;
          for (let d = 0; d < D; d++) {
            this.E[offset + d] -= lr * w * dx[d];
          }
        }
      }

      lastLoss = totalLoss / this.samples.length;
      this.epochs++;
      this.lossHistory.push(Number(lastLoss.toFixed(4)));
      if (this.lossHistory.length > 200) this.lossHistory.shift();
    }

    const perplexity = Math.exp(lastLoss);
    return {
      epochs: this.epochs,
      loss: Number(lastLoss.toFixed(4)),
      perplexity: Number(perplexity.toFixed(2))
    };
  }

  // Generate text from seed words with temperature sampling
  generate(seedText = "artificial intelligence", length = 28, temperature = 0.7) {
    const V = this.vocab.length;
    if (V <= 1) return seedText;

    const rawTokens = this.tokenizeCorpus(seedText);
    const indices = rawTokens.map(t => {
      const lower = t.toLowerCase();
      if (this.wordToIdx.has(lower)) return this.wordToIdx.get(lower);
      // Fuzzy match prefix if unknown word
      for (const [w, idx] of this.wordToIdx.entries()) {
        if (w.startsWith(lower.slice(0, 4))) return idx;
      }
      return Math.floor(Math.random() * (V - 1)) + 1;
    });

    if (indices.length === 0) {
      indices.push(1);
    }

    const generated = [...rawTokens];
    const temp = Math.max(0.15, Number(temperature) || 0.7);

    for (let step = 0; step < length; step++) {
      const ctx = indices.slice(-this.contextSize);
      const { probs } = this.forward(ctx);

      // Blend neural probabilities with n-gram transition prior if available
      const blended = new Float64Array(V);
      const lastIdx = ctx[ctx.length - 1];
      const triKey = ctx.length >= 2 ? `${ctx[ctx.length - 2]},${lastIdx}` : null;
      const triMap = triKey ? this.ngramCounts.get(triKey) : null;
      const biMap = this.ngramCounts.get(String(lastIdx));

      for (let k = 0; k < V; k++) {
        let p = probs[k];
        if (triMap && triMap.has(k)) p += 0.35 * (triMap.get(k) / 3);
        if (biMap && biMap.has(k)) p += 0.2 * (biMap.get(k) / 4);
        // Penalize immediate repetition
        if (k === lastIdx || k === 0) p *= 0.05;
        blended[k] = Math.pow(Math.max(1e-9, p), 1 / temp);
      }

      // Normalize and sample from distribution
      let sum = 0;
      for (let k = 0; k < V; k++) sum += blended[k];
      let r = Math.random() * sum;
      let chosen = 1;
      for (let k = 1; k < V; k++) {
        r -= blended[k];
        if (r <= 0) {
          chosen = k;
          break;
        }
      }

      indices.push(chosen);
      generated.push(this.vocab[chosen]);
    }

    // Clean up spacing before punctuation
    let text = generated.join(" ").replace(/\s+([.,!?;:])/g, "$1");
    text = text.charAt(0).toUpperCase() + text.slice(1);
    if (!/[.!?]$/.test(text)) text += ".";
    return text;
  }
}

window.FromScratchNeuralLM = FromScratchNeuralLM;
window.DEFAULT_NEURAL_CORPUS = DEFAULT_NEURAL_CORPUS;
