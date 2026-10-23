// Builds the Verification Control Document (ECSS-E-ST-10-02C Rev.1, Annex B) from the
// requirement register and the automated test results.
//
//   npm run vcd
//
// 1. runs Vitest with the JSON reporter;
// 2. reads requirements/requirements.json;
// 3. links each test to the requirement ID at the start of its name ("[SB-02] …");
// 4. writes docs/ecss/VCD.md and refreshes the requirement table in docs/ecss/TS.md.
//
// A requirement is Closed only when its register entry says `complete: true` (all its parts
// implemented and tested); before that, passing tests give "Partially verified".
// Methods other than T (A, R, I) are closed by a review record named in `closedBy`.

import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const RESULTS = 'reports/test-results.json'
mkdirSync('reports', { recursive: true })
try {
  execFileSync('npx', ['vitest', 'run', '--reporter=json', `--outputFile=${RESULTS}`], { stdio: 'inherit', shell: process.platform === 'win32' })
} catch {
  // failing tests still produce the JSON file: the VCD then shows them as failed
}

const register = JSON.parse(readFileSync('requirements/requirements.json', 'utf8'))
const results = JSON.parse(readFileSync(RESULTS, 'utf8'))
const tests = results.testResults.flatMap((file) => file.assertionResults.map((t) => ({
  name: t.title,
  status: t.status,
  file: file.name.replace(/\\/g, '/').replace(/^.*\/src\//, 'src/'),
})))

const byReq = new Map()
for (const t of tests) {
  const m = t.name.match(/^\[(SB-\d{2})\]/)
  if (!m) continue
  if (!byReq.has(m[1])) byReq.set(m[1], [])
  byReq.get(m[1]).push(t)
}

const esc = (s) => String(s).replace(/\|/g, '\\|')
const today = new Date().toISOString().slice(0, 10)
const rows = register.requirements.map((r) => {
  const linked = byReq.get(r.id) || []
  const failed = linked.filter((t) => t.status !== 'passed')
  const needsTest = r.methods.includes('T')
  const closedBy = r.closedBy || {}
  const otherMethods = r.methods.filter((m) => m !== 'T' && !closedBy[m])
  const closedNote = Object.entries(closedBy).map(([m, by]) => `${m} closed at ${by}`).join('; ')
  let status
  if (failed.length) status = `Failed (${failed.length})`
  else if (needsTest && linked.length === 0) status = r.phase > 1 ? 'Open (phase 2)' : 'Open'
  else if (otherMethods.length) status = linked.length ? `Test passed; ${otherMethods.join(', ')} open` : `${otherMethods.join(', ')} open`
  else status = r.complete ? 'Closed' : 'Partially verified'
  const evidence = linked.length
    ? linked.map((t) => `${t.status === 'passed' ? '✔' : '✘'} ${esc(t.name.replace(/^\[SB-\d{2}\]\s*/, ''))}`).join('<br>')
    : '–'
  const evidenceAll = closedNote ? (linked.length ? `${evidence}<br>${esc(closedNote)}` : esc(closedNote)) : evidence
  return `| ${r.id} | ${esc(r.title)} | ${r.methods.join(', ')} | ${evidenceAll} | ${status} |`
})

const passed = tests.filter((t) => t.status === 'passed').length
const vcd = `# Verification Control Document (VCD)

Document MPS-VCD-001 · generated on ${today} by \`npm run vcd\` · do not edit by hand.

Tailored from ECSS-E-ST-10-02C Rev.1 (Verification), Annex B. Verification methods: T test, A analysis,
R review of design, I inspection. Source of requirements: [Technical Requirements Specification](TS.md).

Automated tests: ${passed} passed out of ${tests.length}.

| Req. | Title | Methods | Verification evidence (automated tests) | Status |
| --- | --- | --- | --- | --- |
${rows.join('\n')}
`
writeFileSync('docs/ecss/VCD.md', vcd)

const table = [
  '| ID | Requirement | Rationale | Verification | Phase |',
  '| --- | --- | --- | --- | --- |',
  ...register.requirements.map((r) => `| ${r.id} | ${esc(r.text)} | ${esc(r.rationale)} | ${r.methods.join(', ')} | ${r.phase} |`),
].join('\n')
const ts = readFileSync('docs/ecss/TS.md', 'utf8')
writeFileSync('docs/ecss/TS.md', ts.replace(/<!-- REQUIREMENTS:START -->[\s\S]*<!-- REQUIREMENTS:END -->/,
  `<!-- REQUIREMENTS:START -->\n${table}\n<!-- REQUIREMENTS:END -->`))
console.log(`VCD written: ${register.requirements.length} requirements, ${tests.length} tests (${passed} passed).`)
