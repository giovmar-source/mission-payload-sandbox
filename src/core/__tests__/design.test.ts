// The design object, its evaluation and sharing (SB-04, SB-06, SB-07, SB-08, SB-09).

import { designFromPreset, evaluate, UI_PRESETS } from '../design'
import { decodeDesign, encodeDesign } from '../share'
import { slantRange } from '../link'

describe('design evaluation', () => {
  it('[SB-07] every preset is evaluated in less than 100 ms', () => {
    for (const id of UI_PRESETS) {
      const d = designFromPreset(id)
      const t0 = performance.now()
      evaluate(d)
      expect(performance.now() - t0).toBeLessThan(100)
    }
  })

  it('[SB-01] Sentinel-2 design reproduces 10 m GSD, 290 km swath and the 1.3 Gbit/s raw rate', () => {
    const r = evaluate(designFromPreset('sentinel-2-msi'))
    expect(r.gsdM).toBeCloseTo(10, 2)
    expect(r.swathKm).toBeCloseTo(290, 0)
    expect(r.rawRateMbps / 1300).toBeGreaterThan(0.95)
    expect(r.rawRateMbps / 1300).toBeLessThan(1.05)
    expect(r.bands).toHaveLength(13)
  })

  it('[SB-09] the EnMAP design is hyperspectral: 244 channels, 30 m GSD', () => {
    const r = evaluate(designFromPreset('enmap-hsi'))
    expect(r.channelCount).toBe(244)
    expect(r.gsdM).toBeCloseTo(30, 0)
  })

  it('[SB-06] the Mars design uses the link budget, sols and Mars radiance', () => {
    const d = designFromPreset('mro-hirise')
    const r = evaluate(d)
    expect(r.dayName).toBe('sol')
    expect(r.link?.limitedBy).toBe('link') // default: maximum Earth–Mars distance
    const near = evaluate({ ...d, link: { ...d.link, marsDistanceKm: 54.6e6 } })
    expect(near.link?.limitedBy).toBe('radio')
    expect(near.downlinkPerDayGbit).toBeGreaterThan(r.downlinkPerDayGbit)
  })

  it('[SB-04] changing a design input updates the compliance matrix', () => {
    const d = designFromPreset('sentinel-2-msi')
    const ok = evaluate(d).compliance.find((c) => c.quantity === 'gsd')!
    const coarse = evaluate({ ...d, altitudeKm: 900 }).compliance.find((c) => c.quantity === 'gsd')!
    expect(ok.status).not.toBe('non-compliant')
    expect(coarse.status).toBe('non-compliant')
  })

  it('[SB-01] slant range at 90° elevation equals the altitude', () => {
    expect(slantRange(6378.137, 786, 90)).toBeCloseTo(786, 6)
    expect(slantRange(6378.137, 786, 5)).toBeGreaterThan(2000)
  })
})

describe('HiRISE design', () => {
  it('[SB-06] duty cycle derived from ~18 Tbit over the 2-year primary science phase', () => {
    const d = designFromPreset('mro-hirise')
    const r = evaluate(d)
    // ~18 Tbit / ~710 sols ≈ 25 Gbit per sol
    expect(r.dailyVolumeGbit).toBeGreaterThan(20)
    expect(r.dailyVolumeGbit).toBeLessThan(30)
    expect(d.payload.tdiStages).toBe(128)
    expect(r.snrMin).toBeGreaterThan(100)
  })
})

describe('sharing', () => {
  it('[SB-08] a design survives the share-link round trip', () => {
    for (const id of UI_PRESETS) {
      const d = designFromPreset(id)
      expect(decodeDesign(encodeDesign(d))).toEqual(d)
    }
  })

  it('[SB-08] an invalid or foreign code is rejected', () => {
    expect(decodeDesign('not-a-design')).toBeNull()
    expect(decodeDesign(btoa(JSON.stringify({ version: 2 })))).toBeNull()
  })
})
