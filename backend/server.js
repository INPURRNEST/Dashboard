const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

// ✅ Enable CORS (this fixes browser blocking)
app.use(cors());

const TOKEN = process.env.BLYNK_TOKEN;

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
      mq137: values[6]
    });

  } catch (err) {
    console.error(err); // ✅ helpful for debugging
    res.status(500).json({ error: "failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
