# Life cycle and reviews

Document MPS-REV-001 · Issue 2 · 23 October 2026 · Author: Giovanni Marino

Phases and reviews follow **ECSS-M-ST-10C** (Project planning and implementation, 31 July
2008), scaled to a personal project.

| Phase | Name | ECSS reviews | In this project | Status |
| --- | --- | --- | --- | --- |
| 0 | Mission analysis and needs identification | MDR | Project brief, stakeholder needs (TS §3) | Done, 19 Oct 2026 |
| A | Feasibility | PRR | Published parameters checked; no equivalent web tool found | Done, 23 Oct 2026 |
| B | Preliminary definition | SRR, PDR | TS baseline (SRR); architecture and ICD (PDR) | SRR done 23 Oct 2026; PDR planned |
| C | Detailed definition | CDR | Formulas and interfaces of every module | Planned, weeks 1–2 |
| D | Qualification and production | QR, AR, ORR | Implementation, complete VCD (QR), final check before release (AR) | Planned, weeks 2–4 |
| E | Operations and utilisation | FRR, LRR, CRR, ELR | Public release, issue handling, later versions | After release |
| F | Disposal | MCR | Documented archiving | End of life |

## Review records

### MDR · Mission definition review · 19 October 2026

- **Entry:** project brief with objective, payload families, ECSS approach and plan.
- **Exit criteria:** needs stated (TS §3); reference missions chosen; free-resources constraint accepted.
- **Outcome:** passed. Scope extended beyond four weeks with a phase 2 (shared platform, FTS, SAR).

### PRR · Preliminary requirements review · 23 October 2026

- **Exit criteria:** every reference value in `src/core/presets.ts` traced to an open source;
  first unit tests passing; check that no equivalent web sandbox exists.
- **Evidence:** radiometry, data and link modules with 15 passing tests; reference values for
  Sentinel-2 MSI (SNR specification, optics, data rate), MRO X-band and DSN 34 m added with
  sources; market and tool survey of 19 October 2026 found no web sandbox combining orbit,
  payload, data and link.
- **Outcome:** passed with two open items:
  1. Landsat 8 OLI SNR table not available in an openly readable source: OLI stays a
     geometry-only preset until a source is found.
  2. Mars daily quantities use 86 400 s days: to be expressed in sols before CDR.
- **Change:** SB-02 extended (CR-002).

### SRR · System requirements review · 23 October 2026

- **Exit criteria:** TS issue 1 complete for phase 1 (SB-01 to SB-09) with verification methods;
  ICD data items for all phase-1 modules; baseline tagged `srr`.
- **Evidence:** TS issue 1 with ten requirements, each with rationale and methods; ICD issue 1
  with data items for orbit, geometry, radiometry, data, link, budgets and compliance;
  24 tests passing; PRR open item 2 closed (CR-003, sols on Mars).
- **Review of design for SB-05:** `budgets.ts` checked line by line against the ESA margin
  policy [RD1]: R-M1-4 and R-P-1 (5/10/20% by ECSS category), R-M1-2 (nominal includes
  equipment margins), R-M1-1 and R-M1-3 (20% system mass margin as a visible line), R-P-3
  (≥ 20% system power margin), R-SW-1 (RAM margin ≥ 50%), R-SW-2 (processor peak ≤ 50%).
  Two interpretations recorded in the code and in the interface: system margins computed on
  the nominal values, RAM margin relative to the RAM used. The policy sets no mass-memory
  margin, so mass memory is judged against the user's own requirement. **Closed.**
- **Outcome:** passed. Open items: OLI SNR source (from PRR); imaging spectrometer module
  (SB-09) for PDR.

### PDR · Preliminary design review · open

- **Exit criteria:** architecture of the interface (panels, state, sharing); ICD complete for
  SB-09; interface prototype covering SB-03 and SB-04; baseline tagged `pdr`.
- **Progress:** SB-09 core done on 23 Oct 2026 (spectrometer module, EnMAP preset, 7 tests;
  CR-004). Remaining: interface architecture and prototype.
