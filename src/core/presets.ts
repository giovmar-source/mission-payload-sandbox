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
    },
    derived: {},
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
