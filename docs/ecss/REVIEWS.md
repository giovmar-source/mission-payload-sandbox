# Life cycle and reviews

Document MPS-REV-001 · Issue 1 · 19 October 2026 · Author: Giovanni Marino

Phases and reviews follow **ECSS-M-ST-10C** (Project planning and implementation, 31 July
2008), scaled to a personal project.

| Phase | Name | ECSS reviews | In this project | Status |
| --- | --- | --- | --- | --- |
| 0 | Mission analysis and needs identification | MDR | Project brief, stakeholder needs (TS §3) | Done, 19 Oct 2026 |
| A | Feasibility | PRR | Published parameters checked; no equivalent web tool found | In progress |
| B | Preliminary definition | SRR, PDR | TS baseline (SRR); architecture and ICD (PDR) | Planned, week 1 |
| C | Detailed definition | CDR | Formulas and interfaces of every module | Planned, weeks 1–2 |
| D | Qualification and production | QR, AR, ORR | Implementation, complete VCD (QR), final check before release (AR) | Planned, weeks 2–4 |
| E | Operations and utilisation | FRR, LRR, CRR, ELR | Public release, issue handling, later versions | After release |
| F | Disposal | MCR | Documented archiving | End of life |

## Review records

### MDR · Mission definition review · 19 October 2026

- **Entry:** project brief with objective, payload families, ECSS approach and plan.
- **Exit criteria:** needs stated (TS §3); reference missions chosen; free-resources constraint accepted.
- **Outcome:** passed. Scope extended beyond four weeks with a phase 2 (shared platform, FTS, SAR).

### PRR · Preliminary requirements review · open

- **Exit criteria:** every reference value in `src/core/presets.ts` traced to an open source;
  first unit tests passing; check that no equivalent web sandbox exists.
