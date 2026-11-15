/**
 * Raph AI // Simple, Clean UI Controller with Live Multi-Website Search
 */

document.addEventListener("DOMContentLoaded", () => {
  const kbEngine = new window.SemanticKnowledgeEngine();
  const neuralLM = new window.FromScratchNeuralLM(24);
  const webSearch = new window.MultiWebsiteSearchEngine();
  const musicEngine = window.MusicComposerEngine ? new window.MusicComposerEngine() : null;
  const aiEngine = new window.GeneralReasoningEngine(kbEngine, neuralLM, webSearch, null, null, null, musicEngine);
  const voiceEngine = window.HumanVoiceEngine ? new window.HumanVoiceEngine() : null;
  const videoEngine = window.CinemaVideoEngine ? new window.CinemaVideoEngine(musicEngine, voiceEngine) : null;
  let musicCardCounter = 0;
  let videoCardCounter = 0;

  // Rotating happy emojis that change every time you ask a new question!
  const happyEmojis = ["😄", "🥳", "🤩", "😁", "😊", "🤗", "😎", "😸", "🌟", "🎉", "🌈", "✨"];
  let emojiIndex = 0;

  // Chat Elements
  const chatStream = document.getElementById("chat-stream");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const clearChatBtn = document.getElementById("clear-chat-btn");
  const voiceToggleBtn = document.getElementById("voice-toggle-btn");
  const wakeStatusBtn = document.getElementById("wake-status-btn");
  const speakingBadge = document.getElementById("speaking-badge");
  const micBtn = document.getElementById("mic-btn");

  // Neural Tab Elements
  const trainingCorpusEl = document.getElementById("training-corpus");
  const trainStepBtn = document.getElementById("train-step-btn");
  const resetNetBtn = document.getElementById("reset-net-btn");
  const metricEpochs = document.getElementById("metric-epochs");
  const metricLoss = document.getElementById("metric-loss");
  const lossCanvas = document.getElementById("loss-canvas");
  const seedInput = document.getElementById("seed-input");
  const sampleBtn = document.getElementById("sample-btn");
  const neuralSampleOutput = document.getElementById("neural-sample-output");

  // Memory Tab Elements
  const docTitleInput = document.getElementById("doc-title-input");
  const docBodyInput = document.getElementById("doc-body-input");
  const addDocBtn = document.getElementById("add-doc-btn");
  const kbList = document.getElementById("kb-list");
  const kbCount = document.getElementById("kb-count");
  const userFactsList = document.getElementById("user-facts-list");

  // Switch Tabs
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-view").forEach(v => v.classList.remove("active"));
      btn.classList.add("active");
      const tabId = "tab-" + btn.getAttribute("data-tab");
      document.getElementById(tabId)?.classList.add("active");
      if (btn.getAttribute("data-tab") === "neural") {
        drawLossCurve();
      }
    });
  });

  // Simple Markdown Renderer with Clickable Links
  function renderMarkdown(md) {
    if (!md) return "";
    let html = md
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    html = html.replace(/```([a-zA-Z0-9_+-]*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const label = (lang || "code").toUpperCase();
      return (
        `<div class="code-block-wrapper">` +
        `<div class="code-block-header"><span>💻 ${label}</span><button type="button" class="copy-code-btn">📋 Copy Code</button></div>` +
        `<pre><code class="lang-${lang}">${code.trim()}</code></pre>` +
        `</div>`
      );
    });

    // Interactive Music Style Picker when Raph AI asks what music you want to make first
    html = html.replace(/\[MUSIC_STYLE_PICKER\]/g, () => {
      const choices = [
        { prompt: "Make Pop music", label: "☀️ Pop Anthem" },
        { prompt: "Make Chill Lo-Fi music", label: "🌙 Chill Lo-Fi" },
        { prompt: "Make Grand Piano music", label: "🎹 Grand Piano" },
        { prompt: "Make Hip-Hop Beat music", label: "🎤 Hip-Hop Beat" },
        { prompt: "Make Rock music", label: "🎸 Stadium Rock" },
        { prompt: "Make Electronic Dance music", label: "⚡ Electronic EDM" },
        { prompt: "Make 8-Bit Game music", label: "🕹️ 8-Bit Arcade" },
        { prompt: "Make Epic Orchestra music", label: "🚀 Epic Orchestra" }
      ];
      return (
        `<div class="music-genre-pills" style="margin-top:10px;">` +
        choices
          .map(
            c =>
              `<button type="button" class="music-genre-pill music-pick-btn" data-pick-music="${c.prompt}" style="padding:8px 14px;font-size:0.84rem;">${c.label}</button>`
          )
          .join("") +
        `</div>`
      );
    });

    // Interactive Polyphonic Music Player Card: [MUSIC_PLAYER:genreKey:Title]
    html = html.replace(/\[MUSIC_PLAYER:([a-z]+):([^\]]+)\]/g, (_, genreKey, title) => {
      musicCardCounter++;
      const cardId = `raph-music-${musicCardCounter}`;
      const genres = [
        { key: "happy", label: "☀️ Pop" },
        { key: "chill", label: "🌙 Lo-Fi" },
        { key: "piano", label: "🎹 Piano" },
        { key: "hiphop", label: "🎤 Hip-Hop" },
        { key: "rock", label: "🎸 Rock" },
        { key: "electronic", label: "⚡ EDM" },
        { key: "arcade", label: "🕹️ 8-Bit" },
        { key: "epic", label: "🚀 Epic" }
      ];
      const pillsHtml = genres
        .map(
          g =>
            `<button type="button" class="music-genre-pill ${g.key === genreKey ? "active" : ""}" data-switch-genre="${g.key}" data-card-id="${cardId}">${g.label}</button>`
        )
        .join("");

      return (
        `<div class="music-player-card" data-music-id="${cardId}" data-music-genre="${genreKey}">` +
        `<div class="music-top-row">` +
        `<div class="music-info">` +
        `<div class="music-disc">🎵</div>` +
        `<div><div class="music-title">${title}</div><div class="music-sub">Raph AI Studio • Multi-Track WebAudio Synthesizer</div></div>` +
        `</div>` +
        `<div class="music-controls-right">` +
        `<div class="music-eq"><span class="eq-bar"></span><span class="eq-bar"></span><span class="eq-bar"></span><span class="eq-bar"></span></div>` +
        `<button type="button" class="music-play-btn" data-play-card="${cardId}">▶️ Play Music</button>` +
        `</div>` +
        `</div>` +
        `<div class="music-genre-pills">${pillsHtml}</div>` +
        `</div>`
      );
    });

    // Live Game Website Launch Card: [GAME_WEBSITE_CARD:Title]
    html = html.replace(/\[GAME_WEBSITE_CARD:([^\]]+)\]/g, (_, title) => {
      return (
        `<div class="game-launch-card">` +
        `<div><div style="font-weight:800;font-size:1rem;color:#fff;">🎮 ${title}</div>` +
        `<div style="font-size:0.8rem;color:#a7f3d0;">Live Playable HTML5 Game Website Ready</div></div>` +
        `<button type="button" class="game-launch-btn">🚀 Open Game Website</button>` +
        `</div>`
      );
    });

    // Animated Video & Story Video Player: [VIDEO_PLAYER:topic:encodedStory]
    html = html.replace(/\[VIDEO_PLAYER:([^:\]]+):([^\]]+)\]/g, (_, topic, encodedStory) => {
      videoCardCounter++;
      const vidId = `raph-video-${videoCardCounter}`;
      return (
        `<div class="cinema-video-card" data-video-id="${vidId}" data-video-topic="${topic}" data-video-story="${encodedStory}">` +
        `<canvas class="cinema-canvas" width="680" height="380"></canvas>` +
        `<div class="cinema-timeline-row">` +
        `<input type="range" class="cinema-scrubber" min="0" max="60" value="0" />` +
        `<span class="cinema-time">00:00 / 01:00</span>` +
        `</div>` +
        `<div class="cinema-controls-row">` +
        `<button type="button" class="cinema-play-btn">▶️ Play Video</button>` +
        `<button type="button" class="cinema-fs-btn">📺 Fullscreen</button>` +
        `</div>` +
        `</div>`
      );
    });

    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
    // Raph AI Original Generated Pictures: ![caption](data:image/... or https://...)
    html = html.replace(
      /!\[([^\]]*)\]\(((?:https?:\/\/|data:image\/)[^\s)]+)\)/g,
      '<div class="ai-picture-card"><img src="$2" alt="$1" class="ai-generated-img" loading="lazy" /></div>'
    );
    // Clickable Markdown links: [label](https://...)
    html = html.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" style="color:#38bdf8;text-decoration:underline;">$1</a>'
    );
    html = html.replace(/^#### (.*$)/gm, "<h4>$1</h4>");
    html = html.replace(/^### (.*$)/gm, "<h3>$1</h3>");
    html = html.replace(/^&gt; (.*$)/gm, '<blockquote style="border-left:3px solid #6366f1;padding-left:10px;color:#cbd5e1;margin:8px 0;">$1</blockquote>');
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    html = html.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid #28354e;margin:12px 0;" />');
    html = html.replace(/^\s*-\s+(.*$)/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>");

    return html
      .split(/\n{2,}/)
      .map(block => {
        const trimmed = block.trim();
        if (!trimmed) return "";
        if (
          trimmed.startsWith("<h") ||
          trimmed.startsWith("<pre") ||
          trimmed.startsWith("<ul") ||
          trimmed.startsWith("<blockquote") ||
          trimmed.startsWith("<hr") ||
          trimmed.startsWith("<div")
        ) {
          return trimmed;
        }
        return `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`;
      })
      .join("\n");
  }

  const RAPH_LOGO_SVG = `
    <svg class="raph-r-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="url(#raphRainbowGrad)"
        fill-rule="evenodd"
        stroke="url(#raphRainbowGrad)"
        stroke-width="2.5"
        stroke-linejoin="round"
        d="M 50 7 L 15 85 L 85 91 L 57 54 C 88 50, 90 14, 50 7 Z M 53 18 C 77 23, 76 45, 45 50 L 70 81 L 28 77 L 53 18 Z"
      />
    </svg>
  `;

  function appendMessage(role, markdownText) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `msg ${role}`;

    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.innerHTML = role === "ai" ? RAPH_LOGO_SVG : "YOU";

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.innerHTML = renderMarkdown(markdownText);

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(bubble);
    chatStream.appendChild(msgDiv);
    chatStream.scrollTop = chatStream.scrollHeight;
    return bubble;
  }

  function updateNeuralStats() {
    if (!metricEpochs || !metricLoss) return;
    const lastLoss = neuralLM.lossHistory[neuralLM.lossHistory.length - 1] ?? 0;
    metricEpochs.textContent = neuralLM.epochs;
    metricLoss.textContent = lastLoss ? lastLoss.toFixed(2) : "—";
  }

  function drawLossCurve() {
    if (!lossCanvas) return;
    const ctx = lossCanvas.getContext("2d");
    const W = lossCanvas.width;
    const H = lossCanvas.height;
    ctx.clearRect(0, 0, W, H);

    const hist = neuralLM.lossHistory;
    if (hist.length < 2) return;

    const maxL = Math.max(...hist, 4.5);
    const minL = Math.min(...hist, 0);
    const range = Math.max(0.5, maxL - minL);

    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    hist.forEach((loss, idx) => {
      const x = 16 + ((W - 32) * idx) / (hist.length - 1);
      const y = H - 16 - ((H - 32) * (loss - minL)) / range;
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  function renderMemoryLists() {
    if (!kbCount || !kbList || !userFactsList) return;
    kbCount.textContent = kbEngine.documents.length;
    kbList.innerHTML = "";

    kbEngine.documents.forEach(doc => {
      const div = document.createElement("div");
      div.className = "kb-item";
      div.innerHTML = `
        <div class="kb-item-title">${doc.title}</div>
        <div class="kb-item-body">${doc.body}</div>
      `;
      kbList.appendChild(div);
    });

    userFactsList.innerHTML = "";
    kbEngine.userFacts.forEach(fact => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>🧠 ${fact.text}</span>
        <button class="secondary-btn" data-del-fact="${fact.id}" style="padding:4px 9px;font-size:0.75rem;">✕</button>
      `;
      userFactsList.appendChild(li);
    });

    userFactsList.querySelectorAll("[data-del-fact]").forEach(btn => {
      btn.addEventListener("click", () => {
        kbEngine.removeUserFact(btn.getAttribute("data-del-fact"));
        renderMemoryLists();
      });
    });
  }

  // 4 Free Uses + 4 CHF / Week Subscription System
  const MAX_FREE_USES = 4;
  let usesCount = parseInt(localStorage.getItem("raph_ai_uses_count") || "0", 10);
  if (isNaN(usesCount) || usesCount < 0) usesCount = 0;
  let isSubscribed = localStorage.getItem("raph_ai_pro_subscribed") === "true";

  const usageCounterPill = document.getElementById("usage-counter-pill");
  const openPaywallBtn = document.getElementById("open-paywall-btn");
  const paywallModal = document.getElementById("paywall-modal");
  const closePaywallBtn = document.getElementById("close-paywall-btn");
  const paywallTitle = document.getElementById("paywall-title");
  const paywallSubtitle = document.getElementById("paywall-subtitle");
  const paywallCheckoutForm = document.getElementById("paywall-checkout-form");
  const resetFreeUsesBtn = document.getElementById("reset-free-uses-btn");

  function updateUsageUI() {
    if (!usageCounterPill) return;
    usageCounterPill.classList.remove("limit-reached", "pro-active");

    if (isSubscribed) {
      usageCounterPill.classList.add("pro-active");
      usageCounterPill.textContent = "💎 Raph AI Pro (4 CHF/wk)";
      if (openPaywallBtn) openPaywallBtn.textContent = "✅ Subscribed (4 CHF / week)";
      return;
    }

    const left = Math.max(0, MAX_FREE_USES - usesCount);
    if (left === 0) {
      usageCounterPill.classList.add("limit-reached");
      usageCounterPill.textContent = "🔒 0 / 4 Uses Left";
    } else {
      usageCounterPill.textContent = `⚡ ${left} / ${MAX_FREE_USES} Uses Left`;
    }
    if (openPaywallBtn) {
      openPaywallBtn.textContent = "💎 Get More — 4 CHF / week";
    }
  }

  function openPaywallModal(limitReached = false) {
    if (!paywallModal) return;
    if (paywallTitle && paywallSubtitle) {
      if (isSubscribed) {
        paywallTitle.textContent = "Raph AI Pro Active! 💎";
        paywallSubtitle.innerHTML = "You are subscribed for <b>4 CHF per week</b> with unlimited uses!";
      } else if (limitReached || usesCount >= MAX_FREE_USES) {
        paywallTitle.textContent = "You Used All 4 Times! 🔒";
        paywallSubtitle.innerHTML =
          "You can only use Raph AI <b>4 times</b> for free. To get more times, please pay <b>4 CHF per week</b>!";
      } else {
        const left = Math.max(0, MAX_FREE_USES - usesCount);
        paywallTitle.textContent = "Get Unlimited Times";
        paywallSubtitle.innerHTML =
          `You have <b>${left} of ${MAX_FREE_USES}</b> free uses left. Pay <b>4 CHF per week</b> to unlock unlimited times!`;
      }
    }
    paywallModal.classList.remove("hidden");
  }

  function closePaywallModal() {
    if (paywallModal) paywallModal.classList.add("hidden");
  }

  if (openPaywallBtn) {
    openPaywallBtn.addEventListener("click", () => openPaywallModal(false));
  }
  if (closePaywallBtn) {
    closePaywallBtn.addEventListener("click", closePaywallModal);
  }
  if (paywallModal) {
    paywallModal.addEventListener("click", e => {
      if (e.target === paywallModal) closePaywallModal();
    });
  }

  document.querySelectorAll(".pay-method-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".pay-method-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const method = tab.getAttribute("data-method");
      const cardInput = document.getElementById("pay-card-input");
      if (cardInput) {
        if (method === "twint") cardInput.placeholder = "TWINT Phone Number (+41 79 ...)";
        else if (method === "apple") cardInput.placeholder = "Apple ID Email";
        else cardInput.placeholder = "Card Number (4242 •••• •••• ••••)";
      }
    });
  });

  if (paywallCheckoutForm) {
    paywallCheckoutForm.addEventListener("submit", e => {
      e.preventDefault();
      isSubscribed = true;
      localStorage.setItem("raph_ai_pro_subscribed", "true");
      updateUsageUI();
      closePaywallModal();
      appendMessage(
        "ai",
        "🎉 **Thank you for subscribing for 4 CHF / week!** Your account is now unlocked with **unlimited uses** of Raph AI!"
      );
      if (voiceEngine && voiceEngine.autoSpeak) {
        voiceEngine.speak("Thank you for subscribing for 4 Swiss Francs per week! You now have unlimited uses of Raph AI.");
      }
    });
  }

  updateUsageUI();

  // Saved Chat History System (Saves your history when you press "+ New Chat" & as you chat)
  const chatHistoryListEl = document.getElementById("chat-history-list");
  let savedChats = [];
  try {
    savedChats = JSON.parse(localStorage.getItem("raph_ai_saved_chats") || "[]");
    if (!Array.isArray(savedChats)) savedChats = [];
  } catch (e) {
    savedChats = [];
  }

  let currentChatId = "chat-" + Date.now();
  let currentMessages = [];

  function persistSavedChats() {
    try {
      localStorage.setItem("raph_ai_saved_chats", JSON.stringify(savedChats.slice(0, 30)));
    } catch (e) {}
  }

  function saveCurrentChatToHistory() {
    if (!currentMessages || currentMessages.length === 0) return;
    const firstUserMsg = currentMessages.find(m => m.role === "user");
    const rawTitle = firstUserMsg ? firstUserMsg.text : "Chat with Raph AI";
    const title = rawTitle.length > 32 ? rawTitle.slice(0, 32) + "..." : rawTitle;

    const existingIdx = savedChats.findIndex(c => c.id === currentChatId);
    const chatObj = {
      id: currentChatId,
      title,
      updatedAt: Date.now(),
      messages: [...currentMessages]
    };

    if (existingIdx >= 0) {
      savedChats[existingIdx] = chatObj;
    } else {
      savedChats.unshift(chatObj);
    }

    persistSavedChats();
    renderChatHistoryList();
  }

  function loadSavedChat(chatId) {
    if (currentMessages.length > 0) {
      saveCurrentChatToHistory();
    }
    const target = savedChats.find(c => c.id === chatId);
    if (!target) return;

    currentChatId = target.id;
    currentMessages = [...(target.messages || [])];
    chatStream.innerHTML = "";
    aiEngine.resetConversation();

    currentMessages.forEach(msg => {
      const bubble = appendMessage(msg.role, msg.text);
      aiEngine.conversationHistory.push({
        role: msg.role,
        content: msg.text
      });

      if (msg.role === "ai") {
        if (msg.gameHtml) {
          const blob = new Blob([msg.gameHtml], { type: "text/html" });
          const blobUrl = URL.createObjectURL(blob);
          lastBuiltGame = { html: msg.gameHtml, title: msg.gameTitle || "Raph AI Game", blobUrl };
        }
        const videoCard = bubble.querySelector(".cinema-video-card");
        if (videoCard && videoEngine) {
          const vTopic = videoCard.getAttribute("data-video-topic") || "Raph AI Video";
          let vStory = "";
          try {
            vStory = decodeURIComponent(videoCard.getAttribute("data-video-story") || "");
          } catch (e) {}
          videoEngine.mountPlayer(videoCard, vTopic, vStory);
        }
      }
    });

    renderChatHistoryList();
  }

  function deleteSavedChat(chatId) {
    savedChats = savedChats.filter(c => c.id !== chatId);
    persistSavedChats();
    if (currentChatId === chatId) {
      currentChatId = "chat-" + Date.now();
      currentMessages = [];
      chatStream.innerHTML = "";
      aiEngine.resetConversation();
      sendWelcomeMessage();
    }
    renderChatHistoryList();
  }

  function renderChatHistoryList() {
    if (!chatHistoryListEl) return;
    chatHistoryListEl.innerHTML = "";

    if (savedChats.length === 0) {
      chatHistoryListEl.innerHTML = `<div class="chat-history-empty">No saved chats yet</div>`;
      return;
    }

    savedChats.forEach(chat => {
      const item = document.createElement("div");
      item.className = "chat-history-item" + (chat.id === currentChatId ? " active" : "");
      item.innerHTML = `
        <span class="chat-history-title" title="${chat.title.replace(/"/g, "&quot;")}">💬 ${chat.title}</span>
        <button type="button" class="chat-history-del-btn" data-del-chat="${chat.id}" title="Delete chat">✕</button>
      `;
      item.addEventListener("click", e => {
        const delBtn = e.target.closest("[data-del-chat]");
        if (delBtn) {
          e.stopPropagation();
          deleteSavedChat(chat.id);
          return;
        }
        loadSavedChat(chat.id);
      });
      chatHistoryListEl.appendChild(item);
    });
  }

  renderChatHistoryList();

  async function handleSend(promptText) {
    const text = promptText.trim();
    if (!text) return;

    appendMessage("user", text);
    chatInput.value = "";

    // Check if the user has already used their 4 free times!
    if (!isSubscribed && usesCount >= MAX_FREE_USES) {
      const paywallBubble = appendMessage("ai", "");
      paywallBubble.innerHTML = `
        <p>🔒 You have used all <b>4 of your free times</b>! To get more times, you need to pay <b>4 CHF per week</b>.</p>
        <div class="chat-paywall-card">
          <div>
            <div style="font-weight:900;font-size:0.98rem;color:#fde047;">💎 Raph AI Unlimited — 4 CHF / week</div>
            <div style="font-size:0.8rem;color:#e2e8f0;">Unlock unlimited questions, 3D games, stories, pictures &amp; music!</div>
          </div>
          <button type="button" class="chat-paywall-btn">🔓 Pay 4 CHF / week</button>
        </div>
      `;
      chatStream.scrollTop = chatStream.scrollHeight;
      openPaywallModal(true);
      if (voiceEngine && voiceEngine.autoSpeak) {
        voiceEngine.speak("You have used all 4 of your free times. To get more times, you need to pay 4 Swiss Francs per week.");
      }
      return;
    }

    // Count this use (1 of 4)
    if (!isSubscribed) {
      usesCount++;
      localStorage.setItem("raph_ai_uses_count", String(usesCount));
      updateUsageUI();
    }

    // Show a bouncing happy emoji with NO square box around it!
    const currentEmoji = happyEmojis[emojiIndex % happyEmojis.length];
    emojiIndex++;
    const aiBubble = appendMessage("ai", "");
    aiBubble.classList.add("emoji-only");
    aiBubble.innerHTML = `<span class="happy-thinking-emoji">${currentEmoji}</span>`;

    const result = await aiEngine.processQuery(text);
    aiBubble.classList.remove("emoji-only");
    aiBubble.innerHTML = renderMarkdown(result.answer);
    chatStream.scrollTop = chatStream.scrollHeight;

    // Record turn in current chat session and auto-save to history
    currentMessages.push({ role: "user", text });
    currentMessages.push({
      role: "ai",
      text: result.answer,
      gameHtml: result.gameHtml || null,
      gameTitle: result.gameTitle || null
    });
    saveCurrentChatToHistory();

    // If Raph AI coded a game or website, send the user STRAIGHT onto the live website of the game!
    if (result.gameHtml) {
      openLiveGameWebsite(result.gameHtml, result.gameTitle || "Raph AI Game");
    }

    // If Raph AI generated a Video or Story Video, mount the Video Player!
    const videoCard = aiBubble.querySelector(".cinema-video-card");
    if (videoCard && videoEngine) {
      const vTopic = videoCard.getAttribute("data-video-topic") || "Raph AI Video";
      let vStory = "";
      try {
        vStory = decodeURIComponent(videoCard.getAttribute("data-video-story") || "");
      } catch (e) {}
      videoEngine.mountPlayer(videoCard, vTopic, vStory);
    }

    // If Raph AI composed music, start playing the synthesized track immediately!
    const musicCard = aiBubble.querySelector(".music-player-card");
    if (musicCard && musicEngine) {
      const cardId = musicCard.getAttribute("data-music-id");
      const genreKey = musicCard.getAttribute("data-music-genre") || "happy";
      musicEngine.playTrack(genreKey, cardId);
    } else if (voiceEngine && voiceEngine.autoSpeak) {
      // Otherwise speak the answer out loud like a real human!
      voiceEngine.speak(result.answer);
    }

    updateNeuralStats();
    renderMemoryLists();
  }

  // Full-Screen Live Game Website Portal Controller
  let lastBuiltGame = null;
  const gamePortal = document.getElementById("game-website-portal");
  const gamePortalIframe = document.getElementById("game-portal-iframe");
  const portalGameTitle = document.getElementById("portal-game-title");
  const openGameNewtabLink = document.getElementById("open-game-newtab-link");
  const closeGamePortalBtn = document.getElementById("close-game-portal-btn");

  function openLiveGameWebsite(htmlContent, title) {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const blobUrl = URL.createObjectURL(blob);
    lastBuiltGame = { html: htmlContent, title, blobUrl };

    if (portalGameTitle) portalGameTitle.textContent = title;
    if (openGameNewtabLink) openGameNewtabLink.href = blobUrl;
    if (gamePortalIframe) {
      gamePortalIframe.src = blobUrl;
      gamePortalIframe.onload = () => {
        try {
          gamePortalIframe.contentWindow.focus();
        } catch (e) {}
      };
    }
    if (gamePortal) {
      gamePortal.classList.remove("hidden");
    }
  }

  if (closeGamePortalBtn && gamePortal) {
    closeGamePortalBtn.addEventListener("click", () => {
      gamePortal.classList.add("hidden");
      if (gamePortalIframe) gamePortalIframe.src = "about:blank";
    });
  }

  // Interactive Music Player, Game Website Launcher & Code Copy button handlers inside chat
  chatStream.addEventListener("click", e => {
    const paywallBtn = e.target.closest(".chat-paywall-btn");
    if (paywallBtn) {
      openPaywallModal(true);
      return;
    }

    const pickMusicBtn = e.target.closest(".music-pick-btn");
    if (pickMusicBtn) {
      const musicPrompt = pickMusicBtn.getAttribute("data-pick-music");
      if (musicPrompt) handleSend(musicPrompt);
      return;
    }

    const launchBtn = e.target.closest(".game-launch-btn");
    if (launchBtn && lastBuiltGame) {
      openLiveGameWebsite(lastBuiltGame.html, lastBuiltGame.title);
      return;
    }

    const playBtn = e.target.closest(".music-play-btn");
    if (playBtn && musicEngine) {
      const card = playBtn.closest(".music-player-card");
      if (card) {
        const cardId = card.getAttribute("data-music-id");
        const genre = card.getAttribute("data-music-genre") || "happy";
        musicEngine.togglePlay(genre, cardId);
      }
      return;
    }

    const genrePill = e.target.closest(".music-genre-pill");
    if (genrePill && musicEngine) {
      const card = genrePill.closest(".music-player-card");
      const newGenre = genrePill.getAttribute("data-switch-genre");
      if (card && newGenre) {
        card.setAttribute("data-music-genre", newGenre);
        card.querySelectorAll(".music-genre-pill").forEach(p => p.classList.remove("active"));
        genrePill.classList.add("active");
        const titleEl = card.querySelector(".music-title");
        if (titleEl && musicEngine.scales[newGenre]) {
          titleEl.textContent = musicEngine.scales[newGenre].name;
        }
        const cardId = card.getAttribute("data-music-id");
        musicEngine.playTrack(newGenre, cardId);
      }
      return;
    }

    const copyBtn = e.target.closest(".copy-code-btn");
    if (copyBtn) {
      const wrapper = copyBtn.closest(".code-block-wrapper");
      const codeEl = wrapper?.querySelector("code");
      if (codeEl && navigator.clipboard) {
        navigator.clipboard.writeText(codeEl.textContent || "");
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => {
          copyBtn.textContent = "📋 Copy Code";
        }, 1800);
      }
    }
  });

  // Voice & Hands-Free "Hey Raph AI" Controls
  if (voiceEngine) {
    voiceEngine.onStateChange = isSpeaking => {
      if (speakingBadge) {
        speakingBadge.classList.toggle("hidden", !isSpeaking);
      }
    };

    // Automatically answer back when the user says "Hey Raph AI" or speaks any question
    voiceEngine.onVoiceCommand = commandText => {
      handleSend(commandText);
    };

    voiceEngine.onWakeStatusChange = (handsFreeEnabled, isListening, liveHeardText) => {
      if (wakeStatusBtn) {
        if (!handsFreeEnabled) {
          wakeStatusBtn.textContent = '🎙️ Say "Hey Raph AI"';
          wakeStatusBtn.classList.remove("active");
        } else if (isListening) {
          wakeStatusBtn.textContent = liveHeardText
            ? `🟢 Hearing: "${liveHeardText.slice(0, 24)}..."`
            : '🟢 Listening ("Hey Raph AI")';
          wakeStatusBtn.classList.add("active");
        } else {
          wakeStatusBtn.textContent = '🎙️ Say "Hey Raph AI"';
          wakeStatusBtn.classList.remove("active");
        }
      }
      if (micBtn) {
        micBtn.classList.toggle("listening", isListening);
      }
      chatInput.placeholder = liveHeardText
        ? `🎙️ Hearing: "${liveHeardText}"...`
        : isListening
        ? '🟢 Listening! Say "Hey Raph AI" or ask a question...'
        : "Message Raph AI or click 🎤 to talk...";
    };
  }

  if (wakeStatusBtn && voiceEngine) {
    wakeStatusBtn.addEventListener("click", () => {
      if (voiceEngine.handsFreeEnabled && voiceEngine.isListening) {
        voiceEngine.stopHandsFreeListening();
      } else {
        voiceEngine.handsFreeEnabled = true;
        voiceEngine.startHandsFreeListening();
      }
    });
  }

  if (voiceToggleBtn && voiceEngine) {
    voiceToggleBtn.addEventListener("click", () => {
      voiceEngine.autoSpeak = !voiceEngine.autoSpeak;
      if (!voiceEngine.autoSpeak) {
        voiceEngine.stop();
        voiceToggleBtn.textContent = "🔇 Voice: OFF";
        voiceToggleBtn.classList.remove("active");
      } else {
        voiceToggleBtn.textContent = "🔊 Voice: ON";
        voiceToggleBtn.classList.add("active");
      }
    });
  }

  if (micBtn && voiceEngine) {
    micBtn.addEventListener("click", () => {
      voiceEngine.triggerImmediateListen();
    });
  }

  // Events
  chatForm.addEventListener("submit", e => {
    e.preventDefault();
    handleSend(chatInput.value);
  });

  chatInput.addEventListener("keydown", e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(chatInput.value);
    }
  });

  document.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      handleSend(chip.getAttribute("data-prompt"));
    });
  });

  clearChatBtn.addEventListener("click", () => {
    // Save the current chat to history before starting a new chat!
    if (currentMessages.length > 0) {
      saveCurrentChatToHistory();
    }
    currentChatId = "chat-" + Date.now();
    currentMessages = [];
    chatStream.innerHTML = "";
    aiEngine.resetConversation();
    sendWelcomeMessage();
    renderChatHistoryList();
  });

  if (trainingCorpusEl) {
    trainingCorpusEl.value = window.DEFAULT_NEURAL_CORPUS;
  }

  if (trainStepBtn) {
    trainStepBtn.addEventListener("click", () => {
      neuralLM.trainEpochs(40, 0.08);
      updateNeuralStats();
      drawLossCurve();
      if (neuralSampleOutput) {
        neuralSampleOutput.textContent = neuralLM.generate(seedInput?.value || "artificial intelligence", 25, 0.7);
      }
    });
  }

  if (resetNetBtn) {
    resetNetBtn.addEventListener("click", () => {
      neuralLM.initNetwork(trainingCorpusEl?.value || window.DEFAULT_NEURAL_CORPUS, 24);
      updateNeuralStats();
      drawLossCurve();
      if (neuralSampleOutput) neuralSampleOutput.textContent = "Neural network reset and ready!";
    });
  }

  if (sampleBtn) {
    sampleBtn.addEventListener("click", () => {
      if (neuralSampleOutput) {
        neuralSampleOutput.textContent = neuralLM.generate(seedInput?.value || "artificial intelligence", 25, 0.7);
      }
    });
  }

  if (addDocBtn) {
    addDocBtn.addEventListener("click", () => {
      const title = docTitleInput.value.trim();
      const body = docBodyInput.value.trim();
      if (!body) return;

      kbEngine.addDocument(title || "Custom Note", "custom", body);
      docTitleInput.value = "";
      docBodyInput.value = "";
      renderMemoryLists();
    });
  }

  function sendWelcomeMessage() {
    const hero = document.createElement("div");
    hero.className = "welcome-hero";
    hero.innerHTML = `
      <div class="welcome-hero-r">${RAPH_LOGO_SVG}</div>
      <div class="welcome-hero-text">Hi! I'm <b>Raph AI</b>. Ask me anything and I'll give you a simple, direct answer!</div>
    `;
    chatStream.appendChild(hero);
  }

  // Automatically self-learn the latest news in the background on startup and every 3 minutes
  async function runBackgroundSelfLearning() {
    const count = await webSearch.selfLearnLatestNews(kbEngine, neuralLM);
    if (count > 0) {
      updateNeuralStats();
      renderMemoryLists();
    }
  }

  updateNeuralStats();
  renderMemoryLists();
  drawLossCurve();
  sendWelcomeMessage();
  runBackgroundSelfLearning();
  setInterval(runBackgroundSelfLearning, 180000);
});
