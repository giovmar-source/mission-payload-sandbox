/**
 * First-order circular-orbit model (SB-01).
 *
 * Assumptions, stated in the user interface next to each result:
 * - circular orbit, altitude measured above the equatorial radius;
 * - spherical body for period and speeds; J2 used only for the sun-synchronous inclination;
 * - ground speed ignores the body's rotation (a few per cent at low orbits).
 */

import type { Body } from './bodies'

/** Semi-major axis a = R + h [km] */
export function semiMajorAxis(body: Body, altitudeKm: number): number {
  return body.equatorialRadius + altitudeKm
}

/** Orbital period T = 2π √(a³/μ) [s] */
export function orbitalPeriod(body: Body, altitudeKm: number): number {
  const a = semiMajorAxis(body, altitudeKm)
  return 2 * Math.PI * Math.sqrt(a ** 3 / body.mu)
}

/** Orbital speed v = √(μ/a) [km/s] */
export function orbitalSpeed(body: Body, altitudeKm: number): number {
  return Math.sqrt(body.mu / semiMajorAxis(body, altitudeKm))
}

/** Speed of the sub-satellite point on the surface, v_g = (R/a)·v [km/s] */
export function groundSpeed(body: Body, altitudeKm: number): number {
  const a = semiMajorAxis(body, altitudeKm)
  return (body.equatorialRadius / a) * orbitalSpeed(body, altitudeKm)
}

/** Orbits per (solar) day of 86 400 s, n = 86 400 / T */
export function orbitsPerDay(body: Body, altitudeKm: number): number {
  return 86400 / orbitalPeriod(body, altitudeKm)
}

/**
 * Sun-synchronous inclination [deg]: the J2 nodal precession equals the body's mean motion
 * around the Sun, 2π / tropical year.
 *   cos i = −(2/3) · Ω̇ · a^{7/2} / (J2 · R² · √μ)
 * Returns NaN when no sun-synchronous orbit exists at that altitude (|cos i| > 1).
 */
export function sunSynchronousInclination(body: Body, altitudeKm: number): number {
  const a = semiMajorAxis(body, altitudeKm)
  const precession = (2 * Math.PI) / body.tropicalYear
  const cosI = (-2 / 3) * precession * a ** 3.5 / (body.j2 * body.equatorialRadius ** 2 * Math.sqrt(body.mu))
  if (Math.abs(cosI) > 1) return Number.NaN
  return (Math.acos(cosI) * 180) / Math.PI
}

/**
 * Days needed to cover the whole equator once, t ≈ 2πR / (n · swath · S).
 * This is an equatorial coverage estimate, not the exact repeat cycle of the ground track:
 * the interface shows both and explains the difference.
 */
export function equatorCoverageDays(body: Body, altitudeKm: number, swathKm: number, satellites = 1): number {
  const circumference = 2 * Math.PI * body.equatorialRadius
  return circumference / (orbitsPerDay(body, altitudeKm) * swathKm * satellites)
}
