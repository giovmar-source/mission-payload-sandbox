# Interface Control Document (ICD): physics core ↔ user interface

Document MPS-ICD-001 · Issue 3 (CDR baseline) · 24 October 2026 · Author: Giovanni Marino

Tailored from **ECSS-E-ST-10-24C Rev.1** (Interface management, 15 November 2024), Annex B.

## 1. Interface

| Side | Item | Responsibility |
| --- | --- | --- |
| Provider | Physics core, `src/core/` | Pure TypeScript functions, no UI dependency |
| User | Interface, `src/ui/` | Collects inputs, displays outputs, formulas and assumptions |

## 2. Architecture

The interface holds one `Design` object (`src/core/design.ts`) with every input. A pure
function `evaluate(design)` returns every output (`Results`), so the interface never computes
physics itself, and every result shown is covered by the core tests. The design is encoded in
the URL fragment (`src/core/share.ts`), which makes every configuration a shareable link
without a server. Fields that are assumptions or derived values are listed in the design and
marked in the interface.

## 3. Data items

| Item | Direction | Unit | Valid range | Defined in |
| --- | --- | --- | --- | --- |
| Central body | UI → core | `earth` \| `mars` | – | `bodies.ts` |
| Solar day of the body (day or sol) | core → UI | s, name | – | `bodies.ts` |
| Altitude | UI → core | km | 200–1500 in the interface | `orbit.ts` |
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
| Payload family, preset | UI → core | `multispectral` \| `hyperspectral`, preset id | – | `presets.ts` |
| Spectral ranges: min, max, average sampling | UI → core | nm | min < max, sampling > 0 | `spectrometer.ts` |
| Channels: centre, width; channel count; SNR scaling with sampling | core → UI | nm, –, – | – | `spectrometer.ts` |
| Field of view (full, across track) | UI → core | deg | > 0 | `geometry.ts` |
| Design (all inputs), assumptions and derived field lists | UI → core | `Design` | version 1 | `design.ts` |
| Results (all outputs) | core → UI | `Results` | – | `design.ts` |
| Share code | UI ↔ URL | base64url of the design JSON | invalid codes rejected | `share.ts` |
| Validity warnings: code, triggering value | core → UI | `drag` \| `no-sso` \| `diffraction` \| `wide-swath`, number | – | `validity.ts` |
| Altitude sweep: altitude, GSD, coverage, SNR, downlink ratio, storage fill | core → UI | km, m, days, –, –, – | Earth 300–1200 km, Mars 200–1000 km | `sweep.ts` |
| Compliance rows: value, margin, status | core → UI | –, –, `compliant` \| `marginal` \| `non-compliant` | – | `compliance.ts` |

## 4. Closed at CDR

- Altitude validity: warning below 300 km on Earth (`validity.ts`).
- PDF summary: printable summary rendered only for print (`src/ui/summary.tsx`); the browser's
  «Save as PDF» produces it without a server or a PDF library.
