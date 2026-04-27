const express = require("express");
const router = express.Router();

router.post("/ask", (req, res) => {
  const { question, shipData } = req.body;

  if (!shipData) {
    return res.json({
      reply: "Please analyze a vessel first. Then I can explain its location, weather, route risk, and delay prediction."
    });
  }

  const shipName = shipData.shipname || shipData.name || "this vessel";
  const lat = shipData.location?.lat || "N/A";
  const lon = shipData.location?.lon || "N/A";
  const speed = shipData.location?.speed || "N/A";
  const condition = shipData.weather?.condition || "N/A";
const wind = Number(shipData.weather?.windSpeed) || 0;
const risk = shipData.risk || "N/A";
const delay = shipData.delay || "N/A";

const q = question.toLowerCase();

let recommendation = "";

if (risk === "High") {
  recommendation = "High risk detected. Immediate route adjustment is recommended. Avoid bad weather zones and monitor the vessel frequently.";
} else if (risk === "Medium") {
  recommendation = "Moderate risk detected. Continue monitoring weather and speed. Prepare an alternate route if wind or delay risk increases.";
} else if (risk === "Low") {
  recommendation = "Low risk. Current route looks safe, but continue checking weather updates.";
} else {
  recommendation = "Risk data is not available yet. Analyze a vessel first for better guidance.";
}

let reply = "";

if (q.includes("weather") || q.includes("storm") || q.includes("wind")) {
  reply = `
${shipName} weather summary:

Condition: ${condition}
Wind Speed: ${wind} km/h
Location: ${lat}, ${lon}

Insight:
${wind > 30 ? "Wind speed is high and may affect vessel stability or delay." : "Weather is currently within acceptable limits."}

Recommendation:
${recommendation}
`;
} else if (q.includes("risk") || q.includes("delay")) {
  reply = `
${shipName} risk analysis:

Risk Level: ${risk}
Delay Prediction: ${delay}
Speed: ${speed} knots

Reason:
This prediction is based on last-known AIS position, vessel speed, and current weather data.

Recommendation:
${recommendation}
`;
} else if (q.includes("location") || q.includes("where")) {
  reply = `
${shipName}'s last-known AIS position:

Latitude: ${lat}
Longitude: ${lon}
Speed: ${speed} knots

Note:
AIS data may be delayed, so this should be treated as the last-known position, not exact live tracking.
`;
} else if (q.includes("route") || q.includes("reroute")) {
  reply = `
Route guidance for ${shipName}:

Current Risk: ${risk}
Weather: ${condition}
Wind Speed: ${wind} km/h

Recommendation:
${risk === "High"
  ? "Rerouting is strongly recommended through a safer sea corridor."
  : risk === "Medium"
  ? "Keep an alternate route ready and monitor conditions before entering high-risk zones."
  : "No immediate rerouting required. Current route appears acceptable."}
`;
} else {
  reply = `
${shipName} summary:

Last-known position: ${lat}, ${lon}
Weather: ${condition}
Wind Speed: ${wind} km/h
Risk: ${risk}
Delay Prediction: ${delay}

Recommendation:
${recommendation}
`;
}

res.json({ reply });
});

module.exports = router;