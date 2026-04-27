async function getAIS(mmsi, origin, destination) {

  const routes = {
    "Jebel Ali-Chennai": [
      { lat: 25.0657, lon: 55.1713 }, // Dubai
      { lat: 15.0, lon: 65.0 },       // Arabian Sea
      { lat: 10.0, lon: 72.0 },       // Near Lakshadweep
      { lat: 13.0827, lon: 80.2707 }  // Chennai
    ],

    "Colombo-Kolkata": [
      { lat: 6.9271, lon: 79.8612 },
      { lat: 10.0, lon: 85.0 },
      { lat: 15.0, lon: 88.0 },
      { lat: 22.5726, lon: 88.3639 }
    ],

    "Shanghai-Los Angeles": [
      { lat: 31.2304, lon: 121.4737 },
      { lat: 35.0, lon: 150.0 },
      { lat: 30.0, lon: -160.0 },
      { lat: 34.0522, lon: -118.2437 }
    ]
  };

  const key = `${origin}-${destination}`;
  const path = routes[key];

  if (!path) {
    // fallback ocean location
    return {
      lat: 10 + Math.random() * 10,
      lon: 70 + Math.random() * 20,
      speed: Math.floor(Math.random() * 15) + 10
    };
  }

  // pick segment
  const i = Math.floor(Math.random() * (path.length - 1));
  const start = path[i];
  const end = path[i + 1];

  const t = Math.random();

  const lat = start.lat + (end.lat - start.lat) * t;
  const lon = start.lon + (end.lon - start.lon) * t;

  return {
    lat: Number(lat.toFixed(4)),
    lon: Number(lon.toFixed(4)),
    speed: Math.floor(Math.random() * 15) + 10
  };
}

module.exports = getAIS;