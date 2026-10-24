// Validity warnings and trade-off curves (CDR items; SB-01, SB-03, SB-07).

import { designFromPreset, evaluate } from '../design'
import { altitudeSweep } from '../sweep'
import { diffractionGsd, sphericalSwath, validityWarnings } from '../validity'

const codes = (id: string, patch = {}) => {
  const d = { ...designFromPreset(id), ...patch }
  return validityWarnings(d, evaluate(d)).map((w) => w.code)
}

describe('validity warnings', () => {
  it('[SB-03] presets inside the model range raise no drag or swath warning', () => {
    expect(codes('sentinel-2-msi')).toEqual([])
    expect(codes('enmap-hsi')).toEqual([])
  })

  it('[SB-03] Earth orbit below 300 km warns about atmospheric drag', () => {
    expect(codes('sentinel-2-msi', { altitudeKm: 250 })).toContain('drag')
  })

  it('[SB-03] HiRISE samples finer than its diffraction spot (0.30 m pixel, ~0.51 m Airy radius)', () => {
    expect(diffractionGsd(700, 300, 0.5)).toBeCloseTo(0.5124, 3)
    expect(codes('mro-hirise')).toContain('diffraction')
  })

  it('[SB-03] spherical swath: Sentinel-2 290 km flat is about +0.2% on the sphere, below the 1% warning', () => {
    const s = sphericalSwath(6378.137, 786, 290)
    expect(s / 290 - 1).toBeGreaterThan(0.001)
    expect(s / 290 - 1).toBeLessThan(0.01)
    expect(sphericalSwath(6378.137, 300, 5000)).toBe(Number.POSITIVE_INFINITY) // beyond the horizon
  })
})

describe('trade-off curves', () => {
  it('[SB-01] higher orbit: coarser GSD, faster equator coverage', () => {
    const rows = altitudeSweep(designFromPreset('sentinel-2-msi'), 300, 1200, 20)
    expect(rows).toHaveLength(21)
    for (let i = 1; i < rows.length; i++) {
      expect(rows.at(i)!.gsd).toBeGreaterThan(rows.at(i - 1)!.gsd)
      expect(rows.at(i)!.revisit).toBeLessThan(rows.at(i - 1)!.revisit)
    }
  })

  it('[SB-07] a 41-point sweep is computed in less than 100 ms', () => {
    const d = designFromPreset('enmap-hsi')
    const t0 = performance.now()
    altitudeSweep(d, 300, 1200, 40)
    expect(performance.now() - t0).toBeLessThan(100)
  })
})
