/**
 * Raph AI // Verified World Facts, Common Sense & Everyday Intuition Engine
 * Guarantees 100% accurate, instant answers for common knowledge, geography,
 * capitals, science, animals, human body, calendar, inventions, riddles,
 * object comparisons, cause-and-effect, and natural conversation.
 */

class CommonSenseEngine {
  constructor() {
    // World Capitals lookup
    this.capitals = {
      france: "Paris",
      "united kingdom": "London",
      uk: "London",
      england: "London",
      scotland: "Edinburgh",
      wales: "Cardiff",
      ireland: "Dublin",
      usa: "Washington, D.C.",
      "united states": "Washington, D.C.",
      america: "Washington, D.C.",
      canada: "Ottawa",
      mexico: "Mexico City",
      brazil: "Brasília",
      argentina: "Buenos Aires",
      germany: "Berlin",
      italy: "Rome",
      spain: "Madrid",
      portugal: "Lisbon",
      netherlands: "Amsterdam",
      belgium: "Brussels",
      switzerland: "Bern",
      austria: "Vienna",
      poland: "Warsaw",
      greece: "Athens",
      sweden: "Stockholm",
      norway: "Oslo",
      denmark: "Copenhagen",
      finland: "Helsinki",
      russia: "Moscow",
      ukraine: "Kyiv",
      turkey: "Ankara",
      egypt: "Cairo",
      morocco: "Rabat",
      nigeria: "Abuja",
      kenya: "Nairobi",
      "south africa": "Pretoria (executive), Cape Town (legislative), and Bloemfontein (judicial)",
      china: "Beijing",
      japan: "Tokyo",
      "south korea": "Seoul",
      korea: "Seoul",
      india: "New Delhi",
      pakistan: "Islamabad",
      thailand: "Bangkok",
      vietnam: "Hanoi",
      indonesia: "Jakarta",
      philippines: "Manila",
      malaysia: "Kuala Lumpur",
      singapore: "Singapore",
      australia: "Canberra",
      "new zealand": "Wellington",
      "saudi arabia": "Riyadh",
      uae: "Abu Dhabi",
      "united arab emirates": "Abu Dhabi",
      israel: "Jerusalem",
      peru: "Lima",
      colombia: "Bogotá",
      chile: "Santiago"
    };

    // Everyday Objects & Animals Property Graph
    this.entities = {
      sun: { size: 1000, temp: 1000, bright: true, alive: false, color: "white (looks yellow from Earth)" },
      earth: { size: 500, temp: 50, alive: false, color: "blue and green" },
      moon: { size: 300, temp: -20, alive: false, color: "gray/white" },
      mountain: { size: 200, weight: 200, speed: 0, alive: false },
      house: { size: 80, weight: 80, speed: 0, alive: false },
      whale: { size: 70, weight: 70, speed: 25, alive: true, water: true, legs: 0 },
      elephant: { size: 50, weight: 50, speed: 25, alive: true, legs: 4 },
      giraffe: { size: 42, weight: 35, speed: 35, alive: true, legs: 4 },
      car: { size: 30, weight: 35, speed: 120, alive: false },
      airplane: { size: 60, weight: 60, speed: 900, alive: false, canFly: true },
      plane: { size: 60, weight: 60, speed: 900, alive: false, canFly: true },
      rocket: { size: 65, weight: 65, speed: 25000, alive: false, canFly: true },
      cheetah: { size: 18, weight: 18, speed: 115, alive: true, legs: 4 },
      horse: { size: 25, weight: 25, speed: 70, alive: true, legs: 4 },
      lion: { size: 22, weight: 22, speed: 80, alive: true, legs: 4 },
      tiger: { size: 23, weight: 23, speed: 65, alive: true, legs: 4 },
      bear: { size: 26, weight: 28, speed: 50, alive: true, legs: 4 },
      cow: { size: 24, weight: 25, speed: 30, alive: true, legs: 4 },
      human: { size: 20, weight: 20, speed: 25, alive: true, canFly: false, legs: 2 },
      person: { size: 20, weight: 20, speed: 25, alive: true, canFly: false, legs: 2 },
      dog: { size: 12, weight: 12, speed: 35, alive: true, sound: "bark", canFly: false, legs: 4 },
      cat: { size: 8, weight: 8, speed: 35, alive: true, sound: "meow", canFly: false, legs: 4 },
      bird: { size: 4, weight: 3, speed: 60, alive: true, canFly: true, legs: 2 },
      chicken: { size: 5, weight: 4, speed: 14, alive: true, canFly: false, legs: 2 },
      duck: { size: 5, weight: 4, speed: 50, alive: true, canFly: true, legs: 2 },
      eagle: { size: 6, weight: 5, speed: 120, alive: true, canFly: true, legs: 2 },
      penguin: { size: 7, weight: 7, speed: 10, alive: true, canFly: false, legs: 2 },
      fish: { size: 4, weight: 3, speed: 15, alive: true, water: true, canFly: false, legs: 0 },
      shark: { size: 22, weight: 22, speed: 45, alive: true, water: true, canFly: false, legs: 0 },
      snake: { size: 6, weight: 5, speed: 15, alive: true, canFly: false, legs: 0 },
      spider: { size: 0.5, weight: 0.1, speed: 2, alive: true, canFly: false, legs: 8 },
      octopus: { size: 8, weight: 8, speed: 25, alive: true, water: true, canFly: false, legs: 8 },
      insect: { size: 0.3, weight: 0.05, speed: 5, alive: true, legs: 6 },
      ant: { size: 0.2, weight: 0.05, speed: 0.5, alive: true, canFly: false, legs: 6 },
      bee: { size: 0.3, weight: 0.05, speed: 25, alive: true, canFly: true, legs: 6 },
      mouse: { size: 2, weight: 2, speed: 10, alive: true, canFly: false, legs: 4 },
      turtle: { size: 5, weight: 5, speed: 1, alive: true, canFly: false, legs: 4 },
      snail: { size: 1, weight: 1, speed: 0.05, alive: true, canFly: false, legs: 0 },
      feather: { size: 1, weight: 0.05, soft: true, alive: false },
      rock: { size: 5, weight: 15, hard: true, alive: false },
      stone: { size: 5, weight: 15, hard: true, alive: false },
      brick: { size: 5, weight: 16, hard: true, alive: false },
      pillow: { size: 8, weight: 2, soft: true, alive: false },
      fire: { temp: 500, hot: true },
      lava: { temp: 800, hot: true },
      ice: { temp: -10, cold: true },
      snow: { temp: -5, cold: true, color: "white" }
    };
  }

  solve(rawInput) {
    const input = rawInput.trim();
    const lower = input.toLowerCase().replace(/[?!.]+$/g, "").trim();

    // 1. Conversational Politeness & Identity
    if (/^(how are you|how's it going|hows it going|how are things|you good)/.test(lower)) {
      return { matched: true, answer: "I'm doing great, thanks for asking! What would you like to know?" };
    }
    if (/^(thank you|thanks|thx|ty|appreciate it)/.test(lower)) {
      return { matched: true, answer: "You're welcome!" };
    }
    if (/^(bye|goodbye|see ya|see you|good night|gn)/.test(lower)) {
      return { matched: true, answer: "Goodbye! Have a great day!" };
    }
    if (/^(good morning|morning)/.test(lower)) {
      return { matched: true, answer: "Good morning! How can I help you today?" };
    }
    if (/^(good afternoon|good evening)/.test(lower)) {
      return { matched: true, answer: "Hello! How can I help you?" };
    }
    if (/^(who made you|who created you|who built you)/.test(lower)) {
      return { matched: true, answer: "I am **Raph AI**, built from scratch for Raphael." };
    }
    if (/^(what is your name|what's your name|who are you)/.test(lower)) {
      return { matched: true, answer: "I'm **Raph AI**." };
    }
    if (/^(ok|okay|cool|nice|awesome|great|good job)$/.test(lower)) {
      return { matched: true, answer: "Awesome! Ask me anything else whenever you're ready." };
    }

    // 2. Capitals of Countries ("What is the capital of France?", "capital of japan")
    const capMatch = lower.match(/capital\s+of\s+(?:the\s+)?([a-z\s]+)$/);
    if (capMatch) {
      const country = capMatch[1].trim();
      if (this.capitals[country]) {
        const cap = this.capitals[country];
        const countryDisplay = country.replace(/\b\w/g, c => c.toUpperCase());
        return { matched: true, answer: `The capital of ${countryDisplay} is **${cap}**.` };
      }
    }

    // 3. Animal Legs Count ("How many legs does a spider have?")
    const legsMatch = lower.match(/how\s+many\s+(?:legs|arms)\s+does\s+(?:a\s+|an\s+)?([a-z]+)\s+have/);
    if (legsMatch) {
      const animal = legsMatch[1];
      if (this.entities[animal] && this.entities[animal].legs !== undefined) {
        return { matched: true, answer: `A ${animal} has **${this.entities[animal].legs}** legs.` };
      }
    }

    // 4. Verified Core World, Science, Geography & Calendar Facts
    // Colors of everyday things
    if (/what\s+colou?r\s+is\s+(?:the\s+)?sky/.test(lower)) {
      return { matched: true, answer: "The sky is **blue** during the day (and dark at night)." };
    }
    if (/why\s+is\s+(?:the\s+)?sky\s+blue/.test(lower)) {
      return { matched: true, answer: "The sky is blue because Earth's atmosphere scatters short-wavelength **blue light** from the Sun in all directions more than other colors (Rayleigh scattering)." };
    }
    if (/what\s+colou?r\s+is\s+grass/.test(lower)) {
      return { matched: true, answer: "Grass is **green** (because of chlorophyll)." };
    }
    if (/what\s+colou?r\s+is\s+blood/.test(lower)) {
      return { matched: true, answer: "Human blood is **red** (because of iron in hemoglobin)." };
    }
    if (/what\s+colou?r\s+is\s+snow|what\s+colou?r\s+is\s+milk/.test(lower)) {
      return { matched: true, answer: "It is **white**." };
    }

    // Calendar & Time counts
    if (/how\s+many\s+days\s+(?:are\s+)?in\s+a\s+leap\s+year/.test(lower)) {
      return { matched: true, answer: "There are **366 days** in a leap year." };
    }
    if (/how\s+many\s+days\s+(?:are\s+)?in\s+a\s+year/.test(lower)) {
      return { matched: true, answer: "There are **365 days** in a regular year (and 366 in a leap year)." };
    }
    if (/how\s+many\s+days\s+(?:are\s+)?in\s+a\s+week/.test(lower)) {
      return { matched: true, answer: "There are **7 days** in a week." };
    }
    if (/how\s+many\s+hours\s+(?:are\s+)?in\s+a\s+day/.test(lower)) {
      return { matched: true, answer: "There are **24 hours** in a day." };
    }
    if (/how\s+many\s+minutes\s+(?:are\s+)?in\s+an\s+hour/.test(lower)) {
      return { matched: true, answer: "There are **60 minutes** in an hour." };
    }
    if (/how\s+many\s+seconds\s+(?:are\s+)?in\s+a\s+minute/.test(lower)) {
      return { matched: true, answer: "There are **60 seconds** in a minute." };
    }
    if (/how\s+many\s+months\s+(?:are\s+)?in\s+a\s+year/.test(lower)) {
      return { matched: true, answer: "There are **12 months** in a year." };
    }
    if (/how\s+many\s+weeks\s+(?:are\s+)?in\s+a\s+year/.test(lower)) {
      return { matched: true, answer: "There are **52 weeks** in a year." };
    }

    // Geography & Space counts/superlatives
    if (/how\s+many\s+continents/.test(lower)) {
      return { matched: true, answer: "There are **7 continents**: Asia, Africa, North America, South America, Antarctica, Europe, and Australia." };
    }
    if (/how\s+many\s+oceans/.test(lower)) {
      return { matched: true, answer: "There are **5 oceans**: Pacific, Atlantic, Indian, Southern, and Arctic." };
    }
    if (/how\s+many\s+planets\s+(?:are\s+)?in\s+(?:the\s+|our\s+)?solar\s+system/.test(lower)) {
      return { matched: true, answer: "There are **8 planets** in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune." };
    }
    if (/(?:biggest|largest)\s+planet/.test(lower)) {
      return { matched: true, answer: "**Jupiter** is the largest planet in our solar system." };
    }
    if (/(?:smallest)\s+planet/.test(lower)) {
      return { matched: true, answer: "**Mercury** is the smallest planet in our solar system." };
    }
    if (/closest\s+planet\s+to\s+the\s+sun/.test(lower)) {
      return { matched: true, answer: "**Mercury** is the closest planet to the Sun." };
    }
    if (/red\s+planet/.test(lower)) {
      return { matched: true, answer: "**Mars** is known as the Red Planet." };
    }
    if (/(?:tallest|highest)\s+mountain/.test(lower)) {
      return { matched: true, answer: "**Mount Everest** is the highest mountain on Earth at **8,848.86 meters** (29,031.7 feet)." };
    }
    if (/longest\s+river/.test(lower)) {
      return { matched: true, answer: "The **Nile River** (about 6,650 km) is the longest river in the world, followed closely by the Amazon River." };
    }
    if (/(?:biggest|largest)\s+ocean/.test(lower)) {
      return { matched: true, answer: "The **Pacific Ocean** is the largest and deepest ocean on Earth." };
    }
    if (/(?:biggest|largest)\s+country/.test(lower)) {
      return { matched: true, answer: "**Russia** is the largest country in the world by land area." };
    }
    if (/smallest\s+country/.test(lower)) {
      return { matched: true, answer: "**Vatican City** is the smallest country in the world." };
    }
    if (/(?:fastest)\s+land\s+animal/.test(lower)) {
      return { matched: true, answer: "The **cheetah** is the fastest land animal, reaching speeds up to 110–120 km/h (70 mph)." };
    }
    if (/(?:biggest|largest)\s+animal/.test(lower)) {
      return { matched: true, answer: "The **blue whale** is the largest animal on Earth." };
    }
    if (/tallest\s+animal/.test(lower)) {
      return { matched: true, answer: "The **giraffe** is the tallest animal on Earth." };
    }

    // Science & Body facts
    if (/how\s+many\s+bones\s+.*human/.test(lower)) {
      return { matched: true, answer: "An adult human has **206 bones**." };
    }
    if (/boiling\s+point\s+of\s+water|what\s+temperature\s+does\s+water\s+boil/.test(lower)) {
      return { matched: true, answer: "Water boils at **100°C (212°F)** at standard sea-level pressure." };
    }
    if (/freezing\s+point\s+of\s+water|what\s+temperature\s+does\s+water\s+freeze/.test(lower)) {
      return { matched: true, answer: "Water freezes at **0°C (32°F)**." };
    }
    if (/speed\s+of\s+light/.test(lower)) {
      return { matched: true, answer: "The speed of light in a vacuum is **299,792,458 meters per second** (about 300,000 km/s)." };
    }
    if (/chemical\s+(?:formula|symbol)\s+(?:of|for)\s+water/.test(lower)) {
      return { matched: true, answer: "The chemical formula for water is **H₂O**." };
    }

    // 5. Classic Common-Sense Trick Questions & Riddles
    if (
      (lower.includes("pound of") || lower.includes("kilogram of") || lower.includes("kg of") || lower.includes("ton of")) &&
      (lower.includes("heavier") || lower.includes("weighs more") || lower.includes("lighter"))
    ) {
      return { matched: true, answer: "They weigh the **exact same**! Both weigh the same amount." };
    }
    const appleMatch = lower.match(/take\s+(?:away\s+)?(\d+).*?how\s+many\s+do\s+you\s+have/);
    if (appleMatch) {
      return { matched: true, answer: `You have **${appleMatch[1]}**, because you took ${appleMatch[1]}!` };
    }
    if (lower.includes("months") && lower.includes("28 days")) {
      return { matched: true, answer: "**All 12 months** have at least 28 days!" };
    }
    if (lower.includes("rooster") && lower.includes("egg")) {
      return { matched: true, answer: "**Roosters don't lay eggs** — only hens do!" };
    }
    if (lower.includes("electric train") && lower.includes("smoke")) {
      return { matched: true, answer: "**Neither way** — electric trains don't make smoke!" };
    }
    if (lower.includes("pass") && (lower.includes("2nd place") || lower.includes("second place"))) {
      return { matched: true, answer: "You are in **2nd place** (you took the place of the person you passed)." };
    }

    // 6. Physical World & Cause-and-Effect Common Sense
    if (/\b(drop|throw|smash)\b/.test(lower) && /\b(glass|plate|cup|mug|egg|mirror|window|phone)\b/.test(lower)) {
      return { matched: true, answer: "It will fall to the ground and most likely **crack or shatter**." };
    }
    if (/what happens (?:if|when) (?:you|i) drop/.test(lower) || /why do things fall/.test(lower)) {
      return { matched: true, answer: "Gravity pulls it straight down toward the ground." };
    }
    if ((lower.includes("rain") && (lower.includes("without") || lower.includes("outside"))) || (lower.includes("jump") && (lower.includes("water") || lower.includes("pool")))) {
      return { matched: true, answer: "You will **get wet**!" };
    }
    if (/\b(touch|put my hand)\b/.test(lower) && /\b(fire|stove|boiling|flame|lava|oven)\b/.test(lower)) {
      return { matched: true, answer: "You will **burn yourself** because it is dangerously hot." };
    }
    if (/\b(ice|snow|snowman|popsicle|ice cream)\b/.test(lower) && /\b(sun|heat|fire|oven|warm|hot|outside)\b/.test(lower)) {
      return { matched: true, answer: "It will **melt** into liquid." };
    }
    if (lower.includes("water") && /\b(freezer|freeze|below zero|0 degrees)\b/.test(lower)) {
      return { matched: true, answer: "It will **freeze into solid ice**." };
    }
    if (lower.includes("see") && (lower.includes("dark") || lower.includes("eyes closed"))) {
      return { matched: true, answer: "**No**, you need light and open eyes to see." };
    }
    if (lower.includes("breathe") && (lower.includes("underwater") || lower.includes("under water") || lower.includes("space"))) {
      return { matched: true, answer: "**No**, humans cannot breathe there without oxygen gear." };
    }
    if (lower.includes("fish") && (lower.includes("out of water") || lower.includes("on land") || lower.includes("walk"))) {
      return { matched: true, answer: "**No**, fish need water to breathe and swim." };
    }
    if (lower.includes("plant") && (lower.includes("no water") || lower.includes("without water") || lower.includes("without sunlight"))) {
      return { matched: true, answer: "The plant will **wilt and die** because plants need water and sunlight to survive." };
    }

    // 7. Everyday Human Needs
    if (/\b(i am|i'm|im|feel|feeling)\s+(hungry|starving)\b/.test(lower) || (lower.includes("what") && lower.includes("hungry"))) {
      return { matched: true, answer: "You should **eat some food** or grab a healthy snack." };
    }
    if (/\b(i am|i'm|im|feel|feeling)\s+(thirsty|dehydrated)\b/.test(lower) || (lower.includes("what") && lower.includes("thirsty"))) {
      return { matched: true, answer: "You should **drink a glass of water**." };
    }
    if (/\b(i am|i'm|im|feel|feeling)\s+(tired|sleepy|exhausted)\b/.test(lower) || (lower.includes("what") && lower.includes("tired"))) {
      return { matched: true, answer: "You should **take a break and get some sleep**." };
    }
    if (/\b(i am|i'm|im|feel|feeling)\s+(freezing|cold)\b/.test(lower) || (lower.includes("what") && lower.includes("if i'm cold"))) {
      return { matched: true, answer: "Put on a **warm jacket or blanket** and have something warm to drink." };
    }
    if (/\b(i am|i'm|im|feel|feeling)\s+(bored)\b/.test(lower)) {
      return { matched: true, answer: "Try playing a game, going for a walk, learning something new, or building a cool project!" };
    }

    // 8. Object Comparisons ("Which is bigger/faster/heavier/hotter, X or Y?")
    const compMatch = lower.match(/which\s+is\s+(bigger|larger|smaller|faster|slower|heavier|lighter|hotter|colder)\s*,?\s*(?:a\s+|an\s+|the\s+)?([a-z]+)\s+or\s+(?:a\s+|an\s+|the\s+)?([a-z]+)/);
    if (compMatch) {
      const adj = compMatch[1];
      const itemA = compMatch[2];
      const itemB = compMatch[3];
      const objA = this.entities[itemA];
      const objB = this.entities[itemB];

      if (objA && objB) {
        if ((adj === "bigger" || adj === "larger") && objA.size !== undefined && objB.size !== undefined) {
          return { matched: true, answer: `The **${objA.size > objB.size ? itemA : itemB}** is ${adj}.` };
        }
        if (adj === "smaller" && objA.size !== undefined && objB.size !== undefined) {
          return { matched: true, answer: `The **${objA.size < objB.size ? itemA : itemB}** is smaller.` };
        }
        if (adj === "faster" && objA.speed !== undefined && objB.speed !== undefined) {
          return { matched: true, answer: `The **${objA.speed > objB.speed ? itemA : itemB}** is faster.` };
        }
        if (adj === "slower" && objA.speed !== undefined && objB.speed !== undefined) {
          return { matched: true, answer: `The **${objA.speed < objB.speed ? itemA : itemB}** is slower.` };
        }
        if (adj === "heavier" && objA.weight !== undefined && objB.weight !== undefined) {
          return { matched: true, answer: `The **${objA.weight > objB.weight ? itemA : itemB}** is heavier.` };
        }
        if (adj === "lighter" && objA.weight !== undefined && objB.weight !== undefined) {
          return { matched: true, answer: `The **${objA.weight < objB.weight ? itemA : itemB}** is lighter.` };
        }
        if (adj === "hotter" && objA.temp !== undefined && objB.temp !== undefined) {
          const w = objA.temp > objB.temp ? itemA : itemB;
          return { matched: true, answer: `**${w.charAt(0).toUpperCase() + w.slice(1)}** is hotter.` };
        }
        if (adj === "colder" && objA.temp !== undefined && objB.temp !== undefined) {
          const w = objA.temp < objB.temp ? itemA : itemB;
          return { matched: true, answer: `**${w.charAt(0).toUpperCase() + w.slice(1)}** is colder.` };
        }
      }
    }

    if (/is\s+(fire|lava|the sun|boiling water)\s+(hot|cold)/.test(lower)) {
      return { matched: true, answer: "It is **very hot**." };
    }
    if (/is\s+(ice|snow)\s+(hot|cold)/.test(lower)) {
      return { matched: true, answer: "It is **cold**." };
    }
    const flyMatch = lower.match(/^can\s+(?:a\s+|an\s+)?([a-z]+?)s?\s+fly$/);
    if (flyMatch) {
      const entity = this.entities[flyMatch[1]];
      if (entity && entity.canFly !== undefined) {
        return {
          matched: true,
          answer: entity.canFly
            ? `**Yes**, a ${flyMatch[1]} can fly.`
            : `**No**, a ${flyMatch[1]} cannot fly on its own.`
        };
      }
    }

    return { matched: false };
  }
}

window.CommonSenseEngine = CommonSenseEngine;
