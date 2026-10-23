/**
 * Mass, power and on-board computing budgets with the ESA margin policy (SB-05).
 *
 * Source: ESA, "Margin philosophy for science assessment studies", SRE-PA/2011.097,
 * issue 1 revision 3, 15 June 2012
 * (https://sci.esa.int/documents/34375/36249/1567260131067-Margin_philosophy_for_science_assessment_studies_1.3.pdf)
 *
 * - R-M1-4 / R-P-1: equipment design-maturity margins of at least 5% (ECSS categories A/B,
 *   off-the-shelf), 10% (C, minor modifications) and 20% (D, new or major redesign).
 * - R-M1-2: the nominal dry mass includes the equipment margins.
 * - R-M1-1 / R-M1-3: a 20% system mass margin, explicitly visible in the budget, is applied
 *   to the nominal dry mass.
 * - R-P-3: a system power margin of at least 20% of the nominal power requirements.
 * - R-SW-1: on-board RAM with a memory margin of at least 50%.
 * - R-SW-2: processor peak usage not above 50% of its capability.
 *
 * Interpretation stated in the interface: the 20% system margins are computed on the nominal
 * values that already include the equipment margins; the RAM margin is the spare capacity
 * relative to the RAM used, (capacity − used) / used.
 */

export type Maturity = 'A' | 'B' | 'C' | 'D'

export const MATURITY_MARGIN: Record<Maturity, number> = { A: 0.05, B: 0.05, C: 0.1, D: 0.2 }
export const SYSTEM_MASS_MARGIN = 0.2
export const SYSTEM_POWER_MARGIN = 0.2
export const RAM_MARGIN_MIN = 0.5
export const CPU_PEAK_MAX = 0.5

export interface Unit {
  name: string
  /** Current best estimate without margin [kg] */
  massKg: number
  /** Current best estimate without margin [W] */
  powerW: number
  maturity: Maturity
}

export interface BudgetLine {
  name: string
  maturity: Maturity
  margin: number
  estimate: number
  withMargin: number
}

export interface Budget {
  lines: BudgetLine[]
  /** Sum of estimates with equipment margins (ESA "nominal") */
  nominal: number
  /** System margin, kept visible as its own line */
  systemMargin: number
  /** Nominal + system margin */
  total: number
}

function budget(units: Unit[], value: (u: Unit) => number, systemMargin: number): Budget {
  const lines = units.map((u) => {
    const margin = MATURITY_MARGIN[u.maturity]
    const estimate = value(u)
    return { name: u.name, maturity: u.maturity, margin, estimate, withMargin: estimate * (1 + margin) }
  })
  const nominal = lines.reduce((s, l) => s + l.withMargin, 0)
  return { lines, nominal, systemMargin: nominal * systemMargin, total: nominal * (1 + systemMargin) }
}

/** Dry mass budget [kg] */
export function massBudget(units: Unit[]): Budget {
  return budget(units, (u) => u.massKg, SYSTEM_MASS_MARGIN)
}

/** Power budget [W] */
export function powerBudget(units: Unit[]): Budget {
  return budget(units, (u) => u.powerW, SYSTEM_POWER_MARGIN)
}

/** RAM margin (capacity − used) / used, and whether it meets R-SW-1 */
export function ramCheck(usedMB: number, capacityMB: number): { margin: number; compliant: boolean } {
  const margin = (capacityMB - usedMB) / usedMB
  return { margin, compliant: margin >= RAM_MARGIN_MIN }
}

/** Processor peak load as a fraction of capability, and whether it meets R-SW-2 */
export function cpuCheck(peakLoad: number): { load: number; compliant: boolean } {
  return { load: peakLoad, compliant: peakLoad <= CPU_PEAK_MAX }
}

/**
 * Mass memory: fill fraction of the data stored between two ground contacts. The ESA policy
 * sets no margin here, so compliance is judged against the user's own requirement (SB-04).
 */
export function storageFill(volumeBetweenContactsBit: number, capacityBit: number): number {
  return volumeBetweenContactsBit / capacityBit
}
