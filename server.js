// Запуск: GEMINI_API_KEY=ваш_ключ node server.js   (Node 18+, без зависимостей)
const http = require("http"), fs = require("fs"), path = require("path");
const KEY = process.env.GEMINI_API_KEY, PORT = process.env.PORT || 3000, MODEL = "lyria-3.5";
const mask = k => (k ? k.slice(0, 4) + "••••••••" + k.slice(-4) : null);
const hits = new Map();
function limited(ip) {
  const now = Date.now(), a = (hits.get(ip) || []).filter(t => now - t < 60000);
  a.push(now); hits.set(ip, a);
  return a.length > 6; // не больше 6 генераций в минуту с одного адреса
}
function send(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}
http.createServer(async (req, res) => {
  if (req.method === "GET" && (req.url === "/" || req.url === "/index.html")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(fs.readFileSync(path.join(__dirname, "dj-tenigin.html")));
  }
  if (req.method === "GET" && req.url === "/api/status") {
    return send(res, 200, {
      configured: !!KEY,
      maskedKey: mask(KEY),
      message: KEY ? "API-ключ Gemini настроен и доступен на сервере." : "Ключ не найден. Задайте GEMINI_API_KEY.",
      source: "process.env.GEMINI_API_KEY"
    });
  }
  if (req.method === "POST" && req.url === "/api/generate") {
    if (!KEY) return send(res, 500, { error: { message: "На сервере не задан GEMINI_API_KEY." } });
    if (limited(req.socket.remoteAddress)) return send(res, 429, { error: { message: "Слишком много запросов. Подождите минуту." } });
    let raw = "";
    for await (const ch of req) { raw += ch; if (raw.length > 20000) return send(res, 413, { error: { message: "Слишком большой запрос." } }); }
    let body; try { body = JSON.parse(raw); } catch { return send(res, 400, { error: { message: "Некорректный JSON." } }); }
    const payload = { contents: body.contents, generationConfig: { responseModalities: ["AUDIO", "TEXT"] } };
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
        body: JSON.stringify(payload)
      });
      res.writeHead(r.status, { "Content-Type": "application/json; charset=utf-8" });
      return res.end(await r.text());
    } catch { return send(res, 502, { error: { message: "Не удалось связаться с Google." } }); }
  }
  send(res, 404, { error: { message: "Не найдено" } });
}).listen(PORT, () => console.log("Сайт: http://localhost:" + PORT));
