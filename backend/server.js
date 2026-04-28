const express = require("express");
const app = express();

const TOKEN = process.env.BLYNK_TOKEN;

app.get("/api/room1", async (req, res) => {
  try {
    const [v0, v1, v2, v6] = await Promise.all([
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V0`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V1`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V2`).then(r => r.text()),
      fetch(`https://blynk.cloud/external/api/get?token=${TOKEN}&V6`).then(r => r.text()).catch(() => null)
    ]);

    res.json({
      temp: v0,
      water: v1,
      food: v2,
      mq137: v6 ?? "N/A"
    });

  } catch (err) {
    res.status(500).json({ error: "Room1 failed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running"));
