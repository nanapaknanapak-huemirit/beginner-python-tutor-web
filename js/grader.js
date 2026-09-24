function normalize(text) {
  return String(text).replace(/\s+/g, " ").trim();
}

function esc(html) {
  return String(html)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function runPythonWithCapture(code) {
  await pyodideReady;
  const wrapped =
    "import io\nimport sys\nimport contextlib\n" +
    "_code = " + JSON.stringify(code) + "\n" +
    "_buf = io.StringIO()\n" +
    "with contextlib.redirect_stdout(_buf):\n" +
    "    exec(_code, {\"__builtins__\": __builtins__})\n" +
    "_RESULT = _buf.getvalue()\n";
  try {
    pyodide.runPython(wrapped);
    const result = pyodide.globals.get("_RESULT");
    const output = String(result);
    pyodide.globals.delete("_RESULT");
    return { ok: true, output: output };
  } catch (err) {
    const message = (err && err.message) ? err.message : String(err);
    return { ok: false, error: message };
  }
}

async function computeExpected(snippet) {
  const result = await runPythonWithCapture(snippet);
  if (!result.ok) {
    throw new Error("Built-in snippet failed to run: " + result.error);
  }
  return normalize(result.output);
}

function gradeMcq(selected, answer) {
  return selected === answer;
}

function judgeOutput(actual, expected) {
  return normalize(actual) === normalize(expected);
}

function cleanError(message) {
  let text = String(message).split("\n").slice(-2).join("\n").trim();
  text = text.replace(/^Traceback[\s\S]*?Error/, "Python error");
  return text;
}