// Modello dati dei file docs/data/<gioco>.json e logica di unione dei risultati.
//
// {
//   "version": 1,
//   "updatedAt": "2026-11-04T17:56:00.000Z",
//   "results": [
//     { "puzzle": 112, "player": "Daniel", "score": 285, "date": "2026-11-04",
//       "ts": 1793790640, "grid": "🦑🐟...", "msgId": "3EB0..." }
//   ]
// }
//
// Un file per gioco. "puzzle" è il numero (Krillion, Songless) oppure la data (Magnitudle).
// Un giocatore ha al massimo un risultato per puzzle: vale il primo messaggio
// inviato. Se lo stesso messaggio viene modificato su WhatsApp (stesso msgId),
// la versione modificata sostituisce quella vecchia.

import { GAME_NAMES, puzzleLabel } from './parser.js';

export const DATA_VERSION = 1;

const MAX_SCORE = 100000;
const INVISIBLE = /[\u200b\u200e\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g;

export function emptyData() {
  return { version: DATA_VERSION, updatedAt: null, results: [] };
}

export function aliasKey(s) {
  const key = String(s ?? '')
    .replace(INVISIBLE, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
  // "+41 79 123 45 67", "41791234567", "41791234567@s.whatsapp.net" → "41791234567"
  const phone = key.replace(/@s\.whatsapp\.net$/, '');
  if (isPhone(phone)) return phone.replace(/\D/g, '');
  return key;
}

function isPhone(s) {
  return /^\+?[\d\s().-]{6,}$/.test(s) && s.replace(/\D/g, '').length >= 6;
}

/**
 * I numeri di telefono non vengono mai pubblicati: "+41 79 123 45 46" → "+41∙∙∙∙∙∙∙46".
 * Restano le prime e le ultime due cifre, per riconoscere la persona in names.json.
 */
export function maskPhone(phone) {
  const digits = String(phone).replace(/\D/g, '');
  return `+${digits.slice(0, 2)}${'∙'.repeat(Math.max(0, digits.length - 4))}${digits.slice(-2)}`;
}

/**
 * Nome da salvare: alias se c'è (confronto senza maiuscole/spazi), altrimenti il nome
 * stesso; un numero di telefono senza alias viene mascherato.
 * @param {string} name
 * @param {Map<string, string>} aliasMap chiavi già normalizzate con aliasKey()
 */
export function resolveName(name, aliasMap) {
  const clean = String(name ?? '')
    .replace(INVISIBLE, '')
    .trim();
  const alias = aliasMap?.get(aliasKey(clean));
  if (alias) return alias;
  return isPhone(clean.replace(/@s\.whatsapp\.net$/, '')) ? maskPhone(clean) : clean;
}

/** @param {Record<string, string>} aliases */
export function buildAliasMap(aliases = {}) {
  const map = new Map();
  for (const [from, to] of Object.entries(aliases)) {
    if (typeof to === 'string' && to.trim()) map.set(aliasKey(from), to.trim());
  }
  return map;
}

const isIsoDate = (p) => typeof p === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(p);
const isPuzzle = (p) => (Number.isSafeInteger(p) && p > 0) || isIsoDate(p);

/** Ordine dei puzzle: numeri per Krillion/Songless, date (stringhe ISO) per Magnitudle. */
export function comparePuzzles(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

const keyOf = (r) => `${r.puzzle}\u0000${r.player.toLowerCase()}`;

function sortResults(results) {
  return results.sort(
    (a, b) =>
      comparePuzzles(b.puzzle, a.puzzle) || (a.ts ?? 0) - (b.ts ?? 0) || a.player.localeCompare(b.player),
  );
}

function isValid(r) {
  return (
    r &&
    isPuzzle(r.puzzle) &&
    Number.isSafeInteger(r.score) &&
    r.score >= 0 &&
    r.score <= MAX_SCORE &&
    typeof r.player === 'string' &&
    r.player.trim() !== ''
  );
}

function clean(r) {
  const out = { puzzle: r.puzzle, player: r.player, score: r.score };
  if (r.date) out.date = r.date;
  if (Number.isFinite(r.ts)) out.ts = r.ts;
  if (r.grid) out.grid = r.grid;
  if (r.msgId) out.msgId = r.msgId;
  return out;
}

/**
 * Unisce nuovi risultati nei dati esistenti. Non modifica `data`.
 *
 * @param {ReturnType<typeof emptyData>} data
 * @param {Array<object>} incoming
 * @param {{ aliasMap?: Map<string, string> }} [opts]
 * @returns {{ data: object, changed: boolean, added: object[], updated: object[] }}
 */
export function mergeResults(data, incoming, { aliasMap } = {}) {
  const base = data && Array.isArray(data.results) ? data : emptyData();
  const before = JSON.stringify(base.results);

  // Riapplica gli alias anche ai dati già salvati: aggiungere un alias
  // sistema lo storico alla prossima scrittura.
  const byKey = new Map();
  const byMsgId = new Map();
  const put = (r) => {
    byKey.set(keyOf(r), r);
    if (r.msgId) byMsgId.set(r.msgId, r);
  };
  const remove = (r) => {
    byKey.delete(keyOf(r));
    if (r.msgId && byMsgId.get(r.msgId) === r) byMsgId.delete(r.msgId);
  };
  const isEarlier = (a, b) => (a.ts ?? Infinity) < (b.ts ?? Infinity);

  for (const old of base.results) {
    if (!isValid(old)) continue;
    const r = clean({ ...old, player: resolveName(old.player, aliasMap) });
    const existing = byKey.get(keyOf(r));
    if (!existing || isEarlier(r, existing)) {
      if (existing) remove(existing);
      put(r);
    }
  }

  const added = [];
  const updated = [];
  for (const raw of incoming) {
    if (!isValid(raw)) continue;
    const r = clean({ ...raw, player: resolveName(raw.player, aliasMap) });

    // Modifica di un messaggio già registrato: sostituisce la vecchia versione.
    const sameMsg = r.msgId ? byMsgId.get(r.msgId) : undefined;
    if (sameMsg) {
      const edited = { ...r, ts: sameMsg.ts ?? r.ts, date: sameMsg.date ?? r.date };
      if (JSON.stringify(clean(edited)) === JSON.stringify(sameMsg)) continue;
      const clash = byKey.get(keyOf(edited));
      remove(sameMsg);
      if (clash && clash !== sameMsg) remove(clash);
      put(clean(edited));
      updated.push(clean(edited));
      continue;
    }

    const existing = byKey.get(keyOf(r));
    if (!existing) {
      put(r);
      added.push(r);
    } else if (isEarlier(r, existing)) {
      remove(existing);
      put(r);
      updated.push(r);
    } else if (!existing.grid && r.grid && existing.score === r.score) {
      // stesso risultato, ma ora abbiamo anche la griglia
      const merged = { ...existing, grid: r.grid };
      remove(existing);
      put(merged);
    }
  }

  const results = sortResults([...byKey.values()]);
  const changed = JSON.stringify(results) !== before;
  return {
    data: {
      version: DATA_VERSION,
      updatedAt: changed ? new Date().toISOString() : (base.updatedAt ?? null),
      results,
    },
    changed,
    added,
    updated,
  };
}

/**
 * JSON con un risultato per riga: file leggibile e diff git puliti.
 */
export function serialize(data) {
  const head = { version: data.version ?? DATA_VERSION, updatedAt: data.updatedAt ?? null };
  const rows = (data.results ?? []).map((r) => '    ' + JSON.stringify(r));
  return (
    '{\n' +
    `  "version": ${JSON.stringify(head.version)},\n` +
    `  "updatedAt": ${JSON.stringify(head.updatedAt)},\n` +
    '  "results": [' +
    (rows.length ? '\n' + rows.join(',\n') + '\n  ' : '') +
    ']\n}\n'
  );
}

export function parseData(text) {
  if (!text || !text.trim()) return emptyData();
  const data = JSON.parse(text);
  if (!data || !Array.isArray(data.results)) return emptyData();
  return data;
}

/** Data locale (YYYY-MM-DD) di un timestamp unix in secondi. */
export function localDate(tsSeconds, timeZone = 'Europe/Zurich') {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date(tsSeconds * 1000));
  const get = (t) => parts.find((p) => p.type === t).value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

/** Riassunto breve per il messaggio di commit, es. "Krillion #112: Daniel 285, Anna 225". */
export function describeChanges(game, added, updated) {
  const all = [...added, ...updated];
  const name = GAME_NAMES[game] ?? game;
  if (all.length === 0) return `Aggiorna statistiche ${name}`;
  const puzzles = [...new Set(all.map((r) => r.puzzle))].sort((a, b) => comparePuzzles(b, a));
  const parts = all.slice(0, 6).map((r) => `${r.player} ${r.score}`);
  const more = all.length > 6 ? ` +${all.length - 6}` : '';
  const label = puzzles.length === 1 ? puzzleLabel(game, puzzles[0]) : `${name} ${puzzles.length} puzzle`;
  return `${label}: ${parts.join(', ')}${more}`;
}
