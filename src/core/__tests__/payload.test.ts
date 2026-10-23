// Radiometry, data and link modules against published values. Tolerances and assumptions
// are stated here and in docs/ecss/VALIDATION.md; they were fixed before comparing.

import { BODIES } from '../bodies'
import { groundSpeed } from '../orbit'
import { radianceAtBody, signalElectrons, snr } from '../radiometry'
import { dailyVolume, downlinkTime, rawDataRate } from '../data'
import { linkBudget, parabolicGainDb } from '../link'
import { S2_BANDS, preset } from '../presets'

const { earth, mars } = BODIES
const s2 = preset('sentinel-2-msi')
const mro = preset('mro-hirise')

// Assumptions not published for MSI: optics transmission and quantum efficiency (band-averaged)
const TRANSMISSION = 0.8
const QE = 0.6

describe('radiometry', () => {
  it('[SB-01] Sentinel-2 10 m bands: shot-noise SNR at Lref within a factor 2 of the specification', () => {
    const vg = groundSpeed(earth, s2.altitudeKm)
    for (const b of S2_BANDS.filter((x) => x.gsdM === 10)) {
      const signal = signalElectrons({
        radiance: b.lref, wavelengthNm: b.centreNm, bandwidthNm: b.widthNm,
        apertureM: s2.published.aperture.value, gsdM: b.gsdM, altitudeKm: s2.altitudeKm,
        integrationS: b.gsdM / (vg * 1e3), transmission: TRANSMISSION, quantumEfficiency: QE,
      })
      const ratio = snr(signal) / b.snrRequired
      expect(ratio).toBeGreaterThan(0.5)
      expect(ratio).toBeLessThan(2)
    }
  })

  it('[SB-01] read noise and dark signal lower the SNR; CCD TDI raises it (read noise counted once)', () => {
    expect(snr(10000, 50, 100)).toBeLessThan(snr(10000))
    expect(snr(4 * 10000, 50)).toBeGreaterThan(snr(10000, 50))
    expect(snr(1e4, 50)).toBeCloseTo(1e4 / Math.sqrt(1e4 + 2500), 9)
  })

  it('[SB-06] the same scene around Mars has 43% of the Earth radiance (586.2 / 1361 W/m²)', () => {
    expect(radianceAtBody(100, mars)).toBeCloseTo(100 * 586.2 / 1361, 6)
    expect(radianceAtBody(100, earth)).toBe(100)
  })
})

describe('data', () => {
  it('[SB-02] Sentinel-2 uncompressed data rate within 5% of the published 1.3 Gbit/s', () => {
    const vg = groundSpeed(earth, s2.altitudeKm)
    const rate = rawDataRate(s2.published.swath.value, vg, S2_BANDS.map((b) => ({ gsdM: b.gsdM, bits: s2.published.quantisation.value })))
    expect(Math.abs(rate / 1e9 - s2.published.rawDataRate.value) / s2.published.rawDataRate.value).toBeLessThan(0.05)
  })

  it('[SB-01] daily volume and downlink time follow from rate and duty cycle', () => {
    expect(dailyVolume(1e6, 0.5)).toBe(43.2e9)
    expect(downlinkTime(6e9, 1e6)).toBe(6000)
  })
})

describe('link', () => {
  // MRO X-band: published power, antenna, frequency and EIRP; DSN 34 m gain and noise
  // temperature. Assumed: antenna efficiency 0.55, Eb/N0 1 dB (turbo code), margin 3 dB,
  // other losses 2 dB.
  const base = {
    transmitterPowerW: mro.published.transmitterPower.value,
    txAntennaDiameterM: mro.published.highGainAntenna.value,
    txAntennaEfficiency: 0.55,
    frequencyHz: mro.published.xBandFrequency.value * 1e9,
    rxGainDbi: mro.published.dsn34mGainX.value,
    systemNoiseK: mro.published.dsn34mNoiseTempX.value,
    requiredEbN0Db: 1,
    marginDb: 3,
    otherLossesDb: 2,
    maxRateBps: mro.published.downlinkMax.value * 1e6,
  }

  it('[SB-02] MRO X-band EIRP within 1 dB of the published 95.6 dBm', () => {
    const eirpDbm = 10 * Math.log10(base.transmitterPowerW * 1e3) + parabolicGainDb(base.txAntennaDiameterM, base.frequencyHz, base.txAntennaEfficiency)
    expect(Math.abs(eirpDbm - mro.published.xBandEirp.value)).toBeLessThan(1)
  })

  it('[SB-06] Mars at maximum distance: rate within a factor 2 of the 0.6 Mbps reported for MRO', () => {
    const far = linkBudget({ ...base, distanceKm: mars.distanceFromEarth.max })
    expect(far.limitedBy).toBe('link')
    expect(far.rateBps / 1e6 / mro.published.downlinkFar34m.value).toBeGreaterThan(0.5)
    expect(far.rateBps / 1e6 / mro.published.downlinkFar34m.value).toBeLessThan(2)
  })

  it('[SB-06] Mars at minimum distance: the radio, not the link, limits the rate', () => {
    const near = linkBudget({ ...base, distanceKm: mars.distanceFromEarth.min })
    const far = linkBudget({ ...base, distanceKm: mars.distanceFromEarth.max })
    expect(near.limitedBy).toBe('radio')
    expect(near.rateBps).toBe(base.maxRateBps)
    // free-space physics alone: (401.4 / 54.6)² ≈ 54
    expect(near.physicsRateBps / far.physicsRateBps).toBeCloseTo((401.4 / 54.6) ** 2, 3)
  })
})
