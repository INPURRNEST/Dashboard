require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

// CORS (you can restrict this later if needed)
app.use(cors());

const TOKEN = process.env.BLYNK_TOKEN;

// =======================
// GET ALL SENSOR DATA
// =======================
app.get("/api/data", async (req, res) => {
  try {
    const values = await Promise.all([
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V0`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V1`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V2`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V3`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V4`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V5`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V6`)
        .then(r => r.text())
        .catch(() => "0"),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V10`)
        .then(r => r.text())
        .catch(() => "0")
    ]);

    res.json({
      room1: {
        temp: values[0],
        water: values[1],
        food: values[2]
      },
      room2: {
        temp: values[3],
        water: values[4],
        food: values[5]
      },
      mq137: values[6],
      v10: values[7] // LED state
    });

  } catch (err) {
    console.error("DATA ERROR:", err);
    res.status(500).json({ error: "failed to fetch data" });
  }
});

// =======================
// TOGGLE V6 (BUTTON)
// =======================
app.get("/api/toggleV6", async (req, res) => {
  try {
    const value = req.query.value;

    if (value !== "0" && value !== "1") {
      return res.status(400).json({ error: "invalid value" });
    }

    await fetch(
      `https://blynk.cloud/external/api/update?token=${TOKEN}&V6=${value}`
    );

    res.json({ success: true, value });

  } catch (err) {
    console.error("TOGGLE ERROR:", err);
    res.status(500).json({ error: "toggle failed" });
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
