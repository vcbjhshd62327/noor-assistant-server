const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

// Home
app.get("/", (req, res) => {
  res.status(200).send("Noor Assistant Server is running ✅");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "noor-assistant-server" });
});

// Chat endpoint
app.post("/chat", (req, res) => {
  const message = (req.body?.message || "").toString().trim();
  if (!message) return res.status(400).json({ error: "message is required" });

  const lower = message.toLowerCase();
  let reply = "تمام ✅ ابعت سؤالك بالتفصيل.";

  if (lower.includes("سلام")) reply = "وعليكم السلام ورحمة الله وبركاته ❤️";
  else if (lower.includes("صلاة") || lower.includes("مواقيت"))
    reply = "عايز مواقيت الصلاة لمدينة إيه؟";
  else if (lower.includes("قرآن") || lower.includes("quran"))
    reply = "تحب تفتح سورة/آية معينة ولا تعمل بحث؟";

  res.json({ reply });
});

// Railway PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port:", PORT));
