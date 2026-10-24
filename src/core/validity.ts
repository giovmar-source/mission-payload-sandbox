/**
 * Validity checks of the first-order model (CDR open item): the interface warns when a design
 * leaves the range where the formulas hold, instead of showing numbers without context.
 */

import { BODIES } from './bodies'
import type { Design, Results } from './design'

export type WarningCode = 'drag' | 'no-sso' | 'diffraction' | 'wide-swath'

export interface ValidityWarning {
  code: WarningCode
  /** Value that triggered the warning, for the message */
  value: number
}

/** Below this altitude on Earth, drag makes the circular, drag-free model optimistic */
export const EARTH_DRAG_ALTITUDE_KM = 300

/** Diffraction-limited resolution at nadir [m]: 1.22 λ h / D (Airy radius projected on ground) */
export function diffractionGsd(wavelengthNm: number, altitudeKm: number, apertureM: number): number {
  return (1.22 * wavelengthNm * 1e-9 * altitudeKm * 1e3) / apertureM
}

/**
 * Swath on a spherical body for the same field of view as a flat swath of `flatSwathKm`:
 * the edge pixel looks at half-angle α = atan(swath / 2h); the Earth-central angle to the
 * edge is asin((R + h)/R · sin α) − α.
 */
export function sphericalSwath(radiusKm: number, altitudeKm: number, flatSwathKm: number): number {
  const alpha = Math.atan(flatSwathKm / 2 / altitudeKm)
  const s = ((radiusKm + altitudeKm) / radiusKm) * Math.sin(alpha)
  if (s >= 1) return Number.POSITIVE_INFINITY // the field of view goes past the horizon
  return 2 * radiusKm * (Math.asin(s) - alpha)
}

export function validityWarnings(d: Design, r: Results): ValidityWarning[] {
  const out: ValidityWarning[] = []
  const body = BODIES[d.body]
  if (d.body === 'earth' && d.altitudeKm < EARTH_DRAG_ALTITUDE_KM) out.push({ code: 'drag', value: d.altitudeKm })
  if (!Number.isFinite(r.ssoInclinationDeg)) out.push({ code: 'no-sso', value: d.altitudeKm })

  const p = d.payload
  const wavelengths = p.family === 'multispectral'
    ? p.bands.filter((b) => b.gsdFactor === 1).map((b) => b.centreNm)
    : p.ranges.map((rg) => (rg.minNm + rg.maxNm) / 2)
  if (wavelengths.length) {
    const diff = diffractionGsd(Math.max(...wavelengths), d.altitudeKm, p.apertureM)
    if (diff > r.gsdM) out.push({ code: 'diffraction', value: diff })
  }

  const spherical = sphericalSwath(body.equatorialRadius, d.altitudeKm, r.swathKm)
  const error = spherical / r.swathKm - 1
  if (error > 0.01) out.push({ code: 'wide-swath', value: error })
  return out
}
