import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Noor Assistant Server is running ✅");
});

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Chat AI
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!process.env.OPENAI_API_KEY) {
    return res.json({
      ok: false,
      reply: "❌ حط OPENAI_API_KEY في Railway"
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `أنت مساعد إسلامي ذكي. أجب بشكل صحيح وبسيط:\n\n${userMessage}`
      })
    });

    const data = await response.json();

    const reply =
      data.output?.[0]?.content?.[0]?.text ||
      "❌ حصل خطأ في الرد";

    res.json({ ok: true, reply });

  } catch (err) {
    res.json({
      ok: false,
      reply: "❌ خطأ في السيرفر"
    });
  }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running 🚀"));
