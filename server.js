import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.send("Noor Assistant Server is running ✅");
});

// ✅ Health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// ✅ Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const message = (req.body?.message || "").toString().trim();
    if (!message) return res.status(400).json({ ok: false, error: "message is required" });

    // مؤقتًا (لحد ما تحط API KEY) — يرد رد ثابت
    // شيل الجزء ده لما تضيف المفتاح
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        ok: true,
        reply: "✅ السيرفر شغال. ضيف OPENAI_API_KEY في Railway علشان يجاوب بذكاء.",
      });
    }

    // لو هتشغله بـ OpenAI
    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `أنت Noor Assistant (مساعد إسلامي). جاوب بإيجاز وبأدب.\nسؤال المستخدم: ${message}`,
      }),
    });

    const data = await r.json();
    const reply = data.output_text || "تم ✅";

    return res.json({ ok: true, reply });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || "server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on", PORT));
