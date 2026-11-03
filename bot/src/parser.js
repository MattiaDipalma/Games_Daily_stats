// Riconosce i risultati dei tre giochi nei messaggi del gruppo.
//
//   Krillion #111 🦐          Songless #432                  Magnitudle — Size It Up
//   335                       ⬜⬜⬜⬜⬜ [Top Hits]           2026-11-03
//   🦑🐟🏮🐟🦑🦑🫧             ⬜⬜🟩⬛⬛ [Hip Hop]            Score: 246/500
//                                                            🟥🟥🟥🟥⬜ 71
//
// - Krillion: il punteggio è il numero sulla riga dopo "Krillion #N".
// - Songless: non c'è un punteggio. Per ogni riga conta dove si trova il quadrato verde:
//   1° quadrato 100 punti, 2° 85, 3° 60, 4° 30, 5° 10, nessun verde 0.
//   Quadrati bianchi, neri e rossi non danno punti.
// - Magnitudle: il punteggio è "Score: N/500"; il puzzle è la data scritta nel messaggio.
//
// Un messaggio può contenere più giochi: ogni intestazione apre un blocco nuovo.

export const GAMES = ['krillion', 'songless', 'magnitudle'];

export const GAME_NAMES = { krillion: 'Krillion', songless: 'Songless', magnitudle: 'Magnitudle' };

/** Punti di Songless per posizione del quadrato verde (1°, 2°, …). */
export const SONGLESS_POINTS = [100, 85, 60, 30, 10];

const MAX_SCORE = 100000;

const HEADERS = {
  krillion: /krillion\s*#\s*(\d+)/i,
  songless: /songless\s*#\s*(\d+)/i,
  magnitudle: /magnitudle/i,
};

// caratteri invisibili che WhatsApp inserisce a volte (LRM, RLM, ZWSP, BOM, isolamenti).
// Lo ZWJ (U+200D) resta: serve alle emoji composte.
const INVISIBLE = /[\u200b\u200e\u200f\u202a-\u202e\u2066-\u2069\ufeff]/g;

// Quadrati (e cerchi) delle griglie. Verde = indovinato.
const GREEN = new Set(['🟩', '🟢']);
const SQUARES = new Set([
  ...GREEN,
  '⬜',
  '⬛',
  '🟥',
  '🟨',
  '🟧',
  '🟦',
  '🟪',
  '🟫',
  '◻',
  '◼',
  '▫',
  '▪',
  '◽',
  '◾',
  '⚪',
  '⚫',
  '🔴',
  '🟡',
  '🟠',
  '🔵',
  '🟣',
  '🟤',
]);

// "285", "1'234", "1.234", "1,234", "1 234": separatori delle migliaia ammessi.
const SCORE_RE = /^\D{0,3}?(\d{1,3}(?:['’., ]\d{3})+|\d+)(?!\d)/;
const URL_RE = /https?:\/\//i;
const DATE_RE = /(?<!\d)(\d{4})-(\d{2})-(\d{2})(?!\d)/;

function toLines(text) {
  return text
    .replace(/\r\n?/g, '\n')
    .replace(INVISIBLE, '')
    .replace(/\u00a0/g, ' ')
    .split('\n')
    .map((l) => l.trim());
}

/** Le emoji di una riga, senza selettori di variante (⬜️ → ⬜). */
const symbols = (line) => [...line.replace(/\ufe0f/g, '')];

/** I quadrati di una riga e il resto del testo (etichetta o numero). */
function squaresOf(line) {
  const squares = [];
  let rest = '';
  for (const c of symbols(line)) {
    if (SQUARES.has(c)) squares.push(c);
    else rest += c;
  }
  return { squares, rest: rest.trim() };
}

function isoDate(y, m, d) {
  const date = new Date(Date.UTC(Number(y), Number(m) - 1, Number(d)));
  if (date.getUTCFullYear() !== Number(y) || date.getUTCMonth() !== Number(m) - 1) return null;
  if (date.getUTCDate() !== Number(d)) return null;
  return `${y}-${m}-${d}`;
}

function number(text) {
  const n = Number(text.replace(/['’., ]/g, ''));
  return Number.isSafeInteger(n) && n >= 0 && n <= MAX_SCORE ? n : null;
}

// ---------------------------------------------------------------------------

function parseKrillionBlock(lines) {
  const puzzle = Number(lines[0].match(HEADERS.krillion)[1]);
  if (!Number.isSafeInteger(puzzle) || puzzle <= 0) return null;

  // Il punteggio è la prima riga non vuota dopo l'intestazione.
  let i = 1;
  while (i < lines.length && lines[i] === '') i++;
  if (i >= lines.length) return null;
  const m = lines[i].match(SCORE_RE);
  if (!m) return null;
  const score = number(m[1]);
  if (score === null) return null;

  // Griglia: le righe di sole emoji (i commenti scritti sotto non contano).
  const grid = lines
    .slice(i + 1)
    .filter((l) => l !== '' && !URL_RE.test(l) && !/[\p{L}\p{N}]/u.test(l))
    .join('\n')
    .slice(0, 200);

  return { puzzle, score, grid };
}

/**
 * Punti di una riga di Songless: dipendono da dove si trova il quadrato verde.
 * @param {string[]} squares
 * @returns {{ guess: number, points: number }} guess = posizione del verde (1…), 0 se non c'è
 */
export function songlessRow(squares) {
  const index = squares.findIndex((c) => GREEN.has(c));
  if (index === -1) return { guess: 0, points: 0 };
  return { guess: index + 1, points: SONGLESS_POINTS[index] ?? 0 };
}

function parseSonglessBlock(lines) {
  const puzzle = Number(lines[0].match(HEADERS.songless)[1]);
  if (!Number.isSafeInteger(puzzle) || puzzle <= 0) return null;

  const rows = [];
  for (const line of lines.slice(1)) {
    const { squares, rest } = squaresOf(line);
    // una riga della griglia ha 5 quadrati: un 🟩 isolato in un commento non conta
    if (squares.length < 3) continue;
    // "[Hip Hop]" → "Hip Hop"
    const label = rest
      .replace(/^\[(.*)\]$/, '$1')
      .trim()
      .slice(0, 40);
    rows.push({ squares, label });
    if (rows.length >= 10) break;
  }
  if (rows.length === 0) return null;

  let score = 0;
  for (const row of rows) score += songlessRow(row.squares).points;
  const grid = rows.map((r) => r.squares.join('') + (r.label ? ` [${r.label}]` : '')).join('\n');
  return { puzzle, score, grid };
}

function parseMagnitudleBlock(lines) {
  let date = null;
  let score = null;
  let max = null;
  const rows = [];

  for (const line of lines) {
    if (!date) {
      const d = line.match(DATE_RE);
      if (d) date = isoDate(d[1], d[2], d[3]);
    }
    const s = line.match(/score\s*:?\s*(\d[\d'’.,]*)(?:\s*\/\s*(\d+))?/i);
    if (s && score === null) {
      score = number(s[1]);
      max = s[2] ? Number(s[2]) : null;
      continue;
    }
    const { squares, rest } = squaresOf(line);
    if (squares.length && /^\d{1,4}$/.test(rest)) rows.push({ squares, points: Number(rest) });
  }

  if (score === null && rows.length) score = rows.reduce((sum, r) => sum + r.points, 0);
  // Senza la griglia serve almeno la data, così "magnitudle: score 300" in chat non conta.
  if (score === null || (!rows.length && !date)) return null;
  if (max && score > max) return null;

  const grid = rows.map((r) => `${r.squares.join('')} ${r.points}`).join('\n');
  return { puzzle: date, score, grid };
}

const PARSERS = {
  krillion: parseKrillionBlock,
  songless: parseSonglessBlock,
  magnitudle: parseMagnitudleBlock,
};

/** Il gioco di cui la riga è l'intestazione, oppure null. */
function headerOf(line) {
  for (const game of GAMES) if (HEADERS[game].test(line)) return game;
  return null;
}

/**
 * Tutti i risultati contenuti in un messaggio (al massimo uno per gioco).
 * Per Magnitudle `puzzle` è la data ("2026-11-03"), oppure null se nel messaggio non c'è.
 *
 * @param {string | null | undefined} text
 * @returns {Array<{ game: string, puzzle: number | string | null, score: number, grid: string }>}
 */
export function parseMessage(text) {
  if (!text || typeof text !== 'string') return [];
  const lines = toLines(text);

  const starts = [];
  lines.forEach((line, i) => {
    const game = headerOf(line);
    if (game) starts.push({ game, i });
  });

  const results = [];
  const seen = new Set();
  starts.forEach(({ game, i }, n) => {
    if (seen.has(game)) return;
    const block = lines.slice(i, starts[n + 1]?.i ?? lines.length);
    const parsed = PARSERS[game](block);
    if (!parsed) return;
    seen.add(game);
    results.push({ game, ...parsed });
  });
  return results;
}

/** Etichetta del puzzle: "Krillion #111", "Magnitudle 2026-11-03". */
export function puzzleLabel(game, puzzle) {
  const name = GAME_NAMES[game] ?? game;
  return typeof puzzle === 'number' ? `${name} #${puzzle}` : `${name} ${puzzle}`;
}
