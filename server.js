const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Noor Assistant Server is running ✅");
});

// API للذكاء
app.post("/chat", (req, res) => {
  const message = req.body.message;

  let reply = "";

  if (message.includes("الصلاة")) {
    reply = "الصلاة فرض وهي عمود الدين ❤️";
  } else if (message.includes("الوضوء")) {
    reply = "الوضوء يكون بغسل اليدين ثم المضمضة...";
  } else {
    reply = "اسألني أي سؤال ديني وأنا أساعدك 😊";
  }

  res.json({ reply });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
