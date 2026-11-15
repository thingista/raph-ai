/**
 * AETHER // From-Scratch Semantic Vector Engine & Knowledge Memory
 * Zero external libraries. Implements tokenization, Porter-style stemming,
 * TF-IDF + BM25 vector embeddings, cosine similarity retrieval, and persistent memory.
 */

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
  "in", "on", "at", "to", "for", "with", "about", "against", "between",
  "into", "through", "during", "before", "after", "above", "below", "from",
  "up", "down", "of", "off", "over", "under", "again", "further", "then",
  "once", "here", "there", "when", "where", "why", "how", "all", "any",
  "both", "each", "few", "more", "most", "other", "some", "such", "no",
  "nor", "not", "only", "own", "same", "so", "than", "too", "very", "can",
  "will", "just", "should", "now", "what", "which", "who", "whom", "this",
  "that", "these", "those", "am", "have", "has", "had", "do", "does", "did",
  "tell", "me", "explain", "please", "could", "would", "and", "or", "but", "if"
]);

// Built-in foundational encyclopedia for out-of-the-box general intelligence
const INITIAL_KNOWLEDGE_BASE = [
  {
    id: "kb-ai-1",
    title: "Artificial Intelligence & Neural Networks",
    tags: ["ai", "neural networks", "deep learning", "machine learning", "transformers", "backpropagation"],
    body: "Artificial Intelligence (AI) builds systems capable of reasoning, learning, perception, and decision-making. Neural networks are layered mathematical graphs inspired by biological neurons. Each layer transforms an input vector x using a weight matrix W and bias b via y = activation(W·x + b). During training, forward propagation computes predictions, a loss function (such as Cross-Entropy or Mean Squared Error) measures error, and backpropagation applies the chain rule of calculus to compute gradients (∂L/∂W) and update weights via Stochastic Gradient Descent (SGD) or Adam."
  },
  {
    id: "kb-ai-2",
    title: "Transformers & Self-Attention Architecture",
    tags: ["transformer", "attention", "llm", "gpt", "embeddings", "tokens"],
    body: "Transformers process sequences in parallel using Self-Attention: Attention(Q, K, V) = softmax((Q·K^T) / sqrt(d_k)) · V, where Queries (Q), Keys (K), and Values (V) are linear projections of token embeddings. Positional encodings inject word-order awareness, while feed-forward networks, layer normalization, and residual connections enable deep representation learning across long contexts."
  },
  {
    id: "kb-phys-1",
    title: "Quantum Computing & Quantum Mechanics",
    tags: ["quantum", "physics", "qubits", "superposition", "entanglement", "computing"],
    body: "Quantum mechanics describes nature at atomic scales where particles exhibit wave-particle duality and evolve according to the Schrödinger equation (iℏ ∂ψ/∂t = Ĥψ). Quantum computers use qubits that can exist in a linear superposition α|0⟩ + β|1⟩ (where |α|² + |β|² = 1) and become entangled across multi-qubit states. Quantum gates (Hadamard, CNOT, Pauli) manipulate probability amplitudes so quantum interference amplifies correct solutions in algorithms like Shor's (factoring) and Grover's (search). Unlike neural networks which learn statistical weights on classical hardware, quantum computers exploit Hilbert-space interference."
  },
  {
    id: "kb-phys-2",
    title: "Classical Mechanics, Kinematics & Relativity",
    tags: ["physics", "mechanics", "kinematics", "newton", "relativity", "einstein", "gravity", "rocket", "velocity", "acceleration"],
    body: "Newton's three laws govern classical motion: F = m·a. For constant acceleration a from initial velocity v0 over time t: final velocity v = v0 + a·t, and displacement d = v0·t + 0.5·a·t² (also v² = v0² + 2·a·d). Kinetic energy is KE = 0.5·m·v² and gravitational force is F = G·m1·m2 / r². Einstein's Special Relativity shows that the speed of light c ≈ 299,792,458 m/s is invariant, leading to time dilation and mass-energy equivalence E = m·c². General Relativity models gravity as spacetime curvature caused by energy and momentum."
  },
  {
    id: "kb-cs-1",
    title: "Algorithms, Graph Theory & Complexity (Big-O)",
    tags: ["algorithms", "cs", "dijkstra", "sorting", "graphs", "big-o", "complexity", "data structures"],
    body: "Algorithmic complexity measures time and space scaling as input size n grows. Binary Search runs in O(log n), Merge Sort and QuickSort average O(n log n), and Hash Table lookups average O(1). In graph theory (G = (V, E)), Breadth-First Search (BFS) finds shortest unweighted paths in O(V + E), while Dijkstra's Algorithm uses a min-priority queue to find shortest weighted paths from a source node in O((V + E) log V) time, assuming non-negative edge weights. A* search adds an admissible heuristic h(n) to guide pathfinding."
  },
  {
    id: "kb-cs-2",
    title: "Systems Programming, Memory & Compilers",
    tags: ["rust", "c++", "python", "javascript", "compilers", "memory", "operating systems", "cpu"],
    body: "Modern software stacks span high-level garbage-collected languages (Python, JavaScript, Go) and systems languages (C, C++, Rust). Rust guarantees memory safety and data-race freedom at compile time via its ownership, borrowing, and lifetime checker without needing a runtime garbage collector. Compilers translate source code through lexing, AST parsing, semantic analysis, intermediate representation (IR) optimization (like LLVM), and machine code generation."
  },
  {
    id: "kb-math-1",
    title: "Calculus, Linear Algebra & Probability Theory",
    tags: ["math", "calculus", "linear algebra", "derivatives", "integrals", "probability", "bayes", "statistics", "fibonacci"],
    body: "Calculus studies rates of change via derivatives f'(x) = lim(h→0)[(f(x+h)-f(x))/h] and accumulation via integrals ∫f(x)dx, unified by the Fundamental Theorem of Calculus. Linear algebra studies vector spaces, matrices, eigenvalues (A·v = λ·v), and singular value decomposition (SVD). Probability theory quantifies uncertainty; Bayes' Theorem states P(A|B) = P(B|A)·P(A) / P(B). The Fibonacci sequence (0, 1, 1, 2, 3, 5, 8, 13...) satisfies F(n) = F(n-1) + F(n-2), where consecutive ratios F(n)/F(n-1) converge to the Golden Ratio φ = (1 + √5)/2 ≈ 1.6180339887."
  },
  {
    id: "kb-bio-1",
    title: "Molecular Biology, DNA, Genetics & Evolution",
    tags: ["biology", "dna", "rna", "proteins", "genetics", "evolution", "cells", "crispr"],
    body: "Living organisms store hereditary information in double-stranded DNA composed of nucleotide bases Adenine (A), Thymine (T), Cytosine (C), and Guanine (G). The Central Dogma of molecular biology describes how DNA is transcribed into messenger RNA (mRNA) and translated by ribosomes into amino-acid chains that fold into functional proteins. Evolution by natural selection acts on genetic variation over generations, while CRISPR-Cas9 enables targeted genome editing."
  },
  {
    id: "kb-astro-1",
    title: "Astrophysics, Cosmology & Black Holes",
    tags: ["space", "astronomy", "cosmology", "stars", "black holes", "universe", "planets"],
    body: "The observable universe began approximately 13.8 billion years ago in the Big Bang and continues to expand. Stars fuse hydrogen into helium in their cores via nuclear fusion, balancing inward gravity with outward thermal pressure. Massive stars end their lives in core-collapse supernovae, leaving behind neutron stars or black holes bounded by an event horizon at the Schwarzschild radius Rs = 2GM/c²."
  },
  {
    id: "kb-phil-1",
    title: "Epistemology, Logic, Consciousness & Ethics",
    tags: ["philosophy", "logic", "consciousness", "ethics", "epistemology", "reasoning", "syllogism"],
    body: "Deductive logic guarantees truth preservation when premises are true (e.g., Modus Ponens: If P then Q; P is true; therefore Q). Inductive reasoning generalizes from observations to probabilistic hypotheses, while abductive reasoning infers the most likely explanation. Philosophy of mind explores consciousness, qualia, the Chinese Room argument, and functionalism—asking whether computation alone suffices for subjective experience."
  },
  {
    id: "kb-self-1",
    title: "About Raph AI",
    tags: ["raph", "raph ai", "who are you", "how do you work", "from scratch", "model", "creator"],
    body: "I am Raph AI, a General AI built from scratch. I can answer questions, paint original pictures, create animated stories and videos, compose music, and build playable 3D games."
  }
];

class SemanticKnowledgeEngine {
  constructor() {
    this.documents = [];
    this.userFacts = [];
    this.df = new Map(); // Document frequency per stemmed token
    this.docVectors = new Map(); // id -> Map(term -> weight)
    this.avgDocLength = 1;
    this.loadFromStorage();
  }

  // Lightweight Porter-style suffix stemmer from scratch
  stem(word) {
    let w = word.toLowerCase().replace(/[^a-z0-9+#-]/g, "");
    if (w.length <= 3) return w;
    if (w.endsWith("ies") && w.length > 4) return w.slice(0, -3) + "y";
    if (w.endsWith("ing") && w.length > 5) return w.slice(0, -3);
    if (w.endsWith("ed") && w.length > 4) return w.slice(0, -2);
    if (w.endsWith("ation") && w.length > 7) return w.slice(0, -5) + "e";
    if (w.endsWith("ness") && w.length > 6) return w.slice(0, -4);
    if (w.endsWith("ment") && w.length > 6) return w.slice(0, -4);
    if (w.endsWith("es") && w.length > 4) return w.slice(0, -2);
    if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) return w.slice(0, -1);
    return w;
  }

  tokenize(text, removeStop = true) {
    if (!text) return [];
    const raw = text
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s-]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    const out = [];
    for (const token of raw) {
      const cleaned = token.replace(/^\.+|\.+$/g, "");
      if (!cleaned) continue;
      if (removeStop && STOP_WORDS.has(cleaned)) continue;
      out.push(this.stem(cleaned));
    }
    return out;
  }

  loadFromStorage() {
    try {
      const savedDocs = localStorage.getItem("raph_ai_custom_docs_v3");
      const customDocs = savedDocs ? JSON.parse(savedDocs) : [];
      this.documents = [...INITIAL_KNOWLEDGE_BASE, ...customDocs];

      const savedFacts = localStorage.getItem("aether_user_facts_v1");
      this.userFacts = savedFacts ? JSON.parse(savedFacts) : [];
    } catch (e) {
      this.documents = [...INITIAL_KNOWLEDGE_BASE];
      this.userFacts = [];
    }
    this.rebuildIndex();
  }

  saveToStorage() {
    try {
      const customDocs = this.documents.filter(d => !d.id.startsWith("kb-"));
      localStorage.setItem("raph_ai_custom_docs_v3", JSON.stringify(customDocs));
      localStorage.setItem("aether_user_facts_v1", JSON.stringify(this.userFacts));
    } catch (e) {
      // Ignore storage quota errors
    }
  }

  rebuildIndex() {
    this.df.clear();
    this.docVectors.clear();
    let totalLen = 0;

    // Combine documents and user facts for indexing
    const allItems = [
      ...this.documents,
      ...this.userFacts.map(f => ({
        id: f.id,
        title: "Learned User Memory",
        tags: ["memory", "user", "fact", "preference"],
        body: f.text,
        isUserFact: true
      }))
    ];

    const tokenizedDocs = new Map();

    for (const doc of allItems) {
      const fullText = `${doc.title} ${doc.title} ${(doc.tags || []).join(" ")} ${doc.body}`;
      const tokens = this.tokenize(fullText, true);
      tokenizedDocs.set(doc.id, { doc, tokens });
      totalLen += tokens.length;

      const unique = new Set(tokens);
      for (const term of unique) {
        this.df.set(term, (this.df.get(term) || 0) + 1);
      }
    }

    const N = Math.max(1, allItems.length);
    this.avgDocLength = totalLen / N;
    const k1 = 1.5;
    const b = 0.75;

    for (const [id, { tokens }] of tokenizedDocs.entries()) {
      const tf = new Map();
      for (const t of tokens) {
        tf.set(t, (tf.get(t) || 0) + 1);
      }
      const vec = new Map();
      const docLen = tokens.length || 1;
      for (const [term, count] of tf.entries()) {
        const dfVal = this.df.get(term) || 1;
        // BM25 + smoothed IDF weighting
        const idf = Math.log(1 + (N - dfVal + 0.5) / (dfVal + 0.5));
        const bm25Tf = (count * (k1 + 1)) / (count + k1 * (1 - b + b * (docLen / this.avgDocLength)));
        vec.set(term, idf * bm25Tf);
      }
      this.docVectors.set(id, vec);
    }
  }

  addDocument(title, tags, body) {
    const doc = {
      id: "custom-" + Date.now() + "-" + Math.floor(Math.random() * 1000),
      title: title.trim() || "Untitled Knowledge Note",
      tags: tags.split(",").map(s => s.trim().toLowerCase()).filter(Boolean),
      body: body.trim()
    };
    this.documents.unshift(doc);
    this.saveToStorage();
    this.rebuildIndex();
    return doc;
  }

  addUserFact(factText) {
    const cleaned = factText.trim();
    if (!cleaned) return null;
    // Avoid duplicates
    if (this.userFacts.some(f => f.text.toLowerCase() === cleaned.toLowerCase())) {
      return null;
    }
    const fact = {
      id: "fact-" + Date.now() + "-" + Math.floor(Math.random() * 999),
      text: cleaned,
      timestamp: Date.now()
    };
    this.userFacts.unshift(fact);
    this.saveToStorage();
    this.rebuildIndex();
    return fact;
  }

  removeUserFact(id) {
    this.userFacts = this.userFacts.filter(f => f.id !== id);
    this.saveToStorage();
    this.rebuildIndex();
  }

  // Compute hybrid BM25 + Cosine Vector Similarity
  search(query, topK = 4) {
    const qTokens = this.tokenize(query, true);
    if (qTokens.length === 0) return [];

    const qVec = new Map();
    const N = Math.max(1, this.documents.length + this.userFacts.length);
    for (const t of qTokens) {
      const dfVal = this.df.get(t) || 0.5;
      const idf = Math.log(1 + (N - dfVal + 0.5) / (dfVal + 0.5));
      qVec.set(t, (qVec.get(t) || 0) + idf);
    }

    let qNorm = 0;
    for (const w of qVec.values()) qNorm += w * w;
    qNorm = Math.sqrt(qNorm) || 1;

    const allItems = [
      ...this.userFacts.map(f => ({
        id: f.id,
        title: "Learned User Fact",
        tags: ["memory", "user"],
        body: f.text,
        isUserFact: true
      })),
      ...this.documents
    ];

    const scored = [];
    for (const item of allItems) {
      const dVec = this.docVectors.get(item.id);
      if (!dVec) continue;

      let dot = 0;
      let dNorm = 0;
      let matchedTerms = 0;

      for (const w of dVec.values()) dNorm += w * w;
      dNorm = Math.sqrt(dNorm) || 1;

      for (const [term, qWeight] of qVec.entries()) {
        if (dVec.has(term)) {
          dot += qWeight * dVec.get(term);
          matchedTerms++;
        }
      }

      if (dot > 0) {
        const cosine = dot / (qNorm * dNorm);
        const coverage = matchedTerms / qVec.size;
        const boost = item.isUserFact ? 1.25 : 1.0;
        const finalScore = (cosine * 0.65 + coverage * 0.35) * boost;
        scored.push({
          ...item,
          score: Number(finalScore.toFixed(4)),
          matchedTerms
        });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }
}

window.SemanticKnowledgeEngine = SemanticKnowledgeEngine;
