const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "https://inpurrnest.github.io",
  methods: ["GET", "POST"]
}));

const TOKEN = process.env.BLYNK_TOKEN;

if (!TOKEN) {
  console.error("BLYNK_TOKEN is missing!");
  process.exit(1);
}

// ROOT CHECK
app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/api/data", async (req, res) => {
  try {
    const urls = ["V0","V1","V2","V3","V4","V5","V6","V10"]
      .map(v => `https://blynk.cloud/external/api/get?token=${TOKEN}&${v}`);

    const values = await Promise.all(
      urls.map(u => fetch(u).then(r => r.text()).catch(() => "0"))
    );

    res.json({
      room1: { temp: values[0], water: values[1], food: values[2] },
      room2: { temp: values[3], water: values[4], food: values[5] },
      mq137: values[6],
      v10: values[7]
    });

  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({ error: "failed" });
  }
});

app.get("/api/toggleV6", async (req, res) => {
  try {
    const value = req.query.value;

    if (value !== "0" && value !== "1") {
      return res.status(400).json({ error: "invalid value" });
    }

    await fetch(
      `https://blynk.cloud/external/api/update?token=${TOKEN}&V6=${value}`
    );

    res.json({ success: true });

  } catch (err) {
    console.error("TOGGLE ERROR:", err);
    res.status(500).json({ error: "toggle failed" });
  }
});


app.use((req, res) => {
  res.status(404).json({ error: "route not found" });
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));
