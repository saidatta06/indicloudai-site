/* Antahpragna "Why was this flagged?" widget.
   Usage:  AntahpragnaExplain.show(containerElement, "https://YOUR-API", messageText, { lang: "en" });
   Needs POST /v1/explain on the API. Message text is only ever inserted with textContent (never as HTML). */
(function () {
  "use strict";
  var CSS = [
    ".aex{--aex-teal:#0f9d8a;--aex-saf:#f59e0b;--aex-bg:rgba(15,157,138,.07);--aex-line:rgba(120,130,140,.28);font:15px/1.55 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:inherit}",
    ".aex h3{margin:0 0 .5rem;font-size:1rem}",
    ".aex-msg{padding:.9rem 1rem;border:1px solid var(--aex-line);border-radius:14px;background:var(--aex-bg);white-space:pre-wrap;word-break:break-word}",
    ".aex-seg-trigger{background:rgba(245,158,11,.38);border-radius:4px;box-shadow:0 0 0 2px rgba(245,158,11,.38)}",
    ".aex-seg-contributes{background:rgba(245,158,11,.16);border-radius:4px;box-shadow:0 0 0 2px rgba(245,158,11,.16)}",
    ".aex-sig{border-bottom:2px solid var(--aex-teal);font-weight:600}",
    ".aex-sig-link_imitates{border-bottom-color:#d93025}",
    ".aex-legend,.aex-note{margin:.6rem 0 0;opacity:.78;font-size:.85rem}",
    ".aex-legend i{display:inline-block;width:.9em;height:.9em;border-radius:3px;vertical-align:-.1em;margin-right:.3em}",
    ".aex-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin:.8rem 0 0;padding:0;list-style:none}",
    ".aex-chips li{padding:.2rem .65rem;border:1px solid var(--aex-teal);border-radius:999px;font-size:.85rem}",
    ".aex-list{margin:.9rem 0 0;padding:0;list-style:none;display:grid;gap:.55rem}",
    ".aex-list li{padding:.6rem .8rem;border:1px solid var(--aex-line);border-radius:12px}",
    ".aex-list b{display:block;font-size:.8rem;opacity:.78;font-weight:600;margin-bottom:.15rem}",
    ".aex-list .t{opacity:1;color:var(--aex-saf)}",
    ".aex-bar{height:6px;border-radius:3px;background:var(--aex-line);margin-top:.4rem;overflow:hidden}",
    ".aex-bar span{display:block;height:100%;background:var(--aex-saf)}",
    ".aex-err{padding:.7rem .9rem;border:1px solid #d93025;border-radius:12px}"
  ].join("\n");

  var TXT = {
    en: { title: "Why this result", main: "Main trigger", adds: "Adds to the risk", fine: "Not a concern", working: "Working out why\u2026",
          legend: "Underlined words are warning signs; hover or tap one to see why.", quiet: "The model sees almost no scam signal in this message as a whole, so nothing is highlighted as a trigger.",
          guardTx: "This looks like a normal bank transaction alert with no links, phone numbers or pressure, so nothing is flagged.", guardAdv: "This is a safety reminder with no links, phone numbers or demands, so nothing is flagged.",
          partial: "The message was long, so only the first sentences were examined.", disclaimer: "This explains the model\u2019s score; it is not proof. When in doubt, check with the sender through a number you already trust.",
          drop: function (n) { return "Without this sentence the scam score falls by " + n + " points."; }, alone: function (n) { return "On its own this sentence scores " + n + "% scam-like."; },
          limit: "Too many requests. Please wait a moment.", fail: "The demo server could not explain this message.", nf: "The highlighting feature is not available on this server version yet.",
          down: "Could not reach the demo server. If it was asleep, wait a minute and try again." },
    hi: { title: "यह नतीजा क्यों", main: "मुख्य कारण", adds: "जोखिम बढ़ाता है", fine: "चिंता की बात नहीं", working: "कारण खोजे जा रहे हैं\u2026",
          legend: "रेखांकित शब्द चेतावनी के संकेत हैं; कारण देखने के लिए उन पर टैप करें।", quiet: "मॉडल को इस संदेश में कुल मिलाकर लगभग कोई धोखे का संकेत नहीं दिखता, इसलिए कुछ भी मुख्य कारण के रूप में चिह्नित नहीं है।",
          guardTx: "यह एक सामान्य बैंक लेनदेन संदेश जैसा दिखता है, जिसमें कोई लिंक, फ़ोन नंबर या दबाव नहीं है, इसलिए कुछ भी चिह्नित नहीं किया गया।", guardAdv: "यह धोखाधड़ी से बचाव की सलाह जैसा संदेश है, जिसमें कोई लिंक, फ़ोन नंबर या माँग नहीं है, इसलिए कुछ भी चिह्नित नहीं किया गया।",
          partial: "संदेश लंबा था, इसलिए केवल शुरुआती वाक्यों की जाँच की गई।", disclaimer: "यह मॉडल के स्कोर की व्याख्या है, कोई प्रमाण नहीं। संदेह होने पर भेजने वाले से किसी ऐसे नंबर पर पुष्टि करें जिस पर आप पहले से भरोसा करते हैं।",
          drop: function (n) { return "इस वाक्य के बिना धोखे का स्कोर " + n + " अंक घट जाता है।"; }, alone: function (n) { return "अकेले यह वाक्य " + n + "% धोखे जैसा दिखता है।"; },
          limit: "बहुत ज़्यादा अनुरोध। कृपया थोड़ा रुकें।", fail: "सर्वर इस संदेश की व्याख्या नहीं कर सका।", nf: "हाइलाइट की सुविधा इस सर्वर संस्करण में अभी उपलब्ध नहीं है।",
          down: "सर्वर तक नहीं पहुँच सके। अगर वह सो रहा था तो एक मिनट बाद फिर कोशिश करें।" }
  };
  function T(opts) { return TXT[(opts && opts.lang) === "hi" ? "hi" : "en"]; }

  function injectCss() {
    if (document.getElementById("aex-css")) return;
    var s = document.createElement("style"); s.id = "aex-css"; s.textContent = CSS; document.head.appendChild(s);
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e;
  }
  function pct(x) { return Math.round(Math.max(0, Math.min(1, x)) * 100); }

  function highlighted(text, data) {
    var box = el("div", "aex-msg");
    var cuts = [0, text.length];
    function addCuts(arr) { arr.forEach(function (x) { cuts.push(Math.max(0, Math.min(text.length, x.start)), Math.max(0, Math.min(text.length, x.end))); }); }
    addCuts(data.segments); addCuts(data.spans);
    cuts = cuts.filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(function (a, b) { return a - b; });
    for (var i = 0; i < cuts.length - 1; i++) {
      var a = cuts[i], b = cuts[i + 1]; if (b <= a) continue;
      var role = "neutral", kinds = [], whys = [];
      data.segments.forEach(function (s) { if (s.start <= a && s.end >= b) role = s.role; });
      data.spans.forEach(function (s) { if (s.start <= a && s.end >= b) { kinds.push(s.kind); if (whys.indexOf(s.why) < 0) whys.push(s.why); } });
      var cls = role === "trigger" ? "aex-seg-trigger" : role === "contributes" ? "aex-seg-contributes" : "";
      if (kinds.length) cls += " aex-sig" + (kinds.indexOf("link_imitates") >= 0 ? " aex-sig-link_imitates" : "");
      var part = text.slice(a, b);
      if (!cls.trim()) { box.appendChild(document.createTextNode(part)); continue; }
      var sp = el("span", cls.trim(), part); if (whys.length) sp.title = whys.join("; "); box.appendChild(sp);
    }
    return box;
  }

  function render(container, text, data, opts) {
    injectCss(); container.textContent = ""; var t = T(opts);
    var root = el("div", "aex"); if (!(opts && opts.hideTitle)) root.appendChild(el("h3", "", t.title));
    root.appendChild(highlighted(text, data));
    var lg = el("p", "aex-legend");
    [["rgba(245,158,11,.38)", t.main], ["rgba(245,158,11,.16)", t.adds]].forEach(function (x) {
      var i = el("i"); i.style.background = x[0]; lg.appendChild(i); lg.appendChild(document.createTextNode(x[1] + "  \u00a0 "));
    });
    lg.appendChild(document.createTextNode(t.legend));
    root.appendChild(lg);
    if (data.guard) root.appendChild(el("p", "aex-note", data.guard === "transaction_alert" ? t.guardTx : t.guardAdv));
    else if (data.quiet) root.appendChild(el("p", "aex-note", t.quiet));
    var seen = {}, chips = el("ul", "aex-chips");
    data.spans.forEach(function (s) { if (!seen[s.why]) { seen[s.why] = 1; chips.appendChild(el("li", "", s.why.charAt(0).toUpperCase() + s.why.slice(1))); } });
    if (chips.children.length) root.appendChild(chips);
    if (data.segments.length > 1) {
      var list = el("ul", "aex-list");
      data.segments.slice().sort(function (a, b) { return b.drop - a.drop || b.alone - a.alone; }).forEach(function (s) {
        var li = el("li"), label = s.role === "trigger" ? t.main : s.role === "contributes" ? t.adds : t.fine;
        li.appendChild(el("b", s.role === "trigger" ? "t" : "", label));
        var shown = s.text.length > 140 ? s.text.slice(0, 137) + "\u2026" : s.text;
        li.appendChild(el("div", "", "\u201c" + shown + "\u201d"));
        li.appendChild(el("div", "aex-note", s.drop >= 0.05 ? t.drop(pct(s.drop)) : t.alone(pct(s.alone))));
        var bar = el("div", "aex-bar"), fill = el("span"); fill.style.width = pct(Math.max(s.drop, 0)) + "%"; bar.appendChild(fill); li.appendChild(bar);
        list.appendChild(li);
      });
      root.appendChild(list);
    }
    if (data.partial) root.appendChild(el("p", "aex-note", t.partial));
    root.appendChild(el("p", "aex-note", t.disclaimer));
    container.appendChild(root);
  }

  function show(container, apiBase, text, opts) {
    injectCss(); container.textContent = ""; var t = T(opts);
    var wait = el("p", "aex-note", t.working); container.appendChild(wait);
    return fetch(apiBase.replace(/\/+$/, "") + "/v1/explain", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, lang: (opts && opts.lang) || "en" })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var err = new Error(j.message && opts && opts.lang === "hi" ? t.fail : (j.message || (r.status === 429 ? t.limit : r.status === 404 ? t.nf : t.fail))); if (r.status === 429) err.message = t.limit; if (r.status === 404) err.message = t.nf; err.aex = true; throw err; }
        return j;
      });
    }).then(function (data) { render(container, text, data, opts); return data; })
      .catch(function (e) { container.textContent = ""; container.appendChild(el("div", "aex-err", e && e.aex ? e.message : t.down)); });
  }

  window.AntahpragnaExplain = { show: show, render: render };
})();
