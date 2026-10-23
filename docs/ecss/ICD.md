# Interface Control Document (ICD): physics core ↔ user interface

Document MPS-ICD-001 · Issue 1 (SRR baseline) · 23 October 2026 · Author: Giovanni Marino

Tailored from **ECSS-E-ST-10-24C Rev.1** (Interface management, 15 November 2024), Annex B.

## 1. Interface

| Side | Item | Responsibility |
| --- | --- | --- |
| Provider | Physics core, `src/core/` | Pure TypeScript functions, no UI dependency |
| User | Interface, `src/ui/` | Collects inputs, displays outputs, formulas and assumptions |

## 2. Data items (current baseline)

| Item | Direction | Unit | Valid range | Defined in |
| --- | --- | --- | --- | --- |
| Central body | UI → core | `earth` \| `mars` | – | `bodies.ts` |
| Solar day of the body (day or sol) | core → UI | s, name | – | `bodies.ts` |
| Altitude | UI → core | km | 200–2000 (to be confirmed at PDR) | `orbit.ts` |
| Pixel pitch | UI → core | µm | > 0 | `geometry.ts` |
| Focal length | UI → core | m | > 0 | `geometry.ts` |
| Pixels across track | UI → core | px | > 0 | `geometry.ts` |
| Orbital period | core → UI | s | – | `orbit.ts` |
| Ground speed | core → UI | km/s | – | `orbit.ts` |
| Sun-synchronous inclination | core → UI | deg, NaN if none | – | `orbit.ts` |
| GSD | core → UI | m | – | `geometry.ts` |
| Swath | core → UI | km | – | `geometry.ts` |
| Equator coverage | core → UI | days | – | `orbit.ts` |
| Spectral radiance, band centre and width | UI → core | W m⁻² sr⁻¹ µm⁻¹, nm, nm | > 0 | `radiometry.ts` |
| Aperture, transmission, quantum efficiency, TDI stages | UI → core | m, 0–1, 0–1, integer ≥ 1 | – | `radiometry.ts` |
| Signal electrons, SNR | core → UI | e⁻, – | – | `radiometry.ts` |
| Band sampling (GSD, bits), compression ratio, duty cycle | UI → core | m, bit, –, 0–1 | > 0 | `data.ts` |
| Raw and compressed data rate, daily volume, downlink time | core → UI | bit/s, bit, s | – | `data.ts` |
| Transmitter power, antenna diameter and efficiency, frequency | UI → core | W, m, 0–1, Hz | > 0 | `link.ts` |
| Ground gain, system noise temperature, Eb/N0, margin, losses, radio limit | UI → core | dBi, K, dB, dB, dB, bit/s | – | `link.ts` |
| EIRP, free-space loss, Pr/N0, rate, limiting element | core → UI | dBW, dB, dB-Hz, bit/s, `link` \| `radio` | – | `link.ts` |
| Units: name, mass, power, maturity category | UI → core | –, kg, W, `A`–`D` | ≥ 0 | `budgets.ts` |
| Budget lines, nominal, system margin, total | core → UI | kg or W | – | `budgets.ts` |
| RAM used and capacity, processor peak load | UI → core | MB, MB, 0–1 | > 0 | `budgets.ts` |
| RAM margin, processor compliance, mass memory fill | core → UI | –, boolean, 0–1 | – | `budgets.ts` |
| User requirements: quantity, max or min, limit, unit | UI → core | – | – | `compliance.ts` |
| Compliance rows: value, margin, status | core → UI | –, –, `compliant` \| `marginal` \| `non-compliant` | – | `compliance.ts` |

## 3. Open items for PDR

- Valid altitude range per body (atmospheric drag on Earth below about 300 km).
- Imaging spectrometer data items (SB-09), added with its module.
