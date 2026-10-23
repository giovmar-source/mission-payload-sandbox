// Imaging spectrometer family (SB-09) and the EnMAP reference preset (SB-02).

import { BODIES } from '../bodies'
import { groundSpeed, sunSynchronousInclination } from '../orbit'
import { groundSamplingDistance, swathFromFov } from '../geometry'
import { rawDataRate } from '../data'
import { signalElectrons, snr } from '../radiometry'
import { channelCount, channelSampling, snrScaleWithSampling, spectralChannels, type SpectralRange } from '../spectrometer'
import { preset, presetsByFamily } from '../presets'

const enmap = preset('enmap-hsi')
const p = enmap.published
const within = (v: number, ref: number, tol: number) => Math.abs(v - ref) / Math.abs(ref) <= tol
const RANGES: SpectralRange[] = [
  { name: 'VNIR', minNm: p.vnirMinNm.value, maxNm: p.vnirMaxNm.value, samplingNm: p.vnirSamplingNm.value },
  { name: 'SWIR', minNm: p.swirMinNm.value, maxNm: p.swirMaxNm.value, samplingNm: p.swirSamplingNm.value },
]

describe('EnMAP reference preset', () => {
  it('[SB-02] GSD from published focal length and pixel pitch within 5% of 30 m', () => {
    const gsd = groundSamplingDistance(enmap.altitudeKm, p.pixelPitch.value, p.focalLength.value)
    expect(within(gsd, p.gsd.value, 0.05)).toBe(true)
  })

  it('[SB-02] swath from the ±1.31° field of view within 5% of 30 km', () => {
    expect(within(swathFromFov(enmap.altitudeKm, p.fieldOfView.value), p.swath.value, 0.05)).toBe(true)
  })

  it('[SB-02] sun-synchronous inclination at 653 km within 5% of the published 98°', () => {
    expect(within(sunSynchronousInclination(BODIES.earth, enmap.altitudeKm), p.inclination.value, 0.05)).toBe(true)
  })
})

describe('imaging spectrometer', () => {
  it('[SB-09] payload families: multispectral and hyperspectral presets are both available', () => {
    expect(presetsByFamily('multispectral').length).toBeGreaterThan(0)
    expect(presetsByFamily('hyperspectral').map((x) => x.id)).toContain('enmap-hsi')
  })

  it('[SB-09] channel count from average sampling: EnMAP within 10% of the published 228 bands', () => {
    const counts = RANGES.map(channelCount)
    expect(counts).toEqual([89, 155])
    // Average sampling ignores its variation across the detector (4.8–8.2 nm in the VNIR):
    // the estimate is about 7% high, documented in the validation note.
    expect(within(counts[0] + counts[1], p.bands.value, 0.1)).toBe(true)
  })

  it('[SB-09] channels are contiguous and centred in their sampling interval', () => {
    const ch = spectralChannels([RANGES[0]])
    expect(ch[0].centreNm).toBeCloseTo(420 + 3.25, 9)
    expect(ch[1].centreNm - ch[0].centreNm).toBeCloseTo(6.5, 9)
    expect(ch.at(-1)!.centreNm + ch.at(-1)!.widthNm / 2).toBeLessThanOrEqual(1000)
  })

  it('[SB-09] halving the sampling doubles the channels and the data rate, and lowers SNR by √2', () => {
    const fine = { ...RANGES[0], samplingNm: RANGES[0].samplingNm / 2 }
    expect(channelCount(fine)).toBeGreaterThanOrEqual(2 * channelCount(RANGES[0]))
    const vg = groundSpeed(BODIES.earth, enmap.altitudeKm)
    const rate = (r: SpectralRange) => rawDataRate(p.swath.value, vg, channelSampling(spectralChannels([r]), p.gsd.value, p.quantisation.value))
    expect(rate(fine) / rate(RANGES[0])).toBeGreaterThanOrEqual(2 - 1e-9)
    expect(snrScaleWithSampling(6.5, 3.25)).toBeCloseTo(1 / Math.SQRT2, 9)

    // the same scaling from the full radiometric model (shot noise only)
    const pixel = (widthNm: number) => signalElectrons({
      radiance: 100, wavelengthNm: 495, bandwidthNm: widthNm, apertureM: enmap.derived.aperture.value,
      gsdM: p.gsd.value, altitudeKm: enmap.altitudeKm, integrationS: p.gsd.value / (vg * 1e3),
      transmission: 0.8, quantumEfficiency: 0.6,
    })
    expect(snr(pixel(3.25)) / snr(pixel(6.5))).toBeCloseTo(1 / Math.SQRT2, 6)
  })
})
