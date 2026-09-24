(function () {
  const LS_DONE = "challenge_done:";
  const LS_PEEK = "challenge_peek:";
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  let data = null;
  const flat = [];

  const NAMED = [
    ["aliceblue", 240, 248, 255], ["antiquewhite", 250, 235, 215], ["aqua", 0, 255, 255],
    ["aquamarine", 127, 255, 212], ["azure", 240, 255, 255], ["beige", 245, 245, 220],
    ["bisque", 255, 228, 196], ["black", 0, 0, 0], ["blanchedalmond", 255, 235, 205],
    ["blue", 0, 0, 255], ["blueviolet", 138, 43, 226], ["brown", 165, 42, 42],
    ["burlywood", 222, 184, 135], ["cadetblue", 95, 158, 160], ["chartreuse", 127, 255, 0],
    ["chocolate", 210, 105, 30], ["coral", 255, 127, 80], ["cornflowerblue", 100, 149, 237],
    ["cornsilk", 255, 248, 220], ["crimson", 220, 20, 60], ["cyan", 0, 255, 255],
    ["darkblue", 0, 0, 139], ["darkcyan", 0, 139, 139], ["darkgoldenrod", 184, 134, 11],
    ["darkgray", 169, 169, 169], ["darkgreen", 0, 100, 0], ["darkkhaki", 189, 183, 107],
    ["darkmagenta", 139, 0, 139], ["darkolivegreen", 85, 107, 47], ["darkorange", 255, 140, 0],
    ["darkorchid", 153, 50, 204], ["darkred", 139, 0, 0], ["darksalmon", 233, 150, 122],
    ["darkseagreen", 143, 188, 143], ["darkslateblue", 72, 61, 139], ["darkslategray", 47, 79, 79],
    ["darkturquoise", 0, 206, 209], ["darkviolet", 148, 0, 211], ["deeppink", 255, 20, 147],
    ["deepskyblue", 0, 191, 255], ["dimgray", 105, 105, 105], ["dodgerblue", 30, 144, 255],
    ["firebrick", 178, 34, 34], ["floralwhite", 255, 250, 240], ["forestgreen", 34, 139, 34],
    ["fuchsia", 255, 0, 255], ["gainsboro", 220, 220, 220], ["ghostwhite", 248, 248, 255],
    ["gold", 255, 215, 0], ["goldenrod", 218, 165, 32], ["gray", 128, 128, 128],
    ["green", 0, 128, 0], ["greenyellow", 173, 255, 47], ["honeydew", 240, 255, 240],
    ["hotpink", 255, 105, 180], ["indianred", 205, 92, 92], ["indigo", 75, 0, 130],
    ["ivory", 255, 255, 240], ["khaki", 240, 230, 140], ["lavender", 230, 230, 250],
    ["lavenderblush", 255, 240, 245], ["lawngreen", 124, 252, 0], ["lemonchiffon", 255, 250, 205],
    ["lightblue", 173, 216, 230], ["lightcoral", 240, 128, 128], ["lightcyan", 224, 255, 255],
    ["lightgoldenrodyellow", 250, 250, 210], ["lightgray", 211, 211, 211], ["lightgreen", 144, 238, 144],
    ["lightpink", 255, 182, 193], ["lightsalmon", 255, 160, 122], ["lightseagreen", 32, 178, 170],
    ["lightskyblue", 135, 206, 250], ["lightslategray", 119, 136, 153], ["lightsteelblue", 176, 196, 222],
    ["lightyellow", 255, 255, 224], ["lime", 0, 255, 0], ["limegreen", 50, 205, 50],
    ["linen", 250, 240, 230], ["magenta", 255, 0, 255], ["maroon", 128, 0, 0],
    ["mediumaquamarine", 102, 205, 170], ["mediumblue", 0, 0, 205], ["mediumorchid", 186, 85, 211],
    ["mediumpurple", 147, 112, 219], ["mediumseagreen", 60, 179, 113], ["mediumslateblue", 123, 104, 238],
    ["mediumspringgreen", 0, 250, 154], ["mediumturquoise", 72, 209, 204], ["mediumvioletred", 199, 21, 133],
    ["midnightblue", 25, 25, 112], ["mintcream", 245, 255, 250], ["mistyrose", 255, 228, 225],
    ["moccasin", 255, 228, 181], ["navajowhite", 255, 222, 173], ["navy", 0, 0, 128],
    ["oldlace", 253, 245, 230], ["olive", 128, 128, 0], ["olivedrab", 107, 142, 35],
    ["orange", 255, 165, 0], ["orangered", 255, 69, 0], ["orchid", 218, 112, 214],
    ["palegoldenrod", 238, 232, 170], ["palegreen", 152, 251, 152], ["paleturquoise", 175, 238, 238],
    ["palevioletred", 219, 112, 147], ["papayawhip", 255, 239, 213], ["peachpuff", 255, 218, 185],
    ["peru", 205, 133, 63], ["pink", 255, 192, 203], ["plum", 221, 160, 221],
    ["powderblue", 176, 224, 230], ["purple", 128, 0, 128], ["rebeccapurple", 102, 51, 153],
    ["red", 255, 0, 0], ["rosybrown", 188, 143, 143], ["royalblue", 65, 105, 225],
    ["saddlebrown", 139, 69, 19], ["salmon", 250, 128, 114], ["sandybrown", 244, 164, 96],
    ["seagreen", 46, 139, 87], ["seashell", 255, 245, 238], ["sienna", 160, 82, 45],
    ["silver", 192, 192, 192], ["skyblue", 135, 206, 235], ["slateblue", 106, 90, 205],
    ["slategray", 112, 128, 144], ["snow", 255, 250, 250], ["springgreen", 0, 255, 127],
    ["steelblue", 70, 130, 180], ["tan", 210, 180, 140], ["teal", 0, 128, 128],
    ["thistle", 216, 191, 216], ["tomato", 255, 99, 71], ["turquoise", 64, 224, 208],
    ["violet", 238, 130, 238], ["wheat", 245, 222, 179], ["white", 255, 255, 255],
    ["whitesmoke", 245, 245, 245], ["yellow", 255, 255, 0], ["yellowgreen", 154, 205, 50],
  ];
  const NAME_BY_RGB = {};
  NAMED.forEach((n) => { NAME_BY_RGB[n.join(",")] = n[0]; });

  function parseColor(str) {
    if (!str) return null;
    str = String(str).trim().toLowerCase();
    if (!str || str === "transparent") return null;
    if (str.startsWith("#")) return hexToRgb(str);
    let m = str.match(/^rgba?\(([^)]+)\)/);
    if (m) {
      const parts = m[1].split(/[,\s/]+/).filter(Boolean);
      if (parts.length >= 4 && parseFloat(parts[3]) === 0) return null;
      return [num(parts[0]), num(parts[1]), num(parts[2])];
    }
    m = str.match(/^hsla?\(([^)]+)\)/);
    if (m) {
      const parts = m[1].split(/[,\s%]+/).filter(Boolean);
      if (parts.length < 3) return null;
      return hslToRgb(parseFloat(parts[0]), parseFloat(parts[1]) / 100, parseFloat(parts[2]) / 100);
    }
    if (NAME_BY_RGB[str] || NAMED.some((n) => n[0] === str)) {
      const named = NAMED.find((n) => n[0] === str);
      return named ? named.slice(1) : null;
    }
    return null;
  }

  function num(x) {
    const v = parseFloat(x);
    return /%$/.test(x) ? Math.round((v / 100) * 255) : Math.round(v);
  }

  function hexToRgb(hex) {
    let h = hex.replace("#", "").trim();
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    if (!/^[0-9a-f]{6}$/.test(h)) return null;
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }

  function hslToRgb(h, s, l) {
    h = ((h % 360) + 360) % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }

  function rgbToHsl(rgb) {
    const r = rgb[0] / 255, g = rgb[1] / 255, b = rgb[2] / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
      else if (max === g) h = ((b - r) / d + 2) * 60;
      else h = ((r - g) / d + 4) * 60;
    }
    return { h, s, l };
  }

  function sameColor(a, b) {
    return !!a && !!b && a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }

  function luminance(rgb) {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2]);
  }

  function contrast(fg, bg) {
    const l1 = luminance(fg), l2 = luminance(bg);
    const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  function extractKeyframes(code) {
    const out = [];
    const re = /@keyframes\s+([a-zA-Z0-9_-]+)\s*\{/g;
    let m;
    while ((m = re.exec(code))) {
      let depth = 1, i = m.index + m[0].length;
      while (i < code.length && depth > 0) {
        if (code[i] === "{") depth++;
        else if (code[i] === "}") depth--;
        i++;
      }
      out.push({ name: m[1], body: code.slice(m.index + m[0].length, i - 1) });
    }
    return out;
  }

  function isDone(id) { try { return localStorage.getItem(LS_DONE + id) === "1"; } catch { return false; } }
  function setDone(id, v) { try { localStorage.setItem(LS_DONE + id, v ? "1" : "0"); } catch {} }
  function peeked(id) { try { return localStorage.getItem(LS_PEEK + id) === "1"; } catch { return false; } }
  function setPeeked(id) { try { localStorage.setItem(LS_PEEK + id, "1"); } catch {} }

  const checkers = {
    ["color-naming"]: async function ({ doc }) {
      const boxes = doc.querySelectorAll(".box");
      if (boxes.length < 5) return { ok: false, msg: "I found " + boxes.length + " of 5 boxes." };
      const used = new Set();
      for (const el of boxes) {
        const c = parseColor(cs(doc, el).backgroundColor);
        const name = c ? NAME_BY_RGB[c.join(",")] : null;
        if (!name) return { ok: false, msg: "Every box must use a named color as its background." };
        used.add(name);
      }
      if (used.size < 5) return { ok: false, msg: "Use 5 different named colors (you have " + used.size + ")." };
      return { ok: true, msg: "5 boxes, 5 distinct named colors." };
    },
    ["hex-hunt"]: async function ({ doc, code }) {
      const boxes = doc.querySelectorAll(".hex-box[data-target]");
      let matched = 0;
      for (const el of boxes) {
        const tgt = parseColor(el.getAttribute("data-target"));
        const cur = parseColor(cs(doc, el).backgroundColor);
        if (tgt && cur && sameColor(tgt, cur)) matched++;
      }
      if (matched === 10) return { ok: true, msg: "All 10 swatches match their targets." };
      return { ok: false, msg: matched + " of 10 targets matched. Use hex codes only." };
    },
    ["rgb-mixer"]: async function ({ doc }) {
      const el = doc.querySelector(".gradient");
      if (!el) return { ok: false, msg: "Add a .gradient element." };
      const bg = cs(doc, el).backgroundImage.toLowerCase();
      if (!bg.includes("linear-gradient")) return { ok: false, msg: ".gradient needs a linear-gradient." };
      const stops = bg.match(/rgba?\([^)]*\)/g) || [];
      const distinct = new Set(stops.map((s) => { const c = parseColor(s); return c ? c.join(",") : ""; }));
      if (stops.length < 2 || distinct.size < 2) return { ok: false, msg: "Use two different rgb() color stops." };
      return { ok: true, msg: "Linear gradient with " + distinct.size + " rgb() stops." };
    },
    ["color-palette"]: async function ({ doc }) {
      const els = doc.querySelectorAll(".swatch");
      if (els.length < 5) return { ok: false, msg: "I found " + els.length + " of 5 swatches." };
      const colors = [];
      for (const el of els) {
        const c = parseColor(cs(doc, el).backgroundColor);
        if (c) colors.push(c);
      }
      const uniq = new Set(colors.map((c) => c.join(",")));
      if (uniq.size < 5) return { ok: false, msg: "You need 5 distinct colors (you have " + uniq.size + ")." };
      let warm = 0;
      for (const c of colors) {
        const hsl = rgbToHsl(c);
        if (hsl.s > 0.25 && hsl.l > 0.08 && hsl.l < 0.92 && (hsl.h <= 55 || hsl.h >= 320)) warm++;
      }
      if (warm < 3) return { ok: false, msg: "A sunset palette needs warm hues (reds, oranges, pinks, purples): only " + warm + " warm swatches." };
      return { ok: true, msg: "5 distinct warm swatches — that reads as sunset." };
    },
    ["hsl-rainbow"]: async function ({ doc, code }) {
      const stripes = doc.querySelectorAll(".stripe");
      if (stripes.length < 7) return { ok: false, msg: "Need 7 .stripe elements (I see " + stripes.length + ")." };
      const used = (code.match(/hsl\s*\(/gi) || []).length;
      if (used < 7) return { ok: false, msg: "Use hsl() on every stripe (" + used + " hsl() found)." };
      const hues = new Set();
      const re = /hsl\s*\(\s*[\d.]+/gi;
      let match;
      while ((match = re.exec(code))) {
        hues.add(Math.round(parseFloat(match[0].replace(/[^\d.]/g, "")) % 360));
      }
      if (hues.size < 6) return { ok: false, msg: "Give the stripes different hues (" + hues.size + " distinct)." };
      return { ok: true, msg: "Rainbow with " + hues.size + " distinct hsl() hues." };
    },
    ["dark-mode"]: async function ({ doc, sleep }) {
      const btn = doc.getElementById("toggle");
      if (!btn) return { ok: false, msg: "Add a #toggle button." };
      const before = parseColor(cs(doc, doc.body).backgroundColor);
      btn.click();
      await sleep(80);
      const after = parseColor(cs(doc, doc.body).backgroundColor);
      if (before && after && !sameColor(before, after)) return { ok: true, msg: "The button switches the body background." };
      return { ok: false, msg: "Clicking the button did not change the page background." };
    },
    ["accessible-contrast"]: async function ({ doc }) {
      const secs = doc.querySelectorAll(".section");
      if (secs.length < 3) return { ok: false, msg: "Need 3 .section elements (I see " + secs.length + ")." };
      let pass = 0;
      for (const el of secs) {
        const fg = parseColor(cs(doc, el).color);
        const bg = parseColor(cs(doc, el).backgroundColor);
        if (fg && bg && contrast(fg, bg) >= 4.5) pass++;
      }
      if (pass === 3) return { ok: true, msg: "All 3 sections meet WCAG AA (4.5:1)." };
      return { ok: false, msg: pass + " of 3 sections reach WCAG AA contrast." };
    },
    ["color-theory-quiz"]: async function ({ doc }) {
      const qs = doc.querySelectorAll(".question");
      if (qs.length < 3) return { ok: false, msg: "Need 3 .question blocks (I see " + qs.length + ")." };
      for (const q of qs) {
        const correct = q.querySelector('[data-correct="true"]');
        if (!correct) return { ok: false, msg: "Every question needs a correct option (data-correct=\"true\")." };
        correct.click();
        if (!correct.classList.contains("correct")) {
          return { ok: false, msg: "Clicking the right option must add the 'correct' class to it." };
        }
      }
      return { ok: true, msg: "All 3 questions flag the right answer with the 'correct' class." };
    },
    ["palette-generator"]: async function ({ doc, sleep }) {
      const btn = doc.getElementById("generate");
      if (!btn) return { ok: false, msg: "Add a #generate button." };
      btn.click();
      await sleep(80);
      const root = cs(doc, doc.documentElement);
      const values = [1, 2, 3, 4, 5].map((i) => root.getPropertyValue("--c" + i).trim());
      const colors = values.map(parseColor);
      if (colors.some((c) => !c)) return { ok: false, msg: "Clicking the button must set --c1..--c5 to colors." };
      const hues = colors.map((c) => rgbToHsl(c).h);
      let widest = 0;
      for (let i = 0; i < hues.length; i++) {
        for (let j = i + 1; j < hues.length; j++) {
          const d = Math.abs(hues[i] - hues[j]);
          widest = Math.max(widest, Math.min(d, 360 - d));
        }
      }
      if (widest > 40) return { ok: false, msg: "Palette hues should stay harmonious (~40°): widest gap is " + Math.round(widest) + "°." };
      return { ok: true, msg: "5 harmonious colors generated into CSS variables." };
    },
    ["traffic-light"]: async function ({ doc, code }) {
      if (!doc.querySelector(".light")) return { ok: false, msg: "Add a .light element." };
      const kf = extractKeyframes(code);
      if (!kf.length) return { ok: false, msg: "Add a @keyframes block." };
      const colors = [];
      const re = /background\s*:\s*([^;}]+)/g;
      let m;
      while ((m = re.exec(kf[0].body))) {
        const c = parseColor(m[1].trim());
        if (c) colors.push(c);
      }
      const uniq = new Set(colors.map((c) => c.join(",")));
      if (uniq.size < 3) return { ok: false, msg: "Keyframes need at least 3 color stops (red, yellow, green)." };
      const first = colors[0], last = colors[colors.length - 1];
      if (!(first[0] > 150 && first[1] < 110 && first[2] < 110)) return { ok: false, msg: "The cycle should start red." };
      if (!(last[1] > 120 && last[0] < 110)) return { ok: false, msg: "The cycle should end green." };
      return { ok: true, msg: "CSS-only traffic light cycles red -> yellow -> green." };
    },
    ["mood-page"]: async function ({ doc, sleep }) {
      const ids = ["set-calm", "set-angry", "set-happy", "set-night"];
      const bgs = new Set();
      for (const id of ids) {
        const btn = doc.getElementById(id);
        if (!btn) return { ok: false, msg: "Add the #" + id + " button." };
        btn.click();
        await sleep(60);
        const bg = parseColor(cs(doc, doc.body).backgroundColor);
        if (bg) bgs.add(bg.join(","));
      }
      if (bgs.size >= 4) return { ok: true, msg: "All 4 moods switch the page background." };
      return { ok: false, msg: "The 4 moods should give 4 different backgrounds (" + bgs.size + " distinct)." };
    },
    ["colorblind-mode"]: async function ({ doc, sleep }) {
      const btn = doc.getElementById("toggle");
      const scene = doc.querySelector(".scene");
      if (!btn || !scene) return { ok: false, msg: "Add a #toggle button and a .scene." };
      const before = cs(doc, scene).filter;
      btn.click();
      await sleep(80);
      const after = cs(doc, scene).filter;
      if (after && after !== "none" && after !== before) return { ok: true, msg: "The toggle applies a color-blindness filter." };
      return { ok: false, msg: "Clicking #toggle must apply a filter (saturate / grayscale) to .scene." };
    },
  };

  function cs(doc, el) {
    return doc.defaultView.getComputedStyle(el);
  }

  function loadFrame(frame, code) {
    return new Promise((resolve) => {
      frame.srcdoc = "";
      requestAnimationFrame(() => {
        frame.srcdoc = code;
        setTimeout(resolve, 160);
      });
    });
  }

  async function load() {
    const res = await fetch("content/challenges.json");
    if (!res.ok) throw new Error("Could not load content/challenges.json");
    data = await res.json();
    flat.length = 0;
    data.levels.forEach((lv) => {
      lv.challenges.forEach((c) => flat.push(c));
    });
  }

  function homeSection() {
    if (!data) return "";
    const how = expandCard(
      "How to play",
      "Rules of the color challenges",
      `<ul>${data.howToPlay.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>`
    );
    return `${sectionTitle("CSS Color Challenges")}
      <div class="card-grid">${how}${data.levels.map(levelCard).join("")}</div>`;
  }

  function levelCard(lv) {
    const done = lv.challenges.filter((c) => isDone(c.id)).length;
    const pill = `<span class="pill ${done === lv.challenges.length ? "" : "soon"}">${done} of ${lv.challenges.length} done</span>`;
    const detail = `<div class="cha-list">${lv.challenges.map((c, i) => `
      <button class="lesson-link" data-cha="${lv.level}-${i}">
        <b>Day ${c.day} · ${esc(c.title)}</b>
        <span class="count">${isDone(c.id) ? "Solved" : "Try it"}</span>
      </button>`).join("")}</div>`;
    return expandCard(`${esc(lv.name)} (${esc(lv.days)})`, `${lv.challenges.length} challenges`, detail, pill);
  }

  function bindHome(root) {
    root.querySelectorAll("[data-cha]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const parts = btn.dataset.cha.split("-").map(Number);
        openChallenge(parts[0], parts[1]);
      });
    });
  }

  function openChallenge(levelNo, idxInLevel) {
    const lv = data.levels.find((l) => l.level === levelNo);
    if (!lv) return;
    const c = lv.challenges[idxInLevel];
    const global = flat.indexOf(c);
    if (global < 0) return;
    renderPlayer(global);
  }

  function renderPlayer(idx) {
    const c = flat[idx];
    const n = idx + 1;
    const total = flat.length;
    STATE.challenge = { index: idx, attempts: 0 };
    setPageName("Color Challenge " + n + " of " + total + " · " + c.title);
    view.innerHTML = `
      <div class="card">
        <div class="chal-head">
          <button class="primary" data-home>Home</button>
          <span class="progress">Day ${c.day} · Level ${c.level} · ${n} of ${total}</span>
        </div>
        <h2>${esc(c.title)}</h2>
        <p class="goal">${esc(c.goal)}</p>
        <label class="field-label" for="chal-code">Your code — a full HTML document</label>
        <textarea id="chal-code" class="code-editor" spellcheck="false" data-code>${esc(c.starter)}</textarea>
        ${peeked(c.id) ? `<p class="small">You peeked at the solution for this one — build it again in a fresh project.</p>` : ""}
        <div class="chal-buttons">
          <button class="primary" data-run>Run preview</button>
          <button class="primary" data-check>Check</button>
          <button class="linkish" data-peek>Peek solution</button>
        </div>
        <iframe class="preview-frame" sandbox="allow-scripts allow-same-origin" title="${esc(c.title)} preview" data-preview></iframe>
        <div data-feedback></div>
        <div class="chal-foot">
          ${idx > 0 ? `<button class="linkish" data-prev>← Previous (${esc(flat[idx - 1].title)})</button>` : ""}
          ${idx < total - 1 ? `<button class="linkish" data-next>Next (${esc(flat[idx + 1].title)}) →</button>` : ""}
        </div>
      </div>`;

    const frame = view.querySelector("[data-preview]");
    loadFrame(frame, c.starter);
    view.querySelector("[data-home]").addEventListener("click", renderHome);
    view.querySelector("[data-run]").addEventListener("click", () => {
      loadFrame(frame, view.querySelector("[data-code]").value);
    });
    view.querySelector("[data-check]").addEventListener("click", checkChallenge);
    view.querySelector("[data-peek]").addEventListener("click", peekSolution);
    const prev = view.querySelector("[data-prev]");
    if (prev) prev.addEventListener("click", () => renderPlayer(idx - 1));
    const next = view.querySelector("[data-next]");
    if (next) next.addEventListener("click", () => renderPlayer(idx + 1));
    scrollTop();
  }

  function currentCode() {
    const ta = view.querySelector("[data-code]");
    return ta ? ta.value : "";
  }

  function nextIndex() {
    return STATE.challenge.index + 1 < flat.length ? STATE.challenge.index + 1 : null;
  }

  async function checkChallenge() {
    if (STATE.busy) return;
    const btn = view.querySelector("[data-check]");
    const code = currentCode();
    if (!code.trim()) return;
    STATE.busy = true;
    btn.disabled = true;
    const frame = view.querySelector("[data-preview]");
    await loadFrame(frame, code);
    let res;
    const grader = checkers[flat[STATE.challenge.index].id];
    try {
      res = grader ? await grader({ doc: frame.contentDocument, code, win: frame.contentWindow, sleep }) : { ok: false, msg: "No checker for this challenge." };
    } catch (err) {
      res = { ok: false, msg: "The checker hit a problem: " + err.message };
    }
    STATE.challenge.attempts += 1;
    if (res.ok) {
      successFeedback(res.msg);
    } else if (STATE.challenge.attempts < 2) {
      hintFeedback(res.msg);
    } else {
      revealFeedback(res.msg);
    }
    STATE.busy = false;
    btn.disabled = false;
  }

  function successFeedback(msg) {
    const c = flat[STATE.challenge.index];
    setDone(c.id, true);
    const next = nextIndex();
    const btn = next != null
      ? `<button class="primary" data-next>Next challenge →</button>`
      : `<button class="primary" data-home>Back to home</button>`;
    const fb = view.querySelector("[data-feedback]");
    fb.innerHTML = `
      <div class="feedback ok"><span class="head">Solved! 🎨</span>
        <p>${esc(msg)}</p>
        <p class="small">Commit this to GitHub — it's part of your daily coding habit.</p>
        ${btn}
      </div>`;
    const nbtn = fb.querySelector("[data-next]");
    if (nbtn) nbtn.addEventListener("click", () => renderPlayer(next));
    if (!nbtn) fb.querySelector("[data-home]").addEventListener("click", renderHome);
    scrollTop();
  }

  function hintFeedback(msg) {
    const c = flat[STATE.challenge.index];
    const fb = view.querySelector("[data-feedback]");
    fb.innerHTML = `
      <div class="feedback wrong"><span class="head">Not yet</span>
        <p>${esc(msg)}</p>
        <p class="small"><b>Hint:</b> ${esc(c.hint)}</p>
        <button class="primary" data-retry>Try again</button>
      </div>`;
    fb.querySelector("[data-retry]").addEventListener("click", checkChallenge);
    scrollTop();
  }

  function revealFeedback(msg) {
    const c = flat[STATE.challenge.index];
    setPeeked(c.id);
    const next = nextIndex();
    const btn = next != null
      ? `<button class="primary" data-next>Next challenge →</button>`
      : `<button class="primary" data-home>Back to home</button>`;
    const fb = view.querySelector("[data-feedback]");
    fb.innerHTML = `
      <div class="feedback wrong"><span class="head">Here's the solution</span>
        <p>${esc(msg)}</p>
        <pre class="codeblock">${esc(c.solution)}</pre>
        <p class="small">Study it, then rebuild it from memory in a fresh project.</p>
        ${btn}
      </div>`;
    const nbtn = fb.querySelector("[data-next]");
    if (nbtn) nbtn.addEventListener("click", () => renderPlayer(next));
    if (!nbtn) fb.querySelector("[data-home]").addEventListener("click", renderHome);
    scrollTop();
  }

  function peekSolution() {
    const c = flat[STATE.challenge.index];
    setPeeked(c.id);
    const fb = view.querySelector("[data-feedback]");
    fb.innerHTML = `
      <div class="feedback wrong"><span class="head">Solution revealed</span>
        <pre class="codeblock">${esc(c.solution)}</pre>
        <p class="small">Now close it and rebuild the target yourself.</p>
      </div>`;
    scrollTop();
  }

  window.colorChallenges = { load, homeSection, bindHome };
})();