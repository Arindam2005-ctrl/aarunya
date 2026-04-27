const ships = require("../data/ships.json");

function normalize(text) {
  return text?.toString().toLowerCase().trim();
}

function matchShip(name, origin, destination) {
  const inputName = normalize(name);
  const inputOrigin = normalize(origin);
  const inputDestination = normalize(destination);

  const portMap = {
    mumbai: "jnpt",
    kolkata: "kolkata",
    chennai: "chennai",
    vizag: "visakhapatnam"
  };

  const mappedDestination = portMap[inputDestination] || inputDestination;

  const result = ships.find(ship => {
    const shipName = normalize(ship.shipname);
    const shipOrigin = normalize(ship.Origin_Port);       // ✅ FIXED
    const shipDestination = normalize(ship.Destination_Port); // ✅ FIXED

    return (
      shipName?.includes(inputName) &&
      shipOrigin?.includes(inputOrigin) &&
      shipDestination?.includes(mappedDestination)
    );
  });

  console.log("MATCH FOUND:", result);

  return result;
}

module.exports = matchShip;