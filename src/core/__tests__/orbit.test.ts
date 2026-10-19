// Test names start with the requirement they verify, e.g. "[SB-02] …": scripts/vcd.mjs reads
// them to build the Verification Control Document (ECSS-E-ST-10-02C, Annex B).

import { BODIES } from '../bodies'
import {
  equatorCoverageDays, groundSpeed, orbitalPeriod, orbitsPerDay, sunSynchronousInclination,
} from '../orbit'
import { groundSamplingDistance, ifov, lineTime, swathFromPixels } from '../geometry'
import { preset } from '../presets'

const { earth, mars } = BODIES
const within = (value: number, reference: number, tolerance: number) =>
  Math.abs(value - reference) / Math.abs(reference) <= tolerance

describe('orbit model', () => {
  it('[SB-01] returns finite, physically ordered values for Earth and Mars', () => {
    for (const body of [earth, mars]) {
      const low = orbitalPeriod(body, 300)
      const high = orbitalPeriod(body, 800)
      expect(Number.isFinite(low)).toBe(true)
      expect(high).toBeGreaterThan(low) // higher orbit, longer period
      expect(groundSpeed(body, 800)).toBeLessThan(groundSpeed(body, 300))
      expect(orbitsPerDay(body, 300)).toBeGreaterThan(orbitsPerDay(body, 800))
    }
  })

  it('[SB-02] Sentinel-2 period within 5% of the published 100.6 min', () => {
    const s2 = preset('sentinel-2-msi')
    const minutes = orbitalPeriod(earth, s2.altitudeKm) / 60
    expect(within(minutes, s2.published.period.value, 0.05)).toBe(true)
    expect(minutes).toBeCloseTo(100.6, 0)
  })

  it('[SB-02] sun-synchronous inclination of Sentinel-2 and Landsat 8 within 5% of published', () => {
    for (const id of ['sentinel-2-msi', 'landsat-8-oli']) {
      const p = preset(id)
      const inc = sunSynchronousInclination(earth, p.altitudeKm)
      expect(within(inc, p.published.inclination.value, 0.05)).toBe(true)
      expect(Math.abs(inc - p.published.inclination.value)).toBeLessThan(0.2) // degrees
    }
  })

  it('[SB-02] HiRISE GSD and swath from published optics within 5%', () => {
    const h = preset('mro-hirise')
    const gsd = groundSamplingDistance(h.altitudeKm, h.derived.pixelPitch.value, h.derived.focalLength.value)
    expect(within(gsd, h.published.gsd.value, 0.05)).toBe(true)
    expect(ifov(h.derived.pixelPitch.value, h.derived.focalLength.value)).toBeCloseTo(h.published.ifov.value, 6)
    const swath = swathFromPixels(h.published.pixelsAcrossRed.value, gsd)
    expect(swath).toBeGreaterThanOrEqual(h.published.swathRedMin.value) // published: "> 6 km"
  })

  it('[SB-01] Sentinel-2 equatorial coverage close to the published revisit (1 and 2 satellites)', () => {
    const s2 = preset('sentinel-2-msi')
    const one = equatorCoverageDays(earth, s2.altitudeKm, s2.published.swath.value, 1)
    const two = equatorCoverageDays(earth, s2.altitudeKm, s2.published.swath.value, 2)
    expect(within(one, s2.published.revisitOneSatellite.value, 0.05)).toBe(true)
    expect(within(two, s2.published.revisitTwoSatellites.value, 0.05)).toBe(true)
  })

  it('[SB-01] Landsat 8 coverage estimate is below the 16-day repeat cycle (different quantities, documented)', () => {
    const l8 = preset('landsat-8-oli')
    const days = equatorCoverageDays(earth, l8.altitudeKm, l8.published.swath.value)
    // Coverage of the equator is not the exact repeat cycle of the ground track: the estimate
    // is about 7% shorter. The validation note explains the difference instead of hiding it.
    expect(days).toBeLessThan(l8.published.repeatCycle.value)
    expect(within(days, l8.published.repeatCycle.value, 0.1)).toBe(true)
  })

  it('[SB-06] Mars at 300 km: line time compatible with the HiRISE minimum of 76 µs', () => {
    const h = preset('mro-hirise')
    const t = lineTime(h.published.gsd.value, groundSpeed(mars, h.altitudeKm))
    expect(t).toBeGreaterThanOrEqual(h.published.lineTimeMin.value)
    expect(orbitalPeriod(mars, 300) / 60).toBeGreaterThan(orbitalPeriod(earth, 300) / 60)
  })
})
