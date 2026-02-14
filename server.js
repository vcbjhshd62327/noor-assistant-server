import express from "express";
import cors from "cors";

const app = express();
app.use(cors()); // لو هتحطه على دومينك غيّرها ل cors محدد
app.use(express.json({ limit: "1mb" }));

// ✅ حط مفتاحك في ENV:  OPENAI_API_KEY
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ✅ اختار موديل (خليه زي ما هو لو مش عارف)
const MODEL = process.env.OPENAI_MODEL || "gpt-4.1-mini"; // مثال شائع

if (!OPENAI_API_KEY) {
  console.error("Missing OPENAI_API_KEY env var");
}

app.get("/", (_, res) => res.send("OK"));

app.post("/api/ask", async (req, res) => {
  try {
    const { user_message, history, prefs } = req.body || {};
    if (!user_message || typeof user_message !== "string") {
      return res.status(400).json({ error: "user_message is required" });
    }

    const shortFirst = !!prefs?.short_first;
    const cite = !!prefs?.cite_sources;

    // System rules: مساعد إسلامي عام (بدون فتاوى قطعية/تحريض/خطر)
    const system = `
أنت مساعد إسلامي ذكي باللغة العربية.
- ابدأ بإجابة قصيرة جدًا (سطرين) ثم "تفصيل:" إذا كان المستخدم يريد.
- في الفقه: قدّم رأيًا عامًا مع ذكر "خلاف مشهور" إن وُجد، ولا تجزم بفتوى شخصية، واذكر أن الأفضل سؤال عالم موثوق.
- حاول ذكر مصادر عامة (آية/حديث/كتاب) بدون ادعاء أرقام إذا لم تكن متأكدًا.
- امتنع عن أي محتوى متطرف/تحريض/كراهية. 
- إذا كان السؤال طبي/قانوني/خطير: انصح بمختص.
${cite ? "- لو تقدر: اذكر مراجع مختصرة (مثال: البقرة:255) أو (رواه البخاري/مسلم) عندما تكون متأكدًا." : ""}
`.trim();

    const messages = [
      { role: "system", content: system },
      ...(Array.isArray(history) ? history : []).slice(-12).map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: String(m.content || "").slice(0, 2000),
      })),
      { role: "user", content: user_message }
    ];

    const prompt = shortFirst
      ? `أجب باختصار أولًا ثم ضع عنوان "تفصيل:" وأكمل.`
      : `أجب بشكل واضح ومباشر.`;

    const payload = {
      model: MODEL,
      input: [
        ...messages.map(m => ({ role: m.role, content: [{ type: "text", text: m.content }] })),
        { role: "user", content: [{ type: "text", text: prompt }] }
      ],
      // مخرجات نصية
      text: { format: { type: "text" } }
    };

    const apiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!apiRes.ok) {
      const err = await apiRes.text().catch(() => "");
      return res.status(500).json({ error: "OpenAI error", detail: err });
    }

    const data = await apiRes.json();

    // استخراج النص (ممكن يختلف حسب شكل الاستجابة)
    let answer = "";
    if (data.output_text) answer = data.output_text;
    else if (Array.isArray(data.output)) {
      // fallback: اجمع النصوص
      for (const item of data.output) {
        if (item?.content) {
          for (const c of item.content) {
            if (c?.type === "output_text" && c?.text) answer += c.text;
          }
        }
      }
    }

    answer = (answer || "").trim() || "لم أستطع توليد إجابة الآن.";
    return res.json({ answer });

  } catch (e) {
    return res.status(500).json({ error: "server_error", detail: String(e?.message || e) });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port", port));
