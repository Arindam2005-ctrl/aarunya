export default function WeatherPanel({ shipData }) {
  const weatherData = shipData?.weather || {}
  const location = shipData?.location || {}

  const riskLevel = shipData?.risk || "Waiting"
  const delay = shipData?.delay || "Unknown"

  const risk =
    riskLevel === "High" ? 85 :
    riskLevel === "Medium" ? 59 :
    riskLevel === "Low" ? 25 :
    0

  const riskColor =
    riskLevel === "High" ? "#e24b4a" :
    riskLevel === "Medium" ? "#ef9f27" :
    riskLevel === "Low" ? "#1ebe78" :
    "#3b8bd4"

  const weather = [
    {
      label: "Wind Speed",
      value: weatherData.windSpeed ?? "—",
      unit: "km/h",
      sub: weatherData.condition || "Waiting for data",
      icon: "💨",
      color: "#3b8bd4",
    },
    {
      label: "Condition",
      value: weatherData.condition || "—",
      unit: "",
      sub: "Current weather",
      icon: "🌦️",
      color: "#1ebe78",
    },
    {
      label: "Latitude",
      value: location.lat ?? "—",
      unit: "",
      sub: "Ship latitude",
      icon: "📍",
      color: "#3b8bd4",
    },
    {
      label: "Longitude",
      value: location.lon ?? "—",
      unit: "",
      sub: "Ship longitude",
      icon: "🧭",
      color: "#ef9f27",
    },
  ]

  const r = 26
  const circ = 2 * Math.PI * r
  const dash = (risk / 100) * circ

  return (
    <div style={{
      width: "200px",
      flexShrink: 0,
      background: "#0a1220",
      borderLeft: "1px solid rgba(56,139,255,0.12)",
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
          Weather · Last Known Location
          
        </div>
      </div>

      <div style={{ padding: "10px 10px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
        {weather.map((w) => (
          <div key={w.label} style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(56,139,255,0.08)",
            borderRadius: "10px",
            padding: "10px 12px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: `${w.color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              flexShrink: 0,
            }}>
              {w.icon}
            </div>

            <div>
              <div style={{ fontSize: "10px", color: "#3a6088", marginBottom: "1px" }}>
                {w.label}
              </div>

              <div style={{
                fontSize: "15px",
                fontWeight: 600,
                color: "#c8deff",
                lineHeight: 1,
                wordBreak: "break-word",
              }}>
                {w.value}
                <span style={{
                  fontSize: "10px",
                  fontWeight: 400,
                  color: "#5a7fa8",
                  marginLeft: "2px",
                }}>
                  {w.unit}
                </span>
              </div>

              <div style={{ fontSize: "10px", color: "#3a6088" }}>
                {w.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        margin: "10px",
        padding: "14px",
        background: `${riskColor}10`,
        border: `1px solid ${riskColor}40`,
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}>
        <div style={{
          fontSize: "10px",
          fontWeight: 600,
          color: "#3a6088",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}>
          Risk Score
        </div>

        <svg width="70" height="70" viewBox="0 0 70 70">
          <circle cx="35" cy="35" r={r} fill="none" stroke="rgba(56,139,255,0.08)" strokeWidth="7" />
          <circle
            cx="35"
            cy="35"
            r={r}
            fill="none"
            stroke={riskColor}
            strokeWidth="7"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
            transform="rotate(-90 35 35)"
          />
          <text x="35" y="40" textAnchor="middle" fontSize="14" fontWeight="600" fill={riskColor}>
            {risk}%
          </text>
        </svg>

        <div style={{ fontSize: "13px", fontWeight: 600, color: riskColor }}>
          {riskLevel} Risk
        </div>

        <div style={{
          fontSize: "10px",
          color: "#5a7fa8",
          textAlign: "center",
          lineHeight: 1.5,
        }}>
          Delay Prediction: {delay}
        </div>

        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "5px", marginTop: "4px" }}>
          {[
            { label: "Weather", pct: risk, color: riskColor },
            { label: "Speed", pct: location.speed ? Math.min(Number(location.speed) * 5, 100) : 0, color: "#3b8bd4" },
            { label: "Location", pct: location.lat && location.lon ? 100 : 0, color: "#1ebe78" },
          ].map((b) => (
            <div key={b.label}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontSize: "9px", color: "#3a6088" }}>{b.label}</span>
                <span style={{ fontSize: "9px", color: b.color }}>{Math.round(b.pct)}%</span>
              </div>

              <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px" }}>
                <div style={{
                  width: `${b.pct}%`,
                  height: "100%",
                  background: b.color,
                  borderRadius: "2px",
                  opacity: 0.8,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}