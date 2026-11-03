import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseMessage, puzzleLabel, songlessRow } from '../src/parser.js';

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

// ---------------------------------------------------------------------------
// Più giochi nello stesso messaggio

test('tre giochi nello stesso messaggio', () => {
  const results = parseMessage(`${KRILLION}\n\n${SONGLESS}\n\n${MAGNITUDLE}`);
  assert.deepEqual(
    results.map((r) => [r.game, r.puzzle, r.score]),
    [
      ['krillion', 111, 335],
      ['songless', 432, 120],
      ['magnitudle', '2026-11-03', 246],
    ],
  );
  // la griglia di Krillion non si prende le righe degli altri giochi
  assert.equal(results[0].grid, '🦑🐟🏮🐟🦑🦑🫧');
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
    'Krillion #80 🦐\n🦐⚪🦐',
    'hai fatto il krillion #80?\nio ho fatto 3 errori',
    '1. Nils\n2. Daniel\n3. Nic',
    'Songless #432',
    'chi ha fatto songless #432?\nio 🟩',
  ]) {
    assert.deepEqual(parseMessage(text), [], String(text));
  }
});

test('puzzleLabel', () => {
  assert.equal(puzzleLabel('krillion', 111), 'Krillion #111');
  assert.equal(puzzleLabel('magnitudle', '2026-11-03'), 'Magnitudle 2026-11-03');
});
