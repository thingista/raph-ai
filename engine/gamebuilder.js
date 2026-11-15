/**
 * Raph AI // 3D Playable Game & Website Builder Engine
 * Builds real, fast 60-FPS 3D Perspective Games (3D Bike Racing & Stunts,
 * 3D Alpine Ski & Slalom, 3D Highway Car Racing, 3D Space/Zombie/Dragon 3D Shooters,
 * and Custom 3D Worlds) for ANY game the user tells Raph AI to make!
 */

class CustomGameBuilderEngine {
  constructor() {
    this.themes = [
      {
        match: /\b(ski|skiing|snowboard|snowboarding|slalom|alpine|snow\s+game|winter\s+game|avalanche|sled)\b/i,
        title: "3D Alpine Ski & Snowboard Rush",
        mode: "ski3d",
        player: "⛷️",
        enemy: "🌲",
        enemy2: "🪨",
        item: "🚩",
        boostItem: "❄️",
        skyTop: "#0284c7",
        skyBot: "#bae6fd",
        groundA: "#f8fafc",
        groundB: "#e2e8f0",
        trackA: "#ffffff",
        trackB: "#f1f5f9",
        accent: "#0ea5e9"
      },
      {
        match: /\b(bike|biking|bicycle|motorcycle|motorbike|motocross|bmx|dirt\s*bike|cycling|scooter|atv)\b/i,
        title: "3D Moto Bike Stunt & Nitro Rider",
        mode: "bike3d",
        player: "🏍️",
        enemy: "🚧",
        enemy2: "🚙",
        item: "⚡",
        boostItem: "🔥",
        skyTop: "#0f0728",
        skyBot: "#4c1d95",
        groundA: "#14532d",
        groundB: "#166534",
        trackA: "#1e293b",
        trackB: "#334155",
        accent: "#f43f5e"
      },
      {
        match: /\b(car|race|racing|drive|driving|drift|highway|formula|truck|lambo|ferrari)\b/i,
        title: "3D Turbo Supercar Highway",
        mode: "car3d",
        player: "🏎️",
        enemy: "🚓",
        enemy2: "🚛",
        item: "🪙",
        boostItem: "⚡",
        skyTop: "#090d16",
        skyBot: "#1e3a8a",
        groundA: "#064e3b",
        groundB: "#065f46",
        trackA: "#1f2937",
        trackB: "#374151",
        accent: "#ef4444"
      },
      {
        match: /\b(zombie|undead|apocalypse|monster\s+shooter)\b/i,
        title: "3D Zombie Apocalypse Shooter",
        mode: "shooter3d",
        player: "🦸",
        bullet: "💥",
        enemy: "🧟",
        enemy2: "🦇",
        item: "💊",
        boostItem: "⚡",
        skyTop: "#090d16",
        skyBot: "#31102f",
        groundA: "#18181b",
        groundB: "#27272a",
        trackA: "#27272a",
        trackB: "#3f3f46",
        accent: "#ef4444"
      },
      {
        match: /\b(space|alien|ufo|galaxy|star\s*wars|asteroid|rocket|spaceship)\b/i,
        title: "3D Galaxy Starfighter",
        mode: "shooter3d",
        player: "🚀",
        bullet: "⚡",
        enemy: "👾",
        enemy2: "☄️",
        item: "🌟",
        boostItem: "💎",
        skyTop: "#020617",
        skyBot: "#0f172a",
        groundA: "#0f172a",
        groundB: "#1e1b4b",
        trackA: "#1e1b4b",
        trackB: "#312e81",
        accent: "#38bdf8"
      },
      {
        match: /\b(dragon|fireball|wyvern|knight|castle|wizard|magic)\b/i,
        title: "3D Dragon Fireball Odyssey",
        mode: "shooter3d",
        player: "🐉",
        bullet: "🔥",
        enemy: "👹",
        enemy2: "🦇",
        item: "💎",
        boostItem: "👑",
        skyTop: "#1f091d",
        skyBot: "#4c1d95",
        groundA: "#2e1065",
        groundB: "#3b0764",
        trackA: "#4c1d95",
        trackB: "#581c87",
        accent: "#f97316"
      },
      {
        match: /\b(shark|ocean|sea|underwater|fish|whale|dolphin|boat|pirate)\b/i,
        title: "3D Ocean Shark & Treasure Rush",
        mode: "runner3d",
        player: "🦈",
        enemy: "💣",
        enemy2: "🐙",
        item: "🐟",
        boostItem: "🪙",
        skyTop: "#011627",
        skyBot: "#0284c7",
        groundA: "#0369a1",
        groundB: "#075985",
        trackA: "#0284c7",
        trackB: "#0ea5e9",
        accent: "#38bdf8"
      },
      {
        match: /\b(soccer|football|fifa|goal|penalty|striker|world\s*cup|champions\s*league|premier\s*league)\b/i,
        title: "3D Champions League Soccer Stadium",
        mode: "soccer3d",
        player: "⚽",
        enemy: "🧤",
        enemy2: "🏃",
        item: "🏆",
        boostItem: "⭐",
        skyTop: "#040d21",
        skyBot: "#0f2942",
        groundA: "#15803d",
        groundB: "#16a34a",
        trackA: "#15803d",
        trackB: "#16a34a",
        accent: "#22c55e"
      },
      {
        match: /\b(dino|dinosaur|t-?rex|jurassic|mario|platform|platformer|jump|jumping|runner|run|parkour|sonic)\b/i,
        title: "3D Super Parkour & Jump Rush",
        mode: "runner3d",
        player: "🦖",
        enemy: "🌵",
        enemy2: "🔥",
        item: "🪙",
        boostItem: "⭐",
        skyTop: "#0f172a",
        skyBot: "#3b0764",
        groundA: "#14532d",
        groundB: "#166534",
        trackA: "#334155",
        trackB: "#475569",
        accent: "#4ade80"
      }
    ];
  }

  isGameBuildRequest(input) {
    const lower = (input || "").toLowerCase().trim();
    if (/\b(make\s+a\s+summary|summarize|weather|forecast|capital\s+of|who\s+won|video|videos|film|films|movie|movies|story|stories)\b/.test(lower)) {
      return false;
    }
    if (
      /\b(make|code|program|create|build|develop|write|design|play|give\s+me|start)\b.*\b(game|games|3d|arcade|platformer|shooter|snake|pong|flappy|bike|ski|skiing|snowboard|racing|car)\b/i.test(lower) ||
      /\b(bike|ski|skiing|snowboard|3d)\s+game\b/i.test(lower) ||
      /\bgame\b.*\b(about|where|with|for|3d)\b/i.test(lower)
    ) {
      return true;
    }
    return false;
  }

  detectTheme(promptText) {
    const lower = (promptText || "").toLowerCase();
    for (const t of this.themes) {
      if (t.match.test(lower)) {
        return { ...t };
      }
    }

    // Dynamic noun-to-emoji dictionary so ANY custom character/item the user names appears in 3D!
    const emojiMap = [
      [/\bbike|bicycle|motorcycle|moto\b/, "🏍️"], [/\bski|skier|snowboard\b/, "⛷️"],
      [/\bcar|race|racer\b/, "🏎️"], [/\bfrog|toad\b/, "🐸"], [/\bfly|flies|bug\b/, "🪰"],
      [/\bcat|kitten\b/, "🐱"], [/\bdog|puppy\b/, "🐶"], [/\bmonkey|ape\b/, "🐒"],
      [/\bbanana\b/, "🍌"], [/\bpizza\b/, "🍕"], [/\bburger\b/, "🍔"],
      [/\bninja\b/, "🥷"], [/\brobot\b/, "🤖"], [/\bunicorn\b/, "🦄"],
      [/\bpenguin\b/, "🐧"], [/\bpanda\b/, "🐼"], [/\bbear\b/, "🐻"],
      [/\blion\b/, "🦁"], [/\btiger\b/, "🐯"], [/\bwolf\b/, "🐺"],
      [/\bfox\b/, "🦊"], [/\bbunny|rabbit\b/, "🐰"], [/\bcarrot\b/, "🥕"],
      [/\bghost\b/, "👻"], [/\bsanta\b/, "🎅"], [/\bsuperhero|hero\b/, "🦸"],
      [/\bplane|airplane|jet\b/, "✈️"], [/\bhelicopter\b/, "🚁"], [/\btrain\b/, "🚂"]
    ];

    const matchedEmojis = [];
    for (const [regex, emo] of emojiMap) {
      if (regex.test(lower)) matchedEmojis.push(emo);
    }

    const cleaned = promptText
      .replace(/^(?:please\s+)?(?:can\s+you\s+)?(?:make|code|program|create|build|write|develop|play)\s+(?:me\s+)?(?:a|an|the)?\s*/i, "")
      .replace(/\b(?:in\s+html|in\s+javascript|in\s+js|website|code|game|3d)\b/gi, "")
      .replace(/[?!.]+$/g, "")
      .trim();

    const customName = cleaned
      ? "3D " + cleaned.replace(/\b\w/g, c => c.toUpperCase()) + " Game"
      : "3D Raph AI Adventure";

    let mode = "runner3d";
    if (/\b(shoot|shooter|blast|laser|kill|fight|battle|attack)\b/.test(lower)) mode = "shooter3d";
    else if (/\b(ski|snow|slalom|mountain)\b/.test(lower)) mode = "ski3d";
    else if (/\b(bike|motorcycle|bmx|cycle)\b/.test(lower)) mode = "bike3d";
    else if (/\b(drive|race|racing|steer|car)\b/.test(lower)) mode = "car3d";

    return {
      title: customName,
      mode,
      player: matchedEmojis[0] || (mode === "shooter3d" ? "🚀" : "🦊"),
      bullet: "⚡",
      enemy: matchedEmojis[2] || "🚧",
      enemy2: "👾",
      item: matchedEmojis[1] || "⭐",
      boostItem: "🔥",
      skyTop: "#0f0728",
      skyBot: "#3b0764",
      groundA: "#1e1b4b",
      groundB: "#311042",
      trackA: "#1e293b",
      trackB: "#334155",
      accent: "#ec4899"
    };
  }

  buildGame(promptText) {
    const theme = this.detectTheme(promptText);
    const html =
      theme.mode === "soccer3d"
        ? this.generateSoccer3DHTML(theme)
        : this.generatePlayable3DHTML(theme);
    return {
      title: theme.title,
      mode: theme.mode,
      html
    };
  }

  generateSoccer3DHTML(theme) {
    const safeTitle = theme.title.replace(/[<>"']/g, "");
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; user-select: none; }
    body {
      margin: 0;
      min-height: 100vh;
      background: radial-gradient(circle at top, #0f2942, #030712);
      color: #fff;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .scoreboard {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: min(880px, 96vw);
      margin-bottom: 8px;
      padding: 10px 20px;
      background: linear-gradient(90deg, #0f172a, #1e293b, #0f172a);
      border: 2px solid #22c55e;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.65);
    }
    .match-badge {
      display: flex;
      align-items: center;
      gap: 14px;
      font-size: 1.25rem;
      font-weight: 900;
    }
    .team-blue { color: #38bdf8; }
    .team-red { color: #f43f5e; }
    .score-box {
      background: #020617;
      border: 2px solid #facc15;
      padding: 4px 16px;
      border-radius: 10px;
      color: #fde047;
      font-size: 1.35rem;
      letter-spacing: 2px;
    }
    canvas {
      border: 3px solid #22c55e;
      border-radius: 18px;
      box-shadow: 0 18px 50px rgba(0, 0, 0, 0.85);
      width: min(880px, 96vw);
      height: min(530px, 74vh);
      cursor: crosshair;
      background: #064e3b;
    }
    .controls-bar {
      margin-top: 8px;
      display: flex;
      gap: 14px;
      align-items: center;
      font-size: 0.88rem;
      color: #e2e8f0;
      flex-wrap: wrap;
      justify-content: center;
    }
    .btn {
      background: linear-gradient(135deg, #22c55e, #0ea5e9);
      color: #fff;
      border: none;
      padding: 7px 16px;
      border-radius: 999px;
      font-weight: 800;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="scoreboard">
    <div style="font-weight:900;font-size:1.1rem;">🏟️ ${safeTitle}</div>
    <div class="match-badge">
      <span class="team-blue">🔵 YOU</span>
      <span class="score-box"><span id="goals-you">0</span> - <span id="goals-cpu">0</span></span>
      <span class="team-red">CPU 🔴</span>
    </div>
    <div style="font-weight:800;color:#a7f3d0;">🔥 Streak: <span id="streak">0</span></div>
  </div>

  <canvas id="canvas" width="880" height="530"></canvas>

  <div class="controls-bar">
    <span>⚽ Dribble: <b>Arrow Keys / WASD / Mouse</b> • Aim at Goal Target 🎯 • Shoot / Kick Ball: <b>SPACEBAR or Left Click</b></span>
    <button class="btn" id="reset-btn">🔄 New Match</button>
  </div>

  <script>
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const goalsYouEl = document.getElementById("goals-you");
    const goalsCpuEl = document.getElementById("goals-cpu");
    const streakEl = document.getElementById("streak");

    const W = canvas.width;
    const H = canvas.height;
    const horizonY = 148;

    let goalsYou = 0, goalsCpu = 0, streak = 0, frame = 0;
    const keys = {};

    // 3D Pitch coordinates: x in [-1.3, 1.3], z in [10 (near camera) .. 95 (goal line)]
    let striker = { x: 0, z: 22 };
    let ball = { x: 0, y: 0, z: 25, vx: 0, vy: 0, vz: 0, shot: false, spin: 0 };
    let aimX = 0.35; // Target inside goal [-0.75 .. +0.75]
    let aimY = 38;   // Height target inside goal
    let keeper = { x: 0, y: 0, diveX: 0, diveY: 0, diving: false };
    let defenders = [
      { x: -0.45, z: 52, dir: 1, speed: 0.015 },
      { x: 0.45, z: 70, dir: -1, speed: 0.018 }
    ];
    let banner = "⚽ Dribble past defenders & press SPACE or CLICK to SHOOT!";
    let bannerTimer = 90;
    let netRipple = 0;
    let confetti = [];
    let resetTimer = 0;

    // Crowd fans in stadium stands
    const crowdDots = [];
    for (let i = 0; i < 160; i++) {
      crowdDots.push({
        x: Math.random() * W,
        y: 55 + Math.random() * 82,
        color: ["#38bdf8", "#f43f5e", "#fde047", "#ffffff", "#22c55e"][i % 5],
        phase: Math.random() * Math.PI * 2
      });
    }

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    function sfx(freq, type, dur, slide) {
      try {
        if (!audioCtx) audioCtx = new AudioCtx();
        if (audioCtx.state === "suspended") audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type || "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        if (slide) osc.frequency.exponentialRampToValueAtTime(slide, audioCtx.currentTime + dur);
        gain.gain.setValueAtTime(0.14, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + dur);
      } catch (e) {}
    }

    // Project 3D pitch coordinates (x, heightY, depthZ) onto 2D screen
    function projectPitch(x, y, z) {
      // z goes from 10 (foreground bottom) to 95 (goal line near horizon)
      const t = (z - 10) / 85; // 0 at bottom, 1 at goal line
      const perspective = 1 / (1 + t * 2.35);
      const screenY = H - 35 - (H - 35 - (horizonY + 18)) * (1 - perspective * 0.92) - y * perspective * 1.4;
      const pitchHalfW = 390 * perspective + 65;
      const screenX = W / 2 + x * pitchHalfW;
      return { x: screenX, y: screenY, scale: perspective, halfW: pitchHalfW };
    }

    function spawnConfetti() {
      for (let i = 0; i < 65; i++) {
        confetti.push({
          x: W / 2 + (Math.random() - 0.5) * 360,
          y: horizonY + 20,
          vx: (Math.random() - 0.5) * 9,
          vy: -Math.random() * 7 - 2,
          color: ["#fde047", "#38bdf8", "#22c55e", "#f43f5e", "#a855f7"][i % 5],
          life: 65
        });
      }
    }

    function resetAttack() {
      striker = { x: 0, z: 22 };
      ball = { x: 0, y: 0, z: 25, vx: 0, vy: 0, vz: 0, shot: false, spin: 0 };
      keeper = { x: 0, y: 0, diveX: 0, diveY: 0, diving: false };
      defenders = [
        { x: -0.5, z: 50, dir: 1, speed: 0.015 + Math.min(0.015, streak * 0.002) },
        { x: 0.5, z: 68, dir: -1, speed: 0.018 + Math.min(0.015, streak * 0.002) }
      ];
      resetTimer = 0;
    }

    function shootBall() {
      if (ball.shot || resetTimer > 0) return;
      ball.shot = true;
      const distZ = 95 - ball.z;
      const steps = Math.max(22, distZ * 0.55);
      ball.vz = distZ / steps;
      ball.vx = (aimX - ball.x) / steps;
      ball.vy = (aimY / steps) + 3.6;
      ball.spin = (keys["arrowleft"] || keys["a"]) ? -0.0008 : (keys["arrowright"] || keys["d"]) ? 0.0008 : 0;

      // Goalkeeper reacts and dives toward shot!
      keeper.diving = true;
      const reactionError = (Math.random() - 0.5) * 0.42;
      keeper.diveX = Math.max(-0.72, Math.min(0.72, aimX + reactionError));
      keeper.diveY = Math.random() * 28;
      sfx(240, "triangle", 0.14, 90);
    }

    window.addEventListener("keydown", e => {
      keys[e.key.toLowerCase()] = true;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) e.preventDefault();
      if (e.key === " ") shootBall();
    });
    window.addEventListener("keyup", e => { keys[e.key.toLowerCase()] = false; });

    canvas.addEventListener("mousemove", e => {
      const rect = canvas.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 2.0;
      const my = (e.clientY - rect.top) / rect.height;
      aimX = Math.max(-0.78, Math.min(0.78, mx));
      aimY = Math.max(8, Math.min(62, (1 - my) * 75));
      if (!ball.shot && resetTimer === 0) {
        striker.x += (Math.max(-1.05, Math.min(1.05, mx)) - striker.x) * 0.18;
      }
    });

    canvas.addEventListener("mousedown", () => shootBall());

    document.getElementById("reset-btn").addEventListener("click", () => {
      goalsYou = 0; goalsCpu = 0; streak = 0;
      goalsYouEl.textContent = "0"; goalsCpuEl.textContent = "0"; streakEl.textContent = "0";
      resetAttack();
    });

    function draw3DPitch() {
      // Night Stadium Sky & Floodlights
      const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
      sky.addColorStop(0, "#020617");
      sky.addColorStop(1, "#0f2942");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, horizonY);

      // Stadium Floodlight Beams
      ctx.fillStyle = "rgba(250, 204, 21, 0.14)";
      ctx.beginPath(); ctx.moveTo(110, 22); ctx.lineTo(20, horizonY); ctx.lineTo(290, horizonY); ctx.fill();
      ctx.beginPath(); ctx.moveTo(W - 110, 22); ctx.lineTo(W - 290, horizonY); ctx.lineTo(W - 20, horizonY); ctx.fill();

      // Stadium Grandstands
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, 48, W, horizonY - 48);
      crowdDots.forEach(c => {
        const bounce = Math.sin(frame * 0.12 + c.phase) * (netRipple > 0 ? 4.5 : 1.2);
        ctx.fillStyle = c.color;
        ctx.fillRect(c.x, c.y + bounce, 4, 4);
      });

      // Stadium Ad Boards along Goal Line
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, horizonY - 12, W, 16);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, horizonY - 12, W, 16);

      // 3D Mowed Grass Stripes on the Soccer Pitch
      for (let z = 95; z > 10; z -= 5) {
        const p1 = projectPitch(0, 0, z);
        const p2 = projectPitch(0, 0, z - 5);
        const stripe = Math.floor(z / 5) % 2 === 0;
        ctx.fillStyle = stripe ? "#15803d" : "#16a34a";
        ctx.fillRect(0, p1.y, W, p2.y - p1.y + 1);

        // White 3D Touchlines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(W / 2 - p1.halfW, p1.y);
        ctx.lineTo(W / 2 - p2.halfW, p2.y);
        ctx.moveTo(W / 2 + p1.halfW, p1.y);
        ctx.lineTo(W / 2 + p2.halfW, p2.y);
        ctx.stroke();
      }

      // White Goal Line, 18-Yard Penalty Box & 6-Yard Box in 3D Perspective
      const gLeft = projectPitch(-1.0, 0, 95);
      const gRight = projectPitch(1.0, 0, 95);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(gLeft.x, gLeft.y);
      ctx.lineTo(gRight.x, gRight.y);
      ctx.stroke();

      // 18-Yard Penalty Box
      const pbTL = projectPitch(-0.68, 0, 95);
      const pbTR = projectPitch(0.68, 0, 95);
      const pbBL = projectPitch(-0.68, 0, 62);
      const pbBR = projectPitch(0.68, 0, 62);
      ctx.beginPath();
      ctx.moveTo(pbTL.x, pbTL.y);
      ctx.lineTo(pbBL.x, pbBL.y);
      ctx.lineTo(pbBR.x, pbBR.y);
      ctx.lineTo(pbTR.x, pbTR.y);
      ctx.stroke();

      // Penalty Spot
      const pSpot = projectPitch(0, 0, 74);
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(pSpot.x, pSpot.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw3DGoalpost() {
      const postL = projectPitch(-0.48, 0, 95);
      const postR = projectPitch(0.48, 0, 95);
      const topL = projectPitch(-0.48, 72, 95);
      const topR = projectPitch(0.48, 72, 95);
      const backL = projectPitch(-0.44, 0, 102);
      const backR = projectPitch(0.44, 0, 102);
      const backTopL = projectPitch(-0.44, 65, 102);
      const backTopR = projectPitch(0.44, 65, 102);

      const ripple = netRipple > 0 ? Math.sin(frame * 0.8) * 5 : 0;

      // 3D Goal Netting Mesh
      ctx.strokeStyle = "rgba(255, 255, 255, 0.38)";
      ctx.lineWidth = 1.2;
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const xTop = topL.x + (topR.x - topL.x) * t;
        const xBack = backL.x + (backR.x - backL.x) * t + ripple;
        ctx.beginPath();
        ctx.moveTo(xTop, topL.y);
        ctx.lineTo(xBack, backTopL.y);
        ctx.lineTo(xBack, backL.y);
        ctx.stroke();
      }
      for (let j = 0; j <= 5; j++) {
        const t = j / 5;
        const yBack = backTopL.y + (backL.y - backTopL.y) * t;
        ctx.beginPath();
        ctx.moveTo(backL.x, yBack + ripple * 0.5);
        ctx.lineTo(backR.x, yBack + ripple * 0.5);
        ctx.stroke();
      }

      // Main White 3D Goalposts & Crossbar
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 6;
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(postL.x, postL.y);
      ctx.lineTo(topL.x, topL.y);
      ctx.lineTo(topR.x, topR.y);
      ctx.lineTo(postR.x, postR.y);
      ctx.stroke();

      // Aiming Target Reticle inside the Goal
      if (!ball.shot && resetTimer === 0) {
        const aimPt = projectPitch(aimX * 0.95, aimY, 95);
        ctx.strokeStyle = "#fde047";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(aimPt.x, aimPt.y, 13, 0, Math.PI * 2);
        ctx.moveTo(aimPt.x - 18, aimPt.y);
        ctx.lineTo(aimPt.x + 18, aimPt.y);
        ctx.moveTo(aimPt.x, aimPt.y - 18);
        ctx.lineTo(aimPt.x, aimPt.y + 18);
        ctx.stroke();
      }
    }

    function draw3DSoccerPlayer(x3d, y3d, z3d, jerseyColor, shortsColor, isKeeper = false) {
      const pt = projectPitch(x3d, y3d, z3d);
      const s = pt.scale * 2.15;
      ctx.save();
      ctx.translate(pt.x, pt.y);

      // Ground shadow
      ctx.fillStyle = "rgba(0,0,0,0.38)";
      ctx.beginPath();
      ctx.ellipse(0, 2, 16 * s, 6 * s, 0, 0, Math.PI * 2);
      ctx.fill();

      // Legs / Socks
      const stride = Math.sin(frame * 0.22 + z3d) * 5 * s;
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 4.5 * s;
      ctx.beginPath();
      ctx.moveTo(-5 * s, -14 * s);
      ctx.lineTo(-6 * s, 0 + stride);
      ctx.moveTo(5 * s, -14 * s);
      ctx.lineTo(6 * s, 0 - stride);
      ctx.stroke();

      // Shorts
      ctx.fillStyle = shortsColor;
      ctx.fillRect(-9 * s, -22 * s, 18 * s, 9 * s);

      // Jersey Torso
      ctx.fillStyle = jerseyColor;
      ctx.beginPath();
      ctx.roundRect(-11 * s, -40 * s, 22 * s, 19 * s, 4 * s);
      ctx.fill();

      // Head
      ctx.fillStyle = "#fed7aa";
      ctx.beginPath();
      ctx.arc(0, -47 * s, 7.5 * s, 0, Math.PI * 2);
      ctx.fill();

      // Keeper Gloves
      if (isKeeper) {
        ctx.fillStyle = "#fde047";
        ctx.beginPath();
        ctx.arc(-16 * s, -34 * s, 5 * s, 0, Math.PI * 2);
        ctx.arc(16 * s, -34 * s, 5 * s, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }

    function draw3DBall() {
      const pt = projectPitch(ball.x, ball.y, ball.z);
      const shadowPt = projectPitch(ball.x, 0, ball.z);
      const r = Math.max(7, 17 * pt.scale);

      // Ball Shadow on Grass
      ctx.fillStyle = "rgba(0,0,0,0.42)";
      ctx.beginPath();
      ctx.ellipse(shadowPt.x, shadowPt.y + 3, r * 1.1, r * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3D Soccer Ball
      ctx.font = Math.round(r * 2.1) + "px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("⚽", pt.x, pt.y);
    }

    function loop() {
      requestAnimationFrame(loop);
      frame++;
      if (netRipple > 0) netRipple--;

      if (resetTimer > 0) {
        resetTimer--;
        if (resetTimer === 0) resetAttack();
      }

      // 1. Dribbling & Striker Movement
      if (!ball.shot && resetTimer === 0) {
        if (keys["arrowleft"] || keys["a"]) { striker.x = Math.max(-1.05, striker.x - 0.024); aimX = Math.max(-0.75, aimX - 0.018); }
        if (keys["arrowright"] || keys["d"]) { striker.x = Math.min(1.05, striker.x + 0.024); aimX = Math.min(0.75, aimX + 0.018); }
        if (keys["arrowup"] || keys["w"]) striker.z = Math.min(76, striker.z + 0.38);
        if (keys["arrowdown"] || keys["s"]) striker.z = Math.max(16, striker.z - 0.35);

        ball.x = striker.x + Math.sin(frame * 0.2) * 0.025;
        ball.z = striker.z + 3.2;
        ball.y = Math.abs(Math.sin(frame * 0.25)) * 2.5;
      }

      // 2. Shot Physics in 3D
      if (ball.shot) {
        ball.x += ball.vx;
        ball.vx += ball.spin;
        ball.z += ball.vz;
        ball.y += ball.vy;
        ball.vy -= 0.14;
        if (ball.y < 0) { ball.y = 0; ball.vy = Math.abs(ball.vy) * 0.45; }

        // Keeper dives toward target
        keeper.x += (keeper.diveX - keeper.x) * 0.16;
        keeper.y += (keeper.diveY - keeper.y) * 0.16;

        // Check if Defender blocks the shot along the way
        for (const d of defenders) {
          if (Math.abs(ball.z - d.z) < 2.8 && Math.abs(ball.x - d.x) < 0.16 && ball.y < 22) {
            banner = "🛡️ BLOCKED BY DEFENDER!";
            bannerTimer = 65;
            streak = 0; streakEl.textContent = "0";
            sfx(150, "sawtooth", 0.22, 70);
            ball.shot = false;
            resetTimer = 55;
          }
        }

        // Check Goal Line (z >= 95)
        if (ball.shot && ball.z >= 95) {
          ball.shot = false;
          const inWidth = Math.abs(ball.x) < 0.46;
          const inHeight = ball.y < 70;
          const savedByKeeper = Math.abs(ball.x - keeper.x) < 0.15 && Math.abs(ball.y - keeper.y) < 28;

          if (inWidth && inHeight && !savedByKeeper) {
            goalsYou++;
            streak++;
            goalsYouEl.textContent = goalsYou;
            streakEl.textContent = streak;
            netRipple = 45;
            banner = "⚽ GOOOAAALLL!!! 🎉🏆";
            bannerTimer = 85;
            spawnConfetti();
            sfx(520, "triangle", 0.35, 880);
          } else if (savedByKeeper) {
            banner = "🧤 DIVING SAVE BY THE GOALKEEPER!";
            bannerTimer = 70;
            streak = 0; streakEl.textContent = "0";
            sfx(200, "sawtooth", 0.25, 90);
          } else {
            banner = "💨 WIDE OF THE POST!";
            bannerTimer = 65;
            streak = 0; streakEl.textContent = "0";
            sfx(160, "sine", 0.2, 80);
          }
          resetTimer = 65;
        }
      } else {
        // Keeper patrols goal line
        keeper.x = Math.sin(frame * 0.05) * 0.28;
        keeper.y = 0;
      }

      // 3. AI Defenders Movement & Tackle Check
      defenders.forEach(d => {
        d.x += d.dir * d.speed;
        if (d.x > 0.75 || d.x < -0.75) d.dir *= -1;
        if (!ball.shot && resetTimer === 0 && Math.abs(striker.z - d.z) < 4.2 && Math.abs(striker.x - d.x) < 0.17) {
          goalsCpu++;
          goalsCpuEl.textContent = goalsCpu;
          streak = 0; streakEl.textContent = "0";
          banner = "🚨 TACKLED! CPU Counter-Attack Goal!";
          bannerTimer = 70;
          sfx(140, "sawtooth", 0.28, 60);
          resetTimer = 60;
        }
      });

      // 4. Render Full 3D Stadium Scene (Back-to-Front)
      draw3DPitch();
      draw3DGoalpost();

      // Draw Goalkeeper in Goal (z = 94)
      draw3DSoccerPlayer(keeper.x, keeper.y, 94, "#facc15", "#0f172a", true);

      // Draw AI Defenders sorted from far to near
      const sortedDefs = [...defenders].sort((a, b) => b.z - a.z);
      sortedDefs.forEach(d => draw3DSoccerPlayer(d.x, 0, d.z, "#ef4444", "#ffffff", false));

      // Draw Ball and User Striker in correct depth order
      if (ball.z > striker.z) {
        draw3DBall();
        draw3DSoccerPlayer(striker.x, 0, striker.z, "#0ea5e9", "#1e3a8a", false);
      } else {
        draw3DSoccerPlayer(striker.x, 0, striker.z, "#0ea5e9", "#1e3a8a", false);
        draw3DBall();
      }

      // Confetti Celebration
      for (let i = confetti.length - 1; i >= 0; i--) {
        const c = confetti[i];
        c.x += c.vx;
        c.y += c.vy;
        c.vy += 0.18;
        c.life--;
        ctx.fillStyle = c.color;
        ctx.fillRect(c.x, c.y, 7, 7);
        if (c.life <= 0) confetti.splice(i, 1);
      }

      // Stadium Banner Text
      if (bannerTimer > 0) {
        bannerTimer--;
        ctx.save();
        ctx.font = "900 28px sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fde047";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 12;
        ctx.fillText(banner, W / 2, 115);
        ctx.restore();
      }
    }

    loop();
  </script>
</body>
</html>`;
  }

  generatePlayable3DHTML(theme) {
    const safeTitle = theme.title.replace(/[<>"']/g, "");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeTitle}</title>
  <style>
    * { box-sizing: border-box; user-select: none; }
    body {
      margin: 0;
      min-height: 100vh;
      background: #05050f;
      color: #fff;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .hud-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: min(860px, 96vw);
      margin-bottom: 8px;
      padding: 10px 18px;
      background: rgba(15, 23, 42, 0.86);
      border: 2px solid ${theme.accent};
      border-radius: 16px;
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.6);
      flex-wrap: wrap;
      gap: 10px;
    }
    .game-title {
      font-size: 1.18rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .stats {
      display: flex;
      gap: 12px;
      font-weight: 800;
      font-size: 0.95rem;
      flex-wrap: wrap;
    }
    .stat-pill {
      background: rgba(255, 255, 255, 0.12);
      padding: 5px 12px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    canvas {
      border: 3px solid ${theme.accent};
      border-radius: 18px;
      box-shadow: 0 18px 50px rgba(0, 0, 0, 0.8);
      width: min(860px, 96vw);
      height: min(520px, 74vh);
      cursor: crosshair;
      background: #000;
    }
    .controls-bar {
      margin-top: 8px;
      display: flex;
      gap: 12px;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      font-size: 0.86rem;
      color: #e2e8f0;
    }
    .btn {
      background: linear-gradient(135deg, ${theme.accent}, #6366f1);
      color: #fff;
      border: none;
      padding: 7px 15px;
      border-radius: 999px;
      font-weight: 800;
      cursor: pointer;
      font-size: 0.84rem;
    }
    .btn:hover { transform: scale(1.05); }
  </style>
</head>
<body>
  <div class="hud-bar">
    <div class="game-title"><span>${theme.player}</span> <span>${safeTitle}</span></div>
    <div class="stats">
      <div class="stat-pill">⭐ Score: <span id="score">0</span></div>
      <div class="stat-pill">🔥 Speed: <span id="speed">120</span> km/h</div>
      <div class="stat-pill">🏆 Best: <span id="best">0</span></div>
      <div class="stat-pill">❤️ <span id="lives">3</span></div>
    </div>
  </div>

  <canvas id="canvas" width="860" height="520"></canvas>

  <div class="controls-bar">
    <span>🎮 Steer: <b>Left/Right Arrows, A/D, or Mouse</b> • Boost: <b>Up/W</b> • 3D Jump &amp; Stunt Flip: <b>SPACEBAR</b> ${theme.mode === "shooter3d" ? "• Shoot: <b>Click / F</b>" : ""}</span>
    <button class="btn" id="cam-btn">🎥 Camera: 3rd-Person 3D</button>
    <button class="btn" id="restart-btn">🔄 Restart</button>
  </div>

  <script>
    const THEME = ${JSON.stringify(theme)};
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const scoreEl = document.getElementById("score");
    const speedEl = document.getElementById("speed");
    const bestEl = document.getElementById("best");
    const livesEl = document.getElementById("lives");
    const camBtn = document.getElementById("cam-btn");

    const W = canvas.width;
    const H = canvas.height;

    // 3D World & Camera State
    let score = 0, best = 0, lives = 3, gameOver = false, frame = 0;
    let firstPerson = false;
    let playerX = 0;          // -1.4 (left) to +1.4 (right)
    let playerY = 0;          // 3D height above ground (jumps!)
    let playerVY = 0;         // vertical jump velocity
    let playerZ = 0;          // distance traveled along 3D track
    let speed = 1.15;         // forward 3D speed
    let steerLean = 0;        // 3D bike/ski lean angle
    let stuntAngle = 0;       // 360 stunt flip rotation in radians
    let trickBanner = "";
    let trickTimer = 0;
    let invulnTimer = 0;

    const keys = {};
    let entities = [];        // 3D objects { x, y, z, type, emoji, hit }
    let bullets = [];         // 3D projectiles { x, y, z }
    let particles = [];       // 3D sparks / snow spray

    // WebAudio sound synthesizer
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;
    function sfx(freq, type, dur, slideFreq) {
      try {
        if (!audioCtx) audioCtx = new AudioCtx();
        if (audioCtx.state === "suspended") audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type || "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        if (slideFreq) osc.frequency.exponentialRampToValueAtTime(slideFreq, audioCtx.currentTime + dur);
        gain.gain.setValueAtTime(0.11, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + dur);
      } catch (e) {}
    }

    function showBanner(text) {
      trickBanner = text;
      trickTimer = 55;
    }

    function addScore(pts) {
      score += pts;
      if (score > best) best = score;
      scoreEl.textContent = Math.floor(score);
      bestEl.textContent = Math.floor(best);
    }

    // Procedural 3D elevation & curve functions
    function getTrackCurve(z) {
      return Math.sin(z * 0.018) * 165 + Math.cos(z * 0.007) * 90;
    }
    function getTrackHill(z) {
      return Math.sin(z * 0.025) * 38 + Math.cos(z * 0.012) * 22;
    }

    // Spawn 3D entities ahead on the mountain / highway / track
    function spawnEntityAt(z) {
      // Scenery trees / gates / towers on left & right sides
      if (z % 4 === 0) {
        const side = Math.random() < 0.5 ? -1 : 1;
        entities.push({
          x: side * (1.35 + Math.random() * 0.9),
          y: 0,
          z,
          type: "scenery",
          emoji: THEME.mode === "ski3d" ? "🌲" : THEME.mode === "bike3d" ? "🌴" : "🏢"
        });
      }

      // 3D Jump Ramps!
      if (z % 28 === 0) {
        entities.push({
          x: (Math.random() - 0.5) * 1.4,
          y: 0,
          z,
          type: "ramp",
          emoji: "📐"
        });
        return;
      }

      // Obstacles, Slalom Gates, Collectibles & Boost Pads
      const r = Math.random();
      if (r < 0.38) {
        entities.push({
          x: (Math.random() - 0.5) * 1.9,
          y: 0,
          z,
          type: "enemy",
          emoji: Math.random() < 0.65 ? THEME.enemy : THEME.enemy2
        });
      } else if (r < 0.72) {
        entities.push({
          x: (Math.random() - 0.5) * 1.8,
          y: 0,
          z,
          type: "item",
          emoji: THEME.item
        });
      } else if (r < 0.85) {
        entities.push({
          x: (Math.random() - 0.5) * 1.6,
          y: 0,
          z,
          type: "boost",
          emoji: THEME.boostItem
        });
      }
    }

    function initGame() {
      score = 0;
      lives = 3;
      gameOver = false;
      playerX = 0;
      playerY = 0;
      playerVY = 0;
      playerZ = 0;
      speed = 1.15;
      steerLean = 0;
      stuntAngle = 0;
      entities = [];
      bullets = [];
      particles = [];
      scoreEl.textContent = "0";
      livesEl.textContent = "3";
      for (let z = 12; z < 160; z += 2) {
        spawnEntityAt(z);
      }
    }

    function triggerJumpOrStunt() {
      if (playerY <= 1) {
        // Jump from ground!
        playerVY = 11.5;
        sfx(320, "sine", 0.16, 680);
      } else if (stuntAngle === 0) {
        // Mid-air 360 Stunt Flip!
        stuntAngle = 0.18;
        addScore(50);
        showBanner("🔥 360° STUNT FLIP! +50");
        sfx(520, "triangle", 0.22, 960);
      }
    }

    function shoot3D() {
      bullets.push({ x: playerX, y: playerY + 18, z: playerZ + 2 });
      sfx(680, "sawtooth", 0.09, 220);
    }

    window.addEventListener("keydown", e => {
      keys[e.key.toLowerCase()] = true;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
      if (gameOver && (e.key === " " || e.key === "Enter")) {
        initGame();
        return;
      }
      if (e.key === " ") {
        triggerJumpOrStunt();
      }
      if (e.key.toLowerCase() === "f" || (THEME.mode === "shooter3d" && e.key === "Enter")) {
        shoot3D();
      }
      if (e.key.toLowerCase() === "c") {
        firstPerson = !firstPerson;
        camBtn.textContent = firstPerson ? "🎥 Camera: 1st-Person POV" : "🎥 Camera: 3rd-Person 3D";
      }
    });

    window.addEventListener("keyup", e => {
      keys[e.key.toLowerCase()] = false;
    });

    canvas.addEventListener("mousemove", e => {
      const rect = canvas.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2.6;
      const diff = normX - playerX;
      playerX = Math.max(-1.45, Math.min(1.45, normX));
      steerLean = Math.max(-0.45, Math.min(0.45, diff * 1.8));
    });

    canvas.addEventListener("mousedown", () => {
      if (gameOver) {
        initGame();
        return;
      }
      if (THEME.mode === "shooter3d") {
        shoot3D();
      } else {
        triggerJumpOrStunt();
      }
    });

    camBtn.addEventListener("click", () => {
      firstPerson = !firstPerson;
      camBtn.textContent = firstPerson ? "🎥 Camera: 1st-Person POV" : "🎥 Camera: 3rd-Person 3D";
    });

    document.getElementById("restart-btn").addEventListener("click", initGame);

    // Project a 3D world point (worldX, worldY, relZ) onto the 2D screen with perspective
    function project3D(worldX, worldY, relZ, horizonY, baseCurve, baseHill) {
      const scale = 340 / Math.max(1.2, relZ);
      const curveOffset = ((getTrackCurve(playerZ + relZ) - baseCurve) * (relZ / 95));
      const hillOffset = (getTrackHill(playerZ + relZ) - baseHill) * (relZ / 80);

      const screenX = W / 2 + (worldX - playerX * 0.65) * 230 * (scale / 18) + curveOffset;
      const screenY = horizonY + (135 - worldY + playerY * 0.45) * (scale / 16) + hillOffset;
      const roadHalfWidth = 285 * (scale / 18);
      return { x: screenX, y: screenY, w: roadHalfWidth, scale };
    }

    function addSprayParticles(x, y, color, count = 6) {
      for (let i = 0; i < count; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 9,
          vy: -Math.random() * 5 - 1,
          r: 3 + Math.random() * 4,
          life: 18 + Math.random() * 12,
          color
        });
      }
    }

    function draw3DBikeOrSkier(cx, cy) {
      ctx.save();
      ctx.translate(cx, cy - playerY * 1.45);
      ctx.rotate(steerLean + stuntAngle);

      // Ground shadow (shrinks when jumping high in 3D!)
      if (!firstPerson) {
        ctx.save();
        ctx.rotate(-(steerLean + stuntAngle));
        const shadowScale = Math.max(0.25, 1 - playerY / 160);
        ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
        ctx.beginPath();
        ctx.ellipse(0, 38 + playerY * 1.45, 38 * shadowScale, 11 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (firstPerson) {
        // 1st-Person POV Cockpit / Handlebars / Ski Tips!
        if (THEME.mode === "bike3d") {
          // 3D Moto Handlebars & Digital Speed Dash
          ctx.strokeStyle = "#94a3b8";
          ctx.lineWidth = 10;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(-130, 50);
          ctx.lineTo(-45, 5);
          ctx.lineTo(45, 5);
          ctx.lineTo(130, 50);
          ctx.stroke();

          // Grips
          ctx.strokeStyle = THEME.accent;
          ctx.lineWidth = 14;
          ctx.beginPath(); ctx.moveTo(-135, 52); ctx.lineTo(-90, 30); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(135, 52); ctx.lineTo(90, 30); ctx.stroke();

          // Center 3D Speedometer Dash
          ctx.fillStyle = "#0f172a";
          ctx.strokeStyle = "#38bdf8";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(-55, -18, 110, 52, 12);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#34d399";
          ctx.font = "bold 20px monospace";
          ctx.textAlign = "center";
          ctx.fillText(Math.round(speed * 135) + " KM/H", 0, 14);
        } else if (THEME.mode === "ski3d") {
          // 1st-Person 3D Ski Tips & Poles
          ctx.fillStyle = "#0ea5e9";
          ctx.fillRect(-52, -30, 22, 95);
          ctx.fillRect(30, -30, 22, 95);
          ctx.strokeStyle = "#e2e8f0";
          ctx.lineWidth = 5;
          ctx.beginPath(); ctx.moveTo(-110, -10); ctx.lineTo(-160, 70); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(110, -10); ctx.lineTo(160, 70); ctx.stroke();
        } else {
          ctx.font = "58px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(THEME.player, 0, 20);
        }
        ctx.restore();
        return;
      }

      // 3rd-Person 3D Shaded Model + Character
      if (THEME.mode === "bike3d") {
        // 3D Rear Tire
        ctx.fillStyle = "#090d16";
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(-14, 2, 28, 44, 10);
        ctx.fill();
        ctx.stroke();

        // 3D Bike Tail & Dual Exhaust Pipes
        ctx.fillStyle = THEME.accent;
        ctx.beginPath();
        ctx.moveTo(-24, 6);
        ctx.lineTo(24, 6);
        ctx.lineTo(14, -28);
        ctx.lineTo(-14, -28);
        ctx.closePath();
        ctx.fill();

        // Glowing Neon Tail Light
        ctx.fillStyle = "#fde047";
        ctx.fillRect(-10, -2, 20, 6);

        // Handlebars
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-38, -22);
        ctx.lineTo(38, -22);
        ctx.stroke();

        // Rider Helmet & Jacket
        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        ctx.arc(0, -32, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(0, -48, 14, 0, Math.PI * 2);
        ctx.fill();
      } else if (THEME.mode === "ski3d") {
        // 3D Twin Skis carving in the snow
        ctx.fillStyle = "#f43f5e";
        ctx.fillRect(-26, 12, 14, 42);
        ctx.fillRect(12, 12, 14, 42);

        // Ski Poles
        ctx.strokeStyle = "#94a3b8";
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.moveTo(-28, -8); ctx.lineTo(-48, 28); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(28, -8); ctx.lineTo(48, 28); ctx.stroke();

        // 3D Skier Figure
        ctx.font = "58px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("⛷️", 0, 18);
      } else {
        ctx.font = "64px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(THEME.player, 0, 22);
      }

      ctx.restore();
    }

    function loop() {
      requestAnimationFrame(loop);
      frame++;

      if (gameOver) {
        ctx.fillStyle = "rgba(5, 5, 20, 0.78)";
        ctx.fillRect(0, 0, W, H);
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 46px sans-serif";
        ctx.fillText("🏁 3D RUN COMPLETE!", W / 2, 195);
        ctx.fillStyle = "#fde047";
        ctx.font = "bold 26px sans-serif";
        ctx.fillText("Score: " + Math.floor(score) + "   |   Best: " + Math.floor(best), W / 2, 248);
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText("Press SPACE or Click Anywhere to Play Again!", W / 2, 305);
        return;
      }

      // Controls & 3D Physics
      let steer = 0;
      if (keys["arrowleft"] || keys["a"]) steer = -0.052;
      if (keys["arrowright"] || keys["d"]) steer = 0.052;
      playerX = Math.max(-1.45, Math.min(1.45, playerX + steer));
      steerLean += ((steer * 7.5) - steerLean) * 0.18;

      if (keys["arrowup"] || keys["w"] || keys["shift"]) {
        speed = Math.min(2.15, speed + 0.018);
      } else if (keys["arrowdown"] || keys["s"]) {
        speed = Math.max(0.65, speed - 0.025);
      } else {
        speed += (1.22 - speed) * 0.02;
      }

      // 3D Jump & Gravity Physics
      if (playerY > 0 || playerVY !== 0) {
        playerY += playerVY;
        playerVY -= 0.58;
        if (playerY <= 0) {
          playerY = 0;
          playerVY = 0;
          stuntAngle = 0;
          addSprayParticles(W / 2, H - 70, THEME.mode === "ski3d" ? "#ffffff" : "#fde047", 10);
        }
      }
      if (stuntAngle > 0) {
        stuntAngle += 0.26;
        if (stuntAngle >= Math.PI * 2) stuntAngle = 0;
      }

      // Advance along 3D Z axis
      const prevZ = Math.floor(playerZ);
      playerZ += speed;
      const curZ = Math.floor(playerZ);
      if (curZ > prevZ) {
        addScore(speed * 1.5);
        for (let z = prevZ + 1; z <= curZ; z++) {
          if (z % 2 === 0) spawnEntityAt(z + 150);
        }
      }
      if (invulnTimer > 0) invulnTimer--;

      speedEl.textContent = Math.round(speed * 128);

      // 1. Draw 3D Sky & Horizon Mountains
      const horizonY = H * 0.42 - steerLean * 18;
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, THEME.skyTop);
      skyGrad.addColorStop(1, THEME.skyBot);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, horizonY + 10);

      // 3D Distant Mountains silhouette
      const curveShift = (getTrackCurve(playerZ) * 0.6) % W;
      ctx.fillStyle = THEME.mode === "ski3d" ? "#cbd5e1" : "#1e1b4b";
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      for (let mx = 0; mx <= W; mx += 60) {
        const peak = Math.sin((mx + curveShift) * 0.015) * 38 + Math.cos((mx - curveShift) * 0.03) * 20;
        ctx.lineTo(mx, horizonY - 22 - Math.abs(peak));
      }
      ctx.lineTo(W, horizonY);
      ctx.closePath();
      ctx.fill();

      // 2. Draw 3D Perspective Terrain & Track Segments (Back-to-Front Painter's Algorithm)
      const baseCurve = getTrackCurve(playerZ);
      const baseHill = getTrackHill(playerZ);
      const maxDrawDist = 110;

      for (let dz = maxDrawDist; dz >= 2; dz--) {
        const z1 = Math.floor(playerZ) + dz;
        const z2 = z1 - 1;
        const p1 = project3D(0, 0, z1 - playerZ, horizonY, baseCurve, baseHill);
        const p2 = project3D(0, 0, z2 - playerZ, horizonY, baseCurve, baseHill);

        if (p2.y <= p1.y) continue;

        const stripe = Math.floor(z1 / 3) % 2 === 0;

        // Outer Ground / Snow Slope / Grass
        ctx.fillStyle = stripe ? THEME.groundA : THEME.groundB;
        ctx.fillRect(0, p1.y, W, p2.y - p1.y + 1);

        // 3D Road / Ski Slope Polygon
        ctx.fillStyle = stripe ? THEME.trackA : THEME.trackB;
        ctx.beginPath();
        ctx.moveTo(p1.x - p1.w, p1.y);
        ctx.lineTo(p1.x + p1.w, p1.y);
        ctx.lineTo(p2.x + p2.w, p2.y);
        ctx.lineTo(p2.x - p2.w, p2.y);
        ctx.closePath();
        ctx.fill();

        // Neon Curbs / Ski Trail Borders
        const curbW1 = p1.w * 0.08;
        const curbW2 = p2.w * 0.08;
        ctx.fillStyle = stripe ? THEME.accent : "#ffffff";
        ctx.beginPath();
        ctx.moveTo(p1.x - p1.w - curbW1, p1.y);
        ctx.lineTo(p1.x - p1.w, p1.y);
        ctx.lineTo(p2.x - p2.w, p2.y);
        ctx.lineTo(p2.x - p2.w - curbW2, p2.y);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(p1.x + p1.w, p1.y);
        ctx.lineTo(p1.x + p1.w + curbW1, p1.y);
        ctx.lineTo(p2.x + p2.w + curbW2, p2.y);
        ctx.lineTo(p2.x + p2.w, p2.y);
        ctx.fill();

        // Center Lane Dashes
        if (stripe && THEME.mode !== "ski3d") {
          ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
          ctx.beginPath();
          ctx.moveTo(p1.x - p1.w * 0.03, p1.y);
          ctx.lineTo(p1.x + p1.w * 0.03, p1.y);
          ctx.lineTo(p2.x + p2.w * 0.03, p2.y);
          ctx.lineTo(p2.x - p2.w * 0.03, p2.y);
          ctx.fill();
        }
      }

      // 3. Update & Draw 3D Bullets (for 3D Shooter mode)
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.z += 2.8;
        const relZ = b.z - playerZ;
        if (relZ > 110) {
          bullets.splice(i, 1);
          continue;
        }
        const pt = project3D(b.x, b.y, relZ, horizonY, baseCurve, baseHill);
        ctx.font = Math.max(12, Math.min(48, pt.scale * 1.4)) + "px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(THEME.bullet || "⚡", pt.x, pt.y);
      }

      // 4. Draw 3D Entities (Sorted Back-to-Front by Z depth!)
      entities = entities.filter(e => e.z > playerZ - 2);
      entities.sort((a, b) => b.z - a.z);

      for (let i = 0; i < entities.length; i++) {
        const ent = entities[i];
        const relZ = ent.z - playerZ;
        if (relZ > maxDrawDist || relZ < 0.8) continue;

        const pt = project3D(ent.x, ent.y, relZ, horizonY, baseCurve, baseHill);
        const size = Math.max(10, Math.min(115, pt.scale * 2.5));

        if (ent.type === "ramp") {
          // Draw glowing 3D Stunt Ramp polygon!
          const rw = size * 0.85;
          const rh = size * 0.42;
          ctx.fillStyle = "rgba(236, 72, 153, 0.88)";
          ctx.strokeStyle = "#fde047";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(pt.x - rw, pt.y);
          ctx.lineTo(pt.x + rw, pt.y);
          ctx.lineTo(pt.x + rw * 0.7, pt.y - rh);
          ctx.lineTo(pt.x - rw * 0.7, pt.y - rh);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.font = size + "px sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(ent.emoji, pt.x, pt.y);
        }

        // Check 3D Bullet hits on Enemies
        if (ent.type === "enemy" && !ent.hit) {
          for (let bIdx = bullets.length - 1; bIdx >= 0; bIdx--) {
            const b = bullets[bIdx];
            if (Math.abs(b.z - ent.z) < 3.5 && Math.abs(b.x - ent.x) < 0.45) {
              ent.hit = true;
              bullets.splice(bIdx, 1);
              addScore(35);
              addSprayParticles(pt.x, pt.y - 20, "#f43f5e", 16);
              sfx(420, "square", 0.14, 120);
              break;
            }
          }
        }

        // Check 3D Collision with Player when entity reaches camera depth (relZ < 3.2)
        if (!ent.hit && relZ < 3.0 && relZ > 0.9) {
          const dx = Math.abs(ent.x - playerX);
          if (ent.type === "ramp" && dx < 0.42 && playerY < 18) {
            ent.hit = true;
            playerVY = 15.5;
            stuntAngle = 0.18;
            speed = Math.min(2.25, speed + 0.35);
            addScore(75);
            showBanner("🚀 3D MEGA RAMP LAUNCH! +75");
            sfx(360, "triangle", 0.25, 880);
          } else if (ent.type === "item" && dx < 0.38 && playerY < 45) {
            ent.hit = true;
            addScore(25);
            addSprayParticles(pt.x, pt.y - 20, "#fde047", 12);
            showBanner("⭐ NICE! +25");
            sfx(680, "sine", 0.12, 980);
          } else if (ent.type === "boost" && dx < 0.4 && playerY < 45) {
            ent.hit = true;
            speed = 2.25;
            addScore(40);
            showBanner("⚡ TURBO NITRO BOOST! +40");
            sfx(440, "sawtooth", 0.2, 880);
          } else if (ent.type === "enemy" && dx < 0.32 && playerY < 28 && invulnTimer === 0) {
            ent.hit = true;
            lives--;
            invulnTimer = 35;
            speed = 0.85;
            livesEl.textContent = Math.max(0, lives);
            addSprayParticles(W / 2, H - 80, "#ef4444", 20);
            showBanner("💥 CRASH! Watch Out!");
            sfx(160, "sawtooth", 0.28, 65);
            if (lives <= 0) gameOver = true;
          }
        }
      }

      entities = entities.filter(e => !e.hit);

      // 5. Draw 3D Player (Bike / Skier / Car / Spaceship)
      if (invulnTimer % 4 < 2) {
        draw3DBikeOrSkier(W / 2, H - 68);
      }

      // Continuous snow / tire spray when carving hard
      if (playerY === 0 && Math.abs(steerLean) > 0.15 && frame % 2 === 0) {
        addSprayParticles(
          W / 2 - steerLean * 40,
          H - 35,
          THEME.mode === "ski3d" ? "#ffffff" : "#94a3b8",
          2
        );
      }

      // 6. Draw 3D Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life / 25);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // 7. Trick / Boost Banner Popup
      if (trickTimer > 0) {
        trickTimer--;
        ctx.save();
        ctx.font = "900 28px sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = "#fde047";
        ctx.shadowColor = "#ec4899";
        ctx.shadowBlur = 14;
        ctx.fillText(trickBanner, W / 2, 95);
        ctx.restore();
      }
    }

    initGame();
    loop();
  </script>
</body>
</html>`;
  }
}

window.CustomGameBuilderEngine = CustomGameBuilderEngine;
