/**
 * Live compliance matrix of user requirements (SB-04).
 *
 * A requirement is a limit on one computed quantity, either a maximum (GSD ≤ 10 m) or a
 * minimum (SNR ≥ 100). The margin is the relative distance from the limit, positive when the
 * design complies:
 *   maximum: (limit − value) / limit        minimum: (value − limit) / limit
 * Status: compliant, marginal when the margin is below a declared warning band (default 10%),
 * non-compliant when the margin is negative. The warning band is a sandbox convention, not an
 * ESA rule, and the interface says so.
 */

export type Sense = 'max' | 'min'
export type Status = 'compliant' | 'marginal' | 'non-compliant'

export interface UserRequirement {
  id: string
  quantity: string
  sense: Sense
  limit: number
  unit: string
}

export interface ComplianceRow extends UserRequirement {
  value: number
  margin: number
  status: Status
}

export const DEFAULT_WARNING_BAND = 0.1

export function margin(value: number, limit: number, sense: Sense): number {
  return sense === 'max' ? (limit - value) / limit : (value - limit) / limit
}

export function status(m: number, warningBand = DEFAULT_WARNING_BAND): Status {
  if (!Number.isFinite(m) || m < 0) return 'non-compliant'
  return m < warningBand ? 'marginal' : 'compliant'
}

/** Build the matrix from requirements and the current computed values (by quantity name) */
export function complianceMatrix(
  requirements: UserRequirement[],
  values: Record<string, number>,
  warningBand = DEFAULT_WARNING_BAND,
): ComplianceRow[] {
  return requirements.map((r) => {
    const value = values[r.quantity]
    const m = value === undefined ? Number.NaN : margin(value, r.limit, r.sense)
    return { ...r, value, margin: m, status: status(m, warningBand) }
  })
}
