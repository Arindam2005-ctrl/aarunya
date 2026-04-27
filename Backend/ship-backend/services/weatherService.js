const axios = require("axios");

async function getWeather(lat, lon) {
  const apiKey = process.env.VISUAL_CROSSING_API_KEY;

  console.log("API KEY:", apiKey); // 👈 move here

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${lon}?key=${apiKey}`;

  const res = await axios.get(url);

  return {
       windSpeed: res.data.currentConditions.windspeed + Math.random() * 5,
       condition: res.data.currentConditions.conditions
  };
}

module.exports = getWeather;