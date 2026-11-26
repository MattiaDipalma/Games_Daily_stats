// Riconosce i risultati dei giochi nei messaggi del gruppo.
//
//   Krillion #111 🦐          Songless #432                  Magnitudle — Size It Up
//   335                       ⬜⬜⬜⬜⬜ [Top Hits]           2026-11-03
//   🦑🐟🏮🐟🦑🦑🫧             ⬜⬜🟩⬛⬛ [Hip Hop]            Score: 246/500
//                                                            🟥🟥🟥🟥⬜ 71
//   Noillirk #37 · 5,375m
//   Inside the Storm
//   🟡🟠🟣🟠🟠⚫⚫🟠🟡🔵
//   Crowd Whisperer
//
// - Krillion: il punteggio è il numero sulla riga dopo "Krillion #N".
// - Songless: non c'è un punteggio. Per ogni riga conta dove si trova il quadrato verde:
//   1° quadrato 100 punti, 2° 85, 3° 60, 4° 30, 5° 10, nessun verde 0.
//   Quadrati bianchi, neri e rossi non danno punti.
// - Magnitudle: il punteggio è "Score: N/500"; il puzzle è la data scritta nel messaggio.
//   Il gioco cambia ogni tanto il testo che si condivide, quindi qui si accettano anche le varianti:
//   "Size It Up" senza "Magnitudle", "389/500" senza "Score", righe come "🟥🟥🟥🟥⬜ 71%" o
//   "1. ████░ 71/100", una data scritta in un altro modo (vale il giorno del messaggio) e, se manca
//   del tutto l'intestazione, un messaggio fatto solo di righe "quadrati + punti".
// - Noillirk: il messaggio dice la quota raggiunta ("5,375m"), non i punti. I punti si calcolano dai
//   10 cerchi, uno per domanda, come su noillirk.com/scoring: 🟡 risposta n. 1 100, 🟠 2ª o 3ª 75,
//   🟣 top 5 50, 🔵 top 10 25, ⚪ fuori dal tabellone 10, ⚫ saltata o tempo scaduto 0, moltiplicati per
//   il peso della domanda (×1 le prime due, ×2 dalla 3ª alla 5ª, ×3 dalla 6ª all'8ª, ×4 le ultime due).
//   Massimo 2500. Vale anche la tappa con la folla ("Noillirk #37 · 🧍38/100"), che ha gli stessi
//   cerchi. Non contano "Noillirk Unlimited" (non è il daily) e la versione "Krillion-style", dove vince
//   la risposta più rara: è un altro gioco.
//
// Un messaggio può contenere più giochi: ogni intestazione apre un blocco nuovo.

export const GAMES = ['krillion', 'songless', 'magnitudle', 'noillirk'];

export const GAME_NAMES = {
  krillion: 'Krillion',
  songless: 'Songless',
  magnitudle: 'Magnitudle',
  noillirk: 'Noillirk',
};

/** Punti di Songless per posizione del quadrato verde (1°, 2°, …). */
export const SONGLESS_POINTS = [100, 85, 60, 30, 10];

/** Noillirk: punti di ogni cerchio (il posto della risposta nel tabellone) e peso delle 10 domande. */
export const NOILLIRK_POINTS = new Map([
  ['🟡', 100],
  ['🟠', 75],
  ['🟣', 50],
  ['🔵', 25],
  ['⚪', 10],
  ['⚫', 0],
]);
export const NOILLIRK_WEIGHTS = [1, 1, 2, 2, 2, 3, 3, 3, 4, 4];

const MAX_SCORE = 100000;

const HEADERS = {
  krillion: /krillion\s*#\s*(\d+)/i,
  songless: /songless\s*#\s*(\d+)/i,
  // dal nome del gioco ("Magnitudle — Size It Up"): basta una delle due parti
  magnitudle: /magnitudle|size\s*it\s*up/i,
  // "Noillirk #37 · 5,375m": il numero del daily (dopo il #1000 con la virgola, "#1,234").
  // Anche "Noillirk Unlimited" apre un blocco, così i suoi cerchi non finiscono nel gioco di sopra.
  noillirk: /noillirk(?:\s*#\s*(\d{1,3}(?:,\d{3})+|\d+)|\s+unlimited)/i,
};

// Noillirk: le partite che non sono il daily normale (su una riga d'intestazione). Non contano e
// non vanno segnalate. "Krillion-style" anche scritto con lo spazio o con un altro trattino.
const NOILLIRK_OTHER = /noillirk\s+unlimited|noillirk.*krillion\W*style/i;

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

// Magnitudle: barre disegnate con altri caratteri ("████░ 71", "■■■□□ 49", "●●●○○ 60").
const BARS = new Set([...SQUARES, ...'■□▓▒░█▰▱●○◯⬤◉🔲🔳']);
// "Score: 246/500", "Punteggio 246", "Total: 246 / 500"
const MAG_SCORE_RE =
  /(?:score|punteggio|punkte|punti|points|total[ei]?)\s*[:=]?\s*(\d[\d'’.,]*)(?:\s*\/\s*(\d+))?/i;
// "246/500" senza la parola "Score" (il massimo di Magnitudle è 500)
const MAG_TOTAL_RE = /(?<![\d/.,])(\d{1,3})\s*\/\s*(500)(?![\d/])/;
// punti di una manche, tolti i quadrati: "71", "71%", "71 pts", "71/100", "1. 71", "R2: 49"
const MAG_ROW_RE =
  /^(?:(?:r|round|manche|runde)?\s*\d\s*[.):]\s*)?\+?(\d{1,3})\s*(?:%|\/\s*100|pts?\.?|p\.?|punti|points?|punkte)?$/i;
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
function squaresOf(line, set = SQUARES) {
  const squares = [];
  let rest = '';
  for (const c of symbols(line)) {
    if (set.has(c)) squares.push(c);
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

/** Una manche di Magnitudle ("🟥🟥🟥🟥⬜ 71"): i quadrati e i punti (0–100), oppure null. */
function magnitudleRow(line) {
  const { squares, rest } = squaresOf(line, BARS);
  if (!squares.length || squares.length > 12) return null;
  const m = rest.match(MAG_ROW_RE);
  if (!m) return null;
  const points = Number(m[1]);
  return points <= 100 ? { squares, points } : null;
}

/**
 * @param {string[]} lines
 * @param {{ header?: boolean }} [opts] header = false: messaggio senza il nome del gioco, riconosciuto
 *   solo dalla forma (almeno tre righe "quadrati + punti")
 */
function parseMagnitudleBlock(lines, { header = true } = {}) {
  let date = null;
  let badDate = false;
  let score = null;
  let max = null;
  const rows = [];

  for (const line of lines) {
    if (!date) {
      const d = line.match(DATE_RE);
      if (d) {
        date = isoDate(d[1], d[2], d[3]);
        badDate ||= !date;
      }
    }
    const row = magnitudleRow(line);
    if (row) {
      rows.push(row);
      continue;
    }
    if (score !== null) continue;
    const s = line.match(MAG_SCORE_RE) ?? line.match(MAG_TOTAL_RE);
    if (s) {
      score = number(s[1]);
      max = s[2] ? Number(s[2]) : null;
    }
  }

  if (!header && rows.length < 3) return null;
  if (score === null && rows.length) score = rows.reduce((sum, r) => sum + r.points, 0);
  // Senza la griglia serve la data oppure il punteggio scritto come "N/500",
  // così "magnitudle: score 300" in chat non conta (e nemmeno una data impossibile).
  if (score === null || (!rows.length && !date && (!max || badDate))) return null;
  if (max && score > max) return null;

  const grid = rows.map((r) => `${r.squares.join('')} ${r.points}`).join('\n');
  return { puzzle: date, score, grid };
}

/**
 * Punti di Noillirk: per ogni domanda i punti del cerchio per il peso della domanda.
 * @param {string[]} circles i 10 cerchi, nell'ordine delle domande
 */
export function noillirkScore(circles) {
  return circles.reduce((sum, c, i) => sum + (NOILLIRK_POINTS.get(c) ?? 0) * NOILLIRK_WEIGHTS[i], 0);
}

function parseNoillirkBlock(lines) {
  // Unlimited (non è il daily) e Krillion-style (vince la risposta più rara) sono altri giochi
  const header = lines[0].match(HEADERS.noillirk);
  if (!header[1] || NOILLIRK_OTHER.test(lines[0])) return null;
  const puzzle = number(header[1]);
  if (!puzzle) return null;

  // La riga dei cerchi: solo cerchi, uno per domanda, e il daily ha sempre 10 domande (le righe con
  // del testo sono zona, titolo, sfida o commenti).
  const set = new Set(NOILLIRK_POINTS.keys());
  for (const line of lines.slice(1)) {
    const { squares, rest } = squaresOf(line, set);
    if (squares.length !== NOILLIRK_WEIGHTS.length || rest !== '') continue;
    return { puzzle, score: noillirkScore(squares), grid: squares.join('') };
  }
  return null;
}

const PARSERS = {
  krillion: parseKrillionBlock,
  songless: parseSonglessBlock,
  magnitudle: parseMagnitudleBlock,
  noillirk: parseNoillirkBlock,
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

  // Nessun gioco nominato: un messaggio fatto di righe "quadrati + punti" è comunque un Magnitudle.
  if (!starts.length) {
    const parsed = parseMagnitudleBlock(lines, { header: false });
    if (parsed) results.push({ game: 'magnitudle', ...parsed });
  }
  return results;
}

// crowdict.com: il nuovo indirizzo di Noillirk dal 2027, il testo da condividere potrebbe cambiare
const GAME_WORD_RE = /krillion|songless|magnitudle|size\s*it\s*up|noillirk|crowdict/i;

/** Le righe del messaggio senza le partite di Noillirk che non contano (dall'intestazione alla prossima). */
function withoutIgnored(lines) {
  let ignored = false;
  return lines.filter((line) => {
    if (headerOf(line)) ignored = NOILLIRK_OTHER.test(line);
    return !ignored;
  });
}

/**
 * Il messaggio sembra il risultato di un gioco? Serve solo per segnalare nel log i messaggi che
 * parseMessage() non ha riconosciuto (per esempio quando un gioco cambia il testo da condividere):
 * il nome di un gioco insieme a un numero da solo, a un punteggio o a una riga di quadrati, oppure
 * almeno due righe di quadrati. Le partite di Noillirk che non contano (Unlimited, Krillion-style)
 * non vengono segnalate, il resto del messaggio sì.
 * @param {string | null | undefined} text
 */
export function looksLikeResult(text) {
  if (!text || typeof text !== 'string') return false;
  const lines = withoutIgnored(toLines(text)).filter((l) => l !== '');
  const gridRows = lines.filter((l) => squaresOf(l, BARS).squares.length >= 3).length;
  if (gridRows >= 2) return true;
  if (!lines.some((l) => GAME_WORD_RE.test(l))) return false;
  return (
    gridRows > 0 ||
    lines.some((l) => /^\D{0,3}\d{1,4}\D{0,3}$/.test(l) || /\d\s*\/\s*\d|score|punteggio/i.test(l))
  );
}

/** Etichetta del puzzle: "Krillion #111", "Magnitudle 2026-11-03". */
export function puzzleLabel(game, puzzle) {
  const name = GAME_NAMES[game] ?? game;
  return typeof puzzle === 'number' ? `${name} #${puzzle}` : `${name} ${puzzle}`;
}
