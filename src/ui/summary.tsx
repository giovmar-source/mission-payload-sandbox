import { BODIES } from '../core/bodies'
import type { Design, Results } from '../core/design'
import { preset } from '../core/presets'
import type { ValidityWarning } from '../core/validity'
import { fmt, t } from './i18n'

/**
 * Printable one-page summary (SB-08): shown only when printing, so the browser's
 * "Save as PDF" produces the PDF summary without a server or a PDF library.
 */
export function PrintSummary({ d, r, warnings, warningText, labels }: {
  d: Design; r: Results; warnings: ValidityWarning[]; warningText: (w: ValidityWarning) => string; labels: Record<string, string>
}) {
  const ps = d.presetId ? preset(d.presetId) : null
  const sources = ps ? [...new Set([...Object.values(ps.published), ...Object.values(ps.derived)].map((v) => v.source))] : []
  const per = d.body === 'mars' ? t('sols') : t('days')
  const rows: [string, string][] = [
    [t('Central body'), t(BODIES[d.body].name)],
    [t('Altitude'), `${fmt(d.altitudeKm, 0)} km`],
    [t('Orbital period'), `${fmt(r.periodMin)} min`],
    [t('Ground sampling distance'), `${fmt(r.gsdM)} m`],
    [t('Swath'), `${fmt(r.swathKm, 1)} km`],
    [t('Equator coverage'), `${fmt(r.revisitDays)} ${per}`],
    ['SNR (min)', fmt(r.snrMin, 0)],
    [t('Raw data rate'), `${fmt(r.rawRateMbps, 0)} Mbit/s`],
    [t(d.body === 'mars' ? 'Data per sol' : 'Data per day'), `${fmt(r.dailyVolumeGbit, 1)} Gbit`],
    [t('Downlink rate'), `${fmt(r.downlinkRateMbps, 2)} Mbit/s`],
    [t('Downlink / data generated'), fmt(r.downlinkRatio)],
  ]
  return (
    <section className="print-summary" aria-hidden="true">
      <h1>Mission &amp; Payload Sandbox · {t('Design summary')}</h1>
      <p>{ps ? `${t('Preset')}: ${ps.mission} · ${ps.instrument}` : t('Custom design')} · {new Date().toISOString().slice(0, 10)} · {window.location.href.split('#')[0]}</p>
      <h2>{t('Compliance matrix')}</h2>
      <table>
        <thead><tr><th>ID</th><th>{t('Quantity')}</th><th>{t('Limit')}</th><th>{t('Value')}</th><th>{t('Margin')}</th><th>{t('Status')}</th></tr></thead>
        <tbody>{r.compliance.map((c) => (
          <tr key={c.id}><td>{c.id}</td><td>{t(labels[c.quantity] ?? c.quantity)}</td><td>{c.sense === 'max' ? '≤' : '≥'} {c.limit}</td>
            <td>{fmt(c.value, 2)}</td><td>{fmt(c.margin * 100, 1)}%</td><td>{t(c.status)}</td></tr>
        ))}</tbody>
      </table>
      <h2>{t('Key results')}</h2>
      <table><tbody>{rows.map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}</tbody></table>
      {r.mass.lines.length > 0 && <p>{t('Mass')}: {fmt(r.mass.total, 1)} kg · {t('Power')}: {fmt(r.power.total, 1)} W ({t('System margin 20%')})</p>}
      {warnings.length > 0 && <><h2>{t('Model validity')}</h2><ul>{warnings.map((w) => <li key={w.code}>{warningText(w)}</li>)}</ul></>}
      <h2>{t('Assumptions')}</h2>
      <p>{d.assumptions.join(', ') || '–'}</p>
      {d.derived?.length ? <><h2>{t('Derived values')}</h2><p>{d.derived.join(', ')}</p></> : null}
      {sources.length > 0 && <><h2>{t('Sources')}</h2><ul className="sources">{sources.map((s) => <li key={s}>{s}</li>)}</ul></>}
      <p className="small">{t('First-order model for phase 0/A trade-offs, not for flight design.')}</p>
    </section>
  )
}
