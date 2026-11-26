import { test } from 'node:test';
import assert from 'node:assert/strict';
import { looksLikeResult, parseMessage, puzzleLabel, songlessRow } from '../src/parser.js';

// I messaggi così come arrivano nel gruppo (vedi screenshot nel README)
const KRILLION = 'Krillion #111 🦐\n335\n\n🦑🐟🏮🐟🦑🦑🫧';
const SONGLESS = [
  'Songless #432',
  '',
  '⬜⬜⬜⬜⬜ [Top Hits]',
  '⬜⬜⬜⬜⬜ [Pop]',
  '⬜⬜⬜⬜⬜ [Rock]',
  '⬜⬜🟩⬛⬛ [Hip Hop]',
  '⬜⬜🟩⬛⬛ [EDM]',
].join('\n');
const MAGNITUDLE = [
  'Magnitudle — Size It Up',
  '2026-11-03',
  '',
  'Score: 246/500',
  '',
  '🟥🟥🟥🟥⬜ 71',
  '🟥⬜⬜⬜⬜ 12',
  '🟥⬜⬜⬜⬜ 14',
  '🟥🟥⬜⬜⬜ 49',
  '🟥🟥🟥🟥🟥 100',
].join('\n');
// Noillirk: il numero del daily e la quota, la zona, un cerchio per domanda e il titolo
const NOILLIRK = 'Noillirk #37 · 5,375m\nInside the Storm\n🟡🟠🟣🟠🟠⚫⚫🟠🟡🔵\nCrowd Whisperer';
const NOILLIRK_GRID = '🟡🟠🟣🟠🟠⚫⚫🟠🟡🔵';

const one = (text) => {
  const results = parseMessage(text);
  assert.equal(results.length, 1, `un risultato in: ${text}`);
  return results[0];
};

// ---------------------------------------------------------------------------
// Krillion

test('Krillion: messaggio standard', () => {
  assert.deepEqual(one(KRILLION), { game: 'krillion', puzzle: 111, score: 335, grid: '🦑🐟🏮🐟🦑🦑🫧' });
});

test('Krillion: il punteggio è sempre la seconda riga', () => {
  assert.equal(one('Krillion #80 🦐\n225\n🐟🐟🐟⚪🔴⚪🐟').score, 225);
  assert.equal(one('Krillion #81\r\n\r\n  312  \r\n🦐').score, 312);
  assert.equal(one("Krillion #5\n1'234\n🦐").score, 1234);
});

test('Krillion: testo prima del risultato e caratteri invisibili', () => {
  const r = one('oggi difficile\n\u200eKrillion #79 🦐\n\u200e190\n🦐');
  assert.deepEqual([r.puzzle, r.score], [79, 190]);
});

test('Krillion: link e commenti sotto non finiscono nella griglia', () => {
  assert.equal(one('Krillion #80 🦐\n285\n🦐🦐\nhttps://krillion.example').grid, '🦐🦐');
  assert.equal(one('Krillion #102 🦐\n160\n🐟🫧🐟🐟⬛🦑⬛\nscheisseeee').grid, '🐟🫧🐟🐟⬛🦑⬛');
});

// ---------------------------------------------------------------------------
// Songless

test('Songless: il messaggio dello screenshot vale 120 punti', () => {
  assert.deepEqual(one(SONGLESS), {
    game: 'songless',
    puzzle: 432,
    score: 120,
    grid: [
      '⬜⬜⬜⬜⬜ [Top Hits]',
      '⬜⬜⬜⬜⬜ [Pop]',
      '⬜⬜⬜⬜⬜ [Rock]',
      '⬜⬜🟩⬛⬛ [Hip Hop]',
      '⬜⬜🟩⬛⬛ [EDM]',
    ].join('\n'),
  });
});

test('Songless: punti per posizione del quadrato verde', () => {
  const rows = ['🟩⬛⬛⬛⬛', '⬜🟩⬛⬛⬛', '⬜⬜🟩⬛⬛', '⬜⬜⬜🟩⬛', '⬜⬜⬜⬜🟩', '⬜⬜⬜⬜⬜'];
  assert.deepEqual(
    rows.map((r) => songlessRow([...r]).points),
    [100, 85, 60, 30, 10, 0],
  );
  assert.deepEqual(songlessRow([...'🟥🟥🟩⬛⬛']), { guess: 3, points: 60 });
  assert.equal(one(`Songless #1\n${rows.slice(0, 5).join('\n')}`).score, 285);
  assert.equal(one('Songless #1\n🟩⬛⬛⬛⬛\n🟩⬛⬛⬛⬛\n🟩⬛⬛⬛⬛\n🟩⬛⬛⬛⬛\n🟩⬛⬛⬛⬛').score, 500);
});

test('Songless: bianchi, neri e rossi non danno punti', () => {
  assert.equal(one('Songless #7\n⬜⬜⬜⬜⬜\n⬛⬛⬛⬛⬛\n🟥🟥🟥🟥🟥\n🟥⬜🟥⬜🟥').score, 0);
});

test('Songless: emoji con selettore di variante ed etichetta davanti', () => {
  const r = one('Songless #9\n[Pop] ⬜️⬜️🟩⬛️⬛️\n⬜️🟩⬛️⬛️⬛️ [Rock]');
  assert.equal(r.score, 145);
  assert.equal(r.grid, '⬜⬜🟩⬛⬛ [Pop]\n⬜🟩⬛⬛⬛ [Rock]');
});

test('Songless: un 🟩 in un commento non dà punti', () => {
  const r = one(`${SONGLESS}\nfinalmente 🟩!`);
  assert.equal(r.score, 120);
});

// ---------------------------------------------------------------------------
// Magnitudle

test('Magnitudle: il messaggio dello screenshot', () => {
  assert.deepEqual(one(MAGNITUDLE), {
    game: 'magnitudle',
    puzzle: '2026-11-03',
    score: 246,
    grid: '🟥🟥🟥🟥⬜ 71\n🟥⬜⬜⬜⬜ 12\n🟥⬜⬜⬜⬜ 14\n🟥🟥⬜⬜⬜ 49\n🟥🟥🟥🟥🟥 100',
  });
});

test('Magnitudle: senza "Score" vale la somma delle righe, senza data il puzzle è null', () => {
  const r = one('Magnitudle - Size It Up\n🟥🟥⬜⬜⬜ 40\n🟥🟥🟥⬜⬜ 60');
  assert.deepEqual([r.puzzle, r.score], [null, 100]);
});

test("Magnitudle: data e punteggio sulla stessa riga dell'intestazione", () => {
  const r = one('Magnitudle — Size It Up 2026-11-04 Score: 300/500');
  assert.deepEqual([r.puzzle, r.score], ['2026-11-04', 300]);
});

test('Magnitudle: frasi in chat non sono risultati', () => {
  assert.deepEqual(parseMessage('magnitudle oggi impossibile'), []);
  assert.deepEqual(parseMessage('Magnitudle: il mio record è score 480'), []);
  assert.deepEqual(parseMessage('Magnitudle 2026-11-03\nScore: 600/500'), []);
  // data impossibile e nessuna griglia
  assert.deepEqual(parseMessage('Magnitudle 2026-02-30\nScore: 100/500'), []);
});

// Il gioco cambia ogni tanto il testo da condividere: queste varianti valgono lo stesso.
const ROUNDS = [71, 12, 14, 49, 100];
const GRID = '🟥🟥🟥🟥⬜ 71\n🟥⬜⬜⬜⬜ 12\n🟥⬜⬜⬜⬜ 14\n🟥🟥⬜⬜⬜ 49\n🟥🟥🟥🟥🟥 100';

test('Magnitudle: "Size It Up" senza "Magnitudle" e senza "Score"', () => {
  const r = one(`📏 Size It Up — Nov 15\n246/500\n\n${GRID}`);
  assert.deepEqual(r, { game: 'magnitudle', puzzle: null, score: 246, grid: GRID });
});

test('Magnitudle: punti delle manche scritti in altri modi', () => {
  for (const suffix of ['%', ' pts', '/100', ' punti']) {
    const text = ['Magnitudle', ...ROUNDS.map((p) => `🟥🟥🟥⬜⬜ ${p}${suffix}`)].join('\n');
    assert.equal(one(text).score, 246, suffix);
  }
  const numbered = ROUNDS.map((p, i) => `${i + 1}. ████░ ${p}/100`).join('\n');
  const r = one(`Size It Up 2026-11-15\nTotale: 246 / 500\n${numbered}`);
  assert.deepEqual([r.puzzle, r.score], ['2026-11-15', 246]);
  assert.equal(r.grid.split('\n')[0], '████░ 71');
});

test('Magnitudle: solo il totale "N/500", senza griglia e senza data', () => {
  const r = one('Magnitudle — Size It Up\n389/500');
  assert.deepEqual([r.puzzle, r.score, r.grid], [null, 389, '']);
  assert.deepEqual(parseMessage('Magnitudle\n3890/500'), []);
});

test('Magnitudle: senza intestazione basta la griglia (almeno tre manche)', () => {
  const r = one(`Score: 246/500\n${GRID}`);
  assert.deepEqual([r.game, r.puzzle, r.score], ['magnitudle', null, 246]);
  assert.equal(one(`oggi così\n${GRID}`).score, 246);
  // due righe sole, o righe che non finiscono con i punti, non bastano
  assert.deepEqual(parseMessage('🟥🟥⬜⬜⬜ 40\n🟥🟥🟥⬜⬜ 60'), []);
  assert.deepEqual(parseMessage('⬜⬜🟩⬛⬛ [Pop]\n⬜🟩⬛⬛⬛ [Rock]\n🟩⬛⬛⬛⬛ [EDM]'), []);
  assert.deepEqual(parseMessage('🟥🟥🟥 150\n🟥🟥🟥 200\n🟥🟥🟥 300'), []);
});

test('Magnitudle: un commento con dei quadrati non è una manche', () => {
  assert.deepEqual(parseMessage('magnitudle oggi impossibile 🟥🟥 2 su 5'), []);
  assert.equal(one(`Magnitudle\n${GRID}\nla terza 🟥 era impossibile, 3 volte`).score, 246);
});

// ---------------------------------------------------------------------------
// Noillirk

test('Noillirk: il messaggio del gruppo vale 1300 punti (5,375 m, Inside the Storm)', () => {
  // 🟡100×1 + 🟠75×1 + 🟣50×2 + 🟠75×2 + 🟠75×2 + ⚫ + ⚫ + 🟠75×3 + 🟡100×4 + 🔵25×4
  assert.deepEqual(one(NOILLIRK), { game: 'noillirk', puzzle: 37, score: 1300, grid: NOILLIRK_GRID });
});

test('Noillirk: punti del cerchio per il peso della domanda', () => {
  // dieci risposte n. 1: il massimo, 100 × (1 + 1 + 2 + 2 + 2 + 3 + 3 + 3 + 4 + 4)
  assert.equal(one(`Noillirk #40 · 14.0 km\nThe Jet Stream\n${'🟡'.repeat(10)}\nMind Reader`).score, 2500);
  assert.equal(one(`Noillirk #40 · 0m\nThe Pond Path\n${'⚫'.repeat(10)}\nFree Thinker`).score, 0);
  // una top 10 alla prima domanda (25 × 1) e un fuori dal tabellone all'ultima (10 × 4)
  assert.equal(one('Noillirk #40 · 9m\n🔵⚫⚫⚫⚫⚫⚫⚫⚫⚪').score, 65);
  // ogni cerchio alla terza domanda (×2)
  for (const [circle, points] of [
    ['🟡', 200],
    ['🟠', 150],
    ['🟣', 100],
    ['🔵', 50],
    ['⚪', 20],
    ['⚫', 0],
  ]) {
    assert.equal(one(`Noillirk #40 · 1m\n⚫⚫${circle}⚫⚫⚫⚫⚫⚫⚫`).score, points, circle);
  }
});

test('Noillirk: la tappa con la folla (🧍38/100), la sfida dopo il titolo e il link', () => {
  const crowd = `Noillirk #43 · 🧍38/100\n${NOILLIRK_GRID}\nCrowd Whisperer · beat Mia 38–25\nnoillirk.com/c/a1b2`;
  assert.deepEqual(one(crowd), { game: 'noillirk', puzzle: 43, score: 1300, grid: NOILLIRK_GRID });
  const climb = `${NOILLIRK} · climbed past Nils\nnoillirk.com/c/a1b2`;
  assert.deepEqual([one(climb).puzzle, one(climb).score], [37, 1300]);
});

test('Noillirk: testo prima, caratteri invisibili, selettori di variante e numeri con la virgola', () => {
  const r = one(
    `oggi così\n\u200eNoillirk #37 · 5,375m\nInside the Storm\n🟡🟠🟣🟠🟠⚫️⚫️🟠🟡🔵\nCrowd Whisperer`,
  );
  assert.deepEqual([r.puzzle, r.score, r.grid], [37, 1300, NOILLIRK_GRID]);
  assert.equal(one(`Noillirk #1,234 · 5,375m\n${NOILLIRK_GRID}`).puzzle, 1234);
  // un commento sotto con altri cerchi non cambia niente
  assert.equal(one(`${NOILLIRK}\nla 6 e la 7 🟡🟡 non le sapevo`).score, 1300);
});

test('Noillirk: la versione Krillion-style (vince la risposta più rara) è un altro gioco', () => {
  const rare = `Noillirk #43 · Krillion-style · 5,375m\nInside the Storm\n${NOILLIRK_GRID}\nTrailblazer`;
  assert.deepEqual(parseMessage(rare), []);
  assert.deepEqual(parseMessage(`Noillirk #43 · Krillion-style · ★ 1,015\n${NOILLIRK_GRID}\nSide Trail`), []);
  // non viene segnalata come messaggio non riconosciuto
  assert.equal(looksLikeResult(rare), false);
  // insieme al daily normale vale il daily normale
  assert.deepEqual(
    parseMessage(`${rare}\n\n${NOILLIRK}`).map((r) => [r.game, r.puzzle, r.score]),
    [['noillirk', 37, 1300]],
  );
  // scritto in un altro modo: con lo spazio, in maiuscolo, col trattino che non va a capo (U+2011)
  for (const label of ['Krillion style', 'KRILLION-STYLE', 'Krillion‑style']) {
    const text = `Noillirk #43 · ${label} · 5,375m\n${NOILLIRK_GRID}\nTrailblazer`;
    assert.deepEqual(parseMessage(text), [], label);
    assert.equal(looksLikeResult(text), false, label);
  }
});

test('Noillirk: una partita Unlimited dopo un altro gioco non gli lascia i suoi cerchi', () => {
  const unlimited = `Noillirk Unlimited · 🧍38/100\n${NOILLIRK_GRID}\nCrowd Whisperer`;
  const [songless] = parseMessage(`Songless #455\n🟩⬜⬜⬜⬜ [Top Hits]\n${unlimited}`);
  assert.deepEqual(
    [songless.game, songless.score, songless.grid],
    ['songless', 100, '🟩⬜⬜⬜⬜ [Top Hits]'],
  );
  const [krillion] = parseMessage(`Krillion #134 🦐\n440\n🦑🐟\n${unlimited}`);
  assert.deepEqual([krillion.game, krillion.score, krillion.grid], ['krillion', 440, '🦑🐟']);
});

test('Noillirk: righe di soli cerchi prima della riga del risultato', () => {
  assert.equal(one(`Noillirk #37 · 5,375m\n🔥\n🟡\n${NOILLIRK_GRID}`).score, 1300);
});

test('Noillirk: messaggi che non sono risultati', () => {
  for (const text of [
    'Noillirk #37 · 5,375m',
    'hai fatto il noillirk #37?\n🟡🟡🟡',
    // 9 e 11 cerchi: il daily ha 10 domande
    'Noillirk #37 · 5,375m\n🟡🟠🟣🟠🟠⚫⚫🟠🟡',
    'Noillirk #37 · 5,375m\n🟡🟠🟣🟠🟠⚫⚫🟠🟡🔵🔵',
    // senza "#" non c'è il numero del daily (la quota non è il numero)
    `Noillirk · 5,375m\n${NOILLIRK_GRID}`,
    `Noillirk 5,375m\n${NOILLIRK_GRID}`,
    // dieci cerchi dentro una frase non sono la riga del risultato
    'Noillirk #37 · 5,375m\nho sbagliato 🟡🟡🟡🟡🟡🟡🟡🟡🟡🟡 tutte\nCrowd Whisperer',
    // le partite libere non sono il daily
    `Noillirk Unlimited · 🧍38/100\n${NOILLIRK_GRID}\nCrowd Whisperer`,
  ]) {
    assert.deepEqual(parseMessage(text), [], text);
  }
});

// ---------------------------------------------------------------------------
// Più giochi nello stesso messaggio

test('quattro giochi nello stesso messaggio', () => {
  const results = parseMessage(`${KRILLION}\n\n${SONGLESS}\n\n${MAGNITUDLE}\n\n${NOILLIRK}`);
  assert.deepEqual(
    results.map((r) => [r.game, r.puzzle, r.score]),
    [
      ['krillion', 111, 335],
      ['songless', 432, 120],
      ['magnitudle', '2026-11-03', 246],
      ['noillirk', 37, 1300],
    ],
  );
  // la griglia di Krillion non si prende le righe degli altri giochi
  assert.equal(results[0].grid, '🦑🐟🏮🐟🦑🦑🫧');
  // e Noillirk prima di Songless non gli passa i suoi cerchi
  const swapped = parseMessage(`${NOILLIRK}\n${SONGLESS}`);
  assert.deepEqual(
    swapped.map((r) => [r.game, r.score]),
    [
      ['noillirk', 1300],
      ['songless', 120],
    ],
  );
});

test('stesso gioco due volte: vale il primo', () => {
  const results = parseMessage('Krillion #80\n285\n🦐\nKrillion #81\n300\n🦐');
  assert.deepEqual(
    results.map((r) => r.puzzle),
    [80],
  );
});

test('messaggi che non sono risultati', () => {
  for (const text of [
    null,
    '',
    'machsch du?',
    'Krillion #80 🦐',
    'Krillion #80 🦐\nPunteggio: due e ottantacinque\n🦐⚪🦐',
    'hai fatto il krillion #80?\nio ho fatto 3 errori',
    '1. Nils\n2. Daniel\n3. Nic',
    'Songless #432',
    'chi ha fatto songless #432?\nio 🟩',
  ]) {
    assert.deepEqual(parseMessage(text), [], String(text));
  }
});

test('looksLikeResult: messaggi che sembrano risultati (per il log dei non riconosciuti)', () => {
  for (const text of [
    'Magnitudle — Size It Up\nNov 15\nRisultato: quasi perfetto\n430',
    'Size It Up\n⭐⭐⭐⭐ 430 su 500 — 4/5',
    'Krillion #80 🦐\nPunteggio: due e ottantacinque\n🦐⚪🦐',
    'Nuovo gioco\n🟪🟪🟪⬜⬜\n🟪🟪⬜⬜⬜',
    // Noillirk con nove cerchi, e il testo che potrebbe arrivare dopo il trasloco su crowdict.com
    'Noillirk #37 · 5,375m\nInside the Storm\n🟡🟠🟣🟠🟠⚫⚫🟠🟡\nCrowd Whisperer',
    `Classic #50 · Crowd\n${NOILLIRK_GRID}\nCrowd Whisperer\ncrowdict.com/c/a1b2`,
    // una partita che non conta nello stesso messaggio non nasconde il resto
    `Noillirk #44 · 5,375m\n${NOILLIRK_GRID}🟡🟡\nmeglio della mia noillirk unlimited di ieri`,
    `Krillion #135 🦐\nscore: ???\n\nNoillirk Unlimited · 🧍38/100\n${NOILLIRK_GRID}`,
  ]) {
    assert.deepEqual(parseMessage(text), [], text);
    assert.equal(looksLikeResult(text), true, text);
  }
  for (const text of [
    null,
    '',
    'machsch du?',
    'hai fatto il krillion #80?\nio ho fatto 3 errori',
    'magnitudle oggi impossibile',
    'chi ha fatto songless #432?\nio 🟩',
    '1. Nils\n2. Daniel\n3. Nic',
    'hai fatto il noillirk di oggi?',
    `Noillirk Unlimited · 🧍38/100\n${NOILLIRK_GRID}\nCrowd Whisperer`,
  ]) {
    assert.equal(looksLikeResult(text), false, String(text));
  }
});

test('puzzleLabel', () => {
  assert.equal(puzzleLabel('krillion', 111), 'Krillion #111');
  assert.equal(puzzleLabel('magnitudle', '2026-11-03'), 'Magnitudle 2026-11-03');
  assert.equal(puzzleLabel('noillirk', 37), 'Noillirk #37');
});
