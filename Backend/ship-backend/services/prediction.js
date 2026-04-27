function predict(weather, location) {
  let risk = "Low";
  let delay = "No";

  if (weather.windSpeed > 10) {
    risk = "Medium";
  }

  if (weather.condition.toLowerCase().includes("storm")) {
    risk = "High";
    delay = "Likely";
  }

  if (location.speed < 10) {
    delay = "Possible";
  }

  return { risk, delay };
}

module.exports = predict;