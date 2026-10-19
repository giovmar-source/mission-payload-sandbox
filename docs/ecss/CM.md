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
| Functional | TS issue 1 | SRR | `srr` |
| Design | TS + ICD + module formulas | PDR / CDR | `pdr`, `cdr` |
| Product | Verified version 1 | QR / AR | `v1.0.0` |

## Change records

| CR | Date | Change | Reason | Impact | Status |
| --- | --- | --- | --- | --- | --- |
| CR-001 | 19 Oct 2026 | Vite 7.1.9 → 7.3.7; Vitest 3 → 4.1.12; `legacy-peer-deps` in `.npmrc` | Security advisories on the development server (Windows path traversal) and test runner | Development tooling only; npm installer bug with optional peer dependencies worked around | Closed |
