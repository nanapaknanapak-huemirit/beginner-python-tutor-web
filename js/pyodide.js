const PYODIDE_VERSION = "314.0.7";
const PYODIDE_INDEX = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

let pyodide = null;
const pyodideReady = loadPyodide({ indexURL: PYODIDE_INDEX })
  .then((instance) => {
    pyodide = instance;
    return pyodide;
  })
  .catch((err) => {
    console.error("Pyodide failed to load:", err);
    throw err;
  });