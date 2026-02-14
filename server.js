const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.status(200).send("OK"));
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

app.post("/chat", (req, res) => {
  const msg = (req.body?.message || "").trim();
  return res.status(200).json({ ok: true, reply: "تم ✅ " + msg });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => console.log("Server running on port:", PORT));
