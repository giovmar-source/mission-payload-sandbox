// Every interface text written with t('…') has an Italian translation (SB-08).

import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ITALIAN_KEYS } from '../../ui/i18n'

const UI = join(__dirname, '../../ui')

function literalTexts(): string[] {
  const texts = new Set<string>()
  for (const f of readdirSync(UI).filter((n) => n.endsWith('.tsx'))) {
    const src = readFileSync(join(UI, f), 'utf8')
    for (const m of src.matchAll(/\bt\('((?:[^'\\]|\\.)*)'\)/g)) texts.add(m[1].replace(/\\'/g, "'"))
  }
  return [...texts]
}

describe('interface languages', () => {
  it('[SB-08] every literal interface text has an Italian translation', () => {
    const missing = literalTexts().filter((x) => !ITALIAN_KEYS.includes(x))
    expect(missing).toEqual([])
  })

  it('[SB-08] labels of the compliance quantities have Italian translations', () => {
    const src = readFileSync(join(UI, 'App.tsx'), 'utf8')
    const block = src.slice(src.indexOf('QUANTITY_LABELS'), src.indexOf('function initialDesign'))
    const labels = [...block.matchAll(/:\s*'([^']+)'/g)].map((m) => m[1])
    expect(labels.length).toBeGreaterThan(5)
    expect(labels.filter((x) => !ITALIAN_KEYS.includes(x))).toEqual([])
  })
})
