import { useEffect, useMemo, useState } from 'react'
import { BODIES } from '../core/bodies'
import { type Maturity } from '../core/budgets'
import { designFromPreset, evaluate, newUnit, QUANTITIES, UI_PRESETS, type Design } from '../core/design'
import { preset } from '../core/presets'
import { decodeDesign, designToJson, encodeDesign } from '../core/share'
import { fmt, setLang, t, useLang } from './i18n'
import { NumberField, Panel, RangeField, Result } from './parts'

const QUANTITY_LABELS: Record<string, string> = {
  gsd: 'Ground sampling distance', swath: 'Swath', revisit: 'Equator coverage', snrMin: 'SNR (minimum band)',
  dailyVolume: 'Data per day', downlinkRatio: 'Downlink / data generated', storageFill: 'One day of data / mass memory',
  massTotal: 'Mass', powerTotal: 'Power',
}

function initialDesign(): Design {
  const code = window.location.hash.slice(1)
  return (code && decodeDesign(code)) || designFromPreset('sentinel-2-msi')
}

export default function App() {
  const lang = useLang()
  const [design, setDesign] = useState<Design>(initialDesign)
  const [copied, setCopied] = useState(false)
  const r = useMemo(() => evaluate(design), [design])
  const body = BODIES[design.body]
  const sol = design.body === 'mars'
  const isAssumed = (path: string): 'assumed' | 'derived' | null =>
    design.assumptions.includes(path) ? 'assumed' : design.derived?.includes(path) ? 'derived' : null

  // keep the share link in the address bar
  useEffect(() => { window.history.replaceState(null, '', `#${encodeDesign(design)}`) }, [design])

  const set = (patch: Partial<Design>) => setDesign((d) => ({ ...d, ...patch, presetId: null }))
  const setPayload = (patch: Partial<Design['payload']>) => setDesign((d) => ({ ...d, presetId: null, payload: { ...d.payload, ...patch } }))
  const setLink = (patch: Partial<Design['link']>) => setDesign((d) => ({ ...d, presetId: null, link: { ...d.link, ...patch } }))

  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch { /* clipboard unavailable */ }
  }
  const exportJson = () => {
    const url = URL.createObjectURL(new Blob([designToJson(design)], { type: 'application/json' }))
    const a = document.createElement('a'); a.href = url; a.download = 'mission-design.json'; a.click(); URL.revokeObjectURL(url)
  }

  const p = design.payload
  const l = design.link
  const perDay = sol ? t('sols') : t('days')

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>Mission &amp; Payload Sandbox</h1>
          <p className="lead">{t('First-order mission and payload trade-offs, from Earth observation to Mars.')}</p>
        </div>
        <div className="top-actions">
          <select value={design.presetId ?? ''} onChange={(e) => e.target.value && setDesign(designFromPreset(e.target.value))} aria-label={t('Preset')}>
            {!design.presetId && <option value="">{t('Custom design')}</option>}
            {UI_PRESETS.map((id) => { const ps = preset(id); return <option key={id} value={id}>{ps.mission} · {ps.instrument}</option> })}
          </select>
          <button onClick={share}>{copied ? t('Link copied') : t('Share link')}</button>
          <button onClick={exportJson}>{t('Export JSON')}</button>
          <div className="lang" role="group" aria-label="Language">
            <button className={lang === 'en' ? 'on' : ''} onClick={() => setLang('en')}>EN</button>
            <button className={lang === 'it' ? 'on' : ''} onClick={() => setLang('it')}>IT</button>
          </div>
        </div>
      </header>

      <main className="grid">
        <section className="inputs">
          <Panel title={t('Mission')}>
            <div className="seg" role="group" aria-label={t('Central body')}>
              {(['earth', 'mars'] as const).map((b) => (
                <button key={b} className={design.body === b ? 'on' : ''} onClick={() => set({ body: b, link: { ...l, mode: b === 'mars' ? 'budget' : l.mode } })}>{t(BODIES[b].name)}</button>
              ))}
            </div>
            <RangeField label={t('Altitude')} unit="km" min={200} max={1500} value={design.altitudeKm} onChange={(v) => set({ altitudeKm: v })} />
            <NumberField label={t('Satellites')} value={design.satellites} min={1} step={1} onChange={(v) => set({ satellites: Math.max(1, Math.round(v)) })} />
          </Panel>

          <Panel title={t('Payload')}>
            <div className="seg" role="group" aria-label={t('Family')}>
              {(['multispectral', 'hyperspectral'] as const).map((f) => (
                <button key={f} className={p.family === f ? 'on' : ''} disabled={f === 'hyperspectral' ? !p.ranges.length : !p.bands.length}
                  onClick={() => setPayload({ family: f })}>{t(f === 'multispectral' ? 'Multispectral imager' : 'Imaging spectrometer')}</button>
              ))}
            </div>
            <NumberField label={t('Aperture')} unit="m" value={p.apertureM} onChange={(v) => setPayload({ apertureM: v })} assumed={isAssumed('payload.apertureM')} />
            <NumberField label={t('Focal length')} unit="m" value={p.focalLengthM} onChange={(v) => setPayload({ focalLengthM: v })} assumed={isAssumed('payload.focalLengthM')} />
            <NumberField label={t('Pixel pitch')} unit="µm" value={p.pixelPitchUm} onChange={(v) => setPayload({ pixelPitchUm: v })} assumed={isAssumed('payload.pixelPitchUm')} />
            <NumberField label={t('Pixels across track')} value={p.pixelsAcross} step={1} onChange={(v) => setPayload({ pixelsAcross: v })} assumed={isAssumed('payload.pixelsAcross')} />
            {p.family === 'hyperspectral' && p.ranges.map((rg, i) => (
              <NumberField key={rg.name} label={`${t('Spectral sampling')} ${rg.name}`} unit="nm" value={rg.samplingNm}
                onChange={(v) => setPayload({ ranges: p.ranges.map((x, j) => (j === i ? { ...x, samplingNm: Math.max(0.5, v) } : x)) })} />
            ))}
            <NumberField label={t('Bits per sample')} unit="bit" value={p.bits} step={1} onChange={(v) => setPayload({ bits: v })} />
            <NumberField label={t('Compression ratio')} value={p.compressionRatio} onChange={(v) => setPayload({ compressionRatio: Math.max(1, v) })} assumed={isAssumed('payload.compressionRatio')} />
            <NumberField label={t('Imaging duty cycle')} value={p.dutyCycle} step={0.01} onChange={(v) => setPayload({ dutyCycle: Math.min(1, Math.max(0, v)) })} assumed={isAssumed('payload.dutyCycle')} />
            <NumberField label={t('Optics transmission')} value={p.transmission} step={0.05} onChange={(v) => setPayload({ transmission: v })} assumed={isAssumed('payload.transmission')} />
            <NumberField label={t('Quantum efficiency')} value={p.quantumEfficiency} step={0.05} onChange={(v) => setPayload({ quantumEfficiency: v })} assumed={isAssumed('payload.quantumEfficiency')} />
            <NumberField label={t('Read noise')} unit="e⁻" value={p.readNoiseE} onChange={(v) => setPayload({ readNoiseE: v })} assumed={isAssumed('payload.readNoiseE')} />
            <NumberField label={t('TDI stages')} value={p.tdiStages} step={1} min={1} onChange={(v) => setPayload({ tdiStages: Math.max(1, Math.round(v)) })} assumed={isAssumed('payload.tdiStages')} />
          </Panel>

          <Panel title={t('Link and storage')}>
            <div className="seg" role="group" aria-label={t('Downlink mode')}>
              <button className={l.mode === 'rate' ? 'on' : ''} onClick={() => setLink({ mode: 'rate' })}>{t('Given rate')}</button>
              <button className={l.mode === 'budget' ? 'on' : ''} onClick={() => setLink({ mode: 'budget' })}>{t('Link budget')}</button>
            </div>
            {l.mode === 'rate' ? (
              <NumberField label={t('Downlink rate')} unit="Mbit/s" value={l.rateMbps} onChange={(v) => setLink({ rateMbps: v })} />
            ) : (
              <>
                <NumberField label={t('Transmitter power')} unit="W" value={l.powerW} onChange={(v) => setLink({ powerW: v })} />
                <NumberField label={t('Antenna diameter')} unit="m" value={l.antennaM} onChange={(v) => setLink({ antennaM: v })} />
                <NumberField label={t('Antenna efficiency')} value={l.efficiency} step={0.05} onChange={(v) => setLink({ efficiency: v })} assumed={isAssumed('link.efficiency')} />
                <NumberField label={t('Frequency')} unit="GHz" value={l.frequencyGHz} onChange={(v) => setLink({ frequencyGHz: v })} />
                <NumberField label={t('Ground antenna gain')} unit="dBi" value={l.rxGainDbi} onChange={(v) => setLink({ rxGainDbi: v })} />
                <NumberField label={t('System noise temperature')} unit="K" value={l.systemNoiseK} onChange={(v) => setLink({ systemNoiseK: v })} />
                <NumberField label={t('Required Eb/N0')} unit="dB" value={l.ebn0Db} onChange={(v) => setLink({ ebn0Db: v })} assumed={isAssumed('link.ebn0Db')} />
                <NumberField label={t('Link margin')} unit="dB" value={l.marginDb} onChange={(v) => setLink({ marginDb: v })} assumed={isAssumed('link.marginDb')} />
                <NumberField label={t('Other losses')} unit="dB" value={l.lossesDb} onChange={(v) => setLink({ lossesDb: v })} assumed={isAssumed('link.lossesDb')} />
                <NumberField label={t('Radio maximum rate')} unit="Mbit/s" value={l.maxRateMbps} onChange={(v) => setLink({ maxRateMbps: v })} />
                {sol ? (
                  <RangeField label={t('Earth–Mars distance')} unit="M km" min={body.distanceFromEarth.min} max={body.distanceFromEarth.max} step={1e6}
                    value={l.marsDistanceKm} display={fmt(l.marsDistanceKm / 1e6, 1)} onChange={(v) => setLink({ marsDistanceKm: v })} />
                ) : (
                  <NumberField label={t('Ground-station elevation')} unit="°" value={l.elevationDeg} onChange={(v) => setLink({ elevationDeg: v })} assumed={isAssumed('link.elevationDeg')} />
                )}
              </>
            )}
            <NumberField label={t(sol ? 'Contact time per sol' : 'Contact time per day')} unit="h" value={l.contactHours} onChange={(v) => setLink({ contactHours: v })} assumed={isAssumed('link.contactHours')} />
            <NumberField label={t('Mass memory')} unit="Gbit" value={design.storage.capacityGbit} onChange={(v) => set({ storage: { capacityGbit: v } })} />
          </Panel>

          <Panel title={t('Budgets (ESA margins)')} open={false}>
            {design.units.length === 0 && <p className="note">{t('No units yet: add the payload and platform units.')}</p>}
            {design.units.map((u, i) => {
              const upd = (patch: Partial<typeof u>) => set({ units: design.units.map((x, j) => (j === i ? { ...x, ...patch } : x)) })
              return (
                <div className="unit-row" key={i}>
                  <input className="unit-name" value={u.name} onChange={(e) => upd({ name: e.target.value })} aria-label={t('Unit')} />
                  <NumberField label={t('Mass')} unit="kg" value={u.massKg} onChange={(v) => upd({ massKg: v })} />
                  <NumberField label={t('Power')} unit="W" value={u.powerW} onChange={(v) => upd({ powerW: v })} />
                  <label className="field"><span className="field-label">{t('Maturity')}</span>
                    <select value={u.maturity} onChange={(e) => upd({ maturity: e.target.value as Maturity })}>
                      {(['A', 'B', 'C', 'D'] as const).map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </label>
                  <button className="link-btn" onClick={() => set({ units: design.units.filter((_, j) => j !== i) })}>{t('Remove')}</button>
                </div>
              )
            })}
            <button onClick={() => set({ units: [...design.units, newUnit()] })}>{t('Add unit')}</button>
            <p className="note">{t('Maturity A/B: off-the-shelf (5%) · C: minor modifications (10%) · D: new design (20%).')}</p>
          </Panel>
        </section>

        <section className="outputs">
          <div className="card compliance">
            <h2>{t('Compliance matrix')}</h2>
            <table>
              <thead><tr><th>ID</th><th>{t('Quantity')}</th><th>{t('Limit')}</th><th className="num">{t('Value')}</th><th className="num">{t('Margin')}</th><th>{t('Status')}</th></tr></thead>
              <tbody>
                {r.compliance.map((c, i) => (
                  <tr key={c.id}>
                    <td className="mono">{c.id}</td>
                    <td>{t(QUANTITY_LABELS[c.quantity] ?? c.quantity)}</td>
                    <td className="limit">
                      {c.sense === 'max' ? '≤' : '≥'}{' '}
                      <input type="number" value={c.limit} step="any" aria-label={t('Limit')}
                        onChange={(e) => { const v = e.target.valueAsNumber; if (Number.isFinite(v)) set({ requirements: design.requirements.map((x, j) => (j === i ? { ...x, limit: v } : x)) }) }} />
                      <span className="unit"> {c.quantity === 'revisit' ? perDay : QUANTITIES[c.quantity]?.unit === '-' ? '' : QUANTITIES[c.quantity]?.unit}</span>
                    </td>
                    <td className="num">{fmt(c.value, c.value >= 100 ? 0 : 2)}</td>
                    <td className="num">{Number.isFinite(c.margin) ? `${fmt(c.margin * 100, Math.abs(c.margin) < 0.1 ? 1 : 0)}%` : '–'}</td>
                    <td><span className={`status ${c.status}`}>{t(c.status)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="note">{t('Example requirements: edit the limits. Marginal = margin below 10% (a sandbox convention, not an ESA rule).')}</p>
          </div>

          <div className="card">
            <h2>{t('Orbit and geometry')}</h2>
            <Result label={t('Orbital period')} value={fmt(r.periodMin)} unit="min" formula="T = 2π √(a³ / μ),  a = R + h"
              note={t('Circular orbit, spherical body; altitude above the equatorial radius.')} />
            <Result label={t('Ground speed')} value={fmt(r.groundSpeedKmS, 3)} unit="km/s" formula="v_g = (R / a) √(μ / a)"
              note={t('Ignores the rotation of the body (a few per cent in low orbit).')} />
            <Result label={t('Sun-synchronous inclination')} value={Number.isFinite(r.ssoInclinationDeg) ? fmt(r.ssoInclinationDeg) : t('none at this altitude')} unit={Number.isFinite(r.ssoInclinationDeg) ? '°' : ''}
              formula="cos i = −(2/3) Ω̇ a^3.5 / (J2 R² √μ),  Ω̇ = 2π / tropical year" note={t('J2 nodal precession only.')} />
            <Result label={t('Equator coverage')} value={fmt(r.revisitDays)} unit={perDay} formula="t ≈ 2πR / (n · swath · satellites)"
              note={t('Days (sols on Mars) to cover the equator once; not the exact repeat cycle of the ground track.')} />
            <Result label={t('Ground sampling distance')} value={fmt(r.gsdM)} unit="m" formula="GSD = h · p / f"
              note={t('Nadir, pinhole relation.')} />
            <Result label={t('Swath')} value={fmt(r.swathKm, 1)} unit="km" formula="swath = N_pixels · GSD"
              note={t('Flat-surface approximation: underestimates very wide swaths.')} />
            <Result label={t('Line time')} value={fmt(r.lineTimeUs, 1)} unit="µs" formula="t_line = GSD / v_g"
              note={t('Integration time per TDI stage.')} />
          </div>

          <div className="card">
            <h2>{t('Radiometry')}</h2>
            <table>
              <thead><tr><th>{t('Band')}</th><th className="num">{t('Centre')}</th><th className="num">{t('Width')}</th><th className="num">GSD</th>{p.family === 'hyperspectral' && <th className="num">{t('Channels')}</th>}<th className="num">SNR</th></tr></thead>
              <tbody>
                {r.bands.map((b) => (
                  <tr key={b.name}>
                    <td className="mono">{b.name}</td><td className="num">{fmt(b.centreNm, 0)} nm</td><td className="num">{fmt(b.widthNm, 1)} nm</td>
                    <td className="num">{fmt(b.gsdM, 1)} m</td>{p.family === 'hyperspectral' && <td className="num">{b.channels}</td>}
                    <td className="num"><strong>{fmt(b.snr, 0)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Result label="SNR" value={fmt(r.snrMin, 0)} unit="(min)" formula="SNR = Ne / √(Ne + σ²_read),  Ne = L Δλ A Ω t λ/(hc) τ η N_TDI"
              note={t('Reference radiance per band (Sentinel-2 Lref where not published); on Mars scaled by the solar irradiance ratio 586.2 / 1361.')} />
          </div>

          <div className="card">
            <h2>{t('Data and downlink')}</h2>
            <Result label={t('Raw data rate')} value={fmt(r.rawRateMbps, 0)} unit="Mbit/s" formula="R = Σ (swath / GSD_b) (v_g / GSD_b) bits"
              note={t('Every band or spectral channel sampled at its own GSD.')} />
            <Result label={t('Compressed data rate')} value={fmt(r.compressedRateMbps, 0)} unit="Mbit/s" formula="R_c = R / compression" note={t('Average compression ratio.')} />
            <Result label={t(sol ? 'Data per sol' : 'Data per day')} value={fmt(r.dailyVolumeGbit, 1)} unit="Gbit" formula="V = R_c · day · duty cycle" note={t('A sol on Mars.')} />
            <Result label={t('Link distance')} value={fmt(r.linkDistanceKm >= 1e6 ? r.linkDistanceKm / 1e6 : r.linkDistanceKm, r.linkDistanceKm >= 1e6 ? 1 : 0)} unit={r.linkDistanceKm >= 1e6 ? 'M km' : 'km'}
              formula={sol ? 'd = Earth–Mars distance' : 'd = √((R+h)² − R² cos² e) − R sin e'} note={t('Slant range at the minimum elevation on Earth; Earth–Mars distance on Mars.')} />
            {r.link && (
              <Result label={t('Downlink rate')} value={fmt(r.downlinkRateMbps, 2)} unit={`Mbit/s · ${t('Limited by')} ${t(r.link.limitedBy === 'radio' ? 'the radio' : 'the link')}`}
                formula="R = EIRP · G_r / (L_fs · L · k T_sys · (Eb/N0) · margin),  L_fs = (4πd/λ)²"
                note={`EIRP ${fmt(r.link.eirpDbw + 30, 1)} dBm · L_fs ${fmt(r.link.freeSpaceLossDb, 1)} dB · Pr/N0 ${fmt(r.link.prN0DbHz, 1)} dB-Hz`} />
            )}
            <Result label={t(sol ? 'Downlink per sol' : 'Downlink per day')} value={fmt(r.downlinkPerDayGbit, 1)} unit="Gbit" formula="V_down = R_down · contact time" note={t('Contact time per day (per sol on Mars).')} />
            <Result label={t('Downlink / data generated')} value={fmt(r.downlinkRatio)} formula="V_down / V" note={t('Below 1: data accumulates on board.')} />
            <Result label={t(sol ? 'One sol of data / mass memory' : 'One day of data / mass memory')} value={fmt(r.storageFill)} formula="V / memory"
              note={t('The ESA margin policy sets no mass-memory margin: judged by your requirement.')} />
          </div>

          <div className="card">
            <h2>{t('Budgets (ESA margins)')}</h2>
            {design.units.length === 0 ? <p className="note">{t('No units yet: add the payload and platform units.')}</p> : (
              <table>
                <thead><tr><th>{t('Unit')}</th><th>{t('Maturity')}</th><th>{t('Mass')}</th><th>{t('With margin')}</th><th>{t('Power')}</th><th>{t('With margin')}</th></tr></thead>
                <tbody>
                  {r.mass.lines.map((m, i) => (
                    <tr key={i}><td>{m.name}</td><td className="mono">{m.maturity} · {fmt(m.margin * 100, 0)}%</td>
                      <td className="num">{fmt(m.estimate, 1)} kg</td><td className="num">{fmt(m.withMargin, 1)} kg</td>
                      <td className="num">{fmt(r.power.lines[i].estimate, 1)} W</td><td className="num">{fmt(r.power.lines[i].withMargin, 1)} W</td></tr>
                  ))}
                  <tr className="sub"><td colSpan={3}>{t('Nominal (with equipment margins)')}</td><td className="num">{fmt(r.mass.nominal, 1)} kg</td><td /><td className="num">{fmt(r.power.nominal, 1)} W</td></tr>
                  <tr className="sub"><td colSpan={3}>{t('System margin 20%')}</td><td className="num">{fmt(r.mass.systemMargin, 1)} kg</td><td /><td className="num">{fmt(r.power.systemMargin, 1)} W</td></tr>
                  <tr className="total"><td colSpan={3}>{t('Total')}</td><td className="num">{fmt(r.mass.total, 1)} kg</td><td /><td className="num">{fmt(r.power.total, 1)} W</td></tr>
                </tbody>
              </table>
            )}
            <p className="note">ESA, Margin philosophy for science assessment studies (SRE-PA/2011.097, 2012).</p>
          </div>
        </section>
      </main>

      <footer className="foot">
        <p>{t('First-order model for phase 0/A trade-offs, not for flight design.')} {t('Built with ECSS practices: requirements, ICD, verification control document and validation are in the repository.')}</p>
        <p>Giovanni Marino · <a href="https://github.com/giovmar-source/mission-payload-sandbox">GitHub</a> · <a href="https://www.linkedin.com/in/giov-marino">LinkedIn</a></p>
      </footer>
    </div>
  )
}
