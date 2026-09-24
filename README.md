# Python Basics — learn by doing

<div align="center">

![QR Code](qr_code.svg)

**📱 Scan to try it on your phone!**

[🔗 Live Demo](https://nanapaknanapak-huemirit.github.io/beginner-python-tutor-web/)

</div>

An interactive web app for programming beginners. Read a concept, predict what
Python prints, write real Python, and get instant feedback — all in the browser
with real Python running in the page (Pyodide).

## Lessons

| # | Lesson | Covers |
|---|--------|--------|
| 1 | Variables | assignment, naming, reassignment, f-strings |
| 2 | Types | `int`, `float`, `str`, `bool`, `type()`, conversions |
| 3 | Operators | `/`, `//`, `%`, `**`, comparison, logical, string `+ *` |

## Exercise types

- **Multiple choice** — pick the right answer.
- **Predict the output** — type what the snippet prints; the real answer is
  computed by running the snippet in Python.
- **Write code** — run your own snippet against an expected output.

Feedback flow: hint on a wrong answer, one retry, then the explanation.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Content lives in `content/lessons.json`; the app itself is plain
HTML/CSS/JS — no build step, no backend.

## How the Python runs

The page loads Pyodide (Python compiled to WebAssembly) from jsDelivr on first
visit; afterwards it is cached by the browser. Python version: `pyodide
v314.0.7` (Python 3.14).