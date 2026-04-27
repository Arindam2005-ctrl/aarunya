import { useState } from "react";

export default function ShipInputForm({ onResult }) {
  const [formData, setFormData] = useState({
    mmsi: "",
    vesselName: "",
    departure: "",
    destination: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const analyzeRoute = async () => {
    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/get-ship-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mmsi: formData.mmsi,
          shipName: formData.vesselName,
          origin: formData.departure,
          destination: formData.destination,
        }),
      });

      const data = await res.json();
      console.log("Backend result:", data);
      setResult(data);
      onResult && onResult(data);
    } catch (error) {
      console.error("Frontend to backend error:", error);
      alert("Backend connection failed. Check backend server and API route.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: "mmsi", label: "MMSI Number (Optional)", placeholder: "Optional", icon: "📡" },
    { key: "vesselName", label: "Vessel Name", placeholder: "MV Pacific Star", icon: "🚢" },
    { key: "departure", label: "Departure", placeholder: "Shanghai, CN", icon: "📍" },
    { key: "destination", label: "Destination", placeholder: "Los Angeles, US", icon: "🏁" },
  ];

  const ships = [
    { name: "MV Pacific Star", risk: "Low", speed: "14.2", color: "#1ebe78", bg: "rgba(30,190,120,0.06)", border: "rgba(30,190,120,0.2)", flag: "🟢" },
    { name: "MS Atlantic Grace", risk: "Medium", speed: "11.8", color: "#ef9f27", bg: "rgba(239,159,39,0.06)", border: "rgba(239,159,39,0.2)", flag: "🟡" },
    { name: "SS Horizon Bay", risk: "High", speed: "9.1", color: "#e24b4a", bg: "rgba(226,75,74,0.06)", border: "rgba(226,75,74,0.2)", flag: "🔴" },
  ];

  return (
    <div style={{
      width: "220px",
      flexShrink: 0,
      background: "#0a1220",
      borderRight: "1px solid rgba(56,139,255,0.12)",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    }}>
      <div style={{
        padding: "12px 14px 8px",
        borderBottom: "1px solid rgba(56,139,255,0.08)",
      }}>
        <div style={{
          fontSize: "10px",
          fontWeight: 600,
          color: "#3a6088",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>
          Ship Input
        </div>
      </div>

      <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {fields.map((f) => (
          <div key={f.label} style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(56,139,255,0.1)",
            borderRadius: "10px",
            padding: "8px 10px",
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}>
            <span style={{ fontSize: "14px" }}>{f.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "9px", color: "#3a6088", marginBottom: "2px" }}>
                {f.label}
              </div>
              <input
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "11px",
                  color: "#a8c9ef",
                  width: "100%",
                  fontFamily: "inherit",
                }}
                placeholder={f.placeholder}
                value={formData[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
              />
            </div>
          </div>
        ))}

        <button
          onClick={analyzeRoute}
          disabled={loading}
          style={{
            width: "100%",
            background: "linear-gradient(135deg, #1a5fa0, #2272c3)",
            border: "none",
            borderRadius: "10px",
            padding: "10px",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            marginTop: "2px",
            letterSpacing: "0.02em",
          }}
        >
          {loading ? "Analyzing..." : "⚡ Analyze Route"}
        </button>

        {result && (
          <div style={{
            marginTop: "8px",
            padding: "8px",
            borderRadius: "8px",
            background: "rgba(56,139,255,0.06)",
            border: "1px solid rgba(56,139,255,0.15)",
            color: "#a8c9ef",
            fontSize: "10px",
            whiteSpace: "pre-wrap",
          }}>
            <strong>Result:</strong>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}
      </div>

      <div style={{ padding: "0 10px 10px" }}>
        <div style={{
          fontSize: "10px",
          fontWeight: 600,
          color: "#3a6088",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          margin: "8px 2px 6px",
        }}>
          Active Fleet
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {ships.map((s) => (
            <div key={s.name} style={{
              background: s.bg,
              border: `1px solid ${s.border}`,
              borderRadius: "10px",
              padding: "10px 12px",
              cursor: "pointer",
            }}>
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: s.color }}>
                  {s.name}
                </span>
                <span style={{ fontSize: "10px" }}>{s.flag}</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ fontSize: "10px", color: "#5a7fa8" }}>
                  Risk: <span style={{ color: s.color }}>{s.risk}</span>
                </span>
                <span style={{ fontSize: "10px", color: "#5a7fa8" }}>
                  {s.speed} kn
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}