// Il sito (docs/assets/core.js) mostra per Noillirk i punti di ogni domanda, la quota e la zona della
// salita: devono tornare con il bot (che calcola il punteggio) e con i messaggi veri del gioco.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { NOILLIRK_POINTS, parseMessage } from '../src/parser.js';

// core.js legge la lingua del browser quando viene caricato (Node 20 non ha navigator)
globalThis.navigator ??= { languages: ['en'] };
// docs/ non ha un package.json che dica che core.js è un modulo, e Node 20.12 non lo capirebbe da
// solo: lo si carica da un data: URL (core.js non importa altri file)
const source = await readFile(new URL('../../docs/assets/core.js', import.meta.url), 'utf8');
const core = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
core.ui.lang = 'en';

test('sito: quota e zona come nei messaggi di Noillirk', () => {
  // "Noillirk #37 · 5,375m / Inside the Storm": 1300 punti
  assert.equal(Math.round(core.noillirkAltitude(1300)), 5375);
  assert.equal(core.noillirkZone(1300).name, 'Inside the Storm');
  assert.equal(core.fmtAltitude(core.noillirkAltitude(1300)), '5,375 m');
  // il massimo del daily: 2500 punti, 14 km nella corrente a getto
  assert.equal(core.noillirkAltitude(2500), 14000);
  assert.equal(core.noillirkZone(2500).name, 'The Jet Stream');
  assert.equal(core.fmtAltitude(14000), '14.0 km');
  // nelle zone basse la quota cresce in modo geometrico: 70 punti = 3 m × 10^(30/60)
  assert.equal(core.fmtAltitude(core.noillirkAltitude(70)), '9 m');
  assert.equal(core.noillirkAltitude(0), 0);
  // una zona comincia dal suo primo punto
  assert.equal(core.noillirkZone(1249).name, 'The Snowline');
  assert.equal(core.noillirkZone(1250).name, 'Inside the Storm');
  assert.equal(core.noillirkAltitude(1250), 5000);
});

// Dalla mappa della salita di noillirk.com: il primo punto di ogni zona, il suo nome e la quota da cui parte
const GAME_ZONES = [
  [0, 'The Pond Path', 0],
  [40, 'Among the Trunks', 3],
  [100, 'The Treetops', 30],
  [250, 'Over the Valley', 120],
  [550, 'Into the Overcast', 800],
  [850, 'The Snowline', 2000],
  [1250, 'Inside the Storm', 5000],
  [1650, 'Everest Height', 8000],
  [1900, 'Cruising Altitude', 9500],
  [2200, 'The Jet Stream', 12000],
];
const near = (a, b) => Math.abs(a - b) < 1e-6;

test('sito: ogni zona della salita comincia al punto giusto, col nome e la quota del gioco', () => {
  GAME_ZONES.forEach(([from, name, alt], i) => {
    assert.equal(core.noillirkZone(from).name, name, `${from} punti`);
    assert.ok(near(core.noillirkAltitude(from), alt), `${from} punti: ${core.noillirkAltitude(from)} m`);
    if (i === 0) return;
    // un punto prima si è ancora nella zona di sotto, e la quota arriva proprio dove comincia questa
    assert.equal(core.noillirkZone(from - 1).name, GAME_ZONES[i - 1][1], `${from - 1} punti`);
    assert.ok(near(core.noillirkAltitude(from - 1e-9), alt), `${from} punti, da sotto`);
  });
  // più punti, sempre più in alto
  for (let p = 1; p <= 2500; p++) {
    assert.ok(core.noillirkAltitude(p) > core.noillirkAltitude(p - 1), `${p} punti`);
  }
  // a metà zona: geometrica se in cima la quota è almeno 4 volte quella in fondo (le cime degli alberi,
  // da 30 a 120 m, lo sono esattamente), altrimenti lineare (la linea della neve, da 2000 a 5000 m)
  assert.ok(near(core.noillirkAltitude(175), 60));
  assert.ok(near(core.noillirkAltitude(1050), 3500));
  // metri fino a 10 km, poi km
  assert.equal(core.fmtAltitude(9999), '9,999 m');
  assert.equal(core.fmtAltitude(10000), '10.0 km');
});

test('sito e bot usano gli stessi cerchi con gli stessi punti', () => {
  assert.deepEqual(
    [...core.NOILLIRK_CIRCLES].map(([circle, { points }]) => [circle, points]).sort(),
    [...NOILLIRK_POINTS].sort(),
  );
  // un risultato di un altro gioco non diventa una griglia di Noillirk
  assert.deepEqual(core.noillirkRounds('🦑🐟🏮🐟🦑🦑🫧'), []);
});

test('sito: i punti delle domande sommati danno il punteggio del bot', () => {
  const circles = [...NOILLIRK_POINTS.keys()];
  let seed = 42;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let n = 0; n < 300; n++) {
    const grid = Array.from({ length: 10 }, () => circles[Math.floor(rand() * circles.length)]).join('');
    const [parsed] = parseMessage(`Noillirk #${n + 1} · 1m\n${grid}\nCrowd Whisperer`);
    const rounds = core.noillirkRounds(parsed.grid);
    assert.equal(rounds.length, 10, grid);
    assert.equal(
      rounds.reduce((sum, q) => sum + q.points, 0),
      parsed.score,
      grid,
    );
  }
});

test('sito: un gioco senza ancora il suo file dei dati non ha risultati, gli altri errori restano errori', async () => {
  const realFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response('Not Found', { status: 404 });
    const game = await core.loadGame('noillirk', { base: 'x/' });
    assert.equal(game.career.results.length, 0);
    assert.equal(game.season.results.length, 0);
    globalThis.fetch = async () => new Response('boom', { status: 500 });
    await assert.rejects(core.loadGame('noillirk', { base: 'x/' }), /HTTP 500/);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test('sito: la griglia di Noillirk diventa dieci cerchi con il posto nel tabellone', () => {
  const rounds = core.noillirkRounds('🟡🟠🟣🟠🟠⚫️⚫️🟠🟡🔵');
  assert.deepEqual(
    rounds.map((q) => [q.band, q.weight, q.points]),
    [
      [4, 1, 100],
      [3, 1, 75],
      [2, 2, 100],
      [3, 2, 150],
      [3, 2, 150],
      [null, 3, 0],
      [null, 3, 0],
      [3, 3, 225],
      [4, 4, 400],
      [1, 4, 100],
    ],
  );
});
