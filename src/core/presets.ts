/**
 * Reference missions used to validate the model (SB-02).
 *
 * `published` holds only values stated on the cited pages. `derived` holds values computed
 * from published ones (for example a focal length from aperture × f-number); they are
 * labelled as derived in the interface and in the validation note.
 */

import type { BodyId } from './bodies'

export interface Published<T = number> {
  value: T
  unit: string
  source: string
}

export interface Preset {
  id: string
  mission: string
  instrument: string
  body: BodyId
  family: 'multispectral' | 'hyperspectral'
  altitudeKm: number
  published: Record<string, Published>
  derived: Record<string, Published & { from: string }>
}

const S2 = 'https://sentiwiki.copernicus.eu/web/s2-mission'
const L8 = 'https://science.nasa.gov/mission/landsat-8/'
const L9 = 'https://www.usgs.gov/landsat-missions/landsat-9'
const HIRISE = 'https://www.uahirise.org/specs/'
const MRO_COMMS = 'https://arxiv.org/pdf/2211.14245'
const MRO_TELECOM = 'https://gsaw.org/wp-content/uploads/2019/09/2006s10d_shambayati.pdf'
const S2_PERF = 'https://sentinel.esa.int/web/sentinel/technical-guides/sentinel-2-msi/mission-performance'
const S2_EOPORTAL = 'https://www.eoportal.org/satellite-missions/copernicus-sentinel-2'
const DSN_103 = 'https://deepspace.jpl.nasa.gov/dsndocs/810-005/103/103D.pdf'

/** Sentinel-2 MSI bands: centre and width [nm], reference radiance Lref [W m⁻² sr⁻¹ µm⁻¹],
 *  required SNR at Lref, GSD [m]. Source: ESA, Sentinel-2 MSI mission performance. */
export const S2_BANDS = [
  { band: 'B1', centreNm: 443, widthNm: 20, lref: 129, snrRequired: 129, gsdM: 60 },
  { band: 'B2', centreNm: 490, widthNm: 65, lref: 128, snrRequired: 154, gsdM: 10 },
  { band: 'B3', centreNm: 560, widthNm: 35, lref: 128, snrRequired: 168, gsdM: 10 },
  { band: 'B4', centreNm: 665, widthNm: 30, lref: 108, snrRequired: 142, gsdM: 10 },
  { band: 'B5', centreNm: 705, widthNm: 15, lref: 74.5, snrRequired: 117, gsdM: 20 },
  { band: 'B6', centreNm: 740, widthNm: 15, lref: 68, snrRequired: 89, gsdM: 20 },
  { band: 'B7', centreNm: 783, widthNm: 20, lref: 67, snrRequired: 105, gsdM: 20 },
  { band: 'B8', centreNm: 842, widthNm: 115, lref: 103, snrRequired: 174, gsdM: 10 },
  { band: 'B8a', centreNm: 865, widthNm: 20, lref: 52.5, snrRequired: 72, gsdM: 20 },
  { band: 'B9', centreNm: 945, widthNm: 20, lref: 9, snrRequired: 114, gsdM: 60 },
  { band: 'B10', centreNm: 1375, widthNm: 30, lref: 6, snrRequired: 50, gsdM: 60 },
  { band: 'B11', centreNm: 1610, widthNm: 90, lref: 4, snrRequired: 100, gsdM: 20 },
  { band: 'B12', centreNm: 2190, widthNm: 180, lref: 1.5, snrRequired: 100, gsdM: 20 },
] as const

export const PRESETS: Preset[] = [
  {
    id: 'sentinel-2-msi',
    mission: 'Sentinel-2',
    instrument: 'MSI',
    body: 'earth',
    family: 'multispectral',
    altitudeKm: 786,
    published: {
      inclination: { value: 98.62, unit: 'deg', source: S2 },
      period: { value: 100.6, unit: 'min', source: S2 },
      swath: { value: 290, unit: 'km', source: S2 },
      gsd: { value: 10, unit: 'm', source: S2 },
      bands: { value: 13, unit: '-', source: S2 },
      revisitOneSatellite: { value: 10, unit: 'days', source: S2 },
      revisitTwoSatellites: { value: 5, unit: 'days', source: S2 },
      downlinkRate: { value: 490, unit: 'Mbps', source: S2 },
      aperture: { value: 0.15, unit: 'm', source: S2_EOPORTAL },
      pixelPitchVnir: { value: 7.5, unit: 'µm', source: S2_EOPORTAL },
      fieldOfView: { value: 20.6, unit: 'deg', source: S2_EOPORTAL },
      quantisation: { value: 12, unit: 'bit', source: S2_EOPORTAL },
      instrumentMass: { value: 290, unit: 'kg', source: S2_EOPORTAL },
      instrumentPowerMax: { value: 266, unit: 'W', source: S2_EOPORTAL },
      rawDataRate: { value: 1.3, unit: 'Gbit/s', source: S2_EOPORTAL },
      compressedDataRate: { value: 450, unit: 'Mbit/s', source: S2_EOPORTAL },
      onboardMemory: { value: 2.4, unit: 'Tbit', source: S2_EOPORTAL },
      snrSpecification: { value: 1, unit: 'per band, see S2_BANDS', source: S2_PERF },
    },
    derived: {
      focalLength: { value: 0.5895, unit: 'm', source: S2_EOPORTAL, from: 'GSD 10 m = 786 km × 7.5 µm / f' },
      fNumber: { value: 3.93, unit: '-', source: S2_EOPORTAL, from: 'focal length 0.5895 m / aperture 0.15 m' },
    },
  },
  {
    id: 'landsat-8-oli',
    mission: 'Landsat 8',
    instrument: 'OLI',
    body: 'earth',
    family: 'multispectral',
    altitudeKm: 705,
    published: {
      inclination: { value: 98.2, unit: 'deg', source: L9 },
      swath: { value: 185, unit: 'km', source: L8 },
      gsd: { value: 30, unit: 'm', source: L8 },
      gsdPanchromatic: { value: 15, unit: 'm', source: L8 },
      repeatCycle: { value: 16, unit: 'days', source: L8 },
    },
    derived: {},
  },
  {
    id: 'mro-hirise',
    mission: 'Mars Reconnaissance Orbiter',
    instrument: 'HiRISE',
    body: 'mars',
    family: 'multispectral',
    altitudeKm: 300,
    published: {
      gsd: { value: 0.3, unit: 'm', source: HIRISE },
      aperture: { value: 0.5, unit: 'm', source: HIRISE },
      fNumber: { value: 24, unit: '-', source: HIRISE },
      ifov: { value: 1, unit: 'µrad', source: HIRISE },
      pixelsAcrossRed: { value: 20264, unit: 'px', source: HIRISE },
      swathRedMin: { value: 6, unit: 'km', source: HIRISE },
      storage: { value: 28, unit: 'Gbit', source: HIRISE },
      lineTimeMin: { value: 76, unit: 'µs', source: HIRISE },
      highGainAntenna: { value: 3, unit: 'm', source: MRO_COMMS },
      transmitterPower: { value: 100, unit: 'W', source: MRO_COMMS },
      downlinkFar34m: { value: 0.6, unit: 'Mbps', source: MRO_COMMS },
      downlinkNear34m: { value: 2.6, unit: 'Mbps', source: MRO_COMMS },
      downlinkMax: { value: 6, unit: 'Mbps', source: MRO_TELECOM },
      xBandFrequency: { value: 8.41, unit: 'GHz', source: MRO_TELECOM },
      xBandEirp: { value: 95.6, unit: 'dBm', source: MRO_TELECOM },
      dsn34mGainX: { value: 68.41, unit: 'dBi', source: DSN_103 },
      dsn34mNoiseTempX: { value: 20.7, unit: 'K', source: DSN_103 },
    },
    derived: {
      focalLength: { value: 12, unit: 'm', source: HIRISE, from: 'aperture 0.5 m × f/24' },
      pixelPitch: { value: 12, unit: 'µm', source: HIRISE, from: 'IFOV 1 µrad × focal length 12 m' },
    },
  },
]

export function preset(id: string): Preset {
  const found = PRESETS.find((p) => p.id === id)
  if (!found) throw new Error(`Unknown preset: ${id}`)
  return found
}
