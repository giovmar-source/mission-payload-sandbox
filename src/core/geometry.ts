/**
 * Instrument viewing geometry at nadir (SB-01).
 *
 * GSD from the pinhole relation GSD = h · p / f; swath from the number of pixels across
 * track. Wide fields of view (for example Sentinel-2) need an Earth-curvature correction,
 * which is added in a later module; for now wide-swath presets take their published swath.
 */

/** Ground sampling distance [m] from altitude [km], pixel pitch [µm] and focal length [m] */
export function groundSamplingDistance(altitudeKm: number, pixelPitchUm: number, focalLengthM: number): number {
  return (altitudeKm * 1e3 * pixelPitchUm * 1e-6) / focalLengthM
}

/** Instantaneous field of view of one pixel [µrad] */
export function ifov(pixelPitchUm: number, focalLengthM: number): number {
  return (pixelPitchUm * 1e-6) / focalLengthM * 1e6
}

/** Swath width [km] for N pixels across track at the given GSD [m], flat-surface approximation */
export function swathFromPixels(pixelsAcross: number, gsdM: number): number {
  return (pixelsAcross * gsdM) / 1e3
}

/** Line time of a pushbroom imager [µs]: the time the ground point takes to move one GSD */
export function lineTime(gsdM: number, groundSpeedKmS: number): number {
  return (gsdM / (groundSpeedKmS * 1e3)) * 1e6
}
