#!/usr/bin/env python3
"""Buduje 30-projekt/teraz.html z teraz.md (źródło prawdy). Uruchom po każdej zmianie teraz.md."""
import json
import pathlib

tu = pathlib.Path(__file__).resolve().parent
md = (tu / "teraz.md").read_text(encoding="utf-8")

strona = f"""<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dynia: teraz</title>
<style>
  :root {{ --tlo: #ffffff; --tekst: #1d1d1f; --linia: #d0d0d0; --kod: #f4f4f4; }}
  @media (prefers-color-scheme: dark) {{
    :root {{ --tlo: #1b1b1d; --tekst: #e8e8e8; --linia: #444; --kod: #2a2a2d; }}
  }}
  body {{ background: var(--tlo); color: var(--tekst); font: 16px/1.5 system-ui, sans-serif;
         max-width: 960px; margin: 0 auto; padding: 16px; }}
  h1, h2 {{ border-bottom: 1px solid var(--linia); padding-bottom: 4px; }}
  code {{ background: var(--kod); padding: 1px 4px; border-radius: 3px; }}
  ul {{ padding-left: 1.2em; }}
  li:has(> input[type=checkbox]) {{ list-style: none; margin-left: -1.2em; }}
  .mermaid {{ background: #ffffff; border-radius: 8px; padding: 8px; overflow-x: auto; }}
</style>
</head>
<body>
<div id="tresc"></div>
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js"></script>
<script>
  const zrodlo = {json.dumps(md, ensure_ascii=False).replace("</", "<\\/")};
  document.getElementById("tresc").innerHTML = marked.parse(zrodlo);
  document.querySelectorAll("code.language-mermaid").forEach(k => {{
    const d = document.createElement("div");
    d.className = "mermaid";
    d.textContent = k.textContent;
    k.parentElement.replaceWith(d);
  }});
  mermaid.initialize({{ startOnLoad: false, theme: "default" }});
  mermaid.run();
</script>
</body>
</html>
"""
(tu / "teraz.html").write_text(strona, encoding="utf-8")
print("zapisano", tu / "teraz.html")
