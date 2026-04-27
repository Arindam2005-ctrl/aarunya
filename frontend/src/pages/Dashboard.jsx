import { useState } from 'react'
import ShipInputForm from '../components/ShipInputForm'
import MapView from '../components/MapView'
import WeatherPanel from '../components/WeatherPanel'
import ChatBox from '../components/ChatBox'

export default function Dashboard() {
  const [shipData, setShipData] = useState(null)

  return (
    <div style={{
      height: '100vh',
      background: '#060d1a',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'system-ui, sans-serif',
    }}>

      {/* NAVBAR */}
      <div style={{
        height: '52px',
        background: 'linear-gradient(90deg, #0a1628 0%, #0d1f3c 100%)',
        borderBottom: '1px solid rgba(56,139,255,0.15)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '16px',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1a5fa0, #2272c3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px'
          }}>⚓</div>

          <div>
            <div style={{ color: '#e2eeff', fontSize: '14px', fontWeight: 600, lineHeight: 1 }}>
              Aarunya
            </div>
            <div style={{ color: '#3b8bd4', fontSize: '10px', lineHeight: 1.4 }}>
              Maritime Insight AI
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '4px', marginLeft: '16px' }}>
      {['Dashboard', 'Alerts'].map((item, i) => (
        <div
  key={item}
  onClick={() => {
    if (item === 'Alerts') {
      if (!shipData) {
        alert('No vessel analyzed yet.');
        return;
      }

      const shipName = shipData.shipname || 'Selected vessel';
      const risk = shipData.risk || 'Unknown';
      const delay = shipData.delay || 'Unknown';
      const wind = Number(shipData.weather?.windSpeed) || 0;
      const condition = shipData.weather?.condition || 'Unknown';
      const speed = shipData.location?.speed || 'N/A';

      let reasons = [];

      if (wind > 30) reasons.push(`High wind speed: ${wind} km/h`);
      if (condition.toLowerCase().includes('storm')) reasons.push(`Storm condition detected`);
      if (condition.toLowerCase().includes('rain')) reasons.push(`Rainy weather condition`);
      if (Number(speed) < 8) reasons.push(`Low vessel speed: ${speed} knots`);
      if (delay === 'Yes') reasons.push(`Delay predicted by system`);

      if (reasons.length === 0) {
        reasons.push('Weather and speed are within acceptable range');
      }

      const message =
`${risk === 'High' ? '🚨 HIGH RISK ALERT' : risk === 'Medium' ? '⚠ MEDIUM RISK ALERT' : '✅ LOW RISK STATUS'}

Vessel: ${shipName}
Risk Level: ${risk}
Delay Prediction: ${delay}

Reasons:
- ${reasons.join('\n- ')}

Suggested Action:
${risk === 'High'
  ? 'Immediate monitoring and possible rerouting recommended.'
  : risk === 'Medium'
  ? 'Monitor weather and prepare alternate route if conditions worsen.'
  : 'No urgent action required. Continue normal monitoring.'}`;

      alert(message);
    }
  }}
  style={{
    padding: '5px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    cursor: 'pointer',
    color: i === 0 ? '#a8c9ef' : '#ef9f27',
    background: i === 0 ? 'rgba(56,139,255,0.1)' : 'transparent',
    border: i === 0 ? '1px solid rgba(56,139,255,0.2)' : '1px solid transparent',
  }}
>
  {item}
</div>
 
))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {[
              {
                 label: 'Vessels',
                 value: shipData ? '1' : '0',
                 color: '#3b8bd4'
                },
              {
                 label: 'At Risk',
                 value: shipData?.risk === 'High' || shipData?.risk === 'Medium' ? '1' : '0',
                 color: '#ef9f27'
               },
             {
                label: 'Alerts',
                value: shipData?.delay === 'Yes' ? '1' : '0',
                color: '#e24b4a'
              },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '9px', color: '#3a6088', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

         <div style={{
  display: 'flex',
  alignItems: 'center',
  gap: '7px',
  background: 'rgba(30,190,120,0.12)',
  border: '1px solid rgba(30,190,120,0.35)',
  padding: '5px 12px',
  borderRadius: '20px',
  boxShadow: '0 0 12px rgba(30,190,120,0.25)',
}}>
  <style>
    {`
      @keyframes livePulse {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(30,190,120,0.8);
        }
        50% {
          transform: scale(1.25);
          box-shadow: 0 0 12px 6px rgba(30,190,120,0.25);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(30,190,120,0);
        }
      }
    `}
  </style>

  <div style={{
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#1ebe78',
    animation: 'livePulse 1.4s infinite ease-in-out',
  }} />

  <span style={{
    fontSize: '11px',
    color: '#1ebe78',
    fontWeight: 700,
    letterSpacing: '0.04em',
  }}>
    LIVE
  </span>
</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <ShipInputForm onResult={setShipData} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ height: '55%', position: 'relative' }}>
            <MapView shipData={shipData} />
          </div>

          <div style={{ height: '45%', overflow: 'hidden' }}>
            <ChatBox shipData={shipData} />
          </div>
        </div>

        <WeatherPanel shipData={shipData} />
      </div>
    </div>
  )
}