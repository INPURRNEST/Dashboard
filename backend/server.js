require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

const TOKEN = process.env.BLYNK_TOKEN;

// SAFETY CHECK (prevents crash)
if (!TOKEN) {
  console.error("BLYNK_TOKEN is missing!");
  process.exit(1);
}

app.get("/api/data", async (req, res) => {
  try {
    const values = await Promise.all([
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V0`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V1`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V2`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V3`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V4`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V5`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V6`).then(r => r.text()).catch(()=> "0"),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V10`).then(r => r.text()).catch(()=> "0")
    ]);

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

// TOGGLE
app.get("/api/toggleV6", async (req, res) => {
  try {
    const value = req.query.value;

    await fetch(`https://blynk.cloud/external/api/update?token=${TOKEN}&V6=${value}`);

    res.json({ success: true });

  } catch (err) {
    console.error("TOGGLE ERROR:", err);
    res.status(500).json({ error: "toggle failed" });
  }
});

app.get("/", (req, res) => {
  res.send("API running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running"));
