import { useState, type ReactNode } from 'react'
import { fmt, t } from './i18n'

export function Panel({ title, children, open = true }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="panel" open={open}>
      <summary>{title}</summary>
      <div className="panel-body">{children}</div>
    </details>
  )
}

export type Origin = 'assumed' | 'derived' | null

export function Assumed({ on }: { on: Origin | boolean }) {
  if (on === 'derived') return <span className="assumed derived" title={t('Computed from published values.')}>{t('derived')}</span>
  return on ? <span className="assumed" title={t('This value is an assumption, not a published value.')}>{t('assumed')}</span> : null
}

export function NumberField({ label, unit, value, onChange, step = 'any', min, assumed = false }: {
  label: string; unit?: string; value: number; onChange: (v: number) => void; step?: number | 'any'; min?: number; assumed?: Origin | boolean
}) {
  return (
    <label className="field">
      <span className="field-label">{label} <Assumed on={assumed} /></span>
      <span className="field-input">
        <input type="number" value={Number.isFinite(value) ? +value.toPrecision(6) : ''} step={step} min={min}
          onChange={(e) => { const v = e.target.valueAsNumber; if (Number.isFinite(v)) onChange(v) }} />
        {unit && <span className="unit">{unit}</span>}
      </span>
    </label>
  )
}

export function RangeField({ label, unit, value, onChange, min, max, step = 1, display }: {
  label: string; unit: string; value: number; onChange: (v: number) => void; min: number; max: number; step?: number; display?: string
}) {
  return (
    <label className="field range">
      <span className="field-label">{label}: <strong>{display ?? fmt(value, 0)} {unit}</strong></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  )
}

/** A result with its formula and assumptions behind a toggle (SB-03) */
export function Result({ label, value, unit, formula, note }: { label: string; value: string; unit?: string; formula: string; note: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="result">
      <div className="result-row">
        <span className="result-label">{label}</span>
        <span className="result-value">{value}{unit ? <span className="unit"> {unit}</span> : null}</span>
        <button className="formula-btn" onClick={() => setOpen(!open)} aria-expanded={open} title={t('Show formula')}>ƒ</button>
      </div>
      {open && <div className="formula-box"><code>{formula}</code><p>{note}</p></div>}
    </div>
  )
}
