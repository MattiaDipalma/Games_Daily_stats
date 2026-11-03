import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { GitHubStore, LocalStore, createStores } from '../src/store.js';
import { emptyData, mergeResults, parseData, serialize } from '../src/stats.js';

const result = (player, puzzle, score) => ({ player, puzzle, score, ts: puzzle * 100 });

/** Finto server GitHub per l'API "contents". */
function fakeGitHub({ initial = null, conflictOnce = false, status } = {}) {
  let file = initial ? { text: serialize(initial), sha: 'sha0' } : null;
  let conflicted = false;
  const calls = [];
  const json = (code, body) =>
    new Response(JSON.stringify(body), { status: code, headers: { 'content-type': 'application/json' } });

  const fetch = async (url, init = {}) => {
    const method = init.method ?? 'GET';
    calls.push({ method, url, headers: init.headers, body: init.body && JSON.parse(init.body) });
    if (status) return json(status, { message: 'nope' });
    if (method === 'GET') {
      if (!file) return json(404, { message: 'Not Found' });
      return json(200, {
        sha: file.sha,
        encoding: 'base64',
        content: Buffer.from(file.text).toString('base64'),
      });
    }
    const body = JSON.parse(init.body);
    if (conflictOnce && !conflicted) {
      conflicted = true;
      // qualcun altro ha aggiornato il file nel frattempo
      const other = mergeResults(parseData(file?.text), [result('Nils', 80, 310)]).data;
      file = { text: serialize(other), sha: 'sha-other' };
      return json(409, { message: 'conflict' });
    }
    if ((file?.sha ?? undefined) !== body.sha) return json(409, { message: 'sha mismatch' });
    file = { text: Buffer.from(body.content, 'base64').toString('utf8'), sha: `sha${calls.length}` };
    return json(200, { content: { sha: file.sha } });
  };
  return {
    fetch,
    calls,
    get data() {
      return file && parseData(file.text);
    },
  };
}

const opts = (fetch, game = 'krillion') => ({
  token: 't0k',
  repo: 'MattiaDipalma/Games_Daily_stats',
  path: `docs/data/${game}.json`,
  game,
  fetch,
});

test('GitHubStore crea il file se non esiste', async () => {
  const gh = fakeGitHub();
  const store = new GitHubStore(opts(gh.fetch));
  const { changed, added } = await store.merge([result('Anna', 80, 225)]);
  assert.equal(changed, true);
  assert.equal(added.length, 1);
  assert.equal(gh.data.results[0].player, 'Anna');

  const put = gh.calls.find((c) => c.method === 'PUT');
  assert.equal(
    put.url,
    'https://api.github.com/repos/MattiaDipalma/Games_Daily_stats/contents/docs/data/krillion.json',
  );
  assert.equal(put.headers.Authorization, 'Bearer t0k');
  assert.equal(put.body.branch, 'main');
  assert.equal(put.body.sha, undefined);
  assert.equal(put.body.message, 'Krillion #80: Anna 225');
});

test('GitHubStore: messaggio di commit con il nome del gioco', async () => {
  const gh = fakeGitHub();
  await new GitHubStore(opts(gh.fetch, 'songless')).merge([result('Anna', 432, 120)]);
  assert.equal(gh.calls.find((c) => c.method === 'PUT').body.message, 'Songless #432: Anna 120');
});

test('GitHubStore non fa commit se non ci sono novità', async () => {
  const initial = mergeResults(emptyData(), [result('Anna', 80, 225)]).data;
  const gh = fakeGitHub({ initial });
  await new GitHubStore(opts(gh.fetch)).merge([result('Anna', 80, 225)]);
  assert.equal(gh.calls.filter((c) => c.method === 'PUT').length, 0);
});

test('GitHubStore riprova in caso di conflitto senza perdere dati', async () => {
  const initial = mergeResults(emptyData(), [result('Anna', 80, 225)]).data;
  const gh = fakeGitHub({ initial, conflictOnce: true });
  await new GitHubStore(opts(gh.fetch)).merge([result('Daniel', 80, 285)]);
  assert.deepEqual(gh.data.results.map((r) => r.player).sort(), ['Anna', 'Daniel', 'Nils']);
});

test('GitHubStore segnala errori di autorizzazione', async () => {
  const gh = fakeGitHub({ status: 401 });
  await assert.rejects(new GitHubStore(opts(gh.fetch)).merge([result('Anna', 80, 225)]), /401/);
});

test('LocalStore scrive il file', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'games-daily-'));
  try {
    const store = new LocalStore(join(dir, 'data', 'krillion.json'), 'krillion');
    await store.merge([result('Anna', 80, 225)]);
    await store.merge([result('Daniel', 80, 285)]);
    const data = parseData(await readFile(join(dir, 'data', 'krillion.json'), 'utf8'));
    assert.equal(data.results.length, 2);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('createStores: un file per gioco', () => {
  const config = {
    githubToken: 't',
    githubRepo: 'MattiaDipalma/Games_Daily_stats',
    githubBranch: 'main',
    dataPath: 'docs/data',
    localDataDir: '/tmp/data',
  };
  const stores = createStores(config);
  assert.deepEqual(
    Object.entries(stores).map(([game, s]) => [game, s.path]),
    [
      ['krillion', 'docs/data/krillion.json'],
      ['songless', 'docs/data/songless.json'],
      ['magnitudle', 'docs/data/magnitudle.json'],
    ],
  );
  const local = createStores(config, { local: true });
  assert.ok(local.songless instanceof LocalStore);
  assert.equal(local.songless.path, '/tmp/data/songless.json');
});
