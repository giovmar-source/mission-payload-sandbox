# Diario di progetto · Mission & Payload Sandbox

Ultimo aggiornamento: **23 ottobre 2026**

## 1. In breve
- **Cos'è:** simulatore web di primo ordine per i trade-off di missione e payload, dalla Terra a Marte,
  sviluppato con le pratiche ECSS. Progetto portfolio per ruoli da systems engineer.
- **Scheda di progetto (Claude Docs):** https://claude.ai/code/artifact/fdf5db34-f009-47e0-adae-53baa79727ca
- **Repository:** github.com/giovmar-source/mission-payload-sandbox (da creare a cura dell'utente)
- **Vincoli:** solo risorse gratuite, sito statico (Cloudflare Pages).

## 2. Decisioni
| Data | Decisione |
| --- | --- |
| 19 ott | Nome: Mission & Payload Sandbox. Payload fase 1: camera multispettrale e spettrometro iperspettrale; fase 2: piattaforma con due payload, FTS (tipo FORUM), SAR, altri corpi celesti |
| 19 ott | Standard ECSS applicati (con tailoring): E-ST-10-06C, E-ST-10-02C Rev.1, E-ST-10-24C Rev.1, M-ST-10C, M-ST-40C Rev.1; margini dalla politica ESA per gli studi di assessment |
| 19 ott | Stack: React 19 + Vite 7.3.7 + TypeScript 5.9 + Vitest 4.1.12; `.npmrc` con legacy-peer-deps (bug di npm con le dipendenze opzionali di Vitest 4) |
| 19 ott | Licenza MIT; documenti in inglese, dialogo in italiano |

## 3. Stato
- Fase 0 (MDR) e fase A (PRR) chiuse. Prossima revisione: SRR.
- Fatto: nucleo orbita (Terra, Marte), geometria (GSD, swath, tempo di riga), preset con fonti,
  moduli di radiometria/SNR, dati e collegamento (23 ott), 15 test, VCD generato dai test, TS, VP, ICD (bozza), revisioni, configurazione, nota di validazione,
  pagina di anteprima.

## 4. Da fare (prossimi passi)
- [x] PRR (23 ott): SNR di MSI, collegamento di MRO; aperto: tabella SNR di OLI non leggibile da fonti aperte
- [ ] SRR: baseline della TS (tag `srr`)
- [x] Moduli: radiometria e SNR, dati, collegamento
- [ ] Modulo budget con margini ESA (SB-05), poi SRR
- [ ] Settimana 2: interfaccia completa, matrice di conformità, IT/EN
- [ ] Marte: rivisita in sol (oggi i «giorni» sono di 86 400 s anche su Marte)

## 5. Cronologia
| Data | Cosa |
| --- | --- |
| 19 ott 2026 | Avvio: ricerca di mercato, scheda di progetto, standard ECSS e modello a V, struttura del repository, primo modulo fisico con test e VCD |
| 23 ott 2026 | Fase A chiusa (PRR): moduli radiometria, dati e collegamento con 8 nuovi test; validazione su Sentinel-2 (flusso dati −0,7%, SNR) e MRO (EIRP +0,25 dB, collegamento); SB-02 esteso (CR-002) |
