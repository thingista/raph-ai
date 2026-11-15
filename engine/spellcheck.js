/**
 * Raph AI // Safe Typo & Phrase Normalizer
 * Fixes common spelling mistakes and question typos without ever corrupting
 * proper nouns, names, sports terms, or unfamiliar words.
 */

class SpellCheckEngine {
  constructor() {
    this.directTypos = {
      wat: "what",
      waht: "what",
      wht: "what",
      wut: "what",
      wher: "where",
      whre: "where",
      wen: "when",
      whn: "when",
      wich: "which",
      whic: "which",
      hwo: "who",
      hw: "how",
      howw: "how",
      wy: "why",
      whi: "why",
      teh: "the",
      hte: "the",
      tha: "the",
      adn: "and",
      nad: "and",
      taht: "that",
      tht: "that",
      wiht: "with",
      whit: "with",
      abotu: "about",
      abuot: "about",
      knwo: "know",
      nows: "knows",
      rong: "wrong",
      wright: "right",
      answere: "answer",
      anwere: "answer",
      anser: "answer",
      majortey: "majority",
      majorety: "majority",
      commen: "common",
      sence: "sense",
      webbsite: "website",
      withiut: "without",
      somthing: "something",
      allsow: "also",
      aske: "ask",
      randum: "random",
      arandum: "a random",
      rember: "remember",
      remeber: "remember",
      remembr: "remember",
      meney: "many",
      maney: "many",
      mny: "many",
      mani: "many",
      mach: "much",
      mch: "much",
      dose: "does",
      doez: "does",
      hav: "have",
      hasv: "have",
      capitel: "capital",
      captial: "capital",
      capitol: "capital",
      captal: "capital",
      popilation: "population",
      populashun: "population",
      popultion: "population",
      populaton: "population",
      temprature: "temperature",
      tempature: "temperature",
      tempreture: "temperature",
      wether: "weather",
      wethers: "weather",
      wetheres: "weather",
      wheather: "weather",
      weater: "weather",
      forcast: "forecast",
      forcasts: "forecast",
      fourcast: "forecast",
      fourcasts: "forecast",
      forecats: "forecast",
      futer: "future",
      futur: "future",
      sumary: "summary",
      summery: "summary",
      sumarry: "summary",
      sumarize: "summarize",
      summerize: "summarize",
      storie: "story",
      stroie: "story",
      picure: "picture",
      pictur: "picture",
      pitcure: "picture",
      pictuers: "pictures",
      picures: "pictures",
      abel: "able",
      musik: "music",
      muisc: "music",
      musci: "music",
      progarm: "program",
      progam: "program",
      pyton: "python",
      phyton: "python",
      javasript: "javascript",
      javscript: "javascript",
      curenccy: "currency",
      curency: "currency",
      curancy: "currency",
      langauge: "language",
      langugae: "language",
      languge: "language",
      continet: "continent",
      continants: "continents",
      contnents: "continents",
      planit: "planet",
      planits: "planets",
      plannets: "planets",
      soler: "solar",
      sistem: "system",
      ocen: "ocean",
      ocens: "oceans",
      ocaens: "oceans",
      mountin: "mountain",
      montain: "mountain",
      moutain: "mountain",
      evrest: "everest",
      everst: "everest",
      elaphant: "elephant",
      elefant: "elephant",
      elephent: "elephant",
      cheeta: "cheetah",
      cheata: "cheetah",
      spidr: "spider",
      spyder: "spider",
      spidre: "spider",
      fethers: "feathers",
      hevier: "heavier",
      fastes: "fastest",
      fastst: "fastest",
      bigest: "biggest",
      biggst: "biggest",
      largst: "largest",
      smalest: "smallest",
      smalst: "smallest",
      tallst: "tallest",
      talest: "tallest",
      coler: "color",
      culer: "color",
      pluss: "plus",
      minous: "minus",
      multipled: "multiplied",
      devided: "divided",
      divded: "divided",
      sqaure: "square",
      sqare: "square",
      derivitive: "derivative",
      intergral: "integral",
      avrage: "average",
      averge: "average",
      fibonaci: "fibonacci",
      fibonnaci: "fibonacci",
      photosinthesis: "photosynthesis",
      fotosynthesis: "photosynthesis",
      frnace: "france",
      geramny: "germany",
      jpan: "japan",
      spian: "spain",
      itali: "italy",
      brazl: "brazil",
      rusia: "russia",
      chian: "china",
      yestreday: "yesterday",
      yestrday: "yesterday",
      tomorow: "tomorrow",
      footbal: "football",
      socer: "soccer"
    };
  }

  correctWord(rawWord) {
    const match = rawWord.match(/^([^a-zA-Z0-9]*)([a-zA-Z]+)([^a-zA-Z0-9]*)$/);
    if (!match) return rawWord;

    const [, prefix, word, suffix] = match;
    const lower = word.toLowerCase();

    if (this.directTypos[lower]) {
      const replacement = this.directTypos[lower];
      return prefix + replacement + suffix;
    }

    return rawWord;
  }

  correctSentence(sentence) {
    if (!sentence) return "";
    let text = sentence
      // Normalize Ballon d'Or variations
      .replace(/\bball?on\s*d'?or\b/gi, "Ballon d'Or")
      .replace(/\bdo\s+you\s+no\b/gi, "do you know")
      .replace(/^were\s+is\b/i, "where is")
      .replace(/^were\s+are\b/i, "where are")
      .replace(/\bhow\s+tal\b/gi, "how tall")
      .replace(/\bwho\s+rote\b/gi, "who wrote");

    const tokens = text.split(/(\s+)/);
    return tokens
      .map(tok => (/^\s+$/.test(tok) ? tok : this.correctWord(tok)))
      .join("");
  }
}

window.SpellCheckEngine = SpellCheckEngine;
