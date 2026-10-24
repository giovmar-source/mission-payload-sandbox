/**
 * Trade-off curves: the same design evaluated over a range of altitudes, so the interface can
 * show how resolution, coverage and data flow move together (CDR).
 */

import { evaluate, type Design } from './design'

export interface SweepRow {
  altitudeKm: number
  gsd: number
  revisit: number
  snrMin: number
  downlinkRatio: number
  storageFill: number
}

export function altitudeSweep(d: Design, fromKm: number, toKm: number, steps = 40): SweepRow[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const altitudeKm = fromKm + ((toKm - fromKm) * i) / steps
    const r = evaluate({ ...d, altitudeKm })
    return { altitudeKm, gsd: r.gsdM, revisit: r.revisitDays, snrMin: r.snrMin, downlinkRatio: r.downlinkRatio, storageFill: r.storageFill }
  })
}

/** Altitude range shown for each body [km] */
export function sweepRange(body: Design['body']): [number, number] {
  return body === 'earth' ? [300, 1200] : [200, 1000]
}
