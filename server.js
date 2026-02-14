const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => res.send("Noor Assistant Server is running ✅"));
app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/chat", (req, res) => {
  const msg = (req.body?.message || "").trim();
  if (!msg) return res.json({ ok: true, reply: "اكتب سؤالك 😊" });

  // رد تجريبي (علشان نضمن الاتصال)
  return res.json({ ok: true, reply: "وصلني ✅: " + msg });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port:", PORT);
});
