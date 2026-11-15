/**
 * Raph AI // Natural Human Female Voice & Wake-Word Engine
 * Restores the exact Microsoft Edge & Safari speechSynthesis pipeline that
 * speaks out loud reliably every single time.
 */

class HumanVoiceEngine {
  constructor() {
    this.autoSpeak = true;
    this.handsFreeEnabled = false;
    this.isSpeaking = false;
    this.isListening = false;
    this.bestFemaleVoice = null;
    this.recognition = null;
    this.lastProcessedTranscript = "";
    this.lastProcessedTime = 0;
    this.currentUtterance = null;

    this.onStateChange = null;       // callback(isSpeaking)
    this.onWakeStatusChange = null;  // callback(handsFreeEnabled, isListening, liveHeardText)
    this.onVoiceCommand = null;      // callback(commandText)

    this.initBrowserVoices();
    this.initHandsFreeRecognition();
  }

  initBrowserVoices() {
    if (!("speechSynthesis" in window)) return;

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices() || [];
      if (voices.length === 0) return;

      // Priority list of the most natural female voices in Microsoft Edge, Safari, and Chrome
      const preferredNames = [
        "Microsoft Ava Online (Natural)",
        "Microsoft Aria Online (Natural)",
        "Microsoft Jenny Online (Natural)",
        "Microsoft Sonia Online (Natural)",
        "Ava (Premium)",
        "Ava (Enhanced)",
        "Samantha (Enhanced)",
        "Allison (Enhanced)",
        "Google UK English Female",
        "Google US English",
        "Ava",
        "Samantha",
        "Allison",
        "Victoria",
        "Karen",
        "Moira",
        "Tessa",
        "Serena"
      ];

      for (const name of preferredNames) {
        const match = voices.find(
          v => v.name.toLowerCase().includes(name.toLowerCase()) && v.lang.toLowerCase().startsWith("en")
        );
        if (match) {
          this.bestFemaleVoice = match;
          return;
        }
      }

      this.bestFemaleVoice =
        voices.find(v => v.lang.toLowerCase().startsWith("en") && /female|woman|samantha|victoria|ava|karen|zira/i.test(v.name)) ||
        voices.find(v => v.lang.toLowerCase().startsWith("en")) ||
        voices[0];
    };

    pickVoice();
    window.speechSynthesis.onvoiceschanged = pickVoice;
  }

  prepareHumanSpeechText(rawText) {
    if (!rawText) return "";
    // Strip Markdown images, Music Player cards, and multi-line code blocks first so she never reads URLs or raw code out loud
    const cleanedBlock = rawText
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
      .replace(/\[MUSIC_PLAYER:[^\]]+\]/g, "")
      .replace(/\[MUSIC_STYLE_PICKER\]/g, "")
      .replace(/\[GAME_WEBSITE_CARD:[^\]]+\]/g, "")
      .replace(/\[VIDEO_PLAYER:[^\]]+\]/g, "")
      .replace(/```[\s\S]*?```/g, "Here is the code.")
      .trim();
    // If there is a multi-line 7-day forecast bullet list, speak the current weather + first 2 days naturally
    const lines = cleanedBlock.split("\n").filter(Boolean);
    const spokenLines = lines.slice(0, 4).join(". ");

    return spokenLines
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/^#+\s+/gm, "")
      .replace(/^\s*-\s*/gm, "")
      .replace(/(\d+)\s*°C\s*\/\s*(\d+)\s*°C/g, "$1 to $2 degrees Celsius")
      .replace(/°C\b/g, " degrees Celsius")
      .replace(/°F\b/g, " degrees Fahrenheit")
      .replace(/\bkm\/h\b/g, " kilometers per hour")
      .replace(/\bm\/s²\b|\bm\/s\^2\b/g, " meters per second squared")
      .replace(/\bm\/s\b/g, " meters per second")
      .replace(/\bkm²\b/g, " square kilometers")
      .replace(/×/g, " times ")
      .replace(/÷/g, " divided by ")
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  stop() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.setSpeakingState(false);
  }

  setSpeakingState(speaking) {
    this.isSpeaking = speaking;
    if (typeof this.onStateChange === "function") {
      this.onStateChange(speaking);
    }
  }

  // Speak text out loud using the exact pipeline that works in Microsoft Edge, Chrome, and Safari
  speak(rawText) {
    const cleanText = this.prepareHumanSpeechText(rawText);
    if (!cleanText || !("speechSynthesis" in window)) return;

    // Stop microphone if it was listening so it never blocks audio output in Edge
    if (this.recognition && this.isListening) {
      try {
        this.recognition.abort();
      } catch (e) {}
      this.isListening = false;
    }

    window.speechSynthesis.cancel();
    if (!this.bestFemaleVoice) this.initBrowserVoices();

    const sentences = cleanText.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (sentences.length === 0) return;

    this.setSpeakingState(true);

    sentences.forEach((sentence, idx) => {
      const utter = new SpeechSynthesisUtterance(sentence);
      this.currentUtterance = utter;

      if (this.bestFemaleVoice) {
        utter.voice = this.bestFemaleVoice;
        utter.lang = this.bestFemaleVoice.lang || "en-US";
      } else {
        utter.lang = "en-US";
      }

      utter.rate = 1.02;
      utter.pitch = 1.05;
      utter.volume = 1.0;

      if (idx === sentences.length - 1) {
        const onFinish = () => {
          this.currentUtterance = null;
          this.setSpeakingState(false);
          if (this.handsFreeEnabled) {
            setTimeout(() => this.startHandsFreeListening(), 400);
          }
        };
        utter.onend = onFinish;
        utter.onerror = onFinish;
      }

      window.speechSynthesis.speak(utter);
    });
  }

  parseSpokenInput(transcript) {
    const clean = transcript.trim().replace(/[?!.,]+$/g, "").trim();
    const lower = clean.toLowerCase();

    const exactWakeGreeting =
      /^(?:hey|hi|hello|yo|ok|okay)?\s*(?:there\s+)?(?:raph|raf|ralph|raphael|raffaello|rap|ref|wrap|rough|wrath|graph|rob|rabbi|red|wifi|a\.?i\.?)?\s*(?:a\.?i\.?|i|eye|ay|hey|ael)?$/i;

    if (exactWakeGreeting.test(lower)) {
      return { isWakeGreeting: true, query: "Hey Raph AI" };
    }

    const prefixWakeMatch = clean.match(
      /^(?:hey|hi|hello|yo|ok|okay)\s+(?:raph\s*ai|raf\s*ai|ralph\s*ai|raphael\s*ai|raphael|raph|raf|ralph|rap\s*ai|ref\s*i|ralph\s*i|raf\s*i|a\.?i\.?)\b[,!.?\s]+(.+)$/i
    );
    if (prefixWakeMatch && prefixWakeMatch[1].trim().length > 2) {
      return { isWakeGreeting: false, query: prefixWakeMatch[1].trim() };
    }

    return { isWakeGreeting: false, query: clean };
  }

  notifyWakeStatus(liveHeardText = "") {
    if (typeof this.onWakeStatusChange === "function") {
      this.onWakeStatusChange(this.handsFreeEnabled, this.isListening, liveHeardText);
    }
  }

  initHandsFreeRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    this.recognition = new SpeechRec();
    this.recognition.continuous = false;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";

    this.recognition.onstart = () => {
      this.isListening = true;
      this.notifyWakeStatus();
    };

    this.recognition.onresult = event => {
      if (this.isSpeaking) return;

      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalTranscript += res[0].transcript;
        } else {
          interimTranscript += res[0].transcript;
        }
      }

      if (interimTranscript.trim()) {
        this.notifyWakeStatus(interimTranscript.trim());
      }

      const spoken = finalTranscript.trim();
      if (!spoken) return;

      const now = Date.now();
      if (spoken.toLowerCase() === this.lastProcessedTranscript && now - this.lastProcessedTime < 1500) {
        return;
      }
      this.lastProcessedTranscript = spoken.toLowerCase();
      this.lastProcessedTime = now;

      const parsed = this.parseSpokenInput(spoken);
      this.notifyWakeStatus("");

      if (this.onVoiceCommand && parsed.query) {
        this.onVoiceCommand(parsed.query);
      }
    };

    this.recognition.onerror = () => {
      this.isListening = false;
      this.notifyWakeStatus();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.notifyWakeStatus();
      if (this.handsFreeEnabled && !this.isSpeaking) {
        setTimeout(() => {
          if (this.handsFreeEnabled && !this.isSpeaking && !this.isListening) {
            this.startHandsFreeListening();
          }
        }, 400);
      }
    };
  }

  startHandsFreeListening() {
    if (!this.recognition || this.isSpeaking || this.isListening) return;
    try {
      this.recognition.start();
    } catch (e) {}
  }

  stopHandsFreeListening() {
    this.handsFreeEnabled = false;
    if (this.recognition && this.isListening) {
      try {
        this.recognition.abort();
      } catch (e) {}
      this.isListening = false;
    }
    this.notifyWakeStatus();
  }

  triggerImmediateListen() {
    this.stop();
    this.handsFreeEnabled = true;
    this.startHandsFreeListening();
  }
}

window.HumanVoiceEngine = HumanVoiceEngine;
