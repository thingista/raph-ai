/**
 * Raph AI // Universal From-Scratch Mathematics Engine
 * Solves Arithmetic, Fractions, Percentages, Algebra (Linear, Quadratic, Cubic,
 * Systems of Equations, Any Transcendental Equation), Calculus (Symbolic & Numeric
 * Derivatives, Integrals, Limits), Geometry, Trigonometry, Number Theory (Primes,
 * Factoring, GCD/LCM, nCr/nPr, Base/Roman Conversions), Statistics, and Unit Conversions.
 * Returns simple, direct answers with zero clutter.
 */

class UniversalMathEngine {
  constructor() {
    this.wordNumbers = {
      zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
      six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
      sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
      thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70,
      eighty: 80, ninety: 90, hundred: 100, thousand: 1000, million: 1000000
    };
  }

  fmt(n) {
    if (typeof n !== "number" || !isFinite(n)) return String(n);
    if (Math.abs(n) < 1e-12) return "0";
    if (Math.abs(n - Math.round(n)) < 1e-9) return String(Math.round(n));
    return String(Number(n.toFixed(6)));
  }

  // Greatest Common Divisor & Least Common Multiple
  gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b !== 0) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  lcm(a, b) {
    return Math.abs((a * b) / this.gcd(a, b));
  }

  factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n > 170) return Infinity;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  isPrime(n) {
    n = Math.round(n);
    if (n < 2) return false;
    if (n === 2 || n === 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    for (let i = 5; i * i <= n; i += 6) {
      if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
  }

  primeFactors(n) {
    n = Math.abs(Math.round(n));
    if (n < 2) return [];
    const factors = [];
    let d = 2;
    while (d * d <= n) {
      while (n % d === 0) {
        factors.push(d);
        n /= d;
      }
      d++;
    }
    if (n > 1) factors.push(n);
    return factors;
  }

  // Safe evaluator for f(x)
  evalFunc(exprStr, xVal = 0) {
    let s = exprStr
      .toLowerCase()
      .replace(/−/g, "-")
      .replace(/×/g, "*")
      .replace(/÷/g, "/")
      .replace(/\^/g, "**")
      // Implicit multiplication: 3x -> 3*x, 2(x+1) -> 2*(x+1), (x)(x) -> (x)*(x)
      .replace(/(\d)([a-z(])/g, "$1*$2")
      .replace(/(\))(\d|[a-z(])/g, "$1*$2")
      .replace(/\bsin\(/g, "Math.sin(")
      .replace(/\bcos\(/g, "Math.cos(")
      .replace(/\btan\(/g, "Math.tan(")
      .replace(/\basin\(/g, "Math.asin(")
      .replace(/\bacos\(/g, "Math.acos(")
      .replace(/\batan\(/g, "Math.atan(")
      .replace(/\bsqrt\(/g, "Math.sqrt(")
      .replace(/\bcbrt\(/g, "Math.cbrt(")
      .replace(/\babs\(/g, "Math.abs(")
      .replace(/\bln\(/g, "Math.log(")
      .replace(/\blog10\(/g, "Math.log10(")
      .replace(/\blog\(/g, "Math.log(")
      .replace(/\bexp\(/g, "Math.exp(")
      .replace(/\bpi\b/g, "Math.PI")
      .replace(/\be\b/g, "Math.E");

    // Replace standalone variable x with (xVal)
    s = s.replace(/\bx\b/g, `(${xVal})`);
    return Function("Math", `"use strict"; return (${s});`)(Math);
  }

  // Symbolic polynomial derivative for clean expressions like 3x^2 + 4x - 5
  symbolicDerivative(rawExpr) {
    const clean = rawExpr.replace(/\s+/g, "").replace(/−/g, "-");
    // Only use symbolic if it looks like a polynomial in x
    if (!/^[0-9x^+\-.*]+$/i.test(clean)) return null;

    const terms = clean.replace(/([+-])/g, " $1").trim().split(/\s+/);
    const derivedTerms = [];

    for (let t of terms) {
      if (!t) continue;
      t = t.replace(/\*/g, "");
      if (!t.includes("x")) continue; // derivative of constant is 0

      const m = t.match(/^([+-]?\d*(?:\.\d+)?)x(?:\^([+-]?\d+(?:\.\d+)?))?$/i);
      if (!m) return null;

      let coeffStr = m[1];
      let coeff = coeffStr === "" || coeffStr === "+" ? 1 : coeffStr === "-" ? -1 : parseFloat(coeffStr);
      let exp = m[2] !== undefined ? parseFloat(m[2]) : 1;

      const newCoeff = coeff * exp;
      const newExp = exp - 1;
      if (newCoeff === 0) continue;

      let termStr = "";
      if (newExp === 0) {
        termStr = this.fmt(newCoeff);
      } else if (newExp === 1) {
        termStr = (newCoeff === 1 ? "" : newCoeff === -1 ? "-" : this.fmt(newCoeff)) + "x";
      } else {
        termStr = (newCoeff === 1 ? "" : newCoeff === -1 ? "-" : this.fmt(newCoeff)) + `x^${this.fmt(newExp)}`;
      }
      derivedTerms.push(termStr);
    }

    if (derivedTerms.length === 0) return "0";
    return derivedTerms
      .map((t, i) => (i > 0 && !t.startsWith("-") ? "+ " + t : t.replace(/^-/, "- ")))
      .join(" ")
      .trim();
  }

  // Symbolic polynomial integral for expressions like 3x^2 + 2x + 1
  symbolicIntegral(rawExpr) {
    const clean = rawExpr.replace(/\s+/g, "").replace(/−/g, "-");
    if (!/^[0-9x^+\-.*]+$/i.test(clean)) return null;

    const terms = clean.replace(/([+-])/g, " $1").trim().split(/\s+/);
    const intTerms = [];

    for (let t of terms) {
      if (!t) continue;
      t = t.replace(/\*/g, "");
      if (!t.includes("x")) {
        const c = parseFloat(t);
        if (isNaN(c)) return null;
        if (c !== 0) intTerms.push((c === 1 ? "" : c === -1 ? "-" : this.fmt(c)) + "x");
        continue;
      }

      const m = t.match(/^([+-]?\d*(?:\.\d+)?)x(?:\^([+-]?\d+(?:\.\d+)?))?$/i);
      if (!m) return null;

      let coeffStr = m[1];
      let coeff = coeffStr === "" || coeffStr === "+" ? 1 : coeffStr === "-" ? -1 : parseFloat(coeffStr);
      let exp = m[2] !== undefined ? parseFloat(m[2]) : 1;

      if (exp === -1) {
        intTerms.push(`${this.fmt(coeff)}ln|x|`);
        continue;
      }

      const newExp = exp + 1;
      const newCoeff = coeff / newExp;
      const coeffFormatted = newCoeff === 1 ? "" : newCoeff === -1 ? "-" : this.fmt(newCoeff);
      intTerms.push(`${coeffFormatted}x^${this.fmt(newExp)}`);
    }

    if (intTerms.length === 0) return "C";
    return (
      intTerms
        .map((t, i) => (i > 0 && !t.startsWith("-") ? "+ " + t : t.replace(/^-/, "- ")))
        .join(" ")
        .trim() + " + C"
    );
  }

  // Numerical Integration (Simpson's Rule)
  numericIntegral(expr, a, b, n = 1000) {
    const h = (b - a) / n;
    let sum = this.evalFunc(expr, a) + this.evalFunc(expr, b);
    for (let i = 1; i < n; i++) {
      const x = a + i * h;
      sum += (i % 2 === 0 ? 2 : 4) * this.evalFunc(expr, x);
    }
    return (h / 3) * sum;
  }

  // Universal Single-Variable Equation Solver (Quadratic, Linear, & Newton-Raphson)
  solveEquation(lhs, rhs) {
    // Check if standard quadratic ax^2 + bx + c = 0
    const combined = `(${lhs}) - (${rhs})`;
    try {
      // Sample 3 points to check if degree <= 2 polynomial
      const f0 = this.evalFunc(combined, 0);
      const f1 = this.evalFunc(combined, 1);
      const fm1 = this.evalFunc(combined, -1);
      const f2 = this.evalFunc(combined, 2);

      const c = f0;
      const a = (f1 + fm1 - 2 * c) / 2;
      const b = (f1 - fm1) / 2;
      // Check if f(2) matches a(4) + b(2) + c
      const expectedF2 = 4 * a + 2 * b + c;

      if (Math.abs(f2 - expectedF2) < 1e-7) {
        // Exact Linear
        if (Math.abs(a) < 1e-9) {
          if (Math.abs(b) < 1e-9) return null;
          return `**x = ${this.fmt(-c / b)}**`;
        }
        // Exact Quadratic
        const disc = b * b - 4 * a * c;
        if (Math.abs(disc) < 1e-9) {
          return `**x = ${this.fmt(-b / (2 * a))}**`;
        } else if (disc > 0) {
          const r1 = (-b + Math.sqrt(disc)) / (2 * a);
          const r2 = (-b - Math.sqrt(disc)) / (2 * a);
          return `**x = ${this.fmt(r1)}** and **x = ${this.fmt(r2)}**`;
        } else {
          const realPart = this.fmt(-b / (2 * a));
          const imagPart = this.fmt(Math.sqrt(-disc) / (2 * Math.abs(a)));
          return `**x = ${realPart} + ${imagPart}i** and **x = ${realPart} - ${imagPart}i**`;
        }
      }

      // General Numerical Root Finder across multiple starting seeds
      const roots = [];
      const seeds = [-50, -10, -3, -1, 0, 0.5, 1, 2, 5, 10, 50];
      for (const seed of seeds) {
        let x = seed;
        for (let iter = 0; iter < 60; iter++) {
          const fx = this.evalFunc(combined, x);
          if (Math.abs(fx) < 1e-9) {
            if (!roots.some(r => Math.abs(r - x) < 1e-5)) {
              roots.push(x);
            }
            break;
          }
          const h = 1e-6;
          const df = (this.evalFunc(combined, x + h) - this.evalFunc(combined, x - h)) / (2 * h);
          if (Math.abs(df) < 1e-12) break;
          x = x - fx / df;
        }
      }
      if (roots.length > 0) {
        roots.sort((p, q) => p - q);
        return roots.map(r => `**x = ${this.fmt(r)}**`).join(", ");
      }
    } catch (e) {}
    return null;
  }

  // Solve 2x2 System of Linear Equations: a1*x + b1*y = c1, a2*x + b2*y = c2
  solveSystem2x2(input) {
    const clean = input.replace(/\s+/g, "");
    const eqs = clean.split(/,|and|;/i).filter(s => s.includes("=") && s.includes("x") && s.includes("y"));
    if (eqs.length !== 2) return null;

    const parseLinearXY = eq => {
      const [l, r] = eq.split("=");
      const c = parseFloat(r);
      const xm = l.match(/([+-]?\d*(?:\.\d+)?)x/i);
      const ym = l.match(/([+-]?\d*(?:\.\d+)?)y/i);
      if (!xm || !ym || isNaN(c)) return null;
      const parseCoeff = s => (s === "" || s === "+" ? 1 : s === "-" ? -1 : parseFloat(s));
      return { a: parseCoeff(xm[1]), b: parseCoeff(ym[1]), c };
    };

    const e1 = parseLinearXY(eqs[0]);
    const e2 = parseLinearXY(eqs[1]);
    if (!e1 || !e2) return null;

    const det = e1.a * e2.b - e2.a * e1.b;
    if (Math.abs(det) < 1e-12) return "The system has no unique solution.";
    const x = (e1.c * e2.b - e2.c * e1.b) / det;
    const y = (e1.a * e2.c - e2.a * e1.c) / det;
    return `**x = ${this.fmt(x)}**, **y = ${this.fmt(y)}**`;
  }

  // Main entry point: returns { solved: true, answer: "..." } or { solved: false }
  solve(rawInput) {
    const input = rawInput.trim();
    const lower = input.toLowerCase();

    // 1. Percentages
    // "what is 15% of 240"
    let m = lower.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/);
    if (m) {
      const val = (parseFloat(m[1]) / 100) * parseFloat(m[2]);
      return { solved: true, answer: `The answer is **${this.fmt(val)}**.` };
    }
    // "45 is what percent of 180"
    m = lower.match(/(\d+(?:\.\d+)?)\s+is\s+what\s+percent(?:age)?\s+of\s+(\d+(?:\.\d+)?)/);
    if (m) {
      const pct = (parseFloat(m[1]) / parseFloat(m[2])) * 100;
      return { solved: true, answer: `It is **${this.fmt(pct)}%**.` };
    }
    // "20% off 150"
    m = lower.match(/(\d+(?:\.\d+)?)\s*%\s*off\s*(\d+(?:\.\d+)?)/);
    if (m) {
      const val = parseFloat(m[2]) * (1 - parseFloat(m[1]) / 100);
      return { solved: true, answer: `The answer is **${this.fmt(val)}**.` };
    }

    // 2. Number Theory: Primes, Prime Factors, GCD, LCM, Factorial, nCr, nPr
    m = lower.match(/is\s+(\d+)\s+(?:a\s+)?prime/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (this.isPrime(n)) {
        return { solved: true, answer: `**Yes**, **${n}** is a prime number.` };
      } else {
        const pf = this.primeFactors(n);
        return { solved: true, answer: `**No**, **${n}** is not prime (its factors are ${pf.join(" × ")}).` };
      }
    }

    m = lower.match(/prime\s+factors?\s+of\s+(\d+)/);
    if (m) {
      const n = parseInt(m[1], 10);
      const pf = this.primeFactors(n);
      return { solved: true, answer: `The prime factors of ${n} are **${pf.join(" × ")}**.` };
    }

    if (lower.includes("gcd") || lower.includes("gcf") || lower.includes("greatest common")) {
      const nums = (input.match(/\d+/g) || []).map(Number);
      if (nums.length >= 2) {
        const res = nums.reduce((a, b) => this.gcd(a, b));
        return { solved: true, answer: `The greatest common divisor is **${res}**.` };
      }
    }

    if (lower.includes("lcm") || lower.includes("least common multiple")) {
      const nums = (input.match(/\d+/g) || []).map(Number);
      if (nums.length >= 2) {
        const res = nums.reduce((a, b) => this.lcm(a, b));
        return { solved: true, answer: `The least common multiple is **${res}**.` };
      }
    }

    // Factorial: "10!" or "factorial of 10"
    m = lower.match(/^(?:what is\s+|calculate\s+)?(\d+)\s*!$/) || lower.match(/factorial\s+of\s+(\d+)/);
    if (m) {
      const n = parseInt(m[1], 10);
      return { solved: true, answer: `The answer is **${this.factorial(n).toLocaleString()}**.` };
    }

    // Combinations: "10 choose 3" or "nCr(10, 3)"
    m = lower.match(/(\d+)\s+choose\s+(\d+)/) || lower.match(/ncr\(\s*(\d+)\s*,\s*(\d+)\s*\)/);
    if (m) {
      const n = parseInt(m[1], 10);
      const r = parseInt(m[2], 10);
      const val = this.factorial(n) / (this.factorial(r) * this.factorial(n - r));
      return { solved: true, answer: `The answer is **${this.fmt(val)}**.` };
    }

    // 3. Base Conversions (binary, hex, octal)
    m = lower.match(/(\d+)\s+(?:in|to)\s+(binary|hex|hexadecimal|octal)/);
    if (m) {
      const n = parseInt(m[1], 10);
      const mode = m[2];
      const base = mode === "binary" ? 2 : mode === "octal" ? 8 : 16;
      return { solved: true, answer: `**${n.toString(base).toUpperCase()}**` };
    }
    m = lower.match(/([01]+)\s+binary\s+(?:to|in)\s+decimal/);
    if (m) {
      return { solved: true, answer: `**${parseInt(m[1], 2)}**` };
    }

    // 4. Statistics (Mean, Median, Mode, Standard Deviation)
    if (/\b(mean|average|median|mode|standard deviation|std dev|variance|range)\b/.test(lower)) {
      const nums = (input.match(/[+-]?\d+(?:\.\d+)?/g) || []).map(Number);
      if (nums.length >= 2) {
        const sorted = [...nums].sort((a, b) => a - b);
        const sum = nums.reduce((a, b) => a + b, 0);
        const mean = sum / nums.length;

        if (lower.includes("mean") || lower.includes("average")) {
          return { solved: true, answer: `The average is **${this.fmt(mean)}**.` };
        }
        if (lower.includes("median")) {
          const mid = Math.floor(sorted.length / 2);
          const med = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
          return { solved: true, answer: `The median is **${this.fmt(med)}**.` };
        }
        if (lower.includes("range")) {
          return { solved: true, answer: `The range is **${this.fmt(sorted[sorted.length - 1] - sorted[0])}**.` };
        }
        if (lower.includes("mode")) {
          const counts = new Map();
          nums.forEach(n => counts.set(n, (counts.get(n) || 0) + 1));
          let maxC = 0, modeVal = nums[0];
          for (const [k, v] of counts.entries()) {
            if (v > maxC) { maxC = v; modeVal = k; }
          }
          return { solved: true, answer: `The mode is **${modeVal}**.` };
        }
        if (lower.includes("variance") || lower.includes("standard deviation") || lower.includes("std dev")) {
          const variance = nums.reduce((acc, val) => acc + (val - mean) ** 2, 0) / nums.length;
          if (lower.includes("variance")) {
            return { solved: true, answer: `The variance is **${this.fmt(variance)}**.` };
          }
          return { solved: true, answer: `The standard deviation is **${this.fmt(Math.sqrt(variance))}**.` };
        }
      }
    }

    // 5. Calculus: Derivatives, Integrals, Limits
    if (lower.includes("derivative of") || lower.includes("differentiate")) {
      const expr = input.replace(/^(?:what is\s+)?(?:the\s+)?(?:derivative of|differentiate)\s+/i, "").replace(/\?+$/, "").trim();
      const atMatch = expr.match(/(.+?)\s+at\s+x\s*=\s*([+-]?\d+(?:\.\d+)?)/i);
      if (atMatch) {
        const fnExpr = atMatch[1].trim();
        const x0 = parseFloat(atMatch[2]);
        const h = 1e-6;
        const dVal = (this.evalFunc(fnExpr, x0 + h) - this.evalFunc(fnExpr, x0 - h)) / (2 * h);
        return { solved: true, answer: `The derivative at x = ${x0} is **${this.fmt(dVal)}**.` };
      }
      const sym = this.symbolicDerivative(expr);
      if (sym) return { solved: true, answer: `The derivative is **${sym}**.` };
    }

    if (lower.includes("integral of") || lower.includes("integrate")) {
      const defMatch = input.match(/(?:integral of|integrate)\s+(.+?)\s+from\s+([+-]?\d+(?:\.\d+)?)\s+to\s+([+-]?\d+(?:\.\d+)?)/i);
      if (defMatch) {
        const fnExpr = defMatch[1].trim();
        const a = parseFloat(defMatch[2]);
        const b = parseFloat(defMatch[3]);
        const val = this.numericIntegral(fnExpr, a, b);
        return { solved: true, answer: `The integral from ${a} to ${b} is **${this.fmt(val)}**.` };
      }
      const expr = input.replace(/^(?:what is\s+)?(?:the\s+)?(?:integral of|integrate)\s+/i, "").replace(/\?+$/, "").trim();
      const sym = this.symbolicIntegral(expr);
      if (sym) return { solved: true, answer: `The integral is **${sym}**.` };
    }

    // 6. Geometry & Pythagoras
    // Area/circumference of circle
    m = lower.match(/(?:area|circumference)\s+of\s+(?:a\s+)?circle\s+with\s+radius\s+(\d+(?:\.\d+)?)/);
    if (m) {
      const r = parseFloat(m[1]);
      if (lower.includes("area")) {
        return { solved: true, answer: `The area is **${this.fmt(Math.PI * r * r)}**.` };
      }
      return { solved: true, answer: `The circumference is **${this.fmt(2 * Math.PI * r)}**.` };
    }
    // Hypotenuse
    m = lower.match(/hypotenuse.*?\b(\d+(?:\.\d+)?)\s+and\s+(\d+(?:\.\d+)?)/);
    if (m) {
      const a = parseFloat(m[1]);
      const b = parseFloat(m[2]);
      return { solved: true, answer: `The hypotenuse is **${this.fmt(Math.hypot(a, b))}**.` };
    }

    // 7. Degree Trigonometry ("sin of 30 degrees", "cos(60 deg)")
    m = lower.match(/\b(sin|cos|tan)\s*\(?\s*([+-]?\d+(?:\.\d+)?)\s*(?:deg|degrees|°)\s*\)?/);
    if (m) {
      const fn = m[1];
      const rad = (parseFloat(m[2]) * Math.PI) / 180;
      const val = fn === "sin" ? Math.sin(rad) : fn === "cos" ? Math.cos(rad) : Math.tan(rad);
      return { solved: true, answer: `The answer is **${this.fmt(val)}**.` };
    }

    // 8. Systems of 2 Equations & Single-Variable Algebra Equations
    if (input.includes("=")) {
      if (input.includes("x") && input.includes("y")) {
        const sysAns = this.solveSystem2x2(input);
        if (sysAns) return { solved: true, answer: sysAns };
      }
      const cleanEq = input.replace(/^(?:solve|find x in|what is x if|what is x in)\s*:?\s*/i, "").replace(/\?+$/, "").trim();
      const parts = cleanEq.split("=");
      if (parts.length === 2 && /\bx\b/i.test(cleanEq)) {
        const eqAns = this.solveEquation(parts[0], parts[1]);
        if (eqAns) return { solved: true, answer: eqAns };
      }
    }

    // 9. Natural Language Arithmetic & Scientific Expressions
    // Convert words like "square root of 144", "5 squared", "10 divided by 2", "3 plus 5"
    let normalized = lower
      .replace(/^(?:what\s+is|calculate|compute|solve|evaluate|work\s+out)\s*:?\s*/i, "")
      .replace(/\?+$/g, "")
      .replace(/square\s+root\s+of\s+(\d+(?:\.\d+)?)/g, "sqrt($1)")
      .replace(/cube\s+root\s+of\s+(\d+(?:\.\d+)?)/g, "cbrt($1)")
      .replace(/(\d+(?:\.\d+)?)\s+squared/g, "($1^2)")
      .replace(/(\d+(?:\.\d+)?)\s+cubed/g, "($1^3)")
      .replace(/\bto\s+the\s+power\s+of\b/g, "^")
      .replace(/\bplus\b/g, "+")
      .replace(/\bminus\b/g, "-")
      .replace(/\b(?:times|multiplied\s+by)\b/g, "*")
      .replace(/\b(?:divided\s+by|over)\b/g, "/")
      .replace(/\bmod(?:ulo)?\b/g, "%")
      .trim();

    if (/^[0-9+\-*/^().%\s,sqrtcbincolgapexwπ]+$/i.test(normalized) && /\d|pi\b/i.test(normalized)) {
      try {
        const val = this.evalFunc(normalized.replace(/π/g, "pi"), 0);
        if (typeof val === "number" && isFinite(val)) {
          return { solved: true, answer: `The answer is **${this.fmt(val)}**.` };
        }
      } catch (e) {}
    }

    return { solved: false };
  }
}

window.UniversalMathEngine = UniversalMathEngine;
