/**
 * Raph AI // Live News, Sports, Specific-Website & Consensus Search Engine
 * Combines:
 *  - Live Google News Search (for sports results, yesterday's games, awards, breaking news)
 *  - Specialist Website Routers (Weather, Countries, FX, Books, Synonyms, Recipes)
 *  - Deep Wikipedia + Wikidata + DuckDuckGo Search with strict relevance filtering
 *  - Free AI Synthesis grounded in live web & news results
 */

class MultiWebsiteSearchEngine {
  constructor() {
    this.stopWords = new Set([
      "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
      "in", "on", "at", "to", "for", "with", "about", "by", "from", "of",
      "and", "or", "but", "as", "it", "its", "this", "that", "these", "those",
      "which", "who", "whom", "what", "where", "when", "why", "how", "has",
      "have", "had", "do", "does", "did", "can", "could", "will", "would",
      "tell", "me", "please", "give", "know", "many", "much", "old", "tall",
      "won", "win", "winner", "yesterday", "today", "last", "night"
    ]);
  }

  detectQuestionIntent(rawInput) {
    const q = rawInput.trim().toLowerCase();
    if (
      /\b(latest|newest|recent|recently|today|tonight|yesterday|last night|this week|current|currently|news|happening|update|updates|won|winner|score|match|vs|versus|2024|2025|2026)\b/.test(
        q
      )
    ) {
      return "latest";
    }
    if (/^(who|whom)\b/.test(q)) return "who";
    if (/^(when|what year|what date)\b/.test(q)) return "when";
    if (/^(where|what country|what city|what capital|capital of)\b/.test(q) || q.includes("capital of")) return "where";
    if (/^(how many|how much|how old|how tall|how long|how far|how big|what is the population)\b/.test(q)) return "number";
    if (/^(why)\b/.test(q)) return "why";
    if (/^(how)\b/.test(q)) return "how";
    return "general";
  }

  parseQuery(rawInput) {
    const original = rawInput.trim().replace(/[?!.]+$/g, "");
    let subject = original
      .replace(/^(?:hey|hi|hello)?\s*(?:raph\s*ai)?\s*,?\s*/i, "")
      .replace(/^(?:can you|could you|please|tell me|explain|search for|look up|give me|do you know)\s+/i, "")
      .replace(
        /^(?:what is|what are|what was|what were|what's|whats|who won|who wins|who is winning|who beat|who is|who was|who are|where is|where are|when was|when is|how does|how do|how to|how many|how much|how old is|how tall is|how long is|why is|why do|why are)\s+/i,
        ""
      )
      .replace(/^(?:the\s+)?(?:latest|newest|recent|current)\s+(?:news|things|updates|info|information)?\s*(?:on|about|in|for)?\s*/i, "")
      .replace(/^(?:a|an|the)\s+/i, "")
      .trim();

    const targetWords = [];
    if (/\b(who won|winner|beat|score)\b/i.test(original)) {
      targetWords.push("won", "winner", "beat", "defeated", "victory");
    }

    const bornMatch = subject.match(/^(.+?)\s+(born|created|founded|invented|discovered|built|made|died|released|published)$/i);
    if (bornMatch) {
      subject = bornMatch[1].trim();
      targetWords.push(bornMatch[2].toLowerCase());
    }
    const propOfMatch = subject.match(
      /^(population|capital|president|leader|founder|creator|inventor|author|director|height|age|size|speed|currency|language|area|continent|meaning|synonym|weather|temperature|price|winner)\s+(?:of|in|for)\s+(?:the\s+)?(.+)$/i
    );
    if (propOfMatch) {
      targetWords.push(propOfMatch[1].toLowerCase());
      subject = propOfMatch[2].trim();
    }
    const doesHaveMatch = subject.match(/^([a-z]+)\s+(?:does|do)\s+(?:a\s+|an\s+|the\s+)?(.+?)\s+(?:have|eat|live|make|use|speak)$/i);
    if (doesHaveMatch) {
      targetWords.push(doesHaveMatch[1].toLowerCase());
      subject = doesHaveMatch[2].trim();
    }

    // Also create a clean Wikipedia subject without temporal words like "yesterday" or "last night"
    const wikiSubject = subject
      .replace(/\b(yesterday|last night|today|tonight|this morning|this week|recently)\b/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!subject || subject.length < 2) {
      subject = original;
    }

    const subjectKeywords = (wikiSubject || subject)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 1 && !this.stopWords.has(w));

    return {
      original,
      subject,
      wikiSubject: wikiSubject || subject,
      subjectKeywords,
      targetWords,
      intent: this.detectQuestionIntent(original)
    };
  }

  getKeywords(text) {
    return (text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 1 && !this.stopWords.has(w));
  }

  // Strict relevance check: requires at least 60% of subject keywords to be present
  isRelevantToSubject(text, title, subjectKeywords) {
    if (!subjectKeywords || subjectKeywords.length === 0) return true;
    const combined = `${title || ""} ${text || ""}`.toLowerCase();
    let matched = 0;
    for (const kw of subjectKeywords) {
      if (combined.includes(kw)) matched++;
    }
    const required = subjectKeywords.length <= 2 ? subjectKeywords.length : Math.ceil(subjectKeywords.length * 0.6);
    return matched >= Math.max(1, required);
  }

  /**
   * 1. LIVE GOOGLE NEWS SEARCH (Fetches real-time sports scores, match winners, awards & breaking news!)
   */
  async searchGoogleNewsLive(parsed) {
    const { subject, subjectKeywords } = parsed;
    const rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(subject)}&hl=en-US&gl=US&ceid=US:en`;
    const proxyUrls = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`,
      `https://corsproxy.io/?${encodeURIComponent(rssUrl)}`
    ];

    for (const url of proxyUrls) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) continue;

        const xmlText = await res.text();
        if (!xmlText.includes("<item>")) continue;

        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");
        const itemNodes = Array.from(xml.querySelectorAll("item")).slice(0, 6);
        const out = [];

        itemNodes.forEach((node, idx) => {
          const rawTitle = node.querySelector("title")?.textContent || "";
          const pubDate = node.querySelector("pubDate")?.textContent || "";
          // Clean " - Source Name" at the end of Google News titles
          const cleanTitle = rawTitle.replace(/\s+-\s+[^-]+$/, "").trim();
          const dateShort = pubDate ? pubDate.split(" ").slice(0, 4).join(" ") : "";

          if (cleanTitle.length > 15 && this.isRelevantToSubject(cleanTitle, cleanTitle, subjectKeywords)) {
            out.push({
              source: `gnews-${idx}`,
              weight: 4.5,
              title: cleanTitle,
              text: dateShort ? `${cleanTitle} (${dateShort}).` : `${cleanTitle}.`
            });
          }
        });

        if (out.length > 0) return out;
      } catch (e) {}
    }
    return [];
  }

  // Generate Raph AI's own original picture from scratch using RaphAIPainterEngine (zero external image services!)
  buildPictureMarkdown(visualPrompt, label = "Generated Picture", seed = 1) {
    if (!this.painter && window.RaphAIPainterEngine) {
      this.painter = new window.RaphAIPainterEngine();
    }
    const dataUrl = this.painter
      ? this.painter.generatePictureDataURL(visualPrompt, seed)
      : "";
    return `![${label}](${dataUrl})`;
  }

  // From-scratch Extractive Story Summarizer (scores sentences by core keyword importance)
  summarizeTextFromScratch(longText, maxSentences = 3) {
    const cleaned = (longText || "").replace(/\[[^\]]*\]/g, "").replace(/\s+/g, " ").trim();
    const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 20);
    if (sentences.length <= maxSentences) return sentences.join(" ");

    const freq = new Map();
    for (const s of sentences) {
      for (const w of this.getKeywords(s)) {
        freq.set(w, (freq.get(w) || 0) + 1);
      }
    }

    const scored = sentences.map((s, idx) => {
      const words = this.getKeywords(s);
      let score = idx === 0 ? 3.5 : 0; // First sentence usually sets the scene
      for (const w of words) {
        score += freq.get(w) || 0;
      }
      return { s, idx, score: score / Math.max(1, Math.pow(words.length, 0.5)) };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, maxSentences).sort((a, b) => a.idx - b.idx);
    return top.map(t => t.s).join(" ");
  }

  // Handle "Make a summary of <story>" + automatically generate an illustration picture!
  async summarizeStoryWithPicture(rawInput) {
    const clean = rawInput.trim();

    // Extract the story title or pasted story text
    let target = clean
      .replace(
        /^(?:hey\s+raph\s+ai\s*,?\s*)?(?:can\s+you\s+|please\s+)?(?:make|give|write|tell|do)\s+(?:me\s+)?(?:a\s+)?(?:short\s+)?(?:summary|sumary|summery)\s+(?:of|for|about)\s+(?:the\s+story\s+of\s+|the\s+story\s+|the\s+book\s+|the\s+movie\s+|this\s+story\s*:?\s*)?/i,
        ""
      )
      .replace(/^(?:summarize|sumarize|summerize)\s+(?:the\s+story\s+of\s+|the\s+story\s+|this\s+story\s*:?\s*)?/i, "")
      .replace(/\s+and\s+(?:make|draw|show|create)\s+(?:a\s+)?(?:picture|pictures|image|images).*$/i, "")
      .replace(/[?!.]+$/g, "")
      .trim();

    if (!target || target.length < 2) return null;

    const wordCount = target.split(/\s+/).length;

    // Case A: User pasted a full story paragraph directly to summarize
    if (wordCount >= 28) {
      const aiSummary = await this.synthesizeWithFreeAI(
        `Summarize this story simply in 3 clear sentences:\n\n${target}`,
        ""
      );
      const summaryText = aiSummary || this.summarizeTextFromScratch(target, 3);
      const keyVisual = this.getKeywords(summaryText).slice(0, 8).join(" ");
      const picMd = this.buildPictureMarkdown(`Story scene: ${keyVisual}`, "Story Illustration");
      const safeSum = encodeURIComponent(summaryText);
      return `**Story Summary:**\n${summaryText}\n\n${picMd}\n\n[VIDEO_PLAYER:${keyVisual || "Story"}:${safeSum}]`;
    }

    // Case B: User asked for a summary of a named story, book, fairy tale, or movie (e.g. "Harry Potter", "The Lion King")
    let wikiPlot = "";
    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
        target
      )}&utf8=&format=json&origin=*&srlimit=2`;
      const res = await fetch(searchUrl);
      const data = await res.json();
      const topTitle = data?.query?.search?.[0]?.title;
      if (topTitle) {
        const extUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext&exchars=4000&titles=${encodeURIComponent(
          topTitle
        )}&format=json&origin=*`;
        const extRes = await fetch(extUrl);
        const extData = await extRes.json();
        const pages = extData?.query?.pages || {};
        wikiPlot = Object.values(pages)[0]?.extract || "";
      }
    } catch (e) {}

    const aiStorySummary = await this.synthesizeWithFreeAI(
      `Give a simple, clear 4-sentence story summary of "${target}".`,
      wikiPlot
    );

    const finalSummary =
      aiStorySummary ||
      (wikiPlot ? this.summarizeTextFromScratch(wikiPlot, 4) : `Here is the story of **${target}**, filled with adventure, courage, and unforgettable moments.`);

    const picMd1 = this.buildPictureMarkdown(
      `${target} opening scene`,
      `Scene 1: ${target}`,
      1
    );
    const picMd2 = this.buildPictureMarkdown(
      `${target} climax scene`,
      `Scene 2: ${target}`,
      2
    );

    const safeTarget = target.replace(/[:\]]/g, " ").trim();
    const safeSum = encodeURIComponent(finalSummary);
    return `${finalSummary}\n\n${picMd1}\n\n${picMd2}\n\n[VIDEO_PLAYER:${safeTarget}:${safeSum}]`;
  }

  // Generate a complete Story or Video with Pictures & Animated Video Player!
  async createStoryOrVideoWithPictures(rawInput, activeTopic = "") {
    let topic = rawInput
      .replace(/^(?:hey\s+raph\s+ai\s*,?\s*)?(?:can\s+you\s+|please\s+)?(?:make|create|generate|play|show|write|tell|build|watch)\s+(?:me\s+)?(?:a\s+|an\s+|the\s+)?/i, "")
      .replace(/\b(?:story\s+with\s+pictures\s+and\s+videos|stories\s+with\s+pictures\s+and\s+videos|story\s+and\s+video|video\s+and\s+story|videos?|story|stories|with\s+pictures\s+and\s+videos|with\s+pictures|with\s+videos)\b/gi, "")
      .replace(/^(?:about|of|for|on)\s+/i, "")
      .replace(/[?!.]+$/g, "")
      .trim();

    if (!topic || topic.length < 2 || /^(it|that|this)$/i.test(topic)) {
      topic = activeTopic || "The Crystal Galaxy Adventure";
    }

    const aiStoryline = await this.synthesizeWithFreeAI(
      `Write an exciting, vivid 4-sentence adventure story about "${topic}".`,
      ""
    );

    const storyline =
      aiStoryline ||
      `In the extraordinary world of ${topic}, an unforgettable journey begins under a glowing sky. Heroes unite to explore uncharted lands, facing thrilling trials and discovering ancient wonders. When shadows threaten the realm, their courage and friendship shine brighter than ever. Through daring teamwork, they overcome the greatest obstacle and bring joy to the land.`;

    const picMd1 = this.buildPictureMarkdown(
      `${topic} opening scene`,
      `${topic} — Picture 1`,
      1
    );
    const picMd2 = this.buildPictureMarkdown(
      `${topic} adventure climax`,
      `${topic} — Picture 2`,
      2
    );

    const safeTopic = topic.replace(/[:\]]/g, " ").trim();
    const safeStory = encodeURIComponent(storyline);

    return `📖 **Story & Video: "${safeTopic}"**\n\n${storyline}\n\n${picMd1}\n\n${picMd2}\n\n[VIDEO_PLAYER:${safeTopic}:${safeStory}]`;
  }
  describeWeatherCode(code) {
    if (code === 0) return "clear and sunny";
    if (code === 1 || code === 2) return "partly cloudy";
    if (code === 3) return "cloudy";
    if (code === 45 || code === 48) return "foggy";
    if (code >= 51 && code <= 57) return "light drizzle";
    if (code >= 61 && code <= 67) return "rainy";
    if (code >= 71 && code <= 77) return "snowy";
    if (code >= 80 && code <= 82) return "rain showers";
    if (code >= 85 && code <= 86) return "snow showers";
    if (code >= 95) return "thunderstorms";
    return "mild";
  }

  // Extract the country or city name from ANY weather/forecast sentence (in any word order!)
  extractWeatherPlace(lower, activeTopic = "") {
    // Strip all question words, weather words, time phrases, and prepositions
    let cleaned = lower
      .replace(/[?!.,]+/g, " ")
      .replace(
        /\b(what|whats|what's|how|is|are|will|be|the|a|an|tell|me|give|show|can|you|know|about|please|for|in|at|of|on|to|like)\b/gi,
        " "
      )
      .replace(
        /\b(weather|wether|wethers|wetheres|wheather|temperature|temp|forecast|fourcast|forcast|forecasts|rain|raining|snow|snowing|sunny|cloudy|wind|hot|cold|warm|cool|degrees|climate)\b/gi,
        " "
      )
      .replace(
        /\b(next|future|futer|this|coming|upcoming|following|whole|entire|full|all|week|weeks|day|days|7|seven|tomorrow|tomorow|today|tonight|right|now|current|currently|daily|weekly|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi,
        " "
      )
      .replace(/\s+/g, " ")
      .trim();

    if (cleaned.length >= 2) {
      return cleaned;
    }

    // If user didn't mention a place in this sentence (e.g. "what is the forecast for the next week?"),
    // use the active conversation topic if available!
    if (activeTopic && activeTopic.trim().length >= 2) {
      return activeTopic.trim();
    }

    // Otherwise, automatically detect user's local city from browser timezone (e.g. "Europe/Paris" -> "Paris")
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.includes("/")) {
        const tzCity = tz.split("/").pop().replace(/_/g, " ").trim();
        if (tzCity.length >= 2) return tzCity;
      }
    } catch (e) {}

    return "Paris";
  }

  // Global Country & City 7-Day Weather Forecast Engine
  async fetchGlobalWeatherForecast(lower, activeTopic = "") {
    if (
      !/\b(weather|wether|wethers|wetheres|temperature|forecast|fourcast|forcast|rain|raining|snow|snowing|how hot|how cold|next week|future week)\b/i.test(
        lower
      )
    ) {
      return null;
    }

    const rawPlace = this.extractWeatherPlace(lower, activeTopic);
    if (!rawPlace || rawPlace.length < 2) return null;

    const countryAliases = {
      uk: "United Kingdom",
      usa: "United States",
      us: "United States",
      uae: "United Arab Emirates"
    };
    const place = countryAliases[rawPlace.toLowerCase()] || rawPlace;

    const wantsTomorrow = /\btomorrow\b/i.test(lower);
    let lat = null;
    let lon = null;
    let displayName = place;

    // Step 1: Search Open-Meteo Global Geocoding API first (instant for every country & city in the world!)
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1&language=en&format=json`
      );
      const geoData = await geoRes.json();
      const loc = geoData?.results?.[0];
      if (loc) {
        lat = loc.latitude;
        lon = loc.longitude;
        displayName =
          loc.country && loc.name.toLowerCase() !== loc.country.toLowerCase()
            ? `${loc.name}, ${loc.country}`
            : loc.name;
      }
    } catch (e) {}

    // Step 2: Fallback to RESTCountries API if needed
    if (lat === null || lon === null) {
      try {
        const cRes = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(place)}`);
        if (cRes.ok) {
          const cData = await cRes.json();
          const country = cData?.[0];
          if (country) {
            const capCoords = country.capitalInfo?.latlng || country.latlng;
            if (capCoords && capCoords.length === 2) {
              lat = capCoords[0];
              lon = capCoords[1];
              displayName = country.name?.common || place;
            }
          }
        }
      } catch (e) {}
    }

    if (lat === null || lon === null) return null;

    // Step 3: Fetch Current Weather + 7-Day Future Week Forecast from Open-Meteo
    try {
      const wUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
        `&timezone=auto&forecast_days=7`;
      const wRes = await fetch(wUrl);
      const wData = await wRes.json();
      const cur = wData?.current;
      const daily = wData?.daily;

      if (!cur || !daily || !daily.time) return null;

      const curDesc = this.describeWeatherCode(cur.weather_code);

      if (wantsTomorrow && daily.time.length >= 2) {
        const tomDesc = this.describeWeatherCode(daily.weather_code[1]);
        const hi = Math.round(daily.temperature_2m_max[1]);
        const lo = Math.round(daily.temperature_2m_min[1]);
        return `Tomorrow in **${displayName}**, it will be **${tomDesc}** with a high of **${hi}°C** and a low of **${lo}°C**.`;
      }

      // Build clean 7-day future week summary
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const dailyParts = [];
      for (let i = 0; i < Math.min(7, daily.time.length); i++) {
        const dateObj = new Date(daily.time[i] + "T12:00:00");
        const dayLabel = i === 0 ? "Today" : i === 1 ? "Tomorrow" : dayNames[dateObj.getDay()];
        const desc = this.describeWeatherCode(daily.weather_code[i]);
        const hi = Math.round(daily.temperature_2m_max[i]);
        const lo = Math.round(daily.temperature_2m_min[i]);
        dailyParts.push(`**${dayLabel}:** ${desc}, ${hi}°C / ${lo}°C`);
      }

      return (
        `Right now in **${displayName}**, it is **${Math.round(cur.temperature_2m)}°C** and **${curDesc}**.\n\n` +
        `**Next 7 Days Forecast:**\n- ` +
        dailyParts.join("\n- ")
      );
    } catch (e) {
      return null;
    }
  }

  /**
   * 2. SPECIALIST WEBSITE ROUTER
   */
  async searchExactSpecialistWebsite(rawInput, parsed, activeTopic = "") {
    const lower = rawInput.toLowerCase().replace(/[?!.]+$/g, "").trim();

    // 0A. Story Summary + Pictures + Animated Story Video ("make a summary of ...", "summarize ...")
    if (/\b(summary|sumary|summery|summarize|sumarize|summerize)\b/i.test(lower)) {
      const storySum = await this.summarizeStoryWithPicture(rawInput);
      if (storySum) return storySum;
    }

    // 0A2. Video or Story with Pictures & Video ("make a video...", "make a story...")
    if (
      /\b(make|create|generate|play|show|write|tell|build|watch)\b.*\b(video|videos|story|stories|fairy\s+tale|bedtime\s+story)\b/i.test(lower)
    ) {
      const vidResp = await this.createStoryOrVideoWithPictures(rawInput, activeTopic);
      if (vidResp) return vidResp;
    }

    // 0B. Direct Picture / Image Generation ("make a picture of ...", "draw ...", "show me a picture of ...")
    const picMatch = rawInput.match(
      /(?:make|create|draw|generate|show|paint)\s+(?:me\s+)?(?:a\s+|an\s+|some\s+)?(?:picture|pictures|picure|pictur|image|images|drawing|photo|art)\s+(?:of|about|for|showing)?\s*(.+)$/i
    );
    if (picMatch) {
      let subjectPrompt = picMatch[1].replace(/[?!.]+$/g, "").trim();
      if (/^(it|that|this|him|her|them)$/i.test(subjectPrompt) && activeTopic) {
        subjectPrompt = activeTopic;
      }
      const picMd = this.buildPictureMarkdown(subjectPrompt, subjectPrompt);
      return `Here is a picture of **${subjectPrompt}**:\n\n${picMd}`;
    }

    // Live Current & 7-Day Future Week Weather for Every Country & City in the World
    const weatherAnswer = await this.fetchGlobalWeatherForecast(lower, activeTopic);
    if (weatherAnswer) return weatherAnswer;

    // Specific Country Facts
    const countryPropMatch = lower.match(/\b(population|currency|money|language|languages|capital|continent|region|area|size)\b.*?\b(?:of|in|does)\s+([a-z\s]+?)(?:\s+use|\s+speak|\s+have)?$/i);
    if (countryPropMatch) {
      const prop = countryPropMatch[1].toLowerCase();
      const countryName = countryPropMatch[2].replace(/^(?:the\s+)/i, "").trim();
      try {
        const cRes = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=false`);
        if (cRes.ok) {
          const cData = await cRes.json();
          const c = cData?.[0];
          if (c) {
            const name = c.name?.common || countryName;
            if (prop === "population" && c.population) return `The population of **${name}** is **${c.population.toLocaleString()}**.`;
            if ((prop === "currency" || prop === "money") && c.currencies) {
              const curList = Object.values(c.currencies).map(v => `${v.name} (${v.symbol || ""})`.trim());
              return `**${name}** uses the **${curList.join(", ")}**.`;
            }
            if ((prop === "language" || prop === "languages") && c.languages) {
              return `The official language(s) of **${name}**: **${Object.values(c.languages).join(", ")}**.`;
            }
            if (prop === "capital" && c.capital?.length) return `The capital of **${name}** is **${c.capital[0]}**.`;
            if ((prop === "continent" || prop === "region") && c.continents?.length) return `**${name}** is in **${c.continents.join(", ")}**.`;
            if ((prop === "area" || prop === "size") && c.area) return `**${name}** covers an area of **${c.area.toLocaleString()} km²**.`;
          }
        }
      } catch (e) {}
    }

    // Live Currency FX
    const fxMatch = lower.match(/(\d+(?:\.\d+)?)\s*([a-z]{3})\s+(?:to|in)\s+([a-z]{3})\b/i);
    if (fxMatch) {
      const amount = parseFloat(fxMatch[1]);
      const from = fxMatch[2].toUpperCase();
      const to = fxMatch[3].toUpperCase();
      try {
        const fxRes = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`);
        if (fxRes.ok) {
          const fxData = await fxRes.json();
          const converted = fxData?.rates?.[to];
          if (converted !== undefined) return `${amount} ${from} is **${converted.toLocaleString()} ${to}**.`;
        }
      } catch (e) {}
    }

    // Books & Authors
    const bookMatch = lower.match(/(?:who\s+wrote|who\s+is\s+the\s+author\s+of|author\s+of)\s+(.+)$/i);
    if (bookMatch) {
      const bookTitle = bookMatch[1].replace(/["']/g, "").trim();
      try {
        const bRes = await fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(bookTitle)}&limit=1`);
        if (bRes.ok) {
          const bData = await bRes.json();
          const doc = bData?.docs?.[0];
          if (doc?.author_name?.length) {
            return `**${doc.title || bookTitle}** was written by **${doc.author_name.join(", ")}**${doc.first_publish_year ? ` (first published in ${doc.first_publish_year})` : ""}.`;
          }
        }
      } catch (e) {}
    }

    // Synonyms & Rhymes
    const synMatch = lower.match(/(?:synonyms?\s+for|words?\s+that\s+mean\s+the\s+same\s+as|another\s+word\s+for)\s+([a-z]+)$/i);
    if (synMatch) {
      const word = synMatch[1];
      try {
        const sRes = await fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}&max=6`);
        if (sRes.ok) {
          const sData = await sRes.json();
          if (sData.length > 0) return `Synonyms for **${word}**: **${sData.map(w => w.word).join(", ")}**.`;
        }
      } catch (e) {}
    }

    const rhymeMatch = lower.match(/(?:words?\s+that\s+rhyme\s+with|rhymes?\s+for)\s+([a-z]+)$/i);
    if (rhymeMatch) {
      const word = rhymeMatch[1];
      try {
        const rRes = await fetch(`https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(word)}&max=8`);
        if (rRes.ok) {
          const rData = await rRes.json();
          if (rData.length > 0) return `Words that rhyme with **${word}**: **${rData.map(w => w.word).join(", ")}**.`;
        }
      } catch (e) {}
    }

    // Recipes
    const mealMatch = lower.match(/(?:how\s+to\s+make|recipe\s+for|ingredients\s+in)\s+([a-z\s]+)$/i);
    if (mealMatch) {
      const dish = mealMatch[1].trim();
      try {
        const mRes = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(dish)}`);
        if (mRes.ok) {
          const mData = await mRes.json();
          const meal = mData?.meals?.[0];
          if (meal && meal.strInstructions) {
            const shortSteps = meal.strInstructions.split(/(?<=[.!?])\s+/).slice(0, 3).join(" ");
            return `To make **${meal.strMeal}**: ${shortSteps}`;
          }
        }
      } catch (e) {}
    }

    return null;
  }

  // 3. Wikipedia Search (Relevance-sorted only — NEVER uses last_edit_desc which caused random articles!)
  async searchWikipedia(parsed) {
    const { wikiSubject, subjectKeywords, targetWords = [] } = parsed;
    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(wikiSubject)}&srinfo=suggestion&utf8=&format=json&origin=*&srlimit=4`;
      const res = await fetch(searchUrl);
      const data = await res.json();
      let results = data?.query?.search || [];

      const suggestion = data?.query?.searchinfo?.suggestion;
      if (results.length === 0 && suggestion) {
        const sugUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(suggestion)}&utf8=&format=json&origin=*&srlimit=4`;
        const sugRes = await fetch(sugUrl);
        const sugData = await sugRes.json();
        results = sugData?.query?.search || [];
      }

      if (results.length === 0) return [];

      // Strictly filter out any Wikipedia result that does not match the subject keywords!
      const relevantResults = results.filter(r =>
        this.isRelevantToSubject(r.snippet, r.title, subjectKeywords)
      );
      if (relevantResults.length === 0) return [];

      const topTitle = relevantResults[0].title;
      const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext&exchars=5000&titles=${encodeURIComponent(topTitle)}&format=json&origin=*`;
      const extRes = await fetch(extractUrl);
      const extData = await extRes.json();
      const pages = extData?.query?.pages || {};
      const firstPage = Object.values(pages)[0];
      const fullExtract = firstPage?.extract || "";

      const items = [];
      if (fullExtract) {
        const paragraphs = fullExtract
          .split("\n")
          .map(p => p.trim())
          .filter(p => p.length > 35 && !p.startsWith("="));

        if (paragraphs[0]) {
          items.push({
            source: "wiki-lead",
            weight: 3.5,
            title: topTitle,
            text: paragraphs[0]
          });
        }

        if (targetWords.length > 0) {
          for (const para of paragraphs.slice(1)) {
            const pLower = para.toLowerCase();
            if (targetWords.some(tw => pLower.includes(tw))) {
              items.push({
                source: "wiki-specific-section",
                weight: 4.5,
                title: topTitle,
                text: para
              });
            }
          }
        }
      }

      for (let i = 0; i < relevantResults.length; i++) {
        const r = relevantResults[i];
        const cleanSnippet = r.snippet
          .replace(/<\/?[^>]+(>|$)/g, "")
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'")
          .replace(/&amp;/g, "&");
        if (cleanSnippet.length > 25) {
          items.push({
            source: `wiki-search-${i}`,
            weight: 2.5,
            title: r.title,
            text: cleanSnippet
          });
        }
      }
      return items;
    } catch (e) {
      return [];
    }
  }

  async searchWikidata(parsed) {
    const { wikiSubject, subjectKeywords } = parsed;
    try {
      const url = `https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(wikiSubject)}&language=en&format=json&origin=*&limit=2`;
      const res = await fetch(url);
      const data = await res.json();
      const results = data?.search || [];
      return results
        .filter(r => r.label && r.description && this.isRelevantToSubject(r.description, r.label, subjectKeywords))
        .map((r, i) => ({
          source: `wikidata-${i}`,
          weight: 2.5,
          title: r.label,
          text: `${r.label} is ${r.description}.`
        }));
    } catch (e) {
      return [];
    }
  }

  searchDuckDuckGo(parsed) {
    const { wikiSubject, subjectKeywords } = parsed;
    return new Promise(resolve => {
      const callbackName = "ddg_cb_" + Math.floor(Math.random() * 1000000);
      const script = document.createElement("script");
      let finished = false;

      const timer = setTimeout(() => {
        if (!finished) {
          finished = true;
          cleanup();
          resolve([]);
        }
      }, 2500);

      function cleanup() {
        clearTimeout(timer);
        delete window[callbackName];
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      window[callbackName] = data => {
        if (finished) return;
        finished = true;
        cleanup();

        const items = [];
        if (data?.Answer && typeof data.Answer === "string") {
          items.push({
            source: "ddg-direct",
            weight: 4.0,
            title: wikiSubject,
            text: data.Answer.replace(/<\/?[^>]+(>|$)/g, "")
          });
        }
        if (data?.AbstractText && this.isRelevantToSubject(data.AbstractText, data.Heading, subjectKeywords)) {
          items.push({
            source: "ddg-abstract",
            weight: 3.2,
            title: data.Heading || wikiSubject,
            text: data.AbstractText
          });
        }
        resolve(items);
      };

      script.src = `https://api.duckduckgo.com/?q=${encodeURIComponent(wikiSubject)}&format=json&no_html=1&skip_disambig=1&callback=${callbackName}`;
      script.onerror = () => {
        if (!finished) {
          finished = true;
          cleanup();
          resolve([]);
        }
      };
      document.body.appendChild(script);
    });
  }

  async searchDictionary(parsed) {
    const { wikiSubject } = parsed;
    const words = wikiSubject.trim().split(/\s+/);
    if (words.length > 2) return [];
    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(wikiSubject.toLowerCase())}`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const data = await res.json();
      const entry = data?.[0];
      const def = entry?.meanings?.[0]?.definitions?.[0]?.definition;
      if (!def) return [];
      return [{
        source: "dictionary",
        weight: 2.5,
        title: entry.word,
        text: `${entry.word} means ${def}`
      }];
    } catch (e) {
      return [];
    }
  }

  // Free Zero-Key AI Synthesis (uses searchgpt for live web/news questions + openai grounded in Google News & Wikipedia)
  async synthesizeWithFreeAI(userQuestion, webContextText, conversationHistory = [], askingLatest = false) {
    const todayStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const systemPrompt =
      `You are Raph AI, a warm, friendly, smart female AI who speaks naturally like a real human in casual conversation. Today's date is ${todayStr}. ` +
      `Stay on the same conversation topic as the recent chat history. ` +
      `Give the exact, correct answer to the user's question in 1 or 2 short, natural spoken sentences using the Live Web & News Facts provided. ` +
      `If an award or event in a future year has not been announced yet, state who won the most recent one instead. ` +
      `Do NOT show working out, do NOT mention websites or sources, and NEVER give a random or unrelated answer.`;

    const recentTurns = conversationHistory.slice(-6).map(turn => ({
      role: turn.role === "ai" ? "assistant" : "user",
      content: turn.content
    }));

    const userContent = webContextText
      ? `Live Web & News Facts:\n${webContextText.slice(0, 1800)}\n\nUser Question: ${userQuestion}`
      : userQuestion;

    // Try searchgpt first if asking for latest/sports/news, then openai
    const modelsToTry = askingLatest ? ["searchgpt", "openai"] : ["openai"];

    for (const modelName of modelsToTry) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch("https://text.pollinations.ai/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [
              { role: "system", content: systemPrompt },
              ...recentTurns,
              { role: "user", content: userContent }
            ],
            model: modelName
          }),
          signal: controller.signal
        });
        clearTimeout(timeout);
        if (!res.ok) continue;
        const text = (await res.text()).trim();
        if (
          text &&
          text.length > 2 &&
          !text.startsWith("{") &&
          !text.startsWith("<!DOCTYPE") &&
          !text.toLowerCase().includes("rate limit")
        ) {
          return text;
        }
      } catch (e) {}
    }
    return null;
  }

  // Dedicated Free AI Coding Synthesis for any programming request
  async synthesizeCodeWithFreeAI(userQuestion, conversationHistory = []) {
    const systemPrompt =
      `You are Raph AI, a friendly, expert coding assistant. ` +
      `Give a short, helpful 1-sentence introduction followed by clean, complete, well-commented working code inside a markdown code block (\`\`\`language ... \`\`\`). ` +
      `Never mention external APIs or websites.`;

    const recentTurns = conversationHistory.slice(-4).map(turn => ({
      role: turn.role === "ai" ? "assistant" : "user",
      content: turn.content
    }));

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7500);

      const res = await fetch("https://text.pollinations.ai/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            ...recentTurns,
            { role: "user", content: userQuestion }
          ],
          model: "openai"
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (res.ok) {
        const text = (await res.text()).trim();
        if (text && text.includes("```") && !text.startsWith("<!DOCTYPE")) {
          return text;
        }
      }
    } catch (e) {}
    return null;
  }

  computeMajorityConsensus(findings, parsed) {
    if (!findings || findings.length === 0) return "";
    const { subjectKeywords, targetWords = [], intent } = parsed;
    const candidates = [];

    findings.forEach((item, idx) => {
      const cleaned = (item.text || "")
        .replace(/\[[^\]]*\]/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const rawSentences = cleaned.split(/(?<=[.!?])\s+/).filter(Boolean);
      rawSentences.slice(0, 5).forEach((sent, sIdx) => {
        const s = sent.trim();
        if (s.length < 12 || s.length > 340) return;
        const words = this.getKeywords(s);
        if (words.length < 2) return;
        candidates.push({
          text: s,
          title: item.title || "",
          source: item.source || `src-${idx}`,
          sourceWeight: item.weight || 1.0,
          isFirstSentence: sIdx === 0,
          words,
          wordSet: new Set(words)
        });
      });
    });

    if (candidates.length === 0) return findings[0]?.text || "";

    const wordVotes = new Map();
    for (const c of candidates) {
      for (const w of c.wordSet) {
        if (!wordVotes.has(w)) wordVotes.set(w, new Set());
        wordVotes.get(w).add(c.source);
      }
    }

    for (const c of candidates) {
      let score = c.sourceWeight * 2.0;
      if (c.isFirstSentence) score += 2.0;

      let subjectHits = 0;
      const combinedLower = `${c.title} ${c.text}`.toLowerCase();
      for (const kw of subjectKeywords) {
        if (combinedLower.includes(kw)) subjectHits++;
      }
      if (subjectKeywords.length > 0 && subjectHits === 0) {
        score -= 20;
      } else {
        score += subjectHits * 4.0;
      }

      for (const tw of targetWords) {
        if (c.text.toLowerCase().includes(tw)) {
          score += 8.0;
        }
      }

      if ((intent === "when" || intent === "number") && /\d/.test(c.text)) {
        score += 6.0;
      }

      let majoritySupport = 0;
      for (const w of c.wordSet) {
        const voters = wordVotes.get(w)?.size || 1;
        if (voters > 1) majoritySupport += voters;
      }
      score += majoritySupport / Math.pow(c.wordSet.size, 0.6);

      c.totalVotes = score;
    }

    candidates.sort((a, b) => b.totalVotes - a.totalVotes);
    const best = candidates[0];
    if (!best || best.totalVotes < 0) return "";
    return best.text;
  }

  async searchAllWebsites(rawPrompt, conversationHistory = [], activeTopic = "") {
    const parsed = this.parseQuery(rawPrompt);

    // 1. Check Specialist Website Router first
    const specialistAnswer = await this.searchExactSpecialistWebsite(rawPrompt, parsed, activeTopic);
    if (specialistAnswer) {
      return {
        cleanQuery: parsed.subject,
        askingLatest: false,
        findings: [{ title: parsed.subject, text: specialistAnswer }],
        majorityAnswer: specialistAnswer
      };
    }

    // 2. Run Google News Live Search + Wikipedia + Wikidata + DuckDuckGo in parallel
    const askingLatest = parsed.intent === "latest";
    const [googleNews, wiki, wikidata, ddg, dict] = await Promise.all([
      this.searchGoogleNewsLive(parsed),
      this.searchWikipedia(parsed),
      this.searchWikidata(parsed),
      this.searchDuckDuckGo(parsed),
      this.searchDictionary(parsed)
    ]);

    const ordered = askingLatest
      ? [...googleNews, ...wiki, ...ddg, ...wikidata]
      : [...ddg, ...wiki, ...googleNews, ...wikidata, ...dict];

    const uniqueFindings = [];
    const seen = new Set();
    for (const item of ordered) {
      if (!item?.text || item.text.length < 10) continue;
      const key = item.text.slice(0, 80).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      uniqueFindings.push(item);
    }

    const consensusText = this.computeMajorityConsensus(uniqueFindings, parsed);
    const webContext = uniqueFindings.slice(0, 6).map(f => f.text).join("\n");

    const aiDirectAnswer = await this.synthesizeWithFreeAI(
      rawPrompt,
      webContext,
      conversationHistory,
      askingLatest
    );

    return {
      cleanQuery: parsed.subject,
      askingLatest,
      findings: uniqueFindings,
      majorityAnswer: aiDirectAnswer || consensusText
    };
  }

  async selfLearnLatestNews(kbEngine, neuralLM) {
    try {
      const [spaceRes, hnRes] = await Promise.allSettled([
        fetch("https://api.spaceflightnewsapi.net/v4/articles/?limit=3").then(r => r.json()),
        fetch("https://hn.algolia.com/api/v1/search_by_date?tags=story&numericFilters=points>25&hitsPerPage=3").then(r => r.json())
      ]);

      let learnedCount = 0;
      const newSentences = [];

      if (spaceRes.status === "fulfilled") {
        for (const art of spaceRes.value?.results || []) {
          if (art.title && art.summary) {
            const exists = kbEngine.documents.some(d => d.title.toLowerCase() === art.title.toLowerCase());
            if (!exists) {
              kbEngine.addDocument(art.title, "latest,news,space", art.summary);
              newSentences.push(art.summary);
              learnedCount++;
            }
          }
        }
      }

      if (hnRes.status === "fulfilled") {
        for (const hit of hnRes.value?.hits || []) {
          if (hit.title && hit.title.length > 20) {
            const exists = kbEngine.documents.some(d => d.title.toLowerCase() === hit.title.toLowerCase());
            if (!exists) {
              kbEngine.addDocument(hit.title, "latest,news,tech", `${hit.title}.`);
              newSentences.push(hit.title);
              learnedCount++;
            }
          }
        }
      }

      if (newSentences.length > 0 && neuralLM) {
        neuralLM.corpusText += "\n" + newSentences.join(". ") + ".";
        neuralLM.trainEpochs(2, 0.06);
      }

      return learnedCount;
    } catch (e) {
      return 0;
    }
  }
}

window.MultiWebsiteSearchEngine = MultiWebsiteSearchEngine;
