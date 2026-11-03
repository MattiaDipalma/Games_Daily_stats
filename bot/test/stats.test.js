import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  aliasKey,
  buildAliasMap,
  comparePuzzles,
  describeChanges,
  emptyData,
  localDate,
  maskPhone,
  mergeResults,
  parseData,
  resolveName,
  serialize,
} from '../src/stats.js';

const r = (player, puzzle, score, extra = {}) => ({ player, puzzle, score, ts: 1000 + puzzle, ...extra });

test('aggiunge risultati nuovi e ordina', () => {
  const { data, changed, added } = mergeResults(emptyData(), [
    r('Anna', 80, 225),
    r('Daniel', 80, 285),
    r('Anna', 79, 200),
  ]);
  assert.equal(changed, true);
  assert.equal(added.length, 3);
  assert.deepEqual(
    data.results.map((x) => [x.puzzle, x.player]),
    [
      [80, 'Anna'],
      [80, 'Daniel'],
      [79, 'Anna'],
    ],
  );
  assert.ok(data.updatedAt);
});

test('Magnitudle: il puzzle è la data', () => {
  const m = (player, date, score, ts) => ({ player, puzzle: date, score, ts, date });
  const { data } = mergeResults(emptyData(), [
    m('Anna', '2026-11-03', 246, 10),
    m('Nils', '2026-11-04', 300, 20),
    m('anna', '2026-11-03', 400, 30),
    { player: 'X', puzzle: '3.11.2026', score: 1 },
  ]);
  assert.deepEqual(
    data.results.map((x) => [x.puzzle, x.player, x.score]),
    [
      ['2026-11-04', 'Nils', 300],
      ['2026-11-03', 'Anna', 246],
    ],
  );
});

test('un solo risultato per giocatore e puzzle: vale il primo', () => {
  const first = mergeResults(emptyData(), [r('Anna', 80, 225, { ts: 100, msgId: 'a' })]).data;
  const again = mergeResults(first, [r('anna', 80, 300, { ts: 200, msgId: 'b' })]);
  assert.equal(again.changed, false);
  assert.equal(again.data.results[0].score, 225);

  const earlier = mergeResults(first, [r('Anna', 80, 150, { ts: 50 })]);
  assert.equal(earlier.data.results.length, 1);
  assert.equal(earlier.data.results[0].score, 150);
});

test('un messaggio modificato sostituisce la versione precedente', () => {
  const first = mergeResults(emptyData(), [r('Anna', 80, 225, { ts: 100, msgId: 'm1' })]).data;
  const edited = mergeResults(first, [r('Anna', 80, 252, { ts: 500, msgId: 'm1' })]);
  assert.equal(edited.changed, true);
  assert.deepEqual(
    edited.updated.map((x) => x.score),
    [252],
  );
  assert.equal(edited.data.results.length, 1);
  assert.equal(edited.data.results[0].score, 252);
  assert.equal(edited.data.results[0].ts, 100, "mantiene l'orario del messaggio originale");

  const fixedPuzzle = mergeResults(first, [r('Anna', 81, 225, { ts: 500, msgId: 'm1' })]).data;
  assert.deepEqual(
    fixedPuzzle.results.map((x) => x.puzzle),
    [81],
  );
});

test('nessuna modifica se il risultato è già presente', () => {
  const first = mergeResults(emptyData(), [r('Anna', 80, 225, { msgId: 'm1' })]).data;
  const same = mergeResults(first, [r('Anna', 80, 225, { msgId: 'm1' })]);
  assert.equal(same.changed, false);
  assert.equal(same.data.updatedAt, first.updatedAt);
});

test('gli alias rinominano anche i dati già salvati', () => {
  const first = mergeResults(emptyData(), [r('Nils Geigy', 80, 300), r('Nils', 79, 280)]).data;
  const aliasMap = buildAliasMap({ 'nils geigy': 'Nils', '+41 79 123 45 67': 'Elia' });
  const { data } = mergeResults(first, [r('41791234567', 80, 111)], { aliasMap });
  assert.deepEqual(
    data.results.map((x) => `${x.puzzle} ${x.player}`),
    ['80 Elia', '80 Nils', '79 Nils'],
  );
});

test('i numeri di telefono senza alias vengono mascherati', () => {
  assert.equal(maskPhone('+41 79 123 45 46'), '+41∙∙∙∙∙∙∙46');
  assert.equal(maskPhone('4915112345673'), '+49∙∙∙∙∙∙∙∙∙73');
  assert.equal(resolveName('+41 79 123 45 46'), '+41∙∙∙∙∙∙∙46');
  assert.equal(resolveName('41791234546@s.whatsapp.net'), '+41∙∙∙∙∙∙∙46');
  // già mascherati, nomi corti o con lettere: invariati
  assert.equal(resolveName('+41∙∙∙∙∙∙∙46'), '+41∙∙∙∙∙∙∙46');
  assert.equal(resolveName('06'), '06');
  assert.equal(resolveName('Nils'), 'Nils');

  const { data } = mergeResults(emptyData(), [r('+41 79 123 45 46', 80, 200)]);
  assert.equal(data.results[0].player, '+41∙∙∙∙∙∙∙46');
});

test('aliasKey normalizza numeri di telefono e jid', () => {
  assert.equal(aliasKey('+41 79 123 45 67'), '41791234567');
  assert.equal(aliasKey('41791234567@s.whatsapp.net'), '41791234567');
  assert.equal(aliasKey('  Nils   Geigy '), 'nils geigy');
});

test('scarta risultati non validi', () => {
  const { data } = mergeResults(emptyData(), [
    { player: '', puzzle: 1, score: 1 },
    { player: 'X', puzzle: 0, score: 1 },
    { player: 'X', puzzle: 1, score: -5 },
    { player: 'X', puzzle: 1.5, score: 3 },
    { player: 'X', puzzle: null, score: 3 },
  ]);
  assert.equal(data.results.length, 0);
});

test('serialize produce JSON valido, una riga per risultato', () => {
  const { data } = mergeResults(emptyData(), [r('Anna', 80, 225, { grid: '🦐⚪' }), r('Daniel', 80, 285)]);
  const text = serialize(data);
  assert.deepEqual(parseData(text), data);
  assert.equal(text.split('\n').filter((l) => l.includes('"puzzle"')).length, 2);
  assert.deepEqual(parseData(serialize(emptyData())), emptyData());
});

test('localDate usa il fuso orario', () => {
  // 2026-10-03 23:30 UTC = 2026-10-04 01:30 a Zurigo
  const ts = Date.UTC(2026, 9, 3, 23, 30) / 1000;
  assert.equal(localDate(ts, 'Europe/Zurich'), '2026-10-04');
  assert.equal(localDate(ts, 'UTC'), '2026-10-03');
});

test('comparePuzzles', () => {
  assert.ok(comparePuzzles(9, 10) < 0);
  assert.ok(comparePuzzles('2026-11-03', '2026-11-04') < 0);
});

test('describeChanges', () => {
  assert.equal(
    describeChanges('krillion', [r('Daniel', 80, 285), r('Anna', 80, 225)], []),
    'Krillion #80: Daniel 285, Anna 225',
  );
  assert.equal(describeChanges('songless', [r('Anna', 432, 120)], []), 'Songless #432: Anna 120');
  assert.equal(
    describeChanges('magnitudle', [{ player: 'Nils', puzzle: '2026-11-03', score: 246 }], []),
    'Magnitudle 2026-11-03: Nils 246',
  );
  assert.match(describeChanges('krillion', [r('A', 1, 1), r('B', 2, 2)], []), /^Krillion 2 puzzle/);
});
