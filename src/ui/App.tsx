import { useState } from 'react'
import { BODIES, type BodyId } from '../core/bodies'
import { equatorCoverageDays, groundSpeed, orbitalPeriod, sunSynchronousInclination } from '../core/orbit'

const fmt = (v: number, digits = 2) => (Number.isFinite(v) ? v.toFixed(digits) : 'none')

/** Week-1 preview: the orbit module with live values. The full interface comes in week 2. */
export default function App() {
  const [bodyId, setBodyId] = useState<BodyId>('earth')
  const [altitude, setAltitude] = useState(786)
  const [swath, setSwath] = useState(290)
  const body = BODIES[bodyId]

  const rows: [string, string, string][] = [
    ['Orbital period', `${fmt(orbitalPeriod(body, altitude) / 60)} min`, 'T = 2π √(a³/μ)'],
    ['Ground speed', `${fmt(groundSpeed(body, altitude), 3)} km/s`, 'v_g = (R/a) √(μ/a)'],
    ['Sun-synchronous inclination', `${fmt(sunSynchronousInclination(body, altitude))}°`, 'cos i = −(2/3) Ω̇ a^3.5 / (J2 R² √μ)'],
    ['Equator coverage, 1 satellite', `${fmt(equatorCoverageDays(body, altitude, swath))} days`, 't ≈ 2πR / (n · swath)'],
  ]

  return (
    <main>
      <header>
        <p className="eyebrow">Preview · week 1</p>
        <h1>Mission &amp; Payload Sandbox</h1>
        <p className="lead">First-order mission and payload trade-offs, from Earth observation to Mars.</p>
      </header>
      <section className="controls">
        <label>Central body
          <select value={bodyId} onChange={(e) => setBodyId(e.target.value as BodyId)}>
            <option value="earth">Earth</option>
            <option value="mars">Mars</option>
          </select>
        </label>
        <label>Altitude: <strong>{altitude} km</strong>
          <input type="range" min={200} max={1500} value={altitude} onChange={(e) => setAltitude(Number(e.target.value))} />
        </label>
        <label>Swath: <strong>{swath} km</strong>
          <input type="range" min={5} max={800} value={swath} onChange={(e) => setSwath(Number(e.target.value))} />
        </label>
      </section>
      <table>
        <thead><tr><th>Quantity</th><th>Value</th><th>Formula</th></tr></thead>
        <tbody>{rows.map(([q, v, f]) => <tr key={q}><td>{q}</td><td className="num">{v}</td><td className="formula">{f}</td></tr>)}</tbody>
      </table>
      <p className="note">Circular orbit, spherical {body.name}; J2 only for the sun-synchronous inclination. Constants: {body.source}.</p>
    </main>
  )
}
