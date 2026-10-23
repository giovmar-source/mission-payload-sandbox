# Verification Control Document (VCD)

Document MPS-VCD-001 · generated on 2026-10-23 by `npm run vcd` · do not edit by hand.

Tailored from ECSS-E-ST-10-02C Rev.1 (Verification), Annex B. Verification methods: T test, A analysis,
R review of design, I inspection. Source of requirements: [Technical Requirements Specification](TS.md).

Automated tests: 24 passed out of 24.

| Req. | Title | Methods | Verification evidence (automated tests) | Status |
| --- | --- | --- | --- | --- |
| SB-01 | First-order performance outputs | T | ✔ returns finite, physically ordered values for Earth and Mars<br>✔ Sentinel-2 equatorial coverage close to the published revisit (1 and 2 satellites)<br>✔ Landsat 8 coverage estimate is below the 16-day repeat cycle (different quantities, documented)<br>✔ Sentinel-2 10 m bands: shot-noise SNR at Lref within a factor 2 of the specification<br>✔ read noise and dark signal lower the SNR; TDI raises it<br>✔ daily volume and downlink time follow from rate and duty cycle | Partially verified |
| SB-02 | Agreement with published missions | T | ✔ Sentinel-2 period within 5% of the published 100.6 min<br>✔ sun-synchronous inclination of Sentinel-2 and Landsat 8 within 5% of published<br>✔ HiRISE GSD and swath from published optics within 5%<br>✔ Sentinel-2 uncompressed data rate within 5% of the published 1.3 Gbit/s<br>✔ MRO X-band EIRP within 1 dB of the published 95.6 dBm | Partially verified |
| SB-03 | Visible formulas and assumptions | I | – | I open |
| SB-04 | Live requirement compliance matrix | T, I | ✔ margin is positive when compliant, for maximum and minimum limits<br>✔ status: compliant, marginal below the 10% warning band, non-compliant below zero<br>✔ a design change propagates to every requirement of the matrix | Test passed; I open |
| SB-05 | Budgets with ESA margins | T, R | ✔ equipment maturity margins are 5% (A/B), 10% (C) and 20% (D)<br>✔ nominal dry mass includes equipment margins; 20% system margin is a visible line<br>✔ power budget: equipment margins plus at least 20% system margin<br>✔ RAM margin of at least 50% and processor peak load at most 50%<br>✔ mass memory fill fraction (no ESA margin: judged by the user requirement)<br>R closed at SRR, 23 Oct 2026 (docs/ecss/REVIEWS.md) | Closed |
| SB-06 | Celestial body switch | T | ✔ daily quantities on Mars use the 24.6597 h sol<br>✔ Mars at 300 km: line time compatible with the HiRISE minimum of 76 µs<br>✔ the same scene around Mars has 43% of the Earth radiance (586.2 / 1361 W/m²)<br>✔ Mars at maximum distance: rate within a factor 2 of the 0.6 Mbps reported for MRO<br>✔ Mars at minimum distance: the radio, not the link, limits the rate | Partially verified |
| SB-07 | Responsiveness without a server | T | – | Open |
| SB-08 | Sharing and export | I | – | I open |
| SB-09 | Payload families | T, I | – | Open |
| SB-10 | Shared platform resources | T | – | Open (phase 2) |
