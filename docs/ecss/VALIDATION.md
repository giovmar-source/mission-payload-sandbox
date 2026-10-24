# Validation note

Document MPS-VAL-001 · Issue 5 (QR) · 24 October 2026 · Author: Giovanni Marino

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
| Sentinel-2 | Uncompressed data rate, 13 bands, 12 bit | 1.3 Gbit/s | 1.29 Gbit/s | −0.7% | [eoPortal](https://www.eoportal.org/satellite-missions/copernicus-sentinel-2) |
| MRO | X-band EIRP (100 W, 3 m antenna, 8.41 GHz) | 95.6 dBm | 95.85 dBm | +0.25 dB | [Shambayati 2006](https://gsaw.org/wp-content/uploads/2019/09/2006s10d_shambayati.pdf) |
| MRO | Downlink at maximum Earth–Mars distance, 34 m antenna | 0.6 Mbps | 1.17 Mbps | factor 1.95 | [arXiv 2211.14245](https://arxiv.org/pdf/2211.14245) |
| EnMAP | GSD from focal length 522 mm and 24 µm pixels at 653 km | 30 m | 30.02 m | +0.08% | [eoPortal EnMAP](https://www.eoportal.org/satellite-missions/enmap), [EnMAP mission](https://www.enmap.org/mission/) |
| EnMAP | Swath from ±1.31° field of view | 30 km | 29.87 km | −0.4% | eoPortal EnMAP, EnMAP mission |
| EnMAP | Sun-synchronous inclination at 653 km | 98° | 98.00° | 0% | eoPortal EnMAP |
| EnMAP | Spectral channels from average sampling (VNIR 6.5 nm, SWIR 10 nm) | 228 | 89 + 155 = 244 | +7% | eoPortal EnMAP |
| MRO | Downlink at minimum distance | 2.6 Mbps (34 m), 6 Mbps maximum | 6 Mbps, limited by the radio | radio-limited | arXiv 2211.14245, Shambayati 2006 |

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
  choices (coding, 70 m antennas, rate limits); see «Link assumptions» below.

## Signal-to-noise ratio, Sentinel-2 10 m bands

Specification: required SNR at the reference radiance Lref
([ESA, MSI mission performance](https://sentinel.esa.int/web/sentinel/technical-guides/sentinel-2-msi/mission-performance)).
Model: aperture 150 mm (eoPortal), integration time equal to the line time (1.51 ms at
6.64 km/s), shot noise only. **Assumed, not published:** optics transmission 0.8 and
quantum efficiency 0.6.

| Band | Lref | Required SNR | Model SNR | Ratio |
| --- | --- | --- | --- | --- |
| B2, 490 nm | 128 | 154 | 206 | 1.34 |
| B3, 560 nm | 128 | 168 | 162 | 0.96 |
| B4, 665 nm | 108 | 142 | 150 | 1.05 |
| B8, 842 nm | 103 | 174 | 322 | 1.85 |

The specification is a minimum that the instrument exceeds, and silicon quantum efficiency
falls in the near infrared, which explains most of the B8 difference. The test accepts a
factor of 2: this checks the order of magnitude, not the exact instrument performance.

## Link assumptions

DSN 34 m X-band gain 68.41 dBi and system noise temperature 20.7 K at zenith
([DSN 810-005, module 103](https://deepspace.jpl.nasa.gov/dsndocs/810-005/103/103D.pdf));
assumed antenna efficiency 0.55, required Eb/N0 1 dB (turbo code), margin 3 dB, other losses
2 dB. With these values the model is optimistic by a factor of about 2 at maximum distance.
Near Mars the physics would allow about 63 Mbps, but the radio limit of 6 Mbps applies: this
is why MRO's real rates change by about 4 times while free-space loss changes by 54 times.

## EnMAP notes

- **Channel count.** The estimate uses the average sampling; real sampling varies across the
  detector (VNIR 4.8–8.2 nm, SWIR −25% to +20% around 10 nm), so +7% is expected from the
  model, not a fault of it. The test accepts 10%.
- **Data rate.** The 2 × 840 Mbit/s quoted for the instrument-to-memory interface is a link
  capacity, not the generated data rate, so it is not used for validation.
- **SNR.** See «Signal-to-noise ratio, EnMAP» below. The official specification sheet gives
  minimums of 500 at 495 nm and 150 at 2200 nm; eoPortal quotes 175 in one section, so the
  official value is used (CR-007).

## HiRISE sampling and diffraction

At 300 km and 700 nm the diffraction spot of the 0.5 m aperture projects to
1.22 λ h / D ≈ 0.51 m on the ground, larger than the 0.30 m pixel. HiRISE therefore samples
finer than its optics resolve: the sandbox flags this as a validity warning, because the
sharpness of the image is then set by the optics and not by the pixel size.

## Signal-to-noise ratio, EnMAP (closed at QR)

Specification: SNR above 500 at 495 nm and above 150 at 2200 nm, for 30% surface albedo and
30° Sun zenith angle ([EnMAP specifications](https://www.enmap.org/data/doc/EnMAP_Specs.pdf)).
The sheet gives no radiance value, so the sandbox derives it:
L = ρ · E₀ · cos θ / π, with the band-averaged solar irradiance E₀ that the Sentinel-2A
processor uses, 1959.66 W m⁻² µm⁻¹ at 490 nm and 85.25 W m⁻² µm⁻¹ at 2190 nm
([Sentinel-2A L1C product metadata](https://explorer.nci.dea.ga.gov.au/dataset/139d6937-bec9-51ac-9b55-e5928a14f5cf)).
**Derived:** L = 162.1 (495 nm) and 7.05 (2200 nm) W m⁻² sr⁻¹ µm⁻¹. **Assumed:** no
atmosphere, optics transmission 0.8, quantum efficiency 0.6, read noise 50 e⁻ (as for
Sentinel-2).

| Wavelength | Sampling | Specification (minimum) | Model SNR | Ratio |
| --- | --- | --- | --- | --- |
| 495 nm | 6.5 nm | 500 | 525 | 1.05 |
| 2200 nm | 10 nm | 150 | 283 | 1.89 |

The VNIR value agrees within 5%. In the SWIR the model is higher: the specification is a
minimum, the atmosphere is left out, and the generic transmission and efficiency are not the
values of a grating spectrometer with an HgCdTe detector. The test accepts a factor of 2, as
for Sentinel-2: an order-of-magnitude check, not the instrument's real performance.

## Signal-to-noise ratio, Landsat 8 OLI (closed at QR, as a data check)

Required SNR per band from Knight and Kvaran 2014, Table 1(b)
([Remote Sensing 6, 10286](https://doi.org/10.3390/rs61110286)); typical radiance and
median on-orbit SNR from Levy 2022
([ESA VH-RODA workshop](https://earth.esa.int/eogateway/documents/20142/4139742/3.07_VH-RODA%202022%20-%20L8-9%20OLI%20radiometric%20performances%20-%20RLevy.pdf)).

| Band | Ltypical | Required | On-orbit | Margin |
| --- | --- | --- | --- | --- |
| Coastal/Aerosol | 40 | 130 | 237 | +82% |
| Blue | 40 | 130 | 370 | +185% |
| Green | 30 | 100 | 307 | +207% |
| Red | 22 | 90 | 229 | +154% |
| NIR | 14 | 90 | 203 | +126% |
| SWIR1 | 4 | 100 | 268 | +168% |
| SWIR2 | 1.7 | 100 | 327 | +227% |
| Pan | 23 | 80 | 148 | +85% |
| Cirrus | 6 | 50 | 159 | +218% |

The OLI aperture and detector efficiency are not given in these open sources (the design
paper gives the 886 mm focal length and the 90–3600 µs integration range, not the pupil), so a
forward SNR prediction would rest on invented numbers and is not made. The table is used to
check the compliance logic on real data: every band compliant, smallest margin
Coastal/Aerosol. OLI remains a geometry preset.

## Open items

None for phase 1. Possible improvement: an atmospheric transmission term for the reference
radiance, if a citable open table is found.
