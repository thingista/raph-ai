/**
 * Raph AI // From-Scratch Procedural Digital Art & Illustration Engine
 * Generates 100% original pictures and story illustrations directly inside the browser
 * using HTML5 Canvas procedural rendering, lighting, landscapes, castles, space scenes,
 * oceans, cities, and custom-drawn characters — with ZERO external image services!
 */

class RaphAIPainterEngine {
  constructor() {
    this.cache = new Map();
  }

  // Deterministic pseudo-random number generator seeded by prompt text + seed
  createRNG(seedStr) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < seedStr.length; i++) {
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return () => {
      h += 0x6d2b79f5;
      let t = Math.imul(h ^ (h >>> 15), 1 | h);
      t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Paint a complete 800x480 illustration from scratch and return a data:image/png URL
  generatePictureDataURL(promptText = "", seed = 1) {
    const key = `${promptText}__${seed}`;
    if (this.cache.has(key)) return this.cache.get(key);

    if (typeof document === "undefined" || !document.createElement) {
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    }

    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    this.paintSceneOnCanvas(ctx, canvas.width, canvas.height, promptText, seed);

    const dataUrl = canvas.toDataURL("image/png");
    this.cache.set(key, dataUrl);
    return dataUrl;
  }

  analyzePrompt(promptText, seed = 1) {
    const lower = (promptText || "").toLowerCase();

    // Determine world environment
    let biome = "magical_kingdom";
    if (/\b(space|galaxy|planet|star|astronaut|alien|ufo|rocket|moon|cosmos|nebula)\b/.test(lower)) {
      biome = "space";
    } else if (/\b(ocean|sea|underwater|shark|fish|whale|dolphin|pirate|beach|island|mermaid)\b/.test(lower)) {
      biome = "ocean";
    } else if (/\b(snow|winter|ski|ice|arctic|penguin|polar|christmas|frozen|mountain)\b/.test(lower)) {
      biome = "snow";
    } else if (/\b(city|cyber|future|robot|car|race|bike|motorcycle|street|neon|building)\b/.test(lower)) {
      biome = "city";
    } else if (/\b(forest|jungle|tree|lion|monkey|tiger|bear|wolf|fox|deer|dino|dinosaur|nature|camp)\b/.test(lower)) {
      biome = "forest";
    } else if (/\b(desert|egypt|pyramid|camel|sand|canyon)\b/.test(lower)) {
      biome = "desert";
    } else if (/\b(soccer|football|stadium|sports|basketball|ball)\b/.test(lower)) {
      biome = "stadium";
    }

    // Color palettes per biome
    const palettes = {
      space: { sky1: "#020617", sky2: "#1e1b4b", sky3: "#4c1d95", ground1: "#1e1b4b", ground2: "#0f172a", glow: "#38bdf8" },
      ocean: { sky1: "#0c4a6e", sky2: "#0284c7", sky3: "#38bdf8", ground1: "#0369a1", ground2: "#082f49", glow: "#2dd4bf" },
      snow: { sky1: "#0f172a", sky2: "#1e3a8a", sky3: "#7dd3fc", ground1: "#e2e8f0", ground2: "#cbd5e1", glow: "#38bdf8" },
      city: { sky1: "#090d16", sky2: "#311042", sky3: "#be185d", ground1: "#0f172a", ground2: "#1e293b", glow: "#f43f5e" },
      forest: { sky1: "#064e3b", sky2: "#0f766e", sky3: "#fde047", ground1: "#14532d", ground2: "#052e16", glow: "#4ade80" },
      desert: { sky1: "#7c2d12", sky2: "#ea580c", sky3: "#fde047", ground1: "#d97706", ground2: "#92400e", glow: "#fbbf24" },
      stadium: { sky1: "#020617", sky2: "#0f2942", sky3: "#1e3a8a", ground1: "#15803d", ground2: "#166534", glow: "#22c55e" },
      magical_kingdom: {
        sky1: seed % 2 === 0 ? "#0f0728" : "#1e1b4b",
        sky2: seed % 2 === 0 ? "#4c1d95" : "#6d28d9",
        sky3: seed % 2 === 0 ? "#ec4899" : "#f59e0b",
        ground1: "#1e1b4b",
        ground2: "#0f172a",
        glow: "#fde047"
      }
    };

    return {
      biome,
      palette: palettes[biome] || palettes.magical_kingdom,
      lower
    };
  }

  paintSceneOnCanvas(ctx, W, H, promptText = "", seed = 1) {
    const rng = this.createRNG(`${promptText}_${seed}`);
    const { biome, palette, lower } = this.analyzePrompt(promptText, seed);

    // 1. Rich Multi-Stop Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.72);
    skyGrad.addColorStop(0, palette.sky1);
    skyGrad.addColorStop(0.55, palette.sky2);
    skyGrad.addColorStop(1, palette.sky3);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Stars, Aurora & Nebula Glow
    for (let i = 0; i < 95; i++) {
      const sx = rng() * W;
      const sy = rng() * (H * 0.6);
      const sr = 0.6 + rng() * 2.2;
      ctx.fillStyle = `rgba(255, 255, 255, ${0.25 + rng() * 0.75})`;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Glowing Nebula / Aurora Ribbons
    ctx.save();
    for (let i = 0; i < 3; i++) {
      const nebX = W * (0.2 + i * 0.3 + (rng() - 0.5) * 0.15);
      const nebY = H * (0.22 + (rng() - 0.5) * 0.12);
      const rad = ctx.createRadialGradient(nebX, nebY, 10, nebX, nebY, 190);
      rad.addColorStop(0, palette.glow + "55");
      rad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = rad;
      ctx.beginPath();
      ctx.arc(nebX, nebY, 190, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 3. Celestial Body (Sun / Glowing Moon / Ringed Planet)
    const sunX = W * (0.72 + (rng() - 0.5) * 0.18);
    const sunY = H * 0.24;
    const sunGlow = ctx.createRadialGradient(sunX, sunY, 12, sunX, sunY, 110);
    sunGlow.addColorStop(0, "#ffffff");
    sunGlow.addColorStop(0.35, "#fde047");
    sunGlow.addColorStop(1, "rgba(253, 224, 71, 0)");
    ctx.fillStyle = sunGlow;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 110, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fef9c3";
    ctx.beginPath();
    ctx.arc(sunX, sunY, 36, 0, Math.PI * 2);
    ctx.fill();

    if (biome === "space") {
      // Draw Saturn-style Ringed Planet in space scenes
      ctx.save();
      ctx.translate(W * 0.24, H * 0.26);
      ctx.rotate(-0.28);
      ctx.fillStyle = "#a855f7";
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(56, 189, 248, 0.75)";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.ellipse(0, 0, 78, 18, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Layered 3D Mountain Ranges in Background
    for (let layer = 0; layer < 3; layer++) {
      const baseY = H * (0.52 + layer * 0.09);
      ctx.fillStyle =
        biome === "snow"
          ? layer === 0 ? "#94a3b8" : layer === 1 ? "#cbd5e1" : "#f1f5f9"
          : layer === 0
          ? "rgba(15, 23, 42, 0.55)"
          : layer === 1
          ? "rgba(15, 23, 42, 0.78)"
          : palette.ground1;

      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 32) {
        const h1 = Math.sin(x * 0.011 + layer * 2 + seed) * (52 - layer * 10);
        const h2 = Math.cos(x * 0.027 - layer) * 20;
        ctx.lineTo(x, baseY - Math.abs(h1 + h2));
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();
    }

    // 5. Biome-Specific Architecture & Scenery
    if (biome === "magical_kingdom" || /\b(harry\s*potter|hogwarts|castle|kingdom|palace|wizard|magic|princess|knight|dragon)\b/.test(lower)) {
      this.drawMagicalCastle(ctx, W * 0.28, H * 0.58);
    } else if (biome === "city") {
      this.drawCyberCity(ctx, W, H, rng);
    } else if (biome === "forest") {
      this.drawForestTrees(ctx, W, H, rng);
    } else if (biome === "ocean") {
      this.drawOceanWaves(ctx, W, H);
    }

    // 6. Foreground Ground & Winding Path / Reflective Lake
    const fgGrad = ctx.createLinearGradient(0, H * 0.68, 0, H);
    fgGrad.addColorStop(0, palette.ground1);
    fgGrad.addColorStop(1, palette.ground2);
    ctx.fillStyle = fgGrad;
    ctx.fillRect(0, H * 0.7, W, H * 0.3);

    // Shimmering River / Path
    ctx.fillStyle = "rgba(56, 189, 248, 0.28)";
    ctx.beginPath();
    ctx.moveTo(W * 0.42, H * 0.7);
    ctx.quadraticCurveTo(W * 0.35, H * 0.85, W * 0.18, H);
    ctx.lineTo(W * 0.62, H);
    ctx.quadraticCurveTo(W * 0.52, H * 0.85, W * 0.5, H * 0.7);
    ctx.closePath();
    ctx.fill();

    // 7. Custom Main Subject Drawn from Prompt!
    this.drawMainSubjects(ctx, W, H, lower, promptText, seed);

    // 8. Magical Floating Bokeh Light Orbs
    for (let i = 0; i < 28; i++) {
      const bx = rng() * W;
      const by = H * 0.25 + rng() * (H * 0.7);
      const br = 2 + rng() * 5;
      ctx.fillStyle = i % 2 === 0 ? "rgba(253, 224, 71, 0.55)" : "rgba(244, 114, 182, 0.45)";
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }

    // 9. Sleek "Raph AI Original Art" Badge
    ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
    ctx.beginPath();
    ctx.roundRect(W - 175, H - 36, 162, 26, 13);
    ctx.fill();
    ctx.fillStyle = "#f9a8d4";
    ctx.font = "bold 12px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("✨ Painted by Raph AI", W - 94, H - 19);
  }

  drawMagicalCastle(ctx, cx, baseY) {
    ctx.save();
    ctx.translate(cx, baseY);

    // Main Castle Keep & Towers
    ctx.fillStyle = "#1e1b4b";
    ctx.fillRect(-75, -110, 150, 110);
    ctx.fillRect(-110, -145, 42, 145);
    ctx.fillRect(68, -145, 42, 145);
    ctx.fillRect(-28, -185, 56, 185);

    // Pointed Spire Roofs
    ctx.fillStyle = "#ec4899";
    const drawRoof = (rx, ry, rw, rh) => {
      ctx.beginPath();
      ctx.moveTo(rx - rw / 2 - 6, ry);
      ctx.lineTo(rx + rw / 2 + 6, ry);
      ctx.lineTo(rx, ry - rh);
      ctx.closePath();
      ctx.fill();
    };
    drawRoof(-89, -145, 42, 55);
    drawRoof(89, -145, 42, 55);
    drawRoof(0, -185, 56, 70);

    // Glowing Golden Castle Windows
    ctx.fillStyle = "#fde047";
    const windows = [
      [-89, -115], [-89, -80],
      [89, -115], [89, -80],
      [0, -150], [-12, -110], [12, -110],
      [-45, -75], [45, -75]
    ];
    windows.forEach(([wx, wy]) => {
      ctx.beginPath();
      ctx.arc(wx, wy, 6, Math.PI, 0);
      ctx.lineTo(wx + 6, wy + 12);
      ctx.lineTo(wx - 6, wy + 12);
      ctx.closePath();
      ctx.fill();
    });

    // Grand Arched Gate
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.arc(0, -28, 18, Math.PI, 0);
    ctx.lineTo(18, 0);
    ctx.lineTo(-18, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  drawCyberCity(ctx, W, H, rng) {
    for (let x = 30; x < W - 30; x += 52) {
      const bw = 38 + rng() * 20;
      const bh = 80 + rng() * 140;
      const by = H * 0.7 - bh;
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1.5;
      ctx.fillRect(x, by, bw, bh);
      ctx.strokeRect(x, by, bw, bh);

      ctx.fillStyle = rng() > 0.5 ? "#fde047" : "#f472b6";
      for (let wy = by + 12; wy < H * 0.68; wy += 18) {
        for (let wx = x + 8; wx < x + bw - 8; wx += 12) {
          if (rng() > 0.35) ctx.fillRect(wx, wy, 6, 9);
        }
      }
    }
  }

  drawForestTrees(ctx, W, H, rng) {
    for (let i = 0; i < 16; i++) {
      const tx = 40 + i * 48 + (rng() - 0.5) * 15;
      const ty = H * 0.7 + (rng() - 0.5) * 20;
      const scale = 0.75 + rng() * 0.5;
      ctx.fillStyle = "#451a03";
      ctx.fillRect(tx - 5 * scale, ty - 25 * scale, 10 * scale, 28 * scale);

      ctx.fillStyle = i % 2 === 0 ? "#15803d" : "#166534";
      for (let tier = 0; tier < 3; tier++) {
        ctx.beginPath();
        ctx.moveTo(tx - (32 - tier * 6) * scale, ty - (20 + tier * 22) * scale);
        ctx.lineTo(tx + (32 - tier * 6) * scale, ty - (20 + tier * 22) * scale);
        ctx.lineTo(tx, ty - (55 + tier * 24) * scale);
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  drawOceanWaves(ctx, W, H) {
    for (let w = 0; w < 4; w++) {
      ctx.fillStyle = `rgba(14, 165, 233, ${0.35 + w * 0.15})`;
      ctx.beginPath();
      const baseY = H * (0.64 + w * 0.08);
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 30) {
        ctx.lineTo(x, baseY + Math.sin(x * 0.03 + w * 1.5) * 12);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Draw custom characters, creatures, vehicles, and props matching the user's prompt!
  drawMainSubjects(ctx, W, H, lower, rawPrompt, seed) {
    ctx.save();

    // Custom Painted Dragon (e.g. "cute dragon reading a glowing book" or "dragon kingdom")
    if (/\bdragon\b/.test(lower)) {
      this.drawCustomDragon(ctx, W * 0.56, H * 0.68, /\bbook|read\b/.test(lower));
      ctx.restore();
      return;
    }

    // Custom Painted Harry Potter / Wizard / Magic Scene
    if (/\b(harry\s*potter|wizard|witch|magic|wand|hogwarts)\b/.test(lower)) {
      this.drawCustomWizard(ctx, W * 0.58, H * 0.72);
      ctx.restore();
      return;
    }

    // Detect matching subject icons + procedural aura for any topic!
    const subjectLibrary = [
      [/\blion\b/, ["🦁", "👑", "🌅"]],
      [/\bcat|kitten\b/, ["🐱", "🧶", "🐾"]],
      [/\bdog|puppy\b/, ["🐶", "🦴", "🎾"]],
      [/\bshark\b/, ["🦈", "🐟", "🌊"]],
      [/\bdino|dinosaur|t-?rex\b/, ["🦖", "🦕", "🌋"]],
      [/\bspace|astronaut|rocket|planet\b/, ["🚀", "🧑‍🚀", "🪐"]],
      [/\bcar|race|racing\b/, ["🏎️", "🏁", "⚡"]],
      [/\bbike|motorcycle|bicycle\b/, ["🏍️", "🔥", "🏆"]],
      [/\bski|snowboard\b/, ["⛷️", "❄️", "🏔️"]],
      [/\bsoccer|football\b/, ["⚽", "🥅", "🏆"]],
      [/\brobot|ai\b/, ["🤖", "⚡", "🌟"]],
      [/\bunicorn\b/, ["🦄", "🌈", "✨"]],
      [/\bpirate|treasure\b/, ["🏴‍☠️", "🪙", "⚓"]],
      [/\bknight|sword|castle\b/, ["⚔️", "🛡️", "🏰"]],
      [/\bprincess|queen|king\b/, ["👑", "🏰", "✨"]],
      [/\bfrog\b/, ["🐸", "🪷", "🪰"]],
      [/\bmonkey\b/, ["🐒", "🍌", "🌴"]],
      [/\bpanda\b/, ["🐼", "🎋", "✨"]],
      [/\bpenguin\b/, ["🐧", "❄️", "🧊"]]
    ];

    let chosenSprites = ["🌟", "✨", "🎨"];
    for (const [regex, sprites] of subjectLibrary) {
      if (regex.test(lower)) {
        chosenSprites = sprites;
        break;
      }
    }

    // Magical Aura behind main subject
    const aura = ctx.createRadialGradient(W * 0.55, H * 0.64, 10, W * 0.55, H * 0.64, 125);
    aura.addColorStop(0, "rgba(253, 224, 71, 0.55)");
    aura.addColorStop(1, "rgba(253, 224, 71, 0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(W * 0.55, H * 0.64, 125, 0, Math.PI * 2);
    ctx.fill();

    // Ground shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.38)";
    ctx.beginPath();
    ctx.ellipse(W * 0.55, H * 0.77, 72, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Main Hero Sprite & Companion Props
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "118px sans-serif";
    ctx.fillText(chosenSprites[0], W * 0.55, H * 0.64);

    ctx.font = "68px sans-serif";
    ctx.fillText(chosenSprites[1], W * 0.36, H * 0.69 + (seed % 2) * 10);
    ctx.fillText(chosenSprites[2], W * 0.73, H * 0.56 - (seed % 2) * 12);

    ctx.restore();
  }

  // Hand-crafted Canvas vector illustration of a Cute Dragon (with optional glowing book or fire!)
  drawCustomDragon(ctx, cx, cy, withBook = false) {
    ctx.save();
    ctx.translate(cx, cy);

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.ellipse(0, 48, 85, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dragon Wings
    ctx.fillStyle = "#ec4899";
    ctx.beginPath();
    ctx.moveTo(-20, -45);
    ctx.quadraticCurveTo(-115, -130, -95, -25);
    ctx.quadraticCurveTo(-55, -35, -20, -15);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(20, -45);
    ctx.quadraticCurveTo(115, -130, 95, -25);
    ctx.quadraticCurveTo(55, -35, 20, -15);
    ctx.fill();

    // Dragon Body & Belly
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.ellipse(0, -10, 48, 56, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.ellipse(0, -4, 30, 40, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dragon Head & Cute Eyes
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(0, -78, 38, 0, Math.PI * 2);
    ctx.fill();

    // Horns
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath(); ctx.moveTo(-22, -108); ctx.lineTo(-36, -138); ctx.lineTo(-8, -112); ctx.fill();
    ctx.beginPath(); ctx.moveTo(22, -108); ctx.lineTo(36, -138); ctx.lineTo(8, -112); ctx.fill();

    // Big Expressive Eyes
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(-14, -84, 10, 0, Math.PI * 2); ctx.arc(14, -84, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#0f172a";
    ctx.beginPath(); ctx.arc(-12, -84, 5.5, 0, Math.PI * 2); ctx.arc(12, -84, 5.5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath(); ctx.arc(-14, -86, 2, 0, Math.PI * 2); ctx.arc(10, -86, 2, 0, Math.PI * 2); ctx.fill();

    if (withBook) {
      // Glowing Open Magic Book in front of the Dragon!
      const bookGlow = ctx.createRadialGradient(0, 22, 5, 0, 22, 85);
      bookGlow.addColorStop(0, "rgba(253, 224, 71, 0.85)");
      bookGlow.addColorStop(1, "rgba(253, 224, 71, 0)");
      ctx.fillStyle = bookGlow;
      ctx.beginPath();
      ctx.arc(0, 22, 85, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#fef08a";
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, 15);
      ctx.lineTo(-55, 2);
      ctx.lineTo(-55, 42);
      ctx.lineTo(0, 52);
      ctx.lineTo(55, 42);
      ctx.lineTo(55, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else {
      // Glowing Fireball Breath
      const fireGlow = ctx.createRadialGradient(65, -78, 5, 65, -78, 55);
      fireGlow.addColorStop(0, "#fde047");
      fireGlow.addColorStop(0.5, "#f97316");
      fireGlow.addColorStop(1, "rgba(239, 68, 68, 0)");
      ctx.fillStyle = fireGlow;
      ctx.beginPath();
      ctx.arc(65, -78, 55, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Hand-crafted Canvas illustration of a Young Wizard casting a glowing spell
  drawCustomWizard(ctx, cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);

    // Shadow
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.beginPath();
    ctx.ellipse(0, 42, 65, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wizard Cloak
    ctx.fillStyle = "#1e1b4b";
    ctx.beginPath();
    ctx.moveTo(-42, 40);
    ctx.lineTo(42, 40);
    ctx.lineTo(22, -45);
    ctx.lineTo(-22, -45);
    ctx.closePath();
    ctx.fill();

    // Scarf (Crimson & Gold)
    ctx.fillStyle = "#dc2626";
    ctx.fillRect(-20, -48, 40, 12);
    ctx.fillStyle = "#facc15";
    ctx.fillRect(-10, -48, 8, 12);
    ctx.fillRect(8, -48, 8, 12);

    // Head & Round Glasses
    ctx.fillStyle = "#fed7aa";
    ctx.beginPath();
    ctx.arc(0, -72, 24, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.arc(-9, -72, 7.5, 0, Math.PI * 2);
    ctx.arc(9, -72, 7.5, 0, Math.PI * 2);
    ctx.moveTo(-1.5, -72);
    ctx.lineTo(1.5, -72);
    ctx.stroke();

    // Pointed Wizard Hat
    ctx.fillStyle = "#312e81";
    ctx.beginPath();
    ctx.ellipse(0, -92, 38, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-26, -92);
    ctx.lineTo(26, -92);
    ctx.lineTo(6, -148);
    ctx.closePath();
    ctx.fill();

    // Magic Wand & Patronus/Spell Glow
    ctx.strokeStyle = "#78350f";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(22, -25);
    ctx.lineTo(68, -62);
    ctx.stroke();

    const spell = ctx.createRadialGradient(74, -66, 4, 74, -66, 68);
    spell.addColorStop(0, "#ffffff");
    spell.addColorStop(0.4, "#38bdf8");
    spell.addColorStop(1, "rgba(56, 189, 248, 0)");
    ctx.fillStyle = spell;
    ctx.beginPath();
    ctx.arc(74, -66, 68, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

window.RaphAIPainterEngine = RaphAIPainterEngine;
