const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// chat endpoint
app.post("/chat", (req, res) => {
  const msg = req.body.message;

  if (!msg) {
    return res.json({ reply: "ابعت رسالة الأول 😊" });
  }

  // ردود مؤقتة
  if (msg.includes("الصباح")) {
    return res.json({ reply: "اذكار الصباح: اللهم بك أصبحنا..." });
  }

  if (msg.includes("المساء")) {
    return res.json({ reply: "اذكار المساء: اللهم بك أمسينا..." });
  }

  if (msg.includes("اركان الاسلام")) {
    return res.json({
      reply:
        "أركان الإسلام هي: الشهادة، الصلاة، الزكاة، الصوم، الحج 🌙",
    });
  }

  return res.json({
    reply: "تمام ✅ السيرفر شغال بس لسه AI مش متوصل",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
