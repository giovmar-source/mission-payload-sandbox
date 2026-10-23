/**
 * Downlink capacity from the link equation (SB-01, SB-06).
 *
 *   EIRP   = P_t · G_t
 *   L_fs   = (4 π d / λ)²
 *   Pr/N0  = EIRP · G_r / (L_fs · L_other · k · T_sys)
 *   R      = Pr/N0 / ((Eb/N0)_req · margin)       capped by the maximum rate of the radio
 *
 * Assumptions, shown in the interface: line-of-sight free-space propagation; atmospheric,
 * pointing and polarisation losses lumped into L_other; parabolic antenna gain
 * G = η (π D / λ)².
 */

const LIGHT = 299792458 // m/s
const BOLTZMANN_DB = -228.6 // 10·log10(k), dBW/K/Hz

export const toDb = (x: number) => 10 * Math.log10(x)
export const fromDb = (db: number) => 10 ** (db / 10)

export function wavelength(frequencyHz: number): number {
  return LIGHT / frequencyHz
}

/** Gain of a parabolic antenna [dBi] */
export function parabolicGainDb(diameterM: number, frequencyHz: number, efficiency: number): number {
  return toDb(efficiency * ((Math.PI * diameterM) / wavelength(frequencyHz)) ** 2)
}

/** Free-space path loss [dB] for a distance in km */
export function freeSpaceLossDb(distanceKm: number, frequencyHz: number): number {
  return 20 * Math.log10((4 * Math.PI * distanceKm * 1e3) / wavelength(frequencyHz))
}

export interface LinkInput {
  transmitterPowerW: number
  txAntennaDiameterM: number
  txAntennaEfficiency: number
  frequencyHz: number
  rxGainDbi: number
  systemNoiseK: number
  distanceKm: number
  /** Required Eb/N0 of the coding scheme [dB] */
  requiredEbN0Db: number
  /** Link margin kept on top of the requirement [dB] */
  marginDb: number
  /** Other losses: atmosphere, pointing, polarisation, implementation [dB] */
  otherLossesDb: number
  /** Maximum rate of the radio [bit/s]; Infinity if not limiting */
  maxRateBps?: number
}

export interface LinkResult {
  eirpDbw: number
  freeSpaceLossDb: number
  prN0DbHz: number
  /** Rate allowed by the link physics [bit/s] */
  physicsRateBps: number
  /** Rate after the radio's own limit [bit/s] */
  rateBps: number
  limitedBy: 'link' | 'radio'
}

export function linkBudget(i: LinkInput): LinkResult {
  const eirpDbw = toDb(i.transmitterPowerW) + parabolicGainDb(i.txAntennaDiameterM, i.frequencyHz, i.txAntennaEfficiency)
  const fsl = freeSpaceLossDb(i.distanceKm, i.frequencyHz)
  const prN0DbHz = eirpDbw + i.rxGainDbi - fsl - i.otherLossesDb - (BOLTZMANN_DB + toDb(i.systemNoiseK))
  const physicsRateBps = fromDb(prN0DbHz - i.requiredEbN0Db - i.marginDb)
  const cap = i.maxRateBps ?? Infinity
  return {
    eirpDbw,
    freeSpaceLossDb: fsl,
    prN0DbHz,
    physicsRateBps,
    rateBps: Math.min(physicsRateBps, cap),
    limitedBy: physicsRateBps > cap ? 'radio' : 'link',
  }
}
