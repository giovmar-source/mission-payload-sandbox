/**
 * Radiometry and signal-to-noise ratio of a pushbroom imager (SB-01).
 *
 * Signal electrons collected by one pixel during one line time:
 *   P  = L · Δλ · A_ap · Ω_pix          (W)   with Ω_pix = (GSD / h)², A_ap = π D² / 4
 *   Ne = P · t · λ / (h c) · τ · η · N_TDI
 * Noise: shot noise, read noise and dark signal. In a CCD the TDI stages add charge in the
 * charge domain and the pixel is read once, so read noise enters once:
 *   SNR = Ne / √(Ne + σ_read² + N_dark)
 *
 * Assumptions, shown in the interface: nadir view, radiance uniform over the pixel,
 * optics transmission τ and quantum efficiency η band-averaged.
 */

import { BODIES, type Body } from './bodies'

const PLANCK = 6.62607015e-34 // J s (exact, SI)
const LIGHT = 299792458 // m/s (exact, SI)

export interface PixelRadiometry {
  /** Top-of-atmosphere spectral radiance [W m⁻² sr⁻¹ µm⁻¹] */
  radiance: number
  /** Band centre [nm] */
  wavelengthNm: number
  /** Bandwidth [nm] */
  bandwidthNm: number
  /** Entrance pupil diameter [m] */
  apertureM: number
  /** Ground sampling distance [m] */
  gsdM: number
  altitudeKm: number
  /** Integration time per stage [s], usually the line time */
  integrationS: number
  /** Optics transmission τ [0–1] */
  transmission: number
  /** Detector quantum efficiency η [0–1] */
  quantumEfficiency: number
  /** Number of TDI stages (1 = no TDI) */
  tdiStages?: number
}

/** Solid angle of one pixel seen from the instrument [sr] */
export function pixelSolidAngle(gsdM: number, altitudeKm: number): number {
  return (gsdM / (altitudeKm * 1e3)) ** 2
}

/** Signal electrons per pixel per line */
export function signalElectrons(p: PixelRadiometry): number {
  const area = (Math.PI * p.apertureM ** 2) / 4
  const power = p.radiance * (p.bandwidthNm / 1e3) * area * pixelSolidAngle(p.gsdM, p.altitudeKm)
  const photonEnergy = (PLANCK * LIGHT) / (p.wavelengthNm * 1e-9)
  const stages = p.tdiStages ?? 1
  return (power * p.integrationS / photonEnergy) * p.transmission * p.quantumEfficiency * stages
}

/** SNR from signal electrons (all TDI stages), read noise [e⁻ rms, read once] and dark signal [e⁻] */
export function snr(signal: number, readNoise = 0, darkElectrons = 0): number {
  return signal / Math.sqrt(signal + readNoise ** 2 + darkElectrons)
}

/**
 * The same scene (same reflectance and illumination geometry) seen around another body:
 * radiance scales with the solar irradiance at that body's distance from the Sun.
 */
export function radianceAtBody(earthRadiance: number, body: Body): number {
  return earthRadiance * (body.solarIrradiance / BODIES.earth.solarIrradiance)
}

/**
 * Radiance of a Lambertian surface of reflectance ρ lit by the Sun at zenith angle θ, without
 * the atmosphere:  L = ρ · E₀ · cos θ / (π d²),  E₀ solar spectral irradiance at 1 AU
 * [W m⁻² µm⁻¹], d Sun distance [AU]. The atmosphere removes part of the light and adds path
 * radiance; at 30° zenith the net effect is of the order of ten percent in the visible.
 */
export function reflectanceToRadiance(reflectance: number, solarIrradiance: number, sunZenithDeg: number, distanceAu = 1): number {
  return (reflectance * solarIrradiance * Math.cos((sunZenithDeg * Math.PI) / 180)) / (Math.PI * distanceAu ** 2)
}
