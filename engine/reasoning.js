/**
 * Raph AI // Context-Aware, Self-Learning General Reasoning Engine
 * - Stays on the same conversation across multiple turns (pronoun resolution,
 *   "what about X?" follow-ups, "tell me more", and full conversation history).
 * - Self-learns the latest news automatically in the background.
 * - Gives simple, direct, accurate answers with zero clutter or source links.
 */

class GeneralReasoningEngine {
  constructor(knowledgeEngine, neuralLM, webSearchEngine, mathEngine, commonSenseEngine, spellCheckEngine, musicEngine) {
    this.kb = knowledgeEngine;
    this.neural = neuralLM;
    this.web = webSearchEngine;
    this.math = mathEngine || (window.UniversalMathEngine ? new window.UniversalMathEngine() : null);
    this.commonSense = commonSenseEngine || (window.CommonSenseEngine ? new window.CommonSenseEngine() : null);
    this.spell = spellCheckEngine || (window.SpellCheckEngine ? new window.SpellCheckEngine() : null);
    this.music = musicEngine || (window.MusicComposerEngine ? new window.MusicComposerEngine() : null);
    this.gameBuilder = window.CustomGameBuilderEngine ? new window.CustomGameBuilderEngine() : null;

    // Multi-turn conversation state
    this.conversationHistory = [];
    this.activeTopic = "";
    this.lastQuestionTemplate = ""; // e.g., "what is the capital of {topic}"
    this.awaitingMusicChoice = false;
  }

  resetConversation() {
    this.conversationHistory = [];
    this.activeTopic = "";
    this.lastQuestionTemplate = "";
    this.awaitingMusicChoice = false;
  }

  simplifyText(text) {
    if (!text) return "";
    const cleaned = text
      .replace(/\[[^\]]*\]/g, "")
      .replace(/\s+/g, " ")
      .trim();

    const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
    return sentences.slice(0, 2).join(" ").trim();
  }

  // Extract main topic from a user question and save a reusable template for "What about X?" follow-ups
  updateConversationTopic(cleanInput, resolvedTopic = "") {
    const q = cleanInput.replace(/[?!.]+$/g, "").trim();

    // Check patterns like "what is the capital of France" -> template: "what is the capital of {topic}", topic: "France"
    const ofMatch = q.match(/^(.+?\b(?:of|in|for|about))\s+([a-zA-Z0-9\s]+)$/i);
    if (ofMatch) {
      const prefix = ofMatch[1].trim();
      const topic = ofMatch[2].replace(/^(?:the|a|an)\s+/i, "").trim();
      if (topic.length >= 2 && !/^(it|him|her|them|that|this)$/i.test(topic)) {
        this.lastQuestionTemplate = `${prefix} {topic}`;
        this.activeTopic = topic;
        return;
      }
    }

    if (resolvedTopic && resolvedTopic.length >= 2 && !/^(it|he|she|they|that|this)$/i.test(resolvedTopic)) {
      this.activeTopic = resolvedTopic;
    }
  }

  // Resolve pronouns ("he", "she", "it", "its", "they", "there") & follow-ups ("what about X?", "tell me more", "why?")
  resolveConversationContext(cleanInput) {
    if (!this.activeTopic) return cleanInput;

    const trimmed = cleanInput.replace(/[?!.]+$/g, "").trim();
    const lower = trimmed.toLowerCase();

    // 1. "Tell me more" / "More info" / "Go on" / "Continue"
    if (/^(tell me more|more info|more details|go on|continue|keep going|what else|anything else)$/i.test(lower)) {
      return `Tell me more interesting facts about ${this.activeTopic}`;
    }

    // 2. Short "Why?" or "How?" follow-up
    if (/^(why|how|how so|why is that)$/i.test(lower)) {
      const lastAi = this.conversationHistory.filter(t => t.role === "ai").slice(-1)[0]?.content || this.activeTopic;
      return `${trimmed} (${lastAi})`;
    }

    // 3. "What about X?" / "How about X?" / "And in X?"
    const whatAboutMatch = trimmed.match(/^(?:what about|how about|and what about|and in|and for|and)\s+([a-zA-Z0-9\s]+)$/i);
    if (whatAboutMatch) {
      const newTopic = whatAboutMatch[1].trim();
      if (this.lastQuestionTemplate) {
        return this.lastQuestionTemplate.replace("{topic}", newTopic);
      }
      return `Tell me about ${newTopic} (in the context of ${this.activeTopic})`;
    }

    // 4. Pronoun replacement ("When was he born?", "What is its population?", "Where is it?", "How tall is it?")
    const hasPronoun = /\b(he|him|his|she|her|it|its|they|them|their|there)\b/i.test(lower);
    if (hasPronoun) {
      let resolved = cleanInput
        .replace(/\b(his|her|its|their)\b/gi, `${this.activeTopic}'s`)
        .replace(/\b(he|him|she|it|they|them|there)\b/gi, this.activeTopic);
      return resolved;
    }

    // 5. Bare property follow-up ("What is the population?", "And the currency?", "How old?")
    if (/^(?:what is the|and the|what's the)?\s*(population|capital|currency|language|area|weather|temperature|height|age|size|speed|author|founder)$/i.test(lower)) {
      return `${trimmed} of ${this.activeTopic}`;
    }

    return cleanInput;
  }

  // 1. Check if user is teaching Raph AI a personal fact or telling it something in conversation
  extractAndStoreMemory(input) {
    const patterns = [
      /^(?:please\s+)?remember\s+(?:that\s+)?(.+)$/i,
      /^(?:note|learn)\s+that\s+(.+)$/i,
      /^my\s+name\s+is\s+([a-zA-Z0-9_\s-]+)$/i,
      /^i\s+am\s+building\s+(.+)$/i,
      /^my\s+favorite\s+(.+\s+is\s+.+)$/i,
      /^i\s+(?:really\s+)?(?:like|love)\s+(.+)$/i
    ];

    for (const pat of patterns) {
      const m = input.trim().match(pat);
      if (m) {
        let factText = m[1].trim();
        let topicExtracted = factText;
        if (/^my\s+name\s+is/i.test(input)) {
          factText = `Your name is ${factText}`;
        } else if (/^my\s+favorite/i.test(input)) {
          factText = `Your favorite ${factText}`;
          topicExtracted = factText.split(/\s+is\s+/i).pop() || factText;
        } else if (/^i\s+am\s+building/i.test(input)) {
          factText = `You are building ${factText}`;
        } else if (/^i\s+(?:really\s+)?(?:like|love)/i.test(input)) {
          factText = `You like ${factText}`;
        }
        const saved = this.kb.addUserFact(factText);
        this.neural.corpusText += "\n" + factText + ".";
        this.activeTopic = topicExtracted.replace(/[?!.]+$/g, "").trim();
        return { learned: true, factText, saved };
      }
    }
    return { learned: false };
  }

  // 2. Direct Math & Physics Answer
  solveMathAndPhysics(input) {
    const accelMatch = input.match(/(\d+(?:\.\d+)?)\s*m\/s(?:\^2|²|2)/i);
    const timeMatch = input.match(/(\d+(?:\.\d+)?)\s*(?:seconds|second|sec|s\b)/i);
    if (accelMatch && timeMatch) {
      const a = parseFloat(accelMatch[1]);
      const t = parseFloat(timeMatch[1]);
      const vFinal = a * t;
      const distance = 0.5 * a * t * t;

      return {
        solved: true,
        summary: `It reaches a speed of **${vFinal.toLocaleString()} m/s** (${(vFinal * 3.6).toLocaleString()} km/h) and travels **${(distance / 1000).toFixed(1)} km**.`
      };
    }
    return { solved: false };
  }

  // 3. Direct Number Sequences
  executeLiveAlgorithm(input) {
    const lower = input.toLowerCase();
    // Only run raw number list if not asking to write code/program
    if (lower.includes("fibonacci") && !/\b(code|program|script|function|python|javascript|js|c\+\+|java|html)\b/.test(lower)) {
      const countMatch = input.match(/(\d+)/);
      const n = countMatch ? Math.min(40, Math.max(3, parseInt(countMatch[1], 10))) : 15;
      const fib = [0, 1];
      for (let i = 2; i < n; i++) {
        fib.push(fib[i - 1] + fib[i - 2]);
      }
      return {
        executed: true,
        output: `Here are the first ${n} Fibonacci numbers: **${fib.join(", ")}**.`
      };
    }
    return { executed: false };
  }

  // 3B. Compose & Play Real Multi-Track Music (Asks user what music they want to make first!)
  handleMusicRequest(input) {
    const lower = input.toLowerCase().trim();
    const hasSpecificGenre =
      /\b(pop|happy|sunshine|chill|lofi|lo-fi|relax|calm|study|jazz|piano|classical|sad|emotional|acoustic|hip\s*hop|hiphop|rap|trap|808|rock|guitar|metal|punk|techno|electronic|edm|dance|club|synth|synthwave|house|8-bit|8bit|retro|arcade|chiptune|epic|cinematic|movie|orchestra)\b/i.test(lower);

    // If Raph AI just asked "What kind of music would you like me to make?" and user answered with a style
    if (this.awaitingMusicChoice) {
      const looksLikeUnrelatedQuestion = /^(what\s+is|who\s+is|where\s+is|when\s+was|weather|make\s+a\s+.*game|code\s+a|make\s+a\s+summary)/i.test(lower);
      if (!looksLikeUnrelatedQuestion) {
        this.awaitingMusicChoice = false;
        const genreKey = this.music ? this.music.detectGenre(lower) : "happy";
        const preset = this.music?.scales?.[genreKey] || { name: "Sunshine Pop Anthem", bpm: 122 };
        return {
          matched: true,
          topic: `${preset.name} Music`,
          answer:
            `Awesome choice! I composed an original **${preset.name}** (${preset.bpm} BPM) track for you! 🎵🎶\n\n` +
            `[MUSIC_PLAYER:${genreKey}:${preset.name}]`
        };
      }
      this.awaitingMusicChoice = false;
    }

    const isMusicTrigger =
      /\b(make|play|create|compose|generate|sing|write|drop|give\s+me|start)\b.*\b(music|song|beat|melody|tune|track|rhythm|piano\s+song|piano\s+music|lofi|lo-fi|techno|synthwave|chiptune|8-bit\s+music|rap\s+beat|hip\s*hop|rock\s+song)\b/i.test(lower) ||
      /^(make\s+music|play\s+music|play\s+a\s+song|make\s+a\s+song|make\s+a\s+beat|play\s+a\s+beat|compose\s+music|music\s+please)$/i.test(lower) ||
      /\b(can\s+you\s+make\s+music|can\s+you\s+play\s+music|do\s+you\s+make\s+music)\b/i.test(lower);

    if (!isMusicTrigger) return { matched: false };

    // If user didn't specify what kind of music they want yet, ask them first!
    if (!hasSpecificGenre) {
      this.awaitingMusicChoice = true;
      return {
        matched: true,
        topic: "Music Studio",
        answer:
          `What kind of music would you like me to make for you? 🎵 Tell me any style (like **Pop**, **Chill Lo-Fi**, **Grand Piano**, **Hip-Hop Beat**, **Rock**, **Electronic Dance**, **8-Bit Game**, or **Epic Orchestra**), or pick one below!\n\n` +
          `[MUSIC_STYLE_PICKER]`
      };
    }

    const genreKey = this.music ? this.music.detectGenre(lower) : "happy";
    const preset = this.music?.scales?.[genreKey] || {
      name: "Sunshine Pop Anthem",
      bpm: 122
    };

    const answer =
      `I composed an original **${preset.name}** (${preset.bpm} BPM) track for you! 🎵🎶\n\n` +
      `[MUSIC_PLAYER:${genreKey}:${preset.name}]`;

    return { matched: true, answer, topic: `${preset.name} Music` };
  }

  // 3C. Universal Code & Custom Playable Game Website Generator
  async handleCodingRequest(input) {
    const lower = input.toLowerCase().trim();

    // Avoid false positives on non-coding questions like "make a picture", "make a summary", or "make a video/film/story"
    if (/\b(make\s+a\s+picture|draw\s+a|make\s+a\s+summary|summarize|video|videos|film|films|movie|movies|story|stories)\b/i.test(lower)) {
      return { matched: false };
    }

    // 1. Check if the user is asking Raph AI to make, code, create, build, or play ANY game!
    if (this.gameBuilder && this.gameBuilder.isGameBuildRequest(input)) {
      const built = this.gameBuilder.buildGame(input);
      return {
        matched: true,
        topic: built.title,
        gameHtml: built.html,
        gameTitle: built.title,
        answer:
          `I coded **${built.title}** just like you asked and opened the live game website for you! 🎮🚀\n\n` +
          `[GAME_WEBSITE_CARD:${built.title}]\n\n` +
          "```html\n" +
          built.html +
          "\n```"
      };
    }

    const hasCodeAction = /\b(code|program|script|implement|develop|write|make|build|create|generate|show\s+me|how\s+to\s+code|can\s+you\s+code)\b/i.test(lower);
    const hasCodeTarget = /\b(code|coding|program|programming|script|function|class|algorithm|python|javascript|js|html|css|typescript|rust|c\+\+|cpp|java|sql|bash|webpage|website|web\s+page|web\s+app|game|arcade|to-?do\s+list|to-?do\s+app|calculator\s+in|calculator\s+code|binary\s+search|bubble\s+sort|quicksort)\b/i.test(lower);

    if (!hasCodeAction || !hasCodeTarget) {
      return { matched: false };
    }

    // If the user generally says "write code" / "can you code" / "code something" without specifying a non-game task, build an interactive game website too!
    if (/^(?:please\s+)?(?:can\s+you\s+)?(?:write\s+code|make\s+code|code|code\s+something|code\s+for\s+me)$/i.test(lower) && this.gameBuilder) {
      const built = this.gameBuilder.buildGame("Galaxy Space Shooter Game");
      return {
        matched: true,
        topic: built.title,
        gameHtml: built.html,
        gameTitle: built.title,
        answer:
          `I coded **${built.title}** and opened the live game website for you! Tell me any game you want me to make next! 🎮🚀\n\n` +
          `[GAME_WEBSITE_CARD:${built.title}]\n\n` +
          "```html\n" +
          built.html +
          "\n```"
      };
    }

    // Detect requested programming language (default to Python or HTML/JS depending on task)
    let lang = "python";
    if (/\b(html|css|website|webpage|web\s+page|web\s+app)\b/.test(lower)) lang = "html";
    else if (/\b(javascript|js|node)\b/.test(lower)) lang = "javascript";
    else if (/\b(c\+\+|cpp)\b/.test(lower)) lang = "cpp";
    else if (/\b(rust)\b/.test(lower)) lang = "rust";
    else if (/\b(sql|database)\b/.test(lower)) lang = "sql";
    else if (/\b(java)\b/.test(lower) && !/\bjavascript\b/.test(lower)) lang = "java";

    if (/\bcalculator\b/.test(lower)) {
      if (lang === "html" || lang === "javascript") {
        return {
          matched: true,
          topic: "JavaScript Calculator Code",
          answer:
            `Here is clean **JavaScript & HTML Calculator** code ready to use! 🧮💻\n\n` +
            "```javascript\n" +
            `// Simple Calculator Function in JavaScript
function calculate(a, operator, b) {
  switch (operator) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b !== 0 ? a / b : "Error: Division by zero";
    default: return "Unknown operator";
  }
}

console.log("12 + 8 =", calculate(12, "+", 8));
console.log("15 * 4 =", calculate(15, "*", 4));\n` +
            "```"
        };
      }
      return {
        matched: true,
        topic: "Python Calculator Code",
        answer:
          `Here is a clean, interactive **Python Calculator** program! 🐍🧮\n\n` +
          "```python\n" +
          `def calculator(a, op, b):
    if op == "+":
        return a + b
    elif op == "-":
        return a - b
    elif op == "*":
        return a * b
    elif op == "/":
        return a / b if b != 0 else "Error: Division by zero"
    return "Invalid operator"

# Example usage:
print("25 + 17 =", calculator(25, "+", 17))
print("12 * 9  =", calculator(12, "*", 9))\n` +
          "```"
      };
    }

    if (/\b(website|webpage|web\s+page)\b/.test(lower)) {
      const siteHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Awesome Website</title>
  <style>
    body {
      margin: 0;
      font-family: system-ui, sans-serif;
      background: linear-gradient(135deg, #1e1b4b, #311042);
      color: white;
      text-align: center;
      padding: 60px 20px;
    }
    .card {
      max-width: 540px;
      margin: 0 auto;
      background: rgba(255, 255, 255, 0.1);
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    button {
      background: #ec4899;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 999px;
      font-size: 1rem;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Welcome to My Website! 🚀</h1>
    <p>Built from scratch with HTML, CSS, and JavaScript.</p>
    <button onclick="alert('Hello from your new website!')">Click Me</button>
  </div>
</body>
</html>`;
      return {
        matched: true,
        topic: "HTML & CSS Website Code",
        gameHtml: siteHtml,
        gameTitle: "Custom Website Preview",
        answer:
          `Here is your **HTML & CSS Website** and I opened the live website preview for you! 🌐✨\n\n` +
          `[GAME_WEBSITE_CARD:Custom Website Preview]\n\n` +
          "```html\n" +
          siteHtml +
          "\n```"
      };
    }

    // Try live Free AI Code Synthesis for any custom coding request!
    if (this.web && this.web.synthesizeCodeWithFreeAI) {
      const aiCode = await this.web.synthesizeCodeWithFreeAI(input, this.conversationHistory);
      if (aiCode) {
        const htmlMatch = aiCode.match(/```html\s*([\s\S]*?)```/i);
        const extractedHtml = htmlMatch ? htmlMatch[1].trim() : null;
        return {
          matched: true,
          answer: extractedHtml ? `[GAME_WEBSITE_CARD:Live Code Preview]\n\n` + aiCode : aiCode,
          gameHtml: extractedHtml,
          gameTitle: "Live Code Website",
          topic: "Programming & Code"
        };
      }
    }

    // Offline fallback code generator so Raph AI ALWAYS writes clean code even without internet
    if (lang === "javascript") {
      return {
        matched: true,
        topic: "JavaScript Code",
        answer:
          `Here is clean **JavaScript** code for your request! 💻✨\n\n` +
          "```javascript\n" +
          `// Raph AI — JavaScript Solution
function solveTask(input) {
  console.log("Running task for:", input);
  return \`Completed: \${input}\`;
}

console.log(solveTask(${JSON.stringify(input)}));\n` +
          "```"
      };
    }

    return {
      matched: true,
      topic: "Python Code",
      answer:
        `Here is clean **Python** code to get you started! 🐍💻\n\n` +
        "```python\n" +
        `# Raph AI — Python Solution
def main():
    print("Hello from Raph AI Coder!")
    numbers = [1, 2, 3, 4, 5]
    squared = [n ** 2 for n in numbers]
    print("Squared numbers:", squared)

if __name__ == "__main__":
    main()\n` +
        "```"
    };
  }

  // Record turn in conversation history and return response
  finishTurn(userMsg, aiAnswer, newTopic = "", extra = {}) {
    this.conversationHistory.push({ role: "user", content: userMsg });
    this.conversationHistory.push({ role: "ai", content: aiAnswer });
    if (this.conversationHistory.length > 16) {
      this.conversationHistory = this.conversationHistory.slice(-16);
    }
    this.updateConversationTopic(userMsg, newTopic);
    return { answer: aiAnswer, ...extra };
  }

  // 4. Main Answer Pipeline
  async processQuery(userInput) {
    const rawTrimmed = userInput.trim();
    const spellCorrected = this.spell ? this.spell.correctSentence(rawTrimmed) : rawTrimmed;
    // Resolve pronouns & follow-up context from current conversation!
    const cleanInput = this.resolveConversationContext(spellCorrected);
    const lower = cleanInput.toLowerCase();

    // A. Simple Greeting or "Hey Raph AI" (including phonetic transcriptions like "Hey Raphael" / "Raphael")
    if (
      /^(?:hey|hi|hello|yo|sup|ok|okay)?\s*(?:there\s+)?(?:raph\s*ai|raphael\s*ai|raphael|raph|ralph|raf)\s*[?!.]*$/i.test(rawTrimmed) ||
      /^(hi|hello|hey|yo|sup)\s*[?!.]*$/i.test(lower)
    ) {
      return this.finishTurn(rawTrimmed, "Hello, what can I do for you?");
    }

    // A2. Live Current Date, Time, Day & Year
    if (/\b(what time is it|current time|what is the time|what's the time)\b/.test(lower)) {
      const now = new Date();
      return this.finishTurn(rawTrimmed, `It is **${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}**.`);
    }
    if (/\b(what day is it|what is the date|today's date|todays date|what date is it|current date|what year is it)\b/.test(lower)) {
      const now = new Date();
      const formatted = now.toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
      return this.finishTurn(rawTrimmed, `Today is **${formatted}**.`);
    }

    // B. Personal Memory Teaching ("Remember that...", "My favorite...", "I like...")
    const memResult = this.extractAndStoreMemory(spellCorrected);
    if (memResult.learned) {
      this.neural.trainEpochs(4, 0.08);
      return this.finishTurn(
        rawTrimmed,
        `Got it! I'll remember that **${memResult.factText.toLowerCase()}**. Want to talk more about **${this.activeTopic}**?`,
        this.activeTopic
      );
    }

    // C. Recall Personal Memory ("What is my name?", "What do you remember?")
    if (lower.includes("my name") || lower.includes("who am i") || lower.includes("what do you remember")) {
      if (this.kb.userFacts.length > 0) {
        return this.finishTurn(rawTrimmed, this.kb.userFacts.map(f => f.text).join(". ") + ".");
      }
    }

    // C1. Music Composition & Live WebAudio Synthesizer ("make music", "play a chill beat", "compose piano music")
    const musicResult = this.handleMusicRequest(cleanInput);
    if (musicResult.matched) {
      return this.finishTurn(rawTrimmed, musicResult.answer, musicResult.topic);
    }

    // C1b. Code & Programming Generator ("write python code", "code a snake game", "build a website in html")
    const codeResult = await this.handleCodingRequest(cleanInput);
    if (codeResult.matched) {
      return this.finishTurn(rawTrimmed, codeResult.answer, codeResult.topic, {
        gameHtml: codeResult.gameHtml,
        gameTitle: codeResult.gameTitle
      });
    }

    // C2. Common Sense & Verified World Facts
    if (this.commonSense) {
      const csResult = this.commonSense.solve(cleanInput);
      if (csResult.matched) {
        return this.finishTurn(rawTrimmed, csResult.answer);
      }
    }

    // D. Direct Math / Sequence / Physics answers
    const execResult = this.executeLiveAlgorithm(cleanInput);
    if (execResult.executed) return this.finishTurn(rawTrimmed, execResult.output);

    if (this.math) {
      const universalMath = this.math.solve(cleanInput);
      if (universalMath.solved) return this.finishTurn(rawTrimmed, universalMath.answer);
    }

    const mathResult = this.solveMathAndPhysics(cleanInput);
    if (mathResult.solved) return this.finishTurn(rawTrimmed, mathResult.summary);

    // E. Silently check websites with full conversation context & return the Majority Answer
    if (this.web) {
      const webResults = await this.web.searchAllWebsites(cleanInput, this.conversationHistory, this.activeTopic);

      if (webResults.majorityAnswer) {
        const simpleAnswer = webResults.majorityAnswer;
        const topTitle = webResults.findings[0]?.title || webResults.cleanQuery;

        const alreadySaved = this.kb.documents.some(
          d => d.title.toLowerCase() === topTitle.toLowerCase()
        );
        if (!alreadySaved && simpleAnswer.length > 25) {
          this.kb.addDocument(topTitle, "learned", simpleAnswer);
        }

        // If it was a weather query, remember the extracted place as the active topic
        const weatherPlace = this.web.extractWeatherPlace
          ? this.web.extractWeatherPlace(lower, this.activeTopic)
          : webResults.cleanQuery;

        return this.finishTurn(rawTrimmed, simpleAnswer, weatherPlace || webResults.cleanQuery);
      }
    }

    // F. Fallback to Local Memory (including self-learned latest news!)
    const localMatches = this.kb.search(cleanInput, 1);
    if (localMatches.length > 0 && localMatches[0].score >= 0.45) {
      return this.finishTurn(rawTrimmed, this.simplifyText(localMatches[0].body), localMatches[0].title);
    }

    return this.finishTurn(
      rawTrimmed,
      `Could you tell me a bit more? I want to make sure I stay right on what you're talking about.`
    );
  }
}

window.GeneralReasoningEngine = GeneralReasoningEngine;
