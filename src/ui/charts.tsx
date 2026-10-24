import { useState } from 'react'
import type { SweepRow } from '../core/sweep'
import { fmt, t } from './i18n'

/**
 * One small trade-off chart: one quantity against altitude, one axis, the current altitude
 * as a dot and, when set, the requirement limit as a dashed line. Hover shows the value.
 */
export function TradeChart({ title, unit, rows, pick, altitude, limit, digits = 1 }: {
  title: string; unit: string; rows: SweepRow[]; pick: (r: SweepRow) => number; altitude: number; limit?: number; digits?: number
}) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 300, H = 170, L = 44, R = 12, T = 12, B = 30
  const xs = rows.map((r) => r.altitudeKm)
  const ys = rows.map(pick).filter(Number.isFinite)
  if (!ys.length) return null
  const x0 = Math.min(...xs), x1 = Math.max(...xs)
  const lo = Math.min(...ys, limit ?? Infinity), hi = Math.max(...ys, limit ?? -Infinity)
  const pad = (hi - lo) * 0.08 || 1
  const y0 = Math.max(0, lo - pad), y1 = hi + pad
  const X = (v: number) => L + ((v - x0) / (x1 - x0)) * (W - L - R)
  const Y = (v: number) => T + (1 - (v - y0) / (y1 - y0)) * (H - T - B)
  const path = rows.filter((r) => Number.isFinite(pick(r))).map((r, i) => `${i ? 'L' : 'M'}${X(r.altitudeKm).toFixed(1)} ${Y(pick(r)).toFixed(1)}`).join('')
  const ticksY = [y0, (y0 + y1) / 2, y1]
  const ticksX = [x0, (x0 + x1) / 2, x1]
  const inRange = altitude >= x0 && altitude <= x1
  const nearest = rows.reduce((best, r) => (Math.abs(r.altitudeKm - altitude) < Math.abs(best.altitudeKm - altitude) ? r : best), rows[0])
  const shown = hover !== null ? rows[hover] : null

  return (
    <figure className="trade">
      <figcaption>{title} {unit && <span className="unit">[{unit}]</span>}</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${title} ${t('against altitude')}`}
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const box = (e.currentTarget as SVGSVGElement).getBoundingClientRect()
          const xv = x0 + (((e.clientX - box.left) / box.width) * W - L) / (W - L - R) * (x1 - x0)
          let k = 0
          rows.forEach((r, i) => { if (Math.abs(r.altitudeKm - xv) < Math.abs(rows[k].altitudeKm - xv)) k = i })
          setHover(k)
        }}>
        {ticksY.map((v) => <g key={`y${v}`}><line x1={L} x2={W - R} y1={Y(v)} y2={Y(v)} className="grid" /><text x={L - 6} y={Y(v) + 4} textAnchor="end" className="tick">{fmt(v, digits)}</text></g>)}
        <text x={W - R} y={H - 22} textAnchor="end" className="tick">km</text>
        {ticksX.map((v, i) => <text key={`x${v}`} x={X(v)} y={H - 10} textAnchor={i === 0 ? 'start' : i === ticksX.length - 1 ? 'end' : 'middle'} className="tick">{fmt(v, 0)}</text>)}
        {limit !== undefined && Number.isFinite(limit) && limit >= y0 && limit <= y1 && (
          <g><line x1={L} x2={W - R} y1={Y(limit)} y2={Y(limit)} className="limit" /><text x={W - R} y={Y(limit) - 4} textAnchor="end" className="tick">{t('Limit')} {fmt(limit, digits)}</text></g>
        )}
        <path d={path} className="curve" />
        {inRange && Number.isFinite(pick(nearest)) && <circle cx={X(altitude)} cy={Y(pick(nearest))} r={5} className="now" />}
        {shown && Number.isFinite(pick(shown)) && (
          <g>
            <line x1={X(shown.altitudeKm)} x2={X(shown.altitudeKm)} y1={T} y2={H - B} className="cross" />
            <circle cx={X(shown.altitudeKm)} cy={Y(pick(shown))} r={4} className="hover-dot" />
          </g>
        )}
      </svg>
      <p className="trade-readout">{shown ? `${fmt(shown.altitudeKm, 0)} km → ${fmt(pick(shown), digits)} ${unit}`.trim() : `${t('Altitude')} ${fmt(altitude, 0)} km → ${fmt(pick(nearest), digits)} ${unit}`.trim()}</p>
    </figure>
  )
}
