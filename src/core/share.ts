/**
 * Sharing a design (SB-08): the whole design is encoded in the URL fragment, so a link
 * reproduces the configuration without a server. Export as JSON uses the same structure.
 */

import type { Design } from './design'

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  bytes.forEach((b) => { binary += String.fromCharCode(b) })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fromBase64Url(code: string): string {
  const b64 = code.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((code.length + 3) % 4)
  const binary = atob(b64)
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)))
}

export function encodeDesign(design: Design): string {
  return toBase64Url(JSON.stringify(design))
}

/** Decodes a shared design; returns null when the code is not a valid version-1 design */
export function decodeDesign(code: string): Design | null {
  try {
    const d = JSON.parse(fromBase64Url(code))
    const valid = d && d.version === 1 && (d.body === 'earth' || d.body === 'mars')
      && typeof d.altitudeKm === 'number' && d.payload && d.link && d.storage
      && Array.isArray(d.units) && Array.isArray(d.requirements)
    return valid ? (d as Design) : null
  } catch {
    return null
  }
}

export function designToJson(design: Design): string {
  return JSON.stringify(design, null, 2)
}
