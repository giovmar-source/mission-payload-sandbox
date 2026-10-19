# Verification Plan (VP)

Document MPS-VP-001 · Issue 1 · 19 October 2026 · Author: Giovanni Marino

Tailored from **ECSS-E-ST-10-02C Rev.1** (Verification, 1 February 2018), Annex A.

## 1. Verification approach

Verification answers "did we build it right?"; validation answers "did we build the right
thing?". Both follow the V-model: each design level on the left is checked on the same level
on the right.

| Level | Design artefact | Verification | Evidence |
| --- | --- | --- | --- |
| Mission | Project brief (MDR) | Validation against real missions | [Validation note](VALIDATION.md) |
| System | [TS](TS.md) (SRR) | System verification, presets within 5% | [VCD](VCD.md) |
| Architecture | [ICD](ICD.md) (PDR) | Integration tests in the browser | VCD, integration test report |
| Module | Module formulas (CDR) | Unit tests per module | VCD |

## 2. Verification methods

| Method | Used for | How |
| --- | --- | --- |
| T, test | Every computed quantity | Automated Vitest tests named after the requirement ("[SB-02] …") |
| A, analysis | Sizing and margins | Short written analyses in `docs/analysis/` |
| R, review of design | Budgets and margin policy | Review records in [Reviews](REVIEWS.md) |
| I, inspection | Interface text, formulas shown, sharing | Checklist in the review records |

## 3. Close-out rules

- A requirement verified by test is closed when all linked tests pass.
- A requirement with R or I methods stays open until the review record cites it.
- Any failure opens a change record in [Configuration management](CM.md).

## 4. Tooling

`npm run vcd` runs all tests, links each test to its requirement and regenerates the VCD
and the requirement table of the TS.
