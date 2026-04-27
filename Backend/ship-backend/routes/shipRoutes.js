const express = require("express");
const router = express.Router();

const matchShip = require("../services/shipMatching");
const getAIS = require("../services/aisService");
const getWeather = require("../services/weatherService");
const predict = require("../services/prediction");

router.post("/get-ship-data", async (req, res) => {
    console.log("API HIT"); 
  try {
    const { shipName, origin, destination } = req.body;

    const ship = matchShip(shipName, origin, destination);

    if (!ship) {
      return res.json({ error: "Ship not found" });
    }

   
    const location = await getAIS(ship.mmsi, origin, destination);
    const weather = await getWeather(location.lat, location.lon);
    const riskData = predict(weather, location);

    res.json({
      ...ship,
      location,
      weather,
      ...riskData
    });

  } 
  catch (err) {
  console.log("ERROR:", err);   // 👈 ADD THIS LINE
  res.status(500).json({ error: err.message });  // 👈 change this
  }
});

module.exports = router;