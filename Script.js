(() => {
  const exprEl = document.getElementById("expr");
  const outEl = document.getElementById("out");
  let expr = "";

  const buttons = document.querySelectorAll("button");
  buttons.forEach((b) => b.addEventListener("click", onClick));

  function onClick(e) {
    const b = e.currentTarget;
    if (b.dataset.action === "clear") {
      expr = "";
      update();
      return;
    }
    if (b.dataset.action === "back") {
      expr = expr.slice(0, -1);
      update();
      return;
    }
    if (b.dataset.action === "equals") {
      calculate();
      return;
    }
    const v = b.dataset.value || "";
    append(v);
  }

  function append(s) {
    // normalize display-friendly operator symbols to JS operators
    if (s === "×") s = "*";
    if (s === "÷") s = "/";
    if (s === "−") s = "-";
    expr += s;
    update();
  }

  function update() {
    exprEl.textContent = expr || "0";
    outEl.textContent = expr || "0";
  }

  function calculate() {
    if (!expr) return;
    // allow only digits, operators, dot, parentheses, percent, spaces
    if (!/^[0-9+\-*/().% \t]+$/.test(expr)) {
      outEl.textContent = "Error";
      return;
    }
    try {
      // Evaluate percent as modulo (%) which JS supports.
      // Replace consecutive Unicode operator symbols if present
      const sanitized = expr
        .replace(/÷/g, "/")
        .replace(/×/g, "*")
        .replace(/−/g, "-");
      // Use Function to evaluate expression safely after validation
      const result = Function('"use strict"; return (' + sanitized + ")")();
      outEl.textContent = String(Number.isFinite(result) ? result : "Error");
      expr = String(outEl.textContent === "Error" ? "" : outEl.textContent);
    } catch (_) {
      outEl.textContent = "Error";
    }
  }

  // Keyboard support
  window.addEventListener("keydown", (e) => {
    if (e.key >= "0" && e.key <= "9") {
      append(e.key);
      e.preventDefault();
      return;
    }
    if (["+", "-", "*", "/", "(", ")", ".", "%"].includes(e.key)) {
      append(e.key);
      e.preventDefault();
      return;
    }
    if (e.key === "Enter" || e.key === "=") {
      calculate();
      e.preventDefault();
      return;
    }
    if (e.key === "Backspace") {
      expr = expr.slice(0, -1);
      update();
      e.preventDefault();
      return;
    }
    if (e.key.toLowerCase() === "c") {
      expr = "";
      update();
      e.preventDefault();
      return;
    }
  });

  update();
})();
