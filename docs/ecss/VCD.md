# Verification Control Document (VCD)

Document MPS-VCD-001 · generated on 2026-10-19 by `npm run vcd` · do not edit by hand.

Tailored from ECSS-E-ST-10-02C Rev.1 (Verification), Annex B. Verification methods: T test, A analysis,
R review of design, I inspection. Source of requirements: [Technical Requirements Specification](TS.md).

Automated tests: 7 passed out of 7.

| Req. | Title | Methods | Verification evidence (automated tests) | Status |
| --- | --- | --- | --- | --- |
| SB-01 | First-order performance outputs | T | ✔ returns finite, physically ordered values for Earth and Mars<br>✔ Sentinel-2 equatorial coverage close to the published revisit (1 and 2 satellites)<br>✔ Landsat 8 coverage estimate is below the 16-day repeat cycle (different quantities, documented) | Partially verified |
| SB-02 | Agreement with published missions | T | ✔ Sentinel-2 period within 5% of the published 100.6 min<br>✔ sun-synchronous inclination of Sentinel-2 and Landsat 8 within 5% of published<br>✔ HiRISE GSD and swath from published optics within 5% | Partially verified |
| SB-03 | Visible formulas and assumptions | I | – | I open |
| SB-04 | Live requirement compliance matrix | T, I | – | Open |
| SB-05 | Budgets with ESA margins | T, R | – | Open |
| SB-06 | Celestial body switch | T | ✔ Mars at 300 km: line time compatible with the HiRISE minimum of 76 µs | Partially verified |
| SB-07 | Responsiveness without a server | T | – | Open |
| SB-08 | Sharing and export | I | – | I open |
| SB-09 | Payload families | T, I | – | Open |
| SB-10 | Shared platform resources | T | – | Open (phase 2) |
