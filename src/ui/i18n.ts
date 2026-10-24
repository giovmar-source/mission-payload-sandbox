// Interface texts in English and Italian (SB-08). English is the reference language.

import { useEffect, useState } from 'react'

export type Lang = 'en' | 'it'

const IT: Record<string, string> = {
  'First-order mission and payload trade-offs, from Earth observation to Mars.': 'Trade-off di primo ordine tra missione e payload, dall\'osservazione della Terra a Marte.',
  'Preset': 'Preset',
  'Custom design': 'Progetto personalizzato',
  'Share link': 'Link da condividere',
  'Link copied': 'Link copiato',
  'Export JSON': 'Esporta JSON',
  'Mission': 'Missione',
  'Payload': 'Payload',
  'Link and storage': 'Collegamento e memoria',
  'Budgets (ESA margins)': 'Budget (margini ESA)',
  'Requirements': 'Requisiti',
  'Central body': 'Corpo centrale',
  'Earth': 'Terra',
  'Mars': 'Marte',
  'Altitude': 'Quota',
  'Satellites': 'Satelliti',
  'Family': 'Famiglia',
  'Multispectral imager': 'Camera multispettrale',
  'Imaging spectrometer': 'Spettrometro iperspettrale',
  'Aperture': 'Apertura',
  'Focal length': 'Focale',
  'Pixel pitch': 'Passo del pixel',
  'Pixels across track': 'Pixel lungo la riga',
  'Bits per sample': 'Bit per campione',
  'Compression ratio': 'Rapporto di compressione',
  'Imaging duty cycle': 'Frazione di tempo in acquisizione',
  'Optics transmission': 'Trasmissione dell\'ottica',
  'Quantum efficiency': 'Efficienza quantica',
  'Read noise': 'Rumore di lettura',
  'TDI stages': 'Stadi TDI',
  'Spectral sampling': 'Passo spettrale',
  'Reference radiance': 'Radianza di riferimento',
  'Downlink mode': 'Modalità del downlink',
  'Given rate': 'Velocità data',
  'Link budget': 'Bilancio del collegamento',
  'Downlink rate': 'Velocità di downlink',
  'Transmitter power': 'Potenza del trasmettitore',
  'Antenna diameter': 'Diametro dell\'antenna',
  'Antenna efficiency': 'Efficienza dell\'antenna',
  'Frequency': 'Frequenza',
  'Ground antenna gain': 'Guadagno dell\'antenna a terra',
  'System noise temperature': 'Temperatura di rumore del sistema',
  'Required Eb/N0': 'Eb/N0 richiesto',
  'Link margin': 'Margine del collegamento',
  'Other losses': 'Altre perdite',
  'Radio maximum rate': 'Velocità massima della radio',
  'Earth–Mars distance': 'Distanza Terra–Marte',
  'Ground-station elevation': 'Elevazione della stazione di terra',
  'Contact time per day': 'Tempo di contatto al giorno',
  'Contact time per sol': 'Tempo di contatto per sol',
  'Mass memory': 'Memoria di massa',
  'Compliance matrix': 'Matrice di conformità',
  'Quantity': 'Grandezza',
  'Limit': 'Limite',
  'Value': 'Valore',
  'Margin': 'Margine',
  'Status': 'Stato',
  'compliant': 'conforme',
  'marginal': 'al limite',
  'non-compliant': 'non conforme',
  'Example requirements: edit the limits. Marginal = margin below 10% (a sandbox convention, not an ESA rule).': 'Requisiti di esempio: modifica i limiti. Al limite = margine sotto il 10% (convenzione del sandbox, non una regola ESA).',
  'Orbit and geometry': 'Orbita e geometria',
  'Orbital period': 'Periodo orbitale',
  'Ground speed': 'Velocità al suolo',
  'Sun-synchronous inclination': 'Inclinazione eliosincrona',
  'none at this altitude': 'nessuna a questa quota',
  'Equator coverage': 'Copertura dell\'equatore',
  'Ground sampling distance': 'Risoluzione a terra (GSD)',
  'Swath': 'Larghezza della striscia',
  'Line time': 'Tempo di riga',
  'Radiometry': 'Radiometria',
  'Band': 'Banda',
  'Centre': 'Centro',
  'Width': 'Larghezza',
  'Channels': 'Canali',
  'Data and downlink': 'Dati e downlink',
  'Raw data rate': 'Flusso dati non compresso',
  'Compressed data rate': 'Flusso dati compresso',
  'Data per day': 'Dati al giorno',
  'Data per sol': 'Dati per sol',
  'Link distance': 'Distanza del collegamento',
  'Limited by': 'Limitato da',
  'the link': 'il collegamento',
  'the radio': 'la radio',
  'Downlink per day': 'Downlink al giorno',
  'Downlink per sol': 'Downlink per sol',
  'Downlink / data generated': 'Downlink / dati generati',
  'One day of data / mass memory': 'Un giorno di dati / memoria di massa',
  'One sol of data / mass memory': 'Un sol di dati / memoria di massa',
  'Unit': 'Unità',
  'Mass': 'Massa',
  'Power': 'Potenza',
  'Maturity': 'Maturità',
  'With margin': 'Con margine',
  'Nominal (with equipment margins)': 'Nominale (con margini delle unità)',
  'System margin 20%': 'Margine di sistema 20%',
  'Total': 'Totale',
  'Add unit': 'Aggiungi unità',
  'Remove': 'Rimuovi',
  'No units yet: add the payload and platform units.': 'Nessuna unità: aggiungi le unità del payload e della piattaforma.',
  'Maturity A/B: off-the-shelf (5%) · C: minor modifications (10%) · D: new design (20%).': 'Maturità A/B: già qualificata (5%) · C: piccole modifiche (10%) · D: nuovo sviluppo (20%).',
  'assumed': 'ipotesi',
  'derived': 'ricavato',
  'Computed from published values.': 'Calcolato da valori pubblicati.',
  'This value is an assumption, not a published value.': 'Questo valore è un\'ipotesi, non un valore pubblicato.',
  'Show formula': 'Mostra la formula',
  'Formula': 'Formula',
  'Built with ECSS practices: requirements, ICD, verification control document and validation are in the repository.': 'Sviluppato con le pratiche ECSS: requisiti, ICD, documento di controllo della verifica e validazione sono nel repository.',
  'First-order model for phase 0/A trade-offs, not for flight design.': 'Modello di primo ordine per i trade-off di fase 0/A, non per il progetto di volo.',
  'SNR (minimum band)': 'SNR (banda minima)',
  'Circular orbit, spherical body; altitude above the equatorial radius.': 'Orbita circolare, corpo sferico; quota sopra il raggio equatoriale.',
  'Ignores the rotation of the body (a few per cent in low orbit).': 'Trascura la rotazione del corpo (qualche per cento in orbita bassa).',
  'J2 nodal precession only.': 'Solo la precessione nodale dovuta a J2.',
  'Days (sols on Mars) to cover the equator once; not the exact repeat cycle of the ground track.': 'Giorni (sol su Marte) per coprire una volta l\'equatore; non è il ciclo di ripetizione esatto della traccia.',
  'Nadir, pinhole relation.': 'Al nadir, relazione della camera a foro stenopeico.',
  'Flat-surface approximation: underestimates very wide swaths.': 'Approssimazione a superficie piana: sottostima le strisce molto larghe.',
  'Integration time per TDI stage.': 'Tempo di integrazione per stadio TDI.',
  'Reference radiance per band (Sentinel-2 Lref where not published); on Mars scaled by the solar irradiance ratio 586.2 / 1361.': 'Radianza di riferimento per banda (Lref di Sentinel-2 dove non pubblicata); su Marte scalata con il rapporto di irraggiamento solare 586,2 / 1361.',
  'Every band or spectral channel sampled at its own GSD.': 'Ogni banda o canale spettrale campionato alla propria GSD.',
  'Average compression ratio.': 'Rapporto di compressione medio.',
  'A sol on Mars.': 'Un sol su Marte.',
  'Slant range at the minimum elevation on Earth; Earth–Mars distance on Mars.': 'Distanza obliqua all\'elevazione minima sulla Terra; distanza Terra–Marte su Marte.',
  'Contact time per day (per sol on Mars).': 'Tempo di contatto al giorno (per sol su Marte).',
  'Below 1: data accumulates on board.': 'Sotto 1: i dati si accumulano a bordo.',
  'The ESA margin policy sets no mass-memory margin: judged by your requirement.': 'La politica di margini ESA non fissa margini per la memoria di massa: si giudica sul tuo requisito.',
  'PDF summary': 'Riepilogo PDF',
  'Model validity': 'Validità del modello',
  'Below 300 km on Earth, atmospheric drag shortens the orbit lifetime; the model ignores drag.': 'Sotto i 300 km sulla Terra la resistenza atmosferica accorcia la vita dell\'orbita; il modello la trascura.',
  'No sun-synchronous orbit exists at this altitude.': 'A questa quota non esiste un\'orbita eliosincrona.',
  'The pixel is smaller than the diffraction spot': 'Il pixel è più piccolo della macchia di diffrazione',
  'image sharpness is limited by the optics, not by the detector.': 'la nitidezza dell\'immagine è limitata dall\'ottica, non dal sensore.',
  'Wide field of view: the flat-surface swath is underestimated by about': 'Campo di vista ampio: la striscia calcolata su superficie piana è sottostimata di circa',
  'Trade-offs against altitude': 'Trade-off al variare della quota',
  'A higher orbit widens the swath and speeds up coverage, but coarsens the resolution: the dot is the current design, the dashed line your requirement.': 'Un\'orbita più alta allarga la striscia e accelera la copertura, ma peggiora la risoluzione: il punto è il progetto attuale, la linea tratteggiata il tuo requisito.',
  'against altitude': 'al variare della quota',
  'Design summary': 'Riepilogo del progetto',
  'Key results': 'Risultati principali',
  'Assumptions': 'Ipotesi',
  'Derived values': 'Valori ricavati',
  'Sources': 'Fonti',
  'days': 'giorni',
  'sols': 'sol',
}

let current: Lang = (() => {
  try {
    const q = new URLSearchParams(window.location.search).get('lang')
    if (q === 'it' || q === 'en') return q
    const saved = localStorage.getItem('mps-lang')
    if (saved === 'it' || saved === 'en') return saved
  } catch { /* storage unavailable */ }
  return typeof navigator !== 'undefined' && navigator.language?.startsWith('it') ? 'it' : 'en'
})()
const listeners = new Set<(l: Lang) => void>()

export function t(text: string): string {
  return current === 'it' ? IT[text] ?? text : text
}

export function setLang(l: Lang) {
  current = l
  try { localStorage.setItem('mps-lang', l) } catch { /* storage unavailable */ }
  document.documentElement.lang = l
  listeners.forEach((fn) => fn(l))
}

export function useLang(): Lang {
  const [l, setL] = useState(current)
  useEffect(() => { listeners.add(setL); return () => { listeners.delete(setL) } }, [])
  return l
}

/** Number formatting in the interface language */
export function fmt(v: number, digits = 2): string {
  if (!Number.isFinite(v)) return '–'
  return v.toLocaleString(current === 'it' ? 'it-IT' : 'en-GB', { minimumFractionDigits: digits, maximumFractionDigits: digits })
}

export const ITALIAN_KEYS = Object.keys(IT)
