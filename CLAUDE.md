# Istruzioni per Claude (lette a ogni sessione)

## Prima di tutto
Leggi `docs/DIARIO.md`: stato, decisioni, cose da fare. Il piano e le revisioni sono in
`docs/ecss/REVIEWS.md`; la scheda di progetto è un documento Claude Docs (link nel diario).

## Come si lavora (come per EarthEmis)
- Con l'utente si parla in **italiano**, in modo formale ma dando del tu, con istruzioni passo passo.
- Codice, interfaccia e documenti ECSS in **inglese** (pubblico internazionale); interfaccia anche
  in italiano dalla settimana 2.
- Commit in locale con autore Giovanni Marino e consegna di uno **ZIP con i file cambiati**.
  **Mai il push**: lo fa l'utente dal suo PC.
- Dopo ogni modifica: `npm run vcd` (test + VCD) e `npm run build`.
- Ogni valore di riferimento ha la sua fonte aperta accanto (presets.ts, bodies.ts).
  Niente numeri inventati; i valori derivati si dichiarano come tali.
- Ogni test inizia con il codice del requisito: `[SB-xx] …`.
- Ogni modifica che cambia una baseline va registrata in `docs/ecss/CM.md`.
- Alla fine di ogni sessione aggiorna `docs/DIARIO.md` (stato, decisioni, cronologia).
