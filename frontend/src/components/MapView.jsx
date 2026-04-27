import { useEffect, useRef } from "react";
import L from "leaflet";

function makeIcon(pulseColor = "#1ebe78") {
  return L.divIcon({
    className: "",
    html: `
      <div class="ship-pulse-marker" style="--pulse-color:${pulseColor};">
        <div class="pulse-ring ring-one"></div>
        <div class="pulse-ring ring-two"></div>
        <div class="ship-dot"></div>
      </div>

      <style>
        .ship-pulse-marker {
          position: relative;
          width: 34px;
          height: 34px;
        }

        .ship-dot {
          position: absolute;
          left: 11px;
          top: 11px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #1ebe78;
          box-shadow: 0 0 12px #1ebe78, 0 0 22px #1ebe78;
          animation: dotBlink 1.2s infinite ease-in-out;
          z-index: 3;
        }

        .pulse-ring {
          position: absolute;
          left: 7px;
          top: 7px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--pulse-color);
          opacity: 0.4;
          animation: pulseRadius 2s infinite ease-out;
          z-index: 1;
        }

        .ring-two {
          animation-delay: 1s;
        }

        @keyframes pulseRadius {
          0% {
            transform: scale(0.6);
            opacity: 0.55;
          }
          70% {
            transform: scale(2.1);
            opacity: 0.18;
          }
          100% {
            transform: scale(2.7);
            opacity: 0;
          }
        }

        @keyframes dotBlink {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.75;
          }
        }
      </style>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  });
}

export default function MapView({ shipData }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20, 80],
      zoom: 3,
      zoomControl: false,
    });

    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "CartoDB",
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 300);

    return () => {
      if (markerRef.current?.moveInterval) {
        clearInterval(markerRef.current.moveInterval);
      }

      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!shipData || !mapInstanceRef.current) return;

    const lat = Number(shipData.location?.lat);
    const lon = Number(shipData.location?.lon);

    if (!lat || !lon) return;

    const map = mapInstanceRef.current;

    if (markerRef.current) {
      if (markerRef.current.moveInterval) {
        clearInterval(markerRef.current.moveInterval);
      }

      map.removeLayer(markerRef.current);
    }

    // Green live marker
   const pulseColor =
  shipData.risk === "High"
    ? "#e24b4a"
    : shipData.risk === "Medium"
    ? "#ef9f27"
    : "#1ebe78";

const marker = L.marker([lat, lon], {
  icon: makeIcon(pulseColor),
}).addTo(map);

    let currentLat = lat;
    let currentLon = lon;
    const angle = Math.random() * 2 * Math.PI;

    const moveInterval = setInterval(() => {
      currentLat += Math.cos(angle) * 0.002;
      currentLon += Math.sin(angle) * 0.002;

      marker.setLatLng([currentLat, currentLon]);
    }, 2000);

    marker.moveInterval = moveInterval;

    marker.bindPopup(`
      <div style="font-family:sans-serif">
        <b>${shipData.shipname || shipData.name || "Ship"}</b><br/>
        MMSI: ${shipData.mmsi || "N/A"}<br/>
        Status: Live AIS Tracking<br/>
        Risk: ${shipData.risk || "N/A"}<br/>
        Speed: ${shipData.location?.speed || "N/A"} kn<br/>
        Lat: ${lat}, Lon: ${lon}
      </div>
    `);

    markerRef.current = marker;

    map.setView([lat, lon], 6);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [shipData]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#0a1628",
        overflow: "hidden",
      }}
    >
      <div ref={mapRef} style={{ width: "100%", height: "100%", minHeight: "300px" }} />

      <style>
        {`
          @keyframes livePulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(30,190,120,0.8);
            }
            70% {
              transform: scale(1.25);
              box-shadow: 0 0 0 8px rgba(30,190,120,0);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 0 0 rgba(30,190,120,0);
            }
          }
        `}
      </style>

      {shipData ? (
        <div
          style={{
            position: "absolute",
            top: "14px",
            left: "16px",
            zIndex: 1000,
            background: "rgba(8, 18, 34, 0.9)",
            border: "1px solid rgba(30,190,120,0.45)",
            padding: "7px 14px",
            borderRadius: "18px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 0 14px rgba(30,190,120,0.25)",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#1ebe78",
              animation: "livePulse 1.4s infinite",
            }}
          />

          <span
            style={{
              color: "#1ebe78",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            LIVE AIS TRACKING
          </span>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            zIndex: 1000,
            background: "rgba(13,21,38,0.85)",
            border: "1px solid rgba(56,139,255,0.15)",
            borderRadius: "8px",
            padding: "8px 12px",
            color: "#a8c9ef",
            fontSize: "12px",
          }}
        >
          Enter ship details and click Analyze Route
        </div>
      )}
    </div>
  );
}