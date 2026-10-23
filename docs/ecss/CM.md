# Configuration and change management

Document MPS-CM-001 · Issue 1 · 19 October 2026 · Author: Giovanni Marino

Tailored from **ECSS-M-ST-40C Rev.1** (Configuration and information management, 6 March 2009).

## Configuration items

| Item | Location | Identification |
| --- | --- | --- |
| Source code | `src/` | Git commit; release tag `vX.Y.Z` |
| Requirement register | `requirements/requirements.json` | Git commit |
| Documents | `docs/ecss/` | Document number and issue in each header |
| Reference values | `src/core/presets.ts`, `src/core/bodies.ts` | Each value carries its source URL |

## Baselines

| Baseline | Content | Review | Tag |
| --- | --- | --- | --- |
| Functional | TS issue 1, ICD issue 1 | SRR, 23 Oct 2026 | `srr` |
| Design | TS + ICD + module formulas | PDR / CDR | `pdr`, `cdr` |
| Product | Verified version 1 | QR / AR | `v1.0.0` |

## Change records

| CR | Date | Change | Reason | Impact | Status |
| --- | --- | --- | --- | --- | --- |
| CR-001 | 19 Oct 2026 | Vite 7.1.9 → 7.3.7; Vitest 3 → 4.1.12; `legacy-peer-deps` in `.npmrc` | Security advisories on the development server (Windows path traversal) and test runner | Development tooling only; npm installer bug with optional peer dependencies worked around | Closed |
| CR-002 | 23 Oct 2026 | SB-02 extended to uncompressed data rate (5%) and transmitter EIRP (1 dB) | New published reference values found at PRR (Sentinel-2 MSI data rate, MRO X-band EIRP) | Requirement register, TS table, VCD regenerated; no code impact | Closed |
| CR-003 | 23 Oct 2026 | Daily quantities expressed in the body's solar day (24.6597 h sol on Mars) | PRR open item 2 | `bodies.ts`, `orbit.ts`, `data.ts`; Earth results unchanged (tested) | Closed |
| CR-004 | 23 Oct 2026 | EnMAP added as hyperspectral reference preset; SB-02 now names EnMAP | SB-09 needs a validated hyperspectral reference | Requirement register, presets, ICD, validation note; functional baseline `srr` superseded at PDR | Closed |
