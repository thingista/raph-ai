/**
 * Raph AI // Animated Video & Story Video Engine
 * Creates playable animated videos and story videos with AI scene artwork,
 * 60-FPS camera motion, atmospheric particle effects, synchronized voice narration,
 * background music, and movie subtitles!
 */

class CinemaVideoEngine {
  constructor(musicEngine, voiceEngine) {
    this.music = musicEngine || null;
    this.voice = voiceEngine || null;
    this.painter = window.RaphAIPainterEngine ? new window.RaphAIPainterEngine() : null;
    this.players = new Map();

    this.sceneStyles = [
      { label: "Scene 1: The Beginning", mood: "piano", weather: "stars", color1: "#0f172a", color2: "#1e1b4b" },
      { label: "Scene 2: The Discovery", mood: "happy", weather: "sunbeams", color1: "#1e3a8a", color2: "#0284c7" },
      { label: "Scene 3: The Journey", mood: "chill", weather: "fireflies", color1: "#064e3b", color2: "#047857" },
      { label: "Scene 4: The Challenge", mood: "electronic", weather: "embers", color1: "#311042", color2: "#701a75" },
      { label: "Scene 5: The Climax", mood: "epic", weather: "embers", color1: "#3b0764", color2: "#be123c" },
      { label: "Scene 6: The Finale", mood: "happy", weather: "stars", color1: "#1e1b4b", color2: "#0ea5e9" }
    ];
  }

  buildVideoScript(topicTitle, customStoryText = "") {
    const sceneDuration = 12; // 12 seconds per scene
    const rawSentences = (customStoryText || "")
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 10);

    const fallbackBeats = [
      `In the world of ${topicTitle}, an extraordinary adventure begins under a glowing sky.`,
      `New wonders and hidden secrets appear as the journey through ${topicTitle} unfolds.`,
      `With courage and excitement, every step forward brings amazing discoveries.`,
      `A thrilling challenge tests our heroes, inspiring teamwork and determination.`,
      `At the height of the adventure, bravery shines bright across ${topicTitle}!`
    ];

    const sentences = rawSentences.length >= 2 ? rawSentences : fallbackBeats;
    const numScenes = Math.min(6, Math.max(3, sentences.length));
    const scenes = [];

    for (let i = 0; i < numScenes; i++) {
      const style = this.sceneStyles[i % this.sceneStyles.length];
      const narration = sentences[i % sentences.length];
      if (!this.painter && window.RaphAIPainterEngine) {
        this.painter = new window.RaphAIPainterEngine();
      }
      const imageUrl = this.painter
        ? this.painter.generatePictureDataURL(`${topicTitle} ${narration}`, i + 1)
        : "";

      scenes.push({
        index: i,
        sceneNumber: i + 1,
        startTime: i * sceneDuration,
        endTime: (i + 1) * sceneDuration,
        sceneTitle: `Scene ${i + 1}`,
        mood: style.mood,
        weather: style.weather,
        color1: style.color1,
        color2: style.color2,
        narration,
        imageUrl
      });
    }

    return {
      title: topicTitle,
      totalSeconds: numScenes * sceneDuration,
      sceneDuration,
      scenes
    };
  }

  formatTimeMMSS(sec) {
    const s = Math.max(0, Math.floor(sec));
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    const pad = n => String(n).padStart(2, "0");
    return `${pad(mins)}:${pad(secs)}`;
  }

  mountPlayer(cardElement, topicTitle, customStory = "") {
    if (!cardElement) return;
    const playerId = cardElement.getAttribute("data-video-id") || `vid-${Date.now()}`;
    const script = this.buildVideoScript(topicTitle, customStory);
    const canvas = cardElement.querySelector(".cinema-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const playBtn = cardElement.querySelector(".cinema-play-btn");
    const scrubber = cardElement.querySelector(".cinema-scrubber");
    const timeLabel = cardElement.querySelector(".cinema-time");
    const fullscreenBtn = cardElement.querySelector(".cinema-fs-btn");

    const imageCache = new Map();
    function getSceneImage(url) {
      if (imageCache.has(url)) return imageCache.get(url);
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      imageCache.set(url, img);
      return img;
    }

    // Preload all scene illustrations right away so the video plays smoothly
    script.scenes.forEach(sc => getSceneImage(sc.imageUrl));

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1.5 + Math.random() * 3,
      vx: (Math.random() - 0.5) * 1.2,
      vy: -0.6 - Math.random() * 1.1,
      alpha: 0.3 + Math.random() * 0.7
    }));

    const state = {
      id: playerId,
      script,
      isPlaying: false,
      currentTime: 0,
      lastSpokenSceneIdx: -1,
      lastMusicMood: "",
      rafId: null,
      lastTick: performance.now()
    };
    this.players.set(playerId, state);

    if (scrubber) {
      scrubber.max = state.script.totalSeconds;
      scrubber.value = 0;
    }
    if (timeLabel) {
      timeLabel.textContent = `00:00 / ${this.formatTimeMMSS(state.script.totalSeconds)}`;
    }

    const triggerSceneAudio = scene => {
      if (!state.isPlaying) return;
      if (state.lastSpokenSceneIdx !== scene.index) {
        state.lastSpokenSceneIdx = scene.index;
        if (this.voice && this.voice.autoSpeak) {
          this.voice.speak(scene.narration);
        }
        if (this.music && state.lastMusicMood !== scene.mood) {
          state.lastMusicMood = scene.mood;
          this.music.playTrack(scene.mood, playerId);
        }
      }
    };

    const renderFrame = now => {
      state.rafId = requestAnimationFrame(renderFrame);
      const dt = Math.min(0.1, (now - state.lastTick) / 1000);
      state.lastTick = now;

      if (state.isPlaying) {
        state.currentTime += dt;
        if (state.currentTime >= state.script.totalSeconds) {
          state.currentTime = 0;
          state.isPlaying = false;
          if (playBtn) playBtn.textContent = "▶️ Play Video";
          if (this.music) this.music.stop();
        }
        if (scrubber) scrubber.value = Math.floor(state.currentTime);
        if (timeLabel) {
          timeLabel.textContent = `${this.formatTimeMMSS(state.currentTime)} / ${this.formatTimeMMSS(state.script.totalSeconds)}`;
        }
      }

      const sceneIdx = Math.min(
        state.script.scenes.length - 1,
        Math.floor(state.currentTime / state.script.sceneDuration)
      );
      const scene = state.script.scenes[sceneIdx] || state.script.scenes[0];
      const sceneProgress = (state.currentTime - scene.startTime) / state.script.sceneDuration;

      if (state.isPlaying) {
        triggerSceneAudio(scene);
      }

      const W = canvas.width;
      const H = canvas.height;

      // 1. Sky Background
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, scene.color1);
      grad.addColorStop(1, scene.color2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // 2. Animated AI Scene Illustration with Ken Burns Pan & Zoom
      const img = getSceneImage(scene.imageUrl);
      if (img && img.complete && img.naturalWidth > 0) {
        const zoom = 1.04 + sceneProgress * 0.14;
        const panX = Math.sin(sceneProgress * Math.PI) * 18;
        const drawW = W * zoom;
        const drawH = H * zoom;
        ctx.save();
        ctx.globalAlpha = 0.88;
        ctx.drawImage(img, (W - drawW) / 2 + panX, (H - drawH) / 2, drawW, drawH);
        ctx.restore();
      } else {
        // Animated landscape while illustration loads
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.beginPath();
        ctx.arc(W * 0.76, H * 0.28, 44, 0, Math.PI * 2);
        ctx.fill();

        for (let layer = 0; layer < 3; layer++) {
          ctx.fillStyle = layer === 0 ? "rgba(15,23,42,0.5)" : layer === 1 ? "rgba(15,23,42,0.75)" : "#090d16";
          ctx.beginPath();
          const baseY = H * (0.58 + layer * 0.11);
          ctx.moveTo(0, H);
          for (let x = 0; x <= W; x += 40) {
            const wave = Math.sin((x + state.currentTime * (14 + layer * 8)) * 0.012 + layer) * (26 - layer * 6);
            ctx.lineTo(x, baseY + wave);
          }
          ctx.lineTo(W, H);
          ctx.closePath();
          ctx.fill();
        }
      }

      // 3. Floating Animated Particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;

        ctx.fillStyle =
          scene.weather === "embers"
            ? "#fb923c"
            : scene.weather === "fireflies"
            ? "#fde047"
            : "#ffffff";
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // 4. Top & Bottom Video Bars
      ctx.fillStyle = "rgba(3, 7, 18, 0.84)";
      ctx.fillRect(0, 0, W, 42);
      ctx.fillRect(0, H - 76, W, 76);

      ctx.fillStyle = "#f472b6";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(`🎥 ${state.script.title.toUpperCase()}`, 16, 26);

      ctx.fillStyle = "#38bdf8";
      ctx.textAlign = "right";
      ctx.fillText(
        `Scene ${scene.sceneNumber} of ${state.script.scenes.length}`,
        W - 16,
        26
      );

      // 5. Story Video Subtitles
      ctx.fillStyle = "#fde047";
      ctx.font = "bold 15.5px sans-serif";
      ctx.textAlign = "center";
      const words = scene.narration.split(" ");
      let line1 = "";
      let line2 = "";
      for (const w of words) {
        if ((line1 + " " + w).length < 68) line1 += (line1 ? " " : "") + w;
        else line2 += (line2 ? " " : "") + w;
      }
      ctx.fillText(line1, W / 2, H - 45);
      if (line2) {
        ctx.fillText(line2.slice(0, 74), W / 2, H - 22);
      }
    };

    state.lastTick = performance.now();
    state.rafId = requestAnimationFrame(renderFrame);

    if (playBtn) {
      playBtn.addEventListener("click", () => {
        state.isPlaying = !state.isPlaying;
        state.lastTick = performance.now();
        if (state.isPlaying) {
          playBtn.textContent = "⏸️ Pause Video";
          state.lastSpokenSceneIdx = -1;
        } else {
          playBtn.textContent = "▶️ Play Video";
          if (this.music) this.music.stop();
          if (this.voice) this.voice.stop();
        }
      });
    }

    if (scrubber) {
      scrubber.addEventListener("input", e => {
        state.currentTime = parseFloat(e.target.value) || 0;
        state.lastSpokenSceneIdx = -1;
        if (timeLabel) {
          timeLabel.textContent = `${this.formatTimeMMSS(state.currentTime)} / ${this.formatTimeMMSS(state.script.totalSeconds)}`;
        }
      });
    }

    if (fullscreenBtn) {
      fullscreenBtn.addEventListener("click", () => {
        if (cardElement.requestFullscreen) {
          cardElement.requestFullscreen();
        } else if (cardElement.webkitRequestFullscreen) {
          cardElement.webkitRequestFullscreen();
        }
      });
    }
  }
}

window.CinemaVideoEngine = CinemaVideoEngine;
