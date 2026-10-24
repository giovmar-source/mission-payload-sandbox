// Radiometric checks closed at QR: EnMAP SNR at its specification conditions, Landsat 8 OLI
// on-orbit SNR against its requirement (SB-01, SB-04).

import { complianceMatrix } from '../compliance'
import { BODIES } from '../bodies'
import { groundSpeed } from '../orbit'
import { OLI_SNR, preset } from '../presets'
import { reflectanceToRadiance, signalElectrons, snr } from '../radiometry'

describe('EnMAP SNR at the specification conditions', () => {
  const ps = preset('enmap-hsi')
  const pub = ps.published
  const vg = groundSpeed(BODIES.earth, ps.altitudeKm)
  const modelSnr = (radiance: number, wavelengthNm: number, samplingNm: number) =>
    snr(signalElectrons({
      radiance, wavelengthNm, bandwidthNm: samplingNm, apertureM: ps.derived.aperture.value,
      gsdM: pub.gsd.value, altitudeKm: ps.altitudeKm, integrationS: pub.gsd.value / (vg * 1e3),
      transmission: 0.8, quantumEfficiency: 0.6,
    }), 50)

  it('[SB-01] reference radiance from 30% albedo and 30° Sun zenith, no atmosphere', () => {
    const l495 = reflectanceToRadiance(pub.snrReferenceAlbedo.value, pub.solarIrradianceB2.value, pub.snrReferenceSunZenith.value)
    expect(l495).toBeCloseTo(ps.derived.referenceRadiance495.value, 1)
    const l2200 = reflectanceToRadiance(pub.snrReferenceAlbedo.value, pub.solarIrradianceB12.value, pub.snrReferenceSunZenith.value)
    expect(l2200).toBeCloseTo(ps.derived.referenceRadiance2200.value, 2)
  })

  it('[SB-01] model SNR within a factor of 2 of the specification at 495 nm and 2200 nm', () => {
    const vnir = modelSnr(ps.derived.referenceRadiance495.value, 495, pub.vnirSamplingNm.value)
    const swir = modelSnr(ps.derived.referenceRadiance2200.value, 2200, pub.swirSamplingNm.value)
    for (const [model, spec] of [[vnir, pub.snrVnir495.value], [swir, pub.snrSwir2200.value]]) {
      expect(model / spec).toBeGreaterThan(0.5)
      expect(model / spec).toBeLessThan(2)
    }
  })
})

describe('Landsat 8 OLI on-orbit SNR', () => {
  it('[SB-04] the compliance matrix finds every band compliant, with the margins of the published data', () => {
    const reqs = OLI_SNR.map((b) => ({ id: b.band, quantity: b.band, sense: 'min' as const, limit: b.snrRequired, unit: '-' }))
    const values = Object.fromEntries(OLI_SNR.map((b) => [b.band, b.snrOnOrbit]))
    const rows = complianceMatrix(reqs, values)
    expect(rows.every((r) => r.status === 'compliant')).toBe(true)
    const blue = rows.find((r) => r.id === 'Blue')!
    expect(blue.margin).toBeCloseTo(370 / 130 - 1, 9)
    expect(Math.min(...rows.map((r) => r.margin))).toBeCloseTo(237 / 130 - 1, 9) // Coastal/Aerosol, smallest margin (+82%)
  })
})
