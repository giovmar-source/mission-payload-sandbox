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
const ENMAP = 'https://www.enmap.org/mission/'
const HIRISE_TDI = 'https://pds.nasa.gov/datastandards/documents/dd/current/PDS4_PDS_DD_1M00/webhelp/all/ch47s198.html'
const HIRISE_COSPAR = 'https://meetings.copernicus.org/www.cosis.net/abstracts/COSPAR2006/01096/COSPAR2006-A-01096.pdf'
const ENMAP_EOPORTAL = 'https://www.eoportal.org/satellite-missions/enmap'
const ENMAP_SPECS = 'https://www.enmap.org/data/doc/EnMAP_Specs.pdf'
const OLI_DESIGN = 'https://doi.org/10.3390/rs61110286'
const OLI_ONORBIT = 'https://earth.esa.int/eogateway/documents/20142/4139742/3.07_VH-RODA%202022%20-%20L8-9%20OLI%20radiometric%20performances%20-%20RLevy.pdf'
const S2A_E0 = 'https://explorer.nci.dea.ga.gov.au/dataset/139d6937-bec9-51ac-9b55-e5928a14f5cf'

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

/**
 * Landsat 8 OLI radiometric reference (QR). Required SNR: Knight and Kvaran 2014, Table 1(b)
 * (Remote Sensing 6, 10286). Typical radiance Ltypical [W m⁻² sr⁻¹ µm⁻¹] and median on-orbit
 * SNR at Ltypical: Levy, «L8/9 OLI radiometric performances», ESA VH-RODA workshop 2022.
 * The OLI aperture and detector quantum efficiency are not in these open sources, so the
 * sandbox cannot predict this SNR forward: the table checks the compliance logic instead.
 */
export const OLI_SNR = [
  { band: 'Coastal/Aerosol', centreNm: 443, lTypical: 40, snrRequired: 130, snrOnOrbit: 237 },
  { band: 'Blue', centreNm: 482, lTypical: 40, snrRequired: 130, snrOnOrbit: 370 },
  { band: 'Green', centreNm: 562, lTypical: 30, snrRequired: 100, snrOnOrbit: 307 },
  { band: 'Red', centreNm: 655, lTypical: 22, snrRequired: 90, snrOnOrbit: 229 },
  { band: 'NIR', centreNm: 865, lTypical: 14, snrRequired: 90, snrOnOrbit: 203 },
  { band: 'SWIR1', centreNm: 1610, lTypical: 4, snrRequired: 100, snrOnOrbit: 268 },
  { band: 'SWIR2', centreNm: 2200, lTypical: 1.7, snrRequired: 100, snrOnOrbit: 327 },
  { band: 'Pan', centreNm: 590, lTypical: 23, snrRequired: 80, snrOnOrbit: 148 },
  { band: 'Cirrus', centreNm: 1375, lTypical: 6, snrRequired: 50, snrOnOrbit: 159 },
] as const

export const OLI_SNR_SOURCES = { required: OLI_DESIGN, onOrbit: OLI_ONORBIT }

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
    id: 'enmap-hsi',
    mission: 'EnMAP',
    instrument: 'HSI',
    body: 'earth',
    family: 'hyperspectral',
    altitudeKm: 653,
    published: {
      inclination: { value: 98, unit: 'deg', source: ENMAP_EOPORTAL },
      gsd: { value: 30, unit: 'm', source: ENMAP },
      swath: { value: 30, unit: 'km', source: ENMAP },
      fieldOfView: { value: 2.62, unit: 'deg', source: ENMAP_EOPORTAL }, // ±1.31°
      focalLength: { value: 0.522, unit: 'm', source: ENMAP_EOPORTAL },
      fNumber: { value: 3, unit: '-', source: ENMAP_EOPORTAL },
      pixelPitch: { value: 24, unit: 'µm', source: ENMAP_EOPORTAL },
      vnirMinNm: { value: 420, unit: 'nm', source: ENMAP },
      vnirMaxNm: { value: 1000, unit: 'nm', source: ENMAP },
      vnirSamplingNm: { value: 6.5, unit: 'nm', source: ENMAP_EOPORTAL },
      swirMinNm: { value: 900, unit: 'nm', source: ENMAP },
      swirMaxNm: { value: 2450, unit: 'nm', source: ENMAP },
      swirSamplingNm: { value: 10, unit: 'nm', source: ENMAP_EOPORTAL },
      bands: { value: 228, unit: '-', source: ENMAP_EOPORTAL },
      snrVnir495: { value: 500, unit: '- (minimum)', source: ENMAP_SPECS },
      snrSwir2200: { value: 150, unit: '- (minimum)', source: ENMAP_SPECS },
      // reference conditions of the SNR specification
      snrReferenceAlbedo: { value: 0.3, unit: '-', source: ENMAP_SPECS },
      snrReferenceSunZenith: { value: 30, unit: 'deg', source: ENMAP_SPECS },
      // band-averaged solar irradiance used by the Sentinel-2A processor (B2 490 nm, B12 2190 nm)
      solarIrradianceB2: { value: 1959.66, unit: 'W m⁻² µm⁻¹', source: S2A_E0 },
      solarIrradianceB12: { value: 85.25, unit: 'W m⁻² µm⁻¹', source: S2A_E0 },
      quantisation: { value: 14, unit: 'bit', source: ENMAP_EOPORTAL },
      downlinkRate: { value: 320, unit: 'Mbit/s', source: ENMAP_EOPORTAL },
      onboardMemory: { value: 512, unit: 'Gbit', source: ENMAP_EOPORTAL },
    },
    derived: {
      aperture: { value: 0.174, unit: 'm', source: ENMAP_EOPORTAL, from: 'focal length 0.522 m / f/3' },
      referenceRadiance495: { value: 162.1, unit: 'W m⁻² sr⁻¹ µm⁻¹', source: S2A_E0, from: '0.3 × 1959.66 × cos 30° / π, no atmosphere' },
      referenceRadiance2200: { value: 7.05, unit: 'W m⁻² sr⁻¹ µm⁻¹', source: S2A_E0, from: '0.3 × 85.25 × cos 30° / π, no atmosphere' },
    },
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
      readNoiseMax: { value: 50, unit: 'e⁻ rms (< 50 at 22 °C)', source: HIRISE },
      tdiMax: { value: 128, unit: 'stages (options 8, 32, 64, 128)', source: HIRISE_TDI },
      pspDataReturn: { value: 18, unit: 'Tbit (~, expected)', source: HIRISE_COSPAR },
      pspDurationYears: { value: 2, unit: 'years', source: HIRISE_COSPAR },
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

export function presetsByFamily(family: Preset['family']): Preset[] {
  return PRESETS.filter((p) => p.family === family)
}
