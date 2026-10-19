# Interface Control Document (ICD): physics core ↔ user interface

Document MPS-ICD-001 · Draft for PDR · 19 October 2026 · Author: Giovanni Marino

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

## 3. Open items for PDR

- Valid altitude range per body (atmospheric drag on Earth below about 300 km).
- Radiometry, data and link data items, added with their modules.
