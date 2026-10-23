/**
 * Celestial bodies supported by the sandbox.
 *
 * All values come from the NASA NSSDCA planetary fact sheets, so every number has one
 * traceable source:
 *   Earth: https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
 *   Mars:  https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html
 */

export type BodyId = 'earth' | 'mars'

export interface Body {
  id: BodyId
  name: string
  /** Gravitational parameter GM [km^3/s^2] */
  mu: number
  /** Equatorial radius [km] */
  equatorialRadius: number
  /** Volumetric mean radius [km] */
  meanRadius: number
  /** Second zonal harmonic J2 [-] */
  j2: number
  /** Sidereal rotation period [s] */
  siderealDay: number
  /** Length of the solar day [s] (a sol on Mars): unit of "days" for that body */
  solarDay: number
  /** Name of the solar day in the interface */
  dayName: string
  /** Tropical orbit period around the Sun [s]: sets the sun-synchronous precession rate */
  tropicalYear: number
  /** Mean solar irradiance at the body's distance from the Sun [W/m^2] */
  solarIrradiance: number
  /** Distance from Earth [km]: minimum and maximum (zero for Earth itself) */
  distanceFromEarth: { min: number; max: number }
  source: string
}

const DAY = 86400
const HOUR = 3600

export const BODIES: Record<BodyId, Body> = {
  earth: {
    id: 'earth',
    name: 'Earth',
    mu: 398600,
    equatorialRadius: 6378.137,
    meanRadius: 6371.0,
    j2: 1082.63e-6,
    siderealDay: 23.9345 * HOUR,
    solarDay: 24.0 * HOUR,
    dayName: 'day',
    tropicalYear: 365.242 * DAY,
    solarIrradiance: 1361.0,
    distanceFromEarth: { min: 0, max: 0 },
    source: 'NASA NSSDCA Earth Fact Sheet',
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    mu: 42828,
    equatorialRadius: 3396.2,
    meanRadius: 3389.5,
    j2: 1960.45e-6,
    siderealDay: 24.6229 * HOUR,
    solarDay: 24.6597 * HOUR,
    dayName: 'sol',
    tropicalYear: 686.972 * DAY,
    solarIrradiance: 586.2,
    distanceFromEarth: { min: 54.6e6, max: 401.4e6 },
    source: 'NASA NSSDCA Mars Fact Sheet',
  },
}
