/**
 * The design: one object holding every input of the sandbox, and `evaluate`, a pure function
 * that computes every output from it (SB-01, SB-04, SB-07).
 *
 * Inputs that are not published for a preset are listed in `assumptions` by field path, so
 * the interface can mark them (SB-03).
 */

import { BODIES, type BodyId } from './bodies'
import { MATURITY_MARGIN, massBudget, powerBudget, type Budget, type Unit } from './budgets'
import { complianceMatrix, type ComplianceRow, type UserRequirement } from './compliance'
import { compressedRate, dailyVolume, rawDataRate, type BandSampling } from './data'
import { groundSamplingDistance, lineTime } from './geometry'
import { linkBudget, slantRange, type LinkResult } from './link'
import { equatorCoverageDays, groundSpeed, orbitalPeriod, orbitsPerDay, sunSynchronousInclination } from './orbit'
import { preset, S2_BANDS } from './presets'
import { radianceAtBody, signalElectrons, snr } from './radiometry'
import { channelCount, spectralChannels, type SpectralRange } from './spectrometer'

export type Family = 'multispectral' | 'hyperspectral'

export interface BandSpec {
  name: string
  centreNm: number
  widthNm: number
  /** GSD of this band relative to the base GSD (Sentinel-2: 1, 2 or 6) */
  gsdFactor: number
  /** Reference spectral radiance [W m⁻² sr⁻¹ µm⁻¹] */
  radiance: number
}

export interface RangeSpec extends SpectralRange {
  radiance: number
}

export interface Design {
  version: 1
  presetId: string | null
  body: BodyId
  altitudeKm: number
  satellites: number
  payload: {
    family: Family
    apertureM: number
    focalLengthM: number
    pixelPitchUm: number
    pixelsAcross: number
    bits: number
    compressionRatio: number
    /** Fraction of the time spent imaging */
    dutyCycle: number
    transmission: number
    quantumEfficiency: number
    readNoiseE: number
    tdiStages: number
    bands: BandSpec[]
    ranges: RangeSpec[]
  }
  link: {
    mode: 'rate' | 'budget'
    rateMbps: number
    powerW: number
    antennaM: number
    efficiency: number
    frequencyGHz: number
    rxGainDbi: number
    systemNoiseK: number
    ebn0Db: number
    marginDb: number
    lossesDb: number
    maxRateMbps: number
    /** Earth–Mars distance used for Mars missions [km] */
    marsDistanceKm: number
    /** Ground-station elevation used for Earth missions [deg] */
    elevationDeg: number
    /** Contact time per day (per sol on Mars) [h] */
    contactHours: number
  }
  storage: { capacityGbit: number }
  units: Unit[]
  requirements: UserRequirement[]
  /** Field paths whose values are assumptions, not published values */
  assumptions: string[]
  /** Field paths whose values are computed from published values */
  derived?: string[]
}

export interface BandResult {
  name: string
  centreNm: number
  widthNm: number
  gsdM: number
  radiance: number
  signalE: number
  snr: number
  channels: number
}

export interface Results {
  dayName: string
  periodMin: number
  groundSpeedKmS: number
  ssoInclinationDeg: number
  orbitsPerDay: number
  revisitDays: number
  gsdM: number
  swathKm: number
  lineTimeUs: number
  bands: BandResult[]
  channelCount: number
  snrMin: number
  rawRateMbps: number
  compressedRateMbps: number
  dailyVolumeGbit: number
  linkDistanceKm: number
  link: LinkResult | null
  downlinkRateMbps: number
  downlinkPerDayGbit: number
  /** Downlink capacity per day divided by the data generated per day */
  downlinkRatio: number
  /** One day of data as a fraction of the mass memory */
  storageFill: number
  mass: Budget
  power: Budget
  compliance: ComplianceRow[]
}

/** Quantities a user requirement can constrain, with units */
export const QUANTITIES: Record<string, { unit: string }> = {
  gsd: { unit: 'm' },
  swath: { unit: 'km' },
  revisit: { unit: 'days' },
  snrMin: { unit: '-' },
  dailyVolume: { unit: 'Gbit' },
  downlinkRatio: { unit: '-' },
  storageFill: { unit: '-' },
  massTotal: { unit: 'kg' },
  powerTotal: { unit: 'W' },
}

export function evaluate(d: Design): Results {
  const body = BODIES[d.body]
  const p = d.payload
  const vg = groundSpeed(body, d.altitudeKm)
  const gsd = groundSamplingDistance(d.altitudeKm, p.pixelPitchUm, p.focalLengthM)
  const swathKm = (p.pixelsAcross * gsd) / 1e3

  const pixel = (radiance: number, centreNm: number, widthNm: number, gsdM: number) => {
    const signalE = signalElectrons({
      radiance: radianceAtBody(radiance, body), wavelengthNm: centreNm, bandwidthNm: widthNm,
      apertureM: p.apertureM, gsdM, altitudeKm: d.altitudeKm, integrationS: gsdM / (vg * 1e3),
      transmission: p.transmission, quantumEfficiency: p.quantumEfficiency, tdiStages: p.tdiStages,
    })
    return { signalE, snr: snr(signalE, p.readNoiseE) }
  }

  let bands: BandResult[]
  let sampling: BandSampling[]
  if (p.family === 'multispectral') {
    bands = p.bands.map((b) => {
      const gsdM = gsd * b.gsdFactor
      return { name: b.name, centreNm: b.centreNm, widthNm: b.widthNm, gsdM, radiance: b.radiance, channels: 1, ...pixel(b.radiance, b.centreNm, b.widthNm, gsdM) }
    })
    sampling = bands.map((b) => ({ gsdM: b.gsdM, bits: p.bits }))
  } else {
    bands = p.ranges.map((r) => {
      const centre = (r.minNm + r.maxNm) / 2
      return { name: r.name, centreNm: centre, widthNm: r.samplingNm, gsdM: gsd, radiance: r.radiance, channels: channelCount(r), ...pixel(r.radiance, centre, r.samplingNm, gsd) }
    })
    sampling = spectralChannels(p.ranges).map(() => ({ gsdM: gsd, bits: p.bits }))
  }

  const raw = rawDataRate(swathKm, vg, sampling)
  const compressed = compressedRate(raw, p.compressionRatio)
  const dailyGbit = dailyVolume(compressed, p.dutyCycle, body.solarDay) / 1e9

  const l = d.link
  const linkDistanceKm = d.body === 'earth' ? slantRange(body.equatorialRadius, d.altitudeKm, l.elevationDeg) : l.marsDistanceKm
  const link = l.mode === 'budget'
    ? linkBudget({
      transmitterPowerW: l.powerW, txAntennaDiameterM: l.antennaM, txAntennaEfficiency: l.efficiency,
      frequencyHz: l.frequencyGHz * 1e9, rxGainDbi: l.rxGainDbi, systemNoiseK: l.systemNoiseK,
      distanceKm: linkDistanceKm, requiredEbN0Db: l.ebn0Db, marginDb: l.marginDb, otherLossesDb: l.lossesDb,
      maxRateBps: l.maxRateMbps * 1e6,
    })
    : null
  const downlinkRateMbps = link ? link.rateBps / 1e6 : l.rateMbps
  const downlinkPerDayGbit = (downlinkRateMbps * 1e6 * l.contactHours * 3600) / 1e9

  const mass = massBudget(d.units)
  const power = powerBudget(d.units)
  const snrMin = bands.length ? Math.min(...bands.map((b) => b.snr)) : Number.NaN
  const revisitDays = equatorCoverageDays(body, d.altitudeKm, swathKm, d.satellites)

  const values: Record<string, number> = {
    gsd, swath: swathKm, revisit: revisitDays, snrMin, dailyVolume: dailyGbit,
    downlinkRatio: downlinkPerDayGbit / dailyGbit, storageFill: dailyGbit / d.storage.capacityGbit,
    massTotal: mass.total, powerTotal: power.total,
  }

  return {
    dayName: body.dayName,
    periodMin: orbitalPeriod(body, d.altitudeKm) / 60,
    groundSpeedKmS: vg,
    ssoInclinationDeg: sunSynchronousInclination(body, d.altitudeKm),
    orbitsPerDay: orbitsPerDay(body, d.altitudeKm),
    revisitDays,
    gsdM: gsd,
    swathKm,
    lineTimeUs: lineTime(gsd, vg),
    bands,
    channelCount: p.family === 'hyperspectral' ? bands.reduce((s, b) => s + b.channels, 0) : bands.length,
    snrMin,
    rawRateMbps: raw / 1e6,
    compressedRateMbps: compressed / 1e6,
    dailyVolumeGbit: dailyGbit,
    linkDistanceKm,
    link,
    downlinkRateMbps,
    downlinkPerDayGbit,
    downlinkRatio: values.downlinkRatio,
    storageFill: values.storageFill,
    mass,
    power,
    compliance: complianceMatrix(d.requirements, values),
  }
}

// ------------------------------------------------------------------ presets as designs

const EXAMPLE_REQUIREMENTS: UserRequirement[] = [
  { id: 'U-1', quantity: 'gsd', sense: 'max', limit: 10, unit: 'm' },
  { id: 'U-2', quantity: 'revisit', sense: 'max', limit: 5, unit: 'days' },
  { id: 'U-3', quantity: 'snrMin', sense: 'min', limit: 50, unit: '-' },
  { id: 'U-4', quantity: 'downlinkRatio', sense: 'min', limit: 1, unit: '-' },
  { id: 'U-5', quantity: 'storageFill', sense: 'max', limit: 1, unit: '-' },
]

const BASE_LINK: Design['link'] = {
  mode: 'rate', rateMbps: 100, powerW: 100, antennaM: 1, efficiency: 0.55, frequencyGHz: 8.4,
  rxGainDbi: 68.41, systemNoiseK: 20.7, ebn0Db: 1, marginDb: 3, lossesDb: 2, maxRateMbps: 1000,
  marsDistanceKm: BODIES.mars.distanceFromEarth.max, elevationDeg: 5, contactHours: 1,
}

const GENERIC_ASSUMPTIONS = [
  'payload.transmission', 'payload.quantumEfficiency', 'payload.readNoiseE', 'payload.dutyCycle',
  'link.contactHours', 'link.elevationDeg', 'requirements',
]

export function designFromPreset(id: string): Design {
  const ps = preset(id)
  const pub = ps.published
  if (id === 'sentinel-2-msi') {
    return {
      version: 1, presetId: id, body: 'earth', altitudeKm: ps.altitudeKm, satellites: 2,
      payload: {
        family: 'multispectral', apertureM: pub.aperture.value, focalLengthM: ps.derived.focalLength.value,
        pixelPitchUm: pub.pixelPitchVnir.value, pixelsAcross: Math.round((pub.swath.value * 1e3) / pub.gsd.value),
        bits: pub.quantisation.value, compressionRatio: (pub.rawDataRate.value * 1e3) / pub.compressedDataRate.value,
        dutyCycle: 0.3, transmission: 0.8, quantumEfficiency: 0.6, readNoiseE: 50, tdiStages: 1,
        bands: S2_BANDS.map((b) => ({ name: b.band, centreNm: b.centreNm, widthNm: b.widthNm, gsdFactor: b.gsdM / 10, radiance: b.lref })),
        ranges: [],
      },
      link: { ...BASE_LINK, mode: 'rate', rateMbps: pub.downlinkRate.value },
      storage: { capacityGbit: pub.onboardMemory.value * 1e3 },
      units: [{ name: 'MSI instrument', massKg: pub.instrumentMass.value, powerW: pub.instrumentPowerMax.value, maturity: 'A' }],
      requirements: EXAMPLE_REQUIREMENTS,
      assumptions: GENERIC_ASSUMPTIONS,
      derived: ['payload.focalLengthM', 'payload.pixelsAcross', 'payload.compressionRatio'],
    }
  }
  if (id === 'enmap-hsi') {
    const vg = groundSpeed(BODIES.earth, ps.altitudeKm)
    return {
      version: 1, presetId: id, body: 'earth', altitudeKm: ps.altitudeKm, satellites: 1,
      payload: {
        family: 'hyperspectral', apertureM: ps.derived.aperture.value, focalLengthM: pub.focalLength.value,
        pixelPitchUm: pub.pixelPitch.value, pixelsAcross: Math.round((pub.swath.value * 1e3) / pub.gsd.value),
        bits: pub.quantisation.value, compressionRatio: 1,
        // 5 000 km of swath length per day (EnMAP mission page) at the ground speed
        dutyCycle: 5000 / (vg * 86400),
        transmission: 0.8, quantumEfficiency: 0.6, readNoiseE: 50, tdiStages: 1,
        bands: [],
        // reference radiance borrowed from Sentinel-2 Lref at the nearest band (B2, B12)
        ranges: [
          { name: 'VNIR', minNm: pub.vnirMinNm.value, maxNm: pub.vnirMaxNm.value, samplingNm: pub.vnirSamplingNm.value, radiance: 128 },
          { name: 'SWIR', minNm: pub.swirMinNm.value, maxNm: pub.swirMaxNm.value, samplingNm: pub.swirSamplingNm.value, radiance: 1.5 },
        ],
      },
      link: { ...BASE_LINK, mode: 'rate', rateMbps: pub.downlinkRate.value },
      storage: { capacityGbit: pub.onboardMemory.value },
      units: [],
      requirements: [
        { id: 'U-1', quantity: 'gsd', sense: 'max', limit: 35, unit: 'm' },
        { id: 'U-3', quantity: 'snrMin', sense: 'min', limit: 100, unit: '-' },
        { id: 'U-4', quantity: 'downlinkRatio', sense: 'min', limit: 1, unit: '-' },
        { id: 'U-5', quantity: 'storageFill', sense: 'max', limit: 1, unit: '-' },
      ],
      assumptions: [...GENERIC_ASSUMPTIONS.filter((a) => a !== 'payload.dutyCycle'), 'payload.compressionRatio', 'payload.ranges.radiance'],
      derived: ['payload.apertureM', 'payload.pixelsAcross', 'payload.dutyCycle'],
    }
  }
  if (id === 'mro-hirise') {
    return {
      version: 1, presetId: id, body: 'mars', altitudeKm: ps.altitudeKm, satellites: 1,
      payload: {
        family: 'multispectral', apertureM: pub.aperture.value, focalLengthM: ps.derived.focalLength.value,
        pixelPitchUm: ps.derived.pixelPitch.value, pixelsAcross: pub.pixelsAcrossRed.value,
        bits: 14, compressionRatio: 14 / 8,
        // ~18 Tbit expected over the 2-year primary science phase, as a fraction of the
        // compressed imaging rate (derived; see presets.ts)
        dutyCycle: hiriseDutyCycle(),
        transmission: 0.8, quantumEfficiency: 0.6, readNoiseE: pub.readNoiseMax.value, tdiStages: 128,
        // RED channel 550–850 nm; radiance: Sentinel-2 B4 Lref, scaled to Mars by the model
        bands: [{ name: 'RED', centreNm: 700, widthNm: 300, gsdFactor: 1, radiance: 108 }],
        ranges: [],
      },
      link: {
        ...BASE_LINK, mode: 'budget', powerW: pub.transmitterPower.value, antennaM: pub.highGainAntenna.value,
        frequencyGHz: pub.xBandFrequency.value, rxGainDbi: pub.dsn34mGainX.value, systemNoiseK: pub.dsn34mNoiseTempX.value,
        maxRateMbps: pub.downlinkMax.value, contactHours: 8,
      },
      storage: { capacityGbit: pub.storage.value },
      units: [],
      requirements: [
        { id: 'U-1', quantity: 'gsd', sense: 'max', limit: 0.5, unit: 'm' },
        { id: 'U-3', quantity: 'snrMin', sense: 'min', limit: 50, unit: '-' },
        { id: 'U-4', quantity: 'downlinkRatio', sense: 'min', limit: 1, unit: '-' },
        { id: 'U-5', quantity: 'storageFill', sense: 'max', limit: 1, unit: '-' },
      ],
      assumptions: [...GENERIC_ASSUMPTIONS.filter((a) => a !== 'payload.dutyCycle' && a !== 'payload.readNoiseE'), 'payload.bands.radiance', 'payload.tdiStages', 'link.efficiency', 'link.ebn0Db', 'link.marginDb', 'link.lossesDb'],
      derived: ['payload.focalLengthM', 'payload.pixelPitchUm', 'payload.dutyCycle'],
    }
  }
  throw new Error(`No interface design for preset ${id}`)
}

export const UI_PRESETS = ['sentinel-2-msi', 'enmap-hsi', 'mro-hirise']

/** HiRISE imaging duty cycle derived from the expected data return of the primary science
 *  phase: average returned rate / compressed imaging rate */
export function hiriseDutyCycle(): number {
  const ps = preset('mro-hirise')
  const pub = ps.published
  const vg = groundSpeed(BODIES.mars, ps.altitudeKm)
  const gsd = groundSamplingDistance(ps.altitudeKm, ps.derived.pixelPitch.value, ps.derived.focalLength.value)
  const compressedBps = (pub.pixelsAcrossRed.value * (vg * 1e3 / gsd) * 14) / (14 / 8)
  const averageBps = (pub.pspDataReturn.value * 1e12) / (pub.pspDurationYears.value * 365.25 * 86400)
  return averageBps / compressedBps
}

export function newUnit(): Unit {
  return { name: 'New unit', massKg: 10, powerW: 10, maturity: 'D' }
}

export { MATURITY_MARGIN }
