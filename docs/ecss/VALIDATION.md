# Validation note

Document MPS-VAL-001 · Issue 1 · 19 October 2026 · Author: Giovanni Marino

The model is compared with published values of real missions. Only values stated on the
cited pages are used; values derived from them are marked as derived.

## Reference values and first results

| Mission | Quantity | Published | Model | Difference | Source |
| --- | --- | --- | --- | --- | --- |
| Sentinel-2 | Orbital period at 786 km | 100.6 min | 100.58 min | −0.02% | [ESA SentiWiki](https://sentiwiki.copernicus.eu/web/s2-mission) |
| Sentinel-2 | Sun-synchronous inclination | 98.62° | 98.54° | −0.08° | ESA SentiWiki |
| Sentinel-2 | Revisit, 1 / 2 satellites | 10 / 5 days | 9.65 / 4.83 days (equator coverage) | −3.5% | ESA SentiWiki |
| Landsat 8/9 | Sun-synchronous inclination at 705 km | 98.2° | 98.21° | +0.01° | [USGS Landsat 9](https://www.usgs.gov/landsat-missions/landsat-9) |
| Landsat 8 | Repeat cycle | 16 days | 14.87 days (equator coverage) | −7%, different quantity | [NASA Landsat 8](https://science.nasa.gov/mission/landsat-8/) |
| HiRISE (MRO) | GSD at 300 km | 0.30 m | 0.30 m | 0% | [HiRISE specifications](https://www.uahirise.org/specs/) |
| HiRISE (MRO) | Red swath, 20 264 pixels | > 6 km | 6.08 km | consistent | HiRISE specifications |
| HiRISE (MRO) | TDI line time | ≥ 76 µs | 95.9 µs at 300 km | consistent | HiRISE specifications |

Derived HiRISE values: focal length 12 m (aperture 0.5 m × f/24) and pixel pitch 12 µm
(IFOV 1 µrad × 12 m).

## Discussion

- **Coverage is not the repeat cycle.** The model estimates the days needed to cover the
  equator; the published 16 days of Landsat are the exact repeat cycle of the ground track.
  The two are compared, not equated, and the interface explains the difference.
- **Mars communications.** Free-space loss alone predicts a factor of about 54 between the
  nearest (54.6 million km) and farthest (401.4 million km) Earth–Mars distances. MRO in
  operation reports 0.6 to 2.6 Mbps to 34 m antennas, a factor of about 4
  ([arXiv 2211.14245](https://arxiv.org/pdf/2211.14245)). The gap is explained by operational
  choices (coding, 70 m antennas, rate limits); the link module will show both curves.
