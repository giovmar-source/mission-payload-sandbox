# Technical Requirements Specification (TS)

Document MPS-TS-001 · Issue 1 · 19 October 2026 · Author: Giovanni Marino

Tailored from **ECSS-E-ST-10-06C** (Technical requirements specification, 6 March 2009).
This is a personal project: the standard is applied in a reduced form, and each tailoring
choice is stated in section 6.

## 1. Purpose and scope

The Mission & Payload Sandbox is a browser application that estimates, to first order,
the performance and resource budgets of an Earth-observation or planetary imaging mission,
and checks them against user-defined requirements. It supports phase 0/A trade-offs; it is
not a design or qualification tool.

## 2. Applicable and reference documents

| Ref. | Document |
| --- | --- |
| [AD1] | ECSS-E-ST-10-06C, Technical requirements specification (6 March 2009) |
| [AD2] | ECSS-E-ST-10-02C Rev.1, Verification (1 February 2018) |
| [AD3] | ECSS-E-ST-10-24C Rev.1, Interface management (15 November 2024) |
| [AD4] | ECSS-M-ST-10C, Project planning and implementation (31 July 2008) |
| [AD5] | ECSS-M-ST-40C Rev.1, Configuration and information management (6 March 2009) |
| [RD1] | ESA, Margin philosophy for science assessment studies, SRE-PA/2011.097, issue 1 rev. 3 (15 June 2012) |
| [RD2] | NASA NSSDCA Earth and Mars fact sheets |
| [RD3] | Reference mission pages listed in [Validation note](VALIDATION.md) |

## 3. Stakeholder needs

| ID | Need |
| --- | --- |
| N1 | A systems or payload engineer explores how orbit, instrument, data and link constrain each other. |
| N2 | The results are credible: they reproduce real missions. |
| N3 | Every number can be checked: formula, assumptions and validity are visible. |
| N4 | Budgets follow the margin practice of ESA studies. |
| N5 | The same mission can be compared around Earth and around Mars. |
| N6 | The tool is free to run, fast and easy to share. |

## 4. Requirements

Each requirement has a unique identifier, a single verifiable "shall" statement, a rationale
and its verification methods (T test, A analysis, R review of design, I inspection, per [AD2]).
The table is generated from `requirements/requirements.json` by `npm run vcd`, so the
specification and the Verification Control Document cannot drift apart.

<!-- REQUIREMENTS:START -->
| ID | Requirement | Rationale | Verification | Phase |
| --- | --- | --- | --- | --- |
| SB-01 | The sandbox shall compute orbital period, ground speed, ground sampling distance, swath, revisit, signal-to-noise ratio, data volume and downlink capacity from declared input parameters. | Core function: a mission and payload trade-off needs these quantities together. | T | 1 |
| SB-02 | With the Sentinel-2, Landsat 8/9, EnMAP and HiRISE/MRO presets, the computed orbital period, inclination, ground sampling distance, swath and uncompressed data rate shall be within 5% of the published values, and the transmitter EIRP within 1 dB. | The model is only useful for trade-offs if it reproduces real missions. | T | 1 |
| SB-03 | Each displayed result shall be accompanied by its formula, its assumptions and its range of validity. | Transparency: the user must be able to judge every number. | I | 1 |
| SB-04 | A compliance matrix of user-defined requirements shall be updated at every change of input, showing value, margin in per cent and status. | Shows how a design change propagates to every requirement. | T, I | 1 |
| SB-05 | Mass, power and data budgets shall apply the ESA margin policy: unit maturity margins of at least 5%, 10% or 20% (categories A/B, C, D) and a system margin of 20%. | ESA, Margin philosophy for science assessment studies (SRE-PA/2011.097, issue 1 rev. 3, 15 June 2012). | T, R | 1 |
| SB-06 | Switching the central body between Earth and Mars shall update gravitational parameter, radius, J2, solar irradiance and distance from Earth. | The same mission must be comparable around Earth and around Mars. | T | 1 |
| SB-07 | Every change of input shall be recomputed in the browser in less than 100 ms, without a server. | Smooth interaction and zero running cost. | T | 1 |
| SB-08 | A configuration shall be shareable through a link and exportable as JSON and as a PDF summary, with the interface in English and Italian. | Use in applications and interviews. | I | 1 |
| SB-09 | The user shall select the payload family (phase 1: multispectral imager and imaging spectrometer) and adjust its parameters, or start from a real preset. | Designing an instrument, not only reading one. | T, I | 1 |
| SB-10 | With two payloads on the same platform, power, memory and downlink shall be shared budgets, and the share of each payload shall be shown. | Interfaces between subsystems are where design conflicts appear. | T | 2 |
<!-- REQUIREMENTS:END -->

## 5. Verification

Verification is planned in the [Verification Plan](VP.md) and tracked in the
[Verification Control Document](VCD.md).

## 6. Tailoring

- One document combines the requirement specification and the stakeholder needs.
- Requirements are kept at system level; there is no separate subsystem specification.
- Reviews are held by the author against written entry and exit criteria ([Reviews](REVIEWS.md)),
  without an independent review board.
