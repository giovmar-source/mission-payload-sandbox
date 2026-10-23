/**
 * Imaging spectrometer (pushbroom, dispersive) as a payload family (SB-09).
 *
 * A spectrometer is modelled as a pushbroom imager with many contiguous narrow bands:
 * each spectral channel collects the radiance of one sampling interval Δλ. The trade-off it
 * shows:
 *   - band count  N ≈ (λmax − λmin) / Δλ           (per spectral channel group)
 *   - signal per band ∝ Δλ, so shot-noise SNR ∝ √Δλ
 *   - data rate ∝ N
 * Spectral sampling varies across a real detector (for EnMAP 4.8–8.2 nm in the VNIR): the
 * model uses the average sampling, and the interface says so.
 */

import type { BandSampling } from './data'

export interface SpectralRange {
  name: string
  minNm: number
  maxNm: number
  /** Average spectral sampling interval [nm] */
  samplingNm: number
}

export interface SpectralChannel {
  range: string
  centreNm: number
  widthNm: number
}

/** Number of contiguous channels that fit in a range at the given sampling */
export function channelCount(range: SpectralRange): number {
  return Math.floor((range.maxNm - range.minNm) / range.samplingNm)
}

/** Channel list (centre and width) for one or more ranges; overlapping ranges are kept */
export function spectralChannels(ranges: SpectralRange[]): SpectralChannel[] {
  return ranges.flatMap((r) =>
    Array.from({ length: channelCount(r) }, (_, i) => ({
      range: r.name,
      centreNm: r.minNm + (i + 0.5) * r.samplingNm,
      widthNm: r.samplingNm,
    })),
  )
}

/** Band sampling for the data-rate model: every channel at the same GSD and bit depth */
export function channelSampling(channels: SpectralChannel[], gsdM: number, bits: number): BandSampling[] {
  return channels.map(() => ({ gsdM, bits }))
}

/** Shot-noise SNR scaling when the sampling changes from Δλ₁ to Δλ₂ (same radiance level) */
export function snrScaleWithSampling(fromNm: number, toNm: number): number {
  return Math.sqrt(toNm / fromNm)
}
