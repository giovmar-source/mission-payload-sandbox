// ESA margin policy (SB-05) and the compliance matrix (SB-04).

import { BODIES } from '../bodies'
import { cpuCheck, massBudget, MATURITY_MARGIN, powerBudget, ramCheck, storageFill, type Unit } from '../budgets'
import { complianceMatrix, margin, status } from '../compliance'
import { dailyVolume } from '../data'
import { equatorCoverageDays, orbitsPerDay } from '../orbit'

const UNITS: Unit[] = [
  { name: 'Telescope (off-the-shelf)', massKg: 100, powerW: 10, maturity: 'A' },
  { name: 'Focal plane (minor modification)', massKg: 50, powerW: 40, maturity: 'C' },
  { name: 'Processing unit (new design)', massKg: 20, powerW: 50, maturity: 'D' },
]

describe('budgets with ESA margins', () => {
  it('[SB-05] equipment maturity margins are 5% (A/B), 10% (C) and 20% (D)', () => {
    expect(MATURITY_MARGIN).toEqual({ A: 0.05, B: 0.05, C: 0.1, D: 0.2 })
  })

  it('[SB-05] nominal dry mass includes equipment margins; 20% system margin is a visible line', () => {
    const b = massBudget(UNITS)
    const expected = [105, 55, 24]
    b.lines.forEach((l, i) => expect(l.withMargin).toBeCloseTo(expected.at(i)!, 9))
    expect(b.nominal).toBeCloseTo(184, 9)
    expect(b.systemMargin).toBeCloseTo(36.8, 9)
    expect(b.total).toBeCloseTo(220.8, 9)
  })

  it('[SB-05] power budget: equipment margins plus at least 20% system margin', () => {
    const b = powerBudget(UNITS)
    expect(b.nominal).toBeCloseTo(10.5 + 44 + 60, 9)
    expect(b.total / b.nominal).toBeCloseTo(1.2, 9)
  })

  it('[SB-05] RAM margin of at least 50% and processor peak load at most 50%', () => {
    expect(ramCheck(100, 150).compliant).toBe(true)
    expect(ramCheck(100, 149).compliant).toBe(false)
    expect(cpuCheck(0.5).compliant).toBe(true)
    expect(cpuCheck(0.51).compliant).toBe(false)
  })

  it('[SB-05] mass memory fill fraction (no ESA margin: judged by the user requirement)', () => {
    expect(storageFill(1.2e12, 2.4e12)).toBe(0.5)
  })
})

describe('compliance matrix', () => {
  it('[SB-04] margin is positive when compliant, for maximum and minimum limits', () => {
    expect(margin(8, 10, 'max')).toBeCloseTo(0.2, 9)
    expect(margin(12, 10, 'max')).toBeCloseTo(-0.2, 9)
    expect(margin(120, 100, 'min')).toBeCloseTo(0.2, 9)
  })

  it('[SB-04] status: compliant, marginal below the 10% warning band, non-compliant below zero', () => {
    expect(status(0.25)).toBe('compliant')
    expect(status(0.05)).toBe('marginal')
    expect(status(-0.01)).toBe('non-compliant')
    expect(status(Number.NaN)).toBe('non-compliant')
  })

  it('[SB-04] a design change propagates to every requirement of the matrix', () => {
    const reqs = [
      { id: 'U-1', quantity: 'gsd', sense: 'max' as const, limit: 10, unit: 'm' },
      { id: 'U-2', quantity: 'revisit', sense: 'max' as const, limit: 5, unit: 'days' },
    ]
    const before = complianceMatrix(reqs, { gsd: 9, revisit: 4 })
    const after = complianceMatrix(reqs, { gsd: 9, revisit: 6 })
    expect(before.map((r) => r.status)).toEqual(['compliant', 'compliant'])
    expect(after.map((r) => r.status)).toEqual(['compliant', 'non-compliant'])
  })
})

describe('Mars days in sols', () => {
  it('[SB-06] daily quantities on Mars use the 24.6597 h sol', () => {
    const { earth, mars } = BODIES
    expect(mars.solarDay / 3600).toBeCloseTo(24.6597, 4)
    expect(orbitsPerDay(mars, 300) * 86400 / mars.solarDay).toBeCloseTo(orbitsPerDay({ ...mars, solarDay: 86400 }, 300), 9)
    expect(dailyVolume(1e6, 1, mars.solarDay)).toBeGreaterThan(dailyVolume(1e6, 1))
    expect(equatorCoverageDays(earth, 786, 290)).toBeCloseTo(9.652, 2) // Earth unchanged
  })
})
