const STATE = {
  data: null,
  lesson: null,
  exerciseIndex: 0,
  attempts: 0,
  score: 0,
  missed: [],
  busy: false,
};

const view = document.getElementById("view");
const status = document.getElementById("status-banner");
const homeBtn = document.getElementById("btn-home");

homeBtn.addEventListener("click", renderHome);

function renderHome() {
  if (!STATE.data) return;
  view.innerHTML = `
    <div class="topic card">
      <h1>${esc(STATE.data.title)}</h1>
      <p class="subtitle">${esc(STATE.data.subtitle)}</p>
      <div class="lesson-list">
        ${STATE.data.lessons.map((lesson, i) => `
          <button class="lesson-link" data-open="${i}">
            <b>${i + 1}. ${esc(lesson.title)}</b>
            <span class="count">${lesson.concepts.length} concept cards · ${lesson.exercises.length} exercises</span>
          </button>`).join("")}
      </div>
    </div>`;
  view.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      STATE.lesson = STATE.data.lessons[Number(btn.dataset.open)];
      STATE.exerciseIndex = 0;
      STATE.score = 0;
      STATE.missed = [];
      renderLesson();
    });
  });
}

function renderLesson() {
  const lesson = STATE.lesson;
  view.innerHTML = `
    <div class="card">
      <button class="primary" data-home>Exit lesson</button>
      <h2>${esc(lesson.title)}</h2>
      ${lesson.concepts.map((c, i) => `
        <div class="concept">
          <h3>${i + 1}. ${esc(c.title)}</h3>
          <ul>${c.lines.map(displayLine).join("")}</ul>
        </div>`).join("")}
      <button class="primary" data-start>Start the exercises</button>
    </div>`;
  view.querySelector("[data-home]").addEventListener("click", renderHome);
  view.querySelector("[data-start]").addEventListener("click", () => {
    STATE.exerciseIndex = 0;
    renderExercise();
  });
}

function displayLine(line) {
  if (line.startsWith(">>>")) {
    return `<li><pre class="codeblock">${esc(line)}</pre></li>`;
  }
  return `<li>${esc(line)}</li>`;
}

function renderExercise() {
  const lesson = STATE.lesson;
  const exercises = lesson.exercises;
  if (STATE.exerciseIndex >= exercises.length) {
    renderSummary();
    return;
  }
  const ex = exercises[STATE.exerciseIndex];
  STATE.attempts = 0;
  STATE.busy = false;

  view.innerHTML = `
    <div class="card">
      <button class="primary" data-home>Exit lesson</button>
      <p class="progress">Exercise ${STATE.exerciseIndex + 1} of ${exercises.length} · Lesson ${esc(lesson.title)}</p>
      <p class="question">${esc(ex.question || ex.prompt)}</p>
      <div data-input></div>
      <div data-feedback></div>
    </div>`;

  view.querySelector("[data-home]").addEventListener("click", renderHome);
  const inputSlot = view.querySelector("[data-input]");
  const feedbackSlot = view.querySelector("[data-feedback]");

  if (ex.type === "predict") renderPredict(ex, inputSlot, feedbackSlot);
  else if (ex.type === "code") renderCode(ex, inputSlot, feedbackSlot);
  else renderMcq(ex, inputSlot, feedbackSlot);

  scrollTop();
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextButton() {
  return `<button class="primary" data-next>Next</button>`;
}

function attachNext(feedbackSlot) {
  const btn = feedbackSlot.querySelector("[data-next]");
  if (btn) btn.addEventListener("click", () => {
    STATE.exerciseIndex += 1;
    renderExercise();
  });
}

function correctFeedback(feedbackSlot, ex, outputLine) {
  if (STATE.attempts === 0) STATE.score += 1;
  const body = `${outputLine || ""}<p>${esc(ex.explanation)}</p>${nextButton()}`;
  feedbackSlot.innerHTML = `<div class="feedback ok"><span class="head">Correct!</span>${body}</div>`;
  attachNext(feedbackSlot);
  scrollTop();
}

function revealFeedback(feedbackSlot, ex, revealLines) {
  if (!STATE.missed.includes(ex)) STATE.missed.push(ex);
  const body = `${revealLines.join("")}<p>${esc(ex.explanation)}</p>${nextButton()}`;
  feedbackSlot.innerHTML = `<div class="feedback wrong"><span class="head">Not this time.</span>${body}</div>`;
  attachNext(feedbackSlot);
  scrollTop();
}

function retryFeedback(feedbackSlot, ex, onRetry) {
  const body = `<p><b>Hint:</b> ${esc(ex.hint)}</p>${onRetry ? `<button class="primary" data-retry>Try again</button>` : ""}`;
  feedbackSlot.innerHTML = `<div class="feedback wrong"><span class="head">Not quite yet.</span>${body}</div>`;
  if (onRetry) feedbackSlot.querySelector("[data-retry]").addEventListener("click", onRetry);
  scrollTop();
}

function renderMcq(ex, inputSlot, feedbackSlot) {
  inputSlot.innerHTML = `
    <div class="options">
      ${ex.options.map((opt, i) => `<button class="option" data-opt="${i}"><b>${String.fromCharCode(65 + i)}.</b> ${esc(opt)}</button>`).join("")}
    </div>`;
  const buttons = inputSlot.querySelectorAll("[data-opt]");
  buttons.forEach((btn) => btn.addEventListener("click", () => {
    if (STATE.busy) return;
    buttons.forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    if (gradeMcq(Number(btn.dataset.opt), ex.answer)) {
      correctFeedback(feedbackSlot, ex);
      STATE.busy = true;
    } else {
      STATE.attempts += 1;
      if (STATE.attempts === 1) {
        retryFeedback(feedbackSlot, ex, null);
      } else {
        revealFeedback(feedbackSlot, ex, [
          `<p class="small">Correct answer: <b>${String.fromCharCode(65 + ex.answer)}. ${esc(ex.options[ex.answer])}</b></p>`,
        ]);
        STATE.busy = true;
      }
    }
  }));
}

function renderPredict(ex, inputSlot, feedbackSlot) {
  inputSlot.innerHTML = `
    <p class="progress">What does this program print?</p>
    <pre class="codeblock">${esc(ex.snippet)}</pre>
    <input type="text" placeholder="Type your prediction" data-answer />
    <button class="primary" data-check>Check</button>`;
  const input = inputSlot.querySelector("[data-answer]");
  const check = inputSlot.querySelector("[data-check]");
  check.disabled = !pyodide;
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") check.click(); });

  async function checkOnce() {
    if (STATE.busy) return;
    const value = input.value.trim();
    if (!value) { input.focus(); return; }
    STATE.busy = true;
    check.disabled = true;
    const expected = await computeExpected(ex.snippet);
    STATE.attempts += 1;
    if (judgeOutput(value, expected)) {
      correctFeedback(feedbackSlot, ex, `<p class="small">It printed: <code>${esc(normalize(expected))}</code></p>`);
    } else if (STATE.attempts === 1) {
      STATE.busy = false;
      check.disabled = !pyodide;
      retryFeedback(feedbackSlot, ex, checkOnce);
    } else {
      revealFeedback(feedbackSlot, ex, [
        `<p class="small">It printed: <code>${esc(normalize(expected))}</code></p>`,
      ]);
    }
  }
  check.addEventListener("click", checkOnce);
}

function renderCode(ex, inputSlot, feedbackSlot) {
  inputSlot.innerHTML = `
    <textarea spellcheck="false" data-code placeholder="# write your Python here"></textarea>
    <button class="primary" data-run>Run &amp; check</button>`;
  const textarea = inputSlot.querySelector("[data-code]");
  const run = inputSlot.querySelector("[data-run]");
  run.disabled = !pyodide;

  async function runOnce() {
    if (STATE.busy) return;
    STATE.busy = true;
    run.disabled = true;
    const result = await runPythonWithCapture(textarea.value);
    STATE.attempts += 1;
    if (!result.ok) {
      if (STATE.attempts === 1) {
        STATE.busy = false;
        run.disabled = !pyodide;
        retryFeedback(feedbackSlot, ex, runOnce);
      } else {
        revealFeedback(feedbackSlot, ex, [
          `<p class="small">Your code raised an error:<pre class="codeblock">${esc(cleanError(result.error))}</pre></p>`,
          `<p class="small">Expected output: <code>${esc(normalize(ex.expected))}</code></p>`,
        ]);
      }
    } else if (judgeOutput(result.output, ex.expected)) {
      correctFeedback(feedbackSlot, ex, `<p class="small">Your output: <code>${esc(normalize(result.output))}</code></p>`);
    } else {
      if (STATE.attempts === 1) {
        STATE.busy = false;
        run.disabled = !pyodide;
        retryFeedback(feedbackSlot, ex, runOnce);
      } else {
        revealFeedback(feedbackSlot, ex, [
          `<p class="small">Your output: <code>${esc(normalize(result.output))}</code></p>`,
          `<p class="small">Expected output: <code>${esc(normalize(ex.expected))}</code></p>`,
        ]);
      }
    }
  }
  run.addEventListener("click", runOnce);
}

function renderSummary() {
  const lesson = STATE.lesson;
  const total = lesson.exercises.length;
  view.innerHTML = `
    <div class="card">
      <button class="primary" data-home>Back to topics</button>
      <h2>${esc(lesson.title)} — summary</h2>
      <div class="scoreboard">
        <span class="score-chip">First-try correct: <b>${STATE.score}</b> / ${total}</span>
        <span class="score-chip">Missed: <b>${STATE.missed.length}</b></span>
      </div>
      ${STATE.missed.length
        ? `<h3>Review what you missed</h3>${STATE.missed.map(missedHtml).join("")}`
        : `<p>All exercises correct on the first try. Well done!</p>`}
      <button class="primary" data-again>Try again</button>
    </div>`;
  view.querySelector("[data-home]").addEventListener("click", renderHome);
  view.querySelector("[data-again]").addEventListener("click", () => {
    STATE.exerciseIndex = 0;
    STATE.score = 0;
    STATE.missed = [];
    renderExercise();
  });
}

function missedHtml(ex) {
  return `
    <div class="missed">
      <p class="q">${esc(ex.question || ex.prompt)}</p>
      ${ex.type === "mcq"
        ? `<p class="small">Correct answer: <b>${String.fromCharCode(65 + ex.answer)}. ${esc(ex.options[ex.answer])}</b></p>`
        : ""}
      ${ex.type === "predict" ? `<pre class="codeblock">${esc(ex.snippet)}</pre>` : ""}
      ${ex.type === "code" ? `<p class="small">Expected output: <code>${esc(normalize(ex.expected))}</code></p>` : ""}
      <p class="small">${esc(ex.explanation)}</p>
    </div>`;
}

function initStatus() {
  status.hidden = false;
  status.textContent = "Loading Python… the first time takes a few seconds.";
  pyodideReady.then(() => {
    status.textContent = "Python is ready.";
    setTimeout(() => { status.hidden = true; }, 1500);
  }).catch(() => {
    status.textContent = "Python failed to load. Check your connection and refresh.";
  });
}

async function init() {
  initStatus();
  try {
    const res = await fetch("content/lessons.json");
    if (!res.ok) throw new Error("Could not load content/lessons.json");
    STATE.data = await res.json();
    renderHome();
  } catch (err) {
    view.innerHTML = `<div class="card"><h2>Could not load the lessons</h2><p>${esc(err.message)}</p></div>`;
  }
}

init();