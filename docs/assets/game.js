// Games Daily – pagina di un gioco (Krillion, Songless o Magnitudle).
// Il gioco è scritto in <html data-game="...">. Aggiungi ?demo all'indirizzo per vedere dati di esempio.

import {
  GAMES,
  MEDALS,
  $,
  applyStaticTexts,
  colorOf,
  el,
  fmt,
  fmtDate,
  fmtLongDate,
  fmtUpdated,
  genreStats,
  gridNode,
  hideTooltip,
  inRange,
  LEADERBOARD_RULE,
  leaderboardStats,
  lineChart,
  loadGame,
  loadNames,
  locale,
  minGames,
  mountShell,
  periodRange,
  playerStats,
  prefs,
  puzzleLabel,
  puzzleLongLabel,
  rolling,
  showTooltip,
  sortStats,
  t,
} from './core.js?v=3';

const id = document.documentElement.dataset.game;
const def = GAMES[id];

const state = {
  demo: new URLSearchParams(location.search).has('demo'),
  period: prefs.get(`period.${id}`, 'all'),
  trendMode: prefs.get('trendMode', 'avg'),
  selected: null,
  sort: { key: 'avg', dir: 'desc' },
  dayPuzzle: null,
  status: null,
};

/** { career, season, updatedAt, seasonStart } – vedi loadGame() */
let game = null;

const shell = mountShell({ page: id, base: '../', onLang: renderAll });

shell.main.innerHTML = `
  <p id="status" class="status" role="status"></p>
  <div id="content" hidden>
    <section class="card day" aria-labelledby="day-title">
      <div class="day-head">
        <button class="icon-btn" id="day-prev" type="button" data-i18n-label="prev">‹</button>
        <div class="day-title-wrap">
          <h2 id="day-title"></h2>
          <p id="day-date" class="muted"></p>
        </div>
        <button class="icon-btn" id="day-next" type="button" data-i18n-label="next">›</button>
      </div>
      <ol id="day-list" class="day-list"></ol>
      <p id="day-missing" class="muted small"></p>
      <p id="scoring" class="muted small scoring"></p>
    </section>

    <div class="filters" id="filters" role="group" aria-labelledby="period-label">
      <span id="period-label" class="muted" data-i18n="period"></span>
      <div class="seg" id="period">
        <button type="button" data-period="all" data-i18n="periodAll"></button>
        <button type="button" data-period="30" data-i18n="period30"></button>
        <button type="button" data-period="7" data-i18n="period7"></button>
      </div>
    </div>

    <section class="tiles" id="tiles" data-i18n-label="leaderboard"></section>

    <section class="card" aria-labelledby="lb-title">
      <h2 id="lb-title" data-i18n="leaderboard"></h2>
      <div class="table-wrap">
        <table class="lb" id="leaderboard"></table>
      </div>
      <p id="lb-empty" class="empty-note"></p>
      <p id="lb-note" class="muted small"></p>
      <p id="lb-others" class="muted small others"></p>
    </section>

    <section class="card" id="genres-card" aria-labelledby="genres-title" hidden>
      <h2 id="genres-title" data-i18n="genres"></h2>
      <p class="muted small" data-i18n="genresHint"></p>
      <div class="table-wrap">
        <table class="lb" id="genres"></table>
      </div>
    </section>

    <section class="card" id="trend-card" aria-labelledby="trend-title">
      <div class="card-head">
        <h2 id="trend-title" data-i18n="trend"></h2>
        <div class="seg small" id="trend-mode">
          <button type="button" data-mode="score" data-i18n="modeScore"></button>
          <button type="button" data-mode="avg" data-i18n="modeAvg"></button>
        </div>
      </div>
      <div class="chips" id="trend-players" role="group" data-i18n-label="trendPlayers"></div>
      <div class="chart" id="trend-chart"></div>
    </section>

    <section class="card" id="h2h-card" aria-labelledby="h2h-title">
      <h2 id="h2h-title" data-i18n="h2h"></h2>
      <p class="muted small" data-i18n="h2hHint"></p>
      <div class="table-wrap">
        <table class="h2h" id="h2h"></table>
      </div>
      <div class="h2h-legend small muted" aria-hidden="true">
        <span data-i18n="h2hWorse"></span>
        <span class="ramp"></span>
        <span data-i18n="h2hBetter"></span>
      </div>
    </section>
  </div>`;

document.body.append(
  el(
    'dialog',
    { id: 'player-dialog', 'aria-labelledby': 'pd-title' },
    el(
      'form',
      { method: 'dialog', class: 'pd-close' },
      el('button', { class: 'icon-btn', type: 'submit', 'data-i18n-label': 'close' }, '✕'),
    ),
    el('h2', { id: 'pd-title' }),
    el('div', { class: 'tiles small-tiles', id: 'pd-tiles' }),
    el(
      'div',
      { id: 'pd-genres-wrap', hidden: true },
      el('h3', { 'data-i18n': 'genres' }),
      el('div', { class: 'table-wrap' }, el('table', { class: 'lb', id: 'pd-genres' })),
    ),
    el('div', { class: 'chips', id: 'pd-legend' }),
    el('div', { class: 'chart', id: 'pd-chart' }),
    el('h3', { 'data-i18n': 'history' }),
    el('div', { class: 'table-wrap' }, el('table', { class: 'lb', id: 'pd-history' })),
  ),
);
applyStaticTexts();

// ---------------------------------------------------------------------------
// Pezzi comuni

function playerButton(name, withKey = true) {
  const c = colorOf(game.career, name);
  return el(
    'button',
    { class: 'player-btn', type: 'button', onclick: () => openPlayer(name) },
    withKey ? el('span', { class: `key${c.cls}`, style: `color:${c.color}` }) : null,
    el('span', {}, name),
  );
}

function legendItem(label, color, cls = '') {
  return el(
    'span',
    { class: 'chip static' },
    el('span', { class: `key${cls}`, style: `color:${color}` }),
    label,
  );
}

function tile(label, value, hint) {
  return el(
    'div',
    { class: 'tile' },
    el('div', { class: 'label' }, label),
    el('div', { class: 'value' }, value),
    // hint può essere un array: una riga per elemento
    [hint]
      .flat()
      .filter(Boolean)
      .map((h) => el('div', { class: 'hint' }, h)),
  );
}

const label = (model) => (x, long) => (long ? puzzleLongLabel(model, x) : puzzleLabel(model, x));

// ---------------------------------------------------------------------------
// Puzzle del giorno (tutte le partite, anche quelle del vecchio gruppo)

function renderDay() {
  const model = game.career;
  const list = model.puzzleList;
  if (state.dayPuzzle === null || !model.puzzles.has(state.dayPuzzle)) state.dayPuzzle = list.at(-1);
  const idx = list.indexOf(state.dayPuzzle);
  const p = model.puzzles.get(state.dayPuzzle);

  $('#day-title').textContent = def.numbered ? `${def.name} #${p.puzzle}` : def.name;
  $('#day-date').textContent = fmtLongDate(p.date);
  $('#day-prev').disabled = idx <= 0;
  $('#day-next').disabled = idx >= list.length - 1;

  $('#day-list').replaceChildren(
    ...p.results.map((r) => {
      const rank = p.rank.get(r.player);
      const history = model.byPlayer.get(r.player).filter((x) => x.puzzle !== r.puzzle);
      let delta;
      if (history.length) {
        const avg = history.reduce((s, x) => s + x.score, 0) / history.length;
        const d = Math.round(r.score - avg);
        const cls = d > 0 ? 'up' : d < 0 ? 'down' : '';
        const arrow = d > 0 ? '▲' : d < 0 ? '▼' : '=';
        delta = el('span', { class: `delta ${cls}` }, `${arrow} ${fmt(Math.abs(d))} ${t('vsAvg')}`);
      } else {
        delta = el('span', { class: 'delta' }, t('firstGame'));
      }
      return el(
        'li',
        {},
        el(
          'span',
          { class: 'rank', 'aria-label': `#${rank}` },
          rank <= 3 && p.results.length > 1 ? MEDALS[rank - 1] : rank,
        ),
        el('span', { class: 'name' }, playerButton(r.player, false)),
        el(
          'span',
          { class: 'score' },
          fmt(r.score),
          // Krillion: la profondità raggiunta, 10 m per punto (come su krillion.io)
          id === 'krillion' ? el('small', { class: 'depth' }, `−${fmt(r.score * 10)} m`) : null,
        ),
        el('span', { class: 'grid' }, gridNode(id, r)),
        delta,
      );
    }),
  );

  // chi gioca di solito ma non ha ancora mandato il risultato (solo per l'ultimo puzzle)
  let missing = [];
  if (idx === list.length - 1) {
    const recent = new Set();
    for (const q of list.slice(Math.max(0, idx - 7), idx)) {
      for (const r of model.puzzles.get(q).results) recent.add(r.player);
    }
    missing = [...recent].filter((name) => !p.rank.has(name)).sort((a, b) => a.localeCompare(b, locale()));
  }
  $('#day-missing').textContent = missing.length
    ? t(missing.length === 1 ? 'missing' : 'missingMany', { names: missing.join(', ') })
    : '';
  $('#scoring').textContent = id === 'krillion' ? '' : t(`scoring_${id}`);
}

// ---------------------------------------------------------------------------
// Riquadri e classifica (solo le partite che contano per la classifica)

function renderTiles(range) {
  const model = game.season;
  const results = model.results.filter((r) => inRange(r.puzzle, range));
  const puzzles = model.puzzleList.filter((p) => inRange(p, range));
  const players = new Set(results.map((r) => r.player));
  const best = results.reduce((m, r) => Math.max(m, r.score), -Infinity);
  // a parimerito vengono mostrati i detentori del record (al massimo tre)
  const records = results.filter((r) => r.score === best).sort((a, b) => a.puzzle - b.puzzle);
  const recordHints = records.slice(0, 3).map((r) => `${r.player} · ${puzzleLabel(model, r.puzzle)}`);
  if (records.length > 3) recordHints.push('…');
  const avg = results.reduce((s, r) => s + r.score, 0) / (results.length || 1);
  $('#tiles').replaceChildren(
    tile(
      t(def.numbered ? 'tilePuzzles' : 'tileDays'),
      fmt(puzzles.length),
      puzzles.length
        ? t('tileRange', { from: puzzleLabel(model, puzzles[0]), to: puzzleLabel(model, puzzles.at(-1)) })
        : '',
    ),
    tile(t('tilePlayers'), fmt(players.size), t('tilePlayersHint', { n: fmt(results.length) })),
    tile(t('tileRecord'), records.length ? fmt(best) : '–', recordHints),
    tile(t('tileAvg'), results.length ? fmt(avg, 1) : '–'),
  );
}

// cls: classe di colonna (c-*), usata anche per la classifica su due righe del telefono
const COLUMNS = [
  { key: 'name', label: 'colPlayer', cls: 'left c-name', defaultDir: 'asc' },
  { key: 'games', label: 'colGames', cls: 'c-games' },
  { key: 'avg', label: 'colAvg', cls: 'c-avg' },
  { key: 'best', label: 'colBest', cls: 'c-best' },
  { key: 'wins', label: 'colWins', cls: 'c-wins' },
  { key: 'avgRank', label: 'colAvgRank', cls: 'c-rank', defaultDir: 'asc' },
  { key: 'streak', label: 'colStreak', cls: 'c-streak' },
];

function renderLeaderboard(range) {
  const model = game.season;
  const stats = sortStats(leaderboardStats(model, range), state.sort);
  const table = $('#leaderboard');

  $('#lb-empty').textContent = stats.length
    ? ''
    : game.seasonStart
      ? t('seasonEmpty', { start: game.seasonStart })
      : t('lbNone', LEADERBOARD_RULE);
  table.hidden = !stats.length;

  const head = el(
    'tr',
    {},
    el('th', { class: 'pos', scope: 'col' }, '#'),
    COLUMNS.map((c) =>
      el(
        'th',
        {
          scope: 'col',
          class: c.cls,
          'aria-sort':
            state.sort.key === c.key ? (state.sort.dir === 'asc' ? 'ascending' : 'descending') : null,
        },
        el(
          'button',
          {
            type: 'button',
            onclick: () => {
              state.sort =
                state.sort.key === c.key
                  ? { key: c.key, dir: state.sort.dir === 'asc' ? 'desc' : 'asc' }
                  : { key: c.key, dir: c.defaultDir ?? 'desc' };
              renderLeaderboard(range);
            },
          },
          t(c.label),
        ),
      ),
    ),
  );

  const rows = stats.map((s, i) => {
    const cells = {
      name: playerButton(s.name),
      games: fmt(s.games),
      avg: fmt(s.avg, 1),
      best: fmt(s.best.score),
      wins: fmt(s.wins),
      avgRank: fmt(s.avgRank, 2),
      streak: s.streak ? `${fmt(s.streak)} 🔥` : '0',
    };
    return el(
      'tr',
      {},
      el('td', { class: 'pos' }, i + 1),
      COLUMNS.map((c) => el('td', { class: c.cls }, cells[c.key])),
    );
  });
  table.replaceChildren(el('thead', {}, head), el('tbody', {}, rows));

  $('#lb-note').textContent = t('qualifyNote', LEADERBOARD_RULE);

  // chi non è in classifica nel periodo (o non ha ancora giocato nella nuova): la scheda resta raggiungibile
  const inBoard = new Set(stats.map((s) => s.name));
  const others = game.career.players.filter((p) => !inBoard.has(p) && !game.hidden.has(p.toLowerCase()));
  const box = $('#lb-others');
  box.replaceChildren();
  if (others.length) {
    box.append(t('others'), ' ');
    // nome e virgola insieme, così la virgola non va mai a capo da sola
    others.forEach((name, i) =>
      box.append(
        i ? ' ' : '',
        el(
          'span',
          { style: 'white-space:nowrap' },
          playerButton(name, false),
          i < others.length - 1 ? ',' : '',
        ),
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Songless: i generi

function genreTable(rows, { withTop = false } = {}) {
  const head = el(
    'tr',
    {},
    el('th', { class: 'left', scope: 'col' }, t('colGenre')),
    el('th', { scope: 'col' }, t('colHits')),
    el('th', { scope: 'col' }, t('colAvgPoints')),
    el('th', { scope: 'col' }, t('colAvgTry')),
    withTop ? el('th', { class: 'left', scope: 'col' }, t('colTop')) : null,
  );
  const body = rows.map((g) =>
    el(
      'tr',
      {},
      el('td', { class: 'left' }, g.genre),
      el('td', {}, `${fmt(g.hits)}/${fmt(g.plays)} · ${fmt((100 * g.hits) / g.plays)}%`),
      el('td', {}, fmt(g.points / g.plays, 1)),
      el('td', {}, g.hits ? fmt(g.tries / g.hits, 1) : '–'),
      withTop ? el('td', { class: 'left' }, g.top ? `${g.top.name} · ${fmt(g.top.avg, 1)}` : '–') : null,
    ),
  );
  return [el('thead', {}, head), el('tbody', {}, body)];
}

function renderGenres(range) {
  const card = $('#genres-card');
  if (id !== 'songless') return;
  const model = game.season;
  const results = model.results.filter((r) => inRange(r.puzzle, range));
  const rows = genreStats(results);
  card.hidden = !rows.length;
  if (!rows.length) return;
  // il migliore di ogni genere: media punti più alta tra chi l'ha giocato abbastanza
  const threshold = minGames(model, range);
  for (const g of rows) {
    let top = null;
    for (const [name, all] of model.byPlayer) {
      const mine = genreStats(all.filter((r) => inRange(r.puzzle, range))).find((x) => x.genre === g.genre);
      if (!mine || mine.plays < threshold) continue;
      const avg = mine.points / mine.plays;
      if (!top || avg > top.avg || (avg === top.avg && mine.plays > top.plays))
        top = { name, avg, plays: mine.plays };
    }
    g.top = top;
  }
  $('#genres').replaceChildren(...genreTable(rows, { withTop: true }));
}

// ---------------------------------------------------------------------------
// Andamento

function groupSeries(model, xs, mode) {
  const values = model.puzzleList.map((x) => model.puzzles.get(x).avg);
  const vals = mode === 'avg' ? rolling(values) : values;
  const byPuzzle = new Map(model.puzzleList.map((x, i) => [x, vals[i]]));
  return {
    name: t('groupAvg'),
    color: 'var(--ref)',
    ref: true,
    points: new Map(xs.map((x) => [x, byPuzzle.get(x)])),
  };
}

function playerSeries(model, name, range, mode) {
  const list = model.byPlayer.get(name) ?? [];
  const vals = mode === 'avg' ? rolling(list.map((r) => r.score)) : list.map((r) => r.score);
  const points = new Map();
  list.forEach((r, i) => {
    if (inRange(r.puzzle, range)) points.set(r.puzzle, vals[i]);
  });
  const c = colorOf(model, name);
  return { name, color: c.color, dash: c.dash, cls: c.cls, points };
}

function renderTrend(range) {
  const model = game.season;
  const card = $('#trend-card');
  const stats = playerStats(model, range);
  card.hidden = !stats.length;
  if (!stats.length) return;
  const active = new Set(stats.map((s) => s.name));
  if (!state.selected) {
    state.selected = new Set(
      sortStats(leaderboardStats(model, range), { key: 'avg', dir: 'desc' })
        .slice(0, 3)
        .map((s) => s.name),
    );
  }

  $('#trend-players').replaceChildren(
    ...model.players
      .filter((p) => active.has(p))
      .map((name) => {
        const c = colorOf(model, name);
        return el(
          'button',
          {
            type: 'button',
            class: 'chip',
            'aria-pressed': state.selected.has(name) ? 'true' : 'false',
            onclick: () => {
              if (state.selected.has(name)) state.selected.delete(name);
              else state.selected.add(name);
              renderTrend(range);
            },
          },
          el('span', { class: `key${c.cls}`, style: `color:${c.color}` }),
          name,
        );
      }),
    legendItem(t('groupAvg'), 'var(--ref)'),
  );

  for (const b of document.querySelectorAll('#trend-mode button')) {
    b.setAttribute('aria-pressed', String(b.dataset.mode === state.trendMode));
  }

  const container = $('#trend-chart');
  const xs = model.puzzleList.filter((p) => inRange(p, range));
  const chosen = [...state.selected].filter((n) => active.has(n));
  if (!chosen.length) {
    container.replaceChildren(el('div', { class: 'empty' }, t('noSelection')));
    return;
  }
  lineChart(container, {
    xs,
    series: [
      groupSeries(model, xs, state.trendMode),
      ...chosen.map((n) => playerSeries(model, n, range, state.trendMode)),
    ],
    xLabel: label(model),
    digits: state.trendMode === 'avg' ? 1 : 0,
  });
}

// ---------------------------------------------------------------------------
// Testa a testa

function renderH2H(range) {
  const model = game.season;
  const card = $('#h2h-card');
  const order = sortStats(playerStats(model, range), { key: 'avg', dir: 'desc' }).map((s) => s.name);
  card.hidden = order.length < 2;
  if (order.length < 2) return;
  const idx = new Map(order.map((n, i) => [n, i]));
  const n = order.length;
  const w = Array.from({ length: n }, () => new Array(n).fill(0));
  const d = Array.from({ length: n }, () => new Array(n).fill(0));

  for (const p of model.puzzleList) {
    if (!inRange(p, range)) continue;
    const rs = model.puzzles.get(p).results;
    for (let a = 0; a < rs.length; a++) {
      for (let b = a + 1; b < rs.length; b++) {
        const i = idx.get(rs[a].player);
        const j = idx.get(rs[b].player);
        if (rs[a].score > rs[b].score) w[i][j]++;
        else if (rs[a].score < rs[b].score) w[j][i]++;
        else {
          d[i][j]++;
          d[j][i]++;
        }
      }
    }
  }

  const head = el(
    'tr',
    {},
    el('th', {}),
    order.map((name) => el('th', { scope: 'col', title: name }, el('span', {}, name))),
  );
  const body = order.map((rowName, i) =>
    el(
      'tr',
      {},
      el('th', { scope: 'row' }, rowName),
      order.map((colName, j) => {
        if (i === j) return el('td', {}, el('div', { class: 'self' }, '·'));
        const wins = w[i][j];
        const losses = w[j][i];
        const draws = d[i][j];
        const games = wins + losses;
        if (!games && !draws) return el('td', {}, el('div', { class: 'self' }, '–'));
        const share = games ? wins / games : 0.5;
        const strength = Math.round(Math.abs(share - 0.5) * 2 * 80);
        const hue = share >= 0.5 ? 'var(--div-pos)' : 'var(--div-neg)';
        const tip = t('h2hTip', { a: rowName, b: colName, w: wins, l: losses, d: draws });
        const show = (e) => {
          const r = e.currentTarget.getBoundingClientRect();
          showTooltip(tip, [], e.clientX ?? r.right, e.clientY ?? r.bottom);
        };
        return el(
          'td',
          {},
          el(
            'div',
            {
              tabindex: 0,
              'aria-label': tip,
              style: `background:color-mix(in oklab, ${hue} ${strength}%, var(--div-mid))`,
              onpointermove: show,
              onpointerleave: hideTooltip,
              onfocus: show,
              onblur: hideTooltip,
            },
            // su schermi stretti il numero può andare a capo dopo il trattino
            el('span', {}, `${wins}–`, el('wbr'), losses),
          ),
        );
      }),
    ),
  );
  $('#h2h').replaceChildren(el('thead', {}, head), el('tbody', {}, body));
}

// ---------------------------------------------------------------------------
// Scheda giocatore: tutte le sue partite (per Krillion anche quelle del vecchio gruppo)

function openPlayer(name) {
  const model = game.career;
  const dialog = $('#player-dialog');
  const all = { from: -Infinity, to: Infinity };
  const s = playerStats(model, all).find((x) => x.name === name);
  if (!s) return;
  const list = model.byPlayer.get(name);
  const seasonGames = game.seasonStart ? (game.season.byPlayer.get(name)?.length ?? 0) : null;
  const pz = (x) => puzzleLabel(model, x);

  $('#pd-title').textContent = name;
  $('#pd-tiles').replaceChildren(
    tile(
      t('colGames'),
      fmt(s.games),
      seasonGames !== null ? t('tileSeasonGames', { n: fmt(seasonGames) }) : '',
    ),
    tile(t('colAvg'), fmt(s.avg, 1)),
    tile(t('colBest'), fmt(s.best.score), pz(s.best.puzzle)),
    tile(t('tileWorst'), fmt(s.worst.score), pz(s.worst.puzzle)),
    tile(t('colWins'), fmt(s.wins)),
    tile(t('tilePodiums'), fmt(s.podiums), MEDALS.map((m, i) => `${m} ${fmt(s.podium[i])}`).join(' · ')),
    tile(
      t('colStreak'),
      `${fmt(s.streak)}${s.streak ? ' 🔥' : ''}`,
      `${t('tileStreakBest')}: ${fmt(s.bestStreak)}`,
    ),
  );

  const genres = id === 'songless' ? genreStats(list) : [];
  $('#pd-genres-wrap').hidden = !genres.length;
  if (genres.length) $('#pd-genres').replaceChildren(...genreTable(genres));

  const rows = [];
  let separated = false;
  for (const r of [...list].reverse()) {
    const p = model.puzzles.get(r.puzzle);
    if (game.seasonStart && r.puzzle < game.seasonStart && !separated) {
      separated = true;
      rows.push(el('tr', { class: 'sep' }, el('td', { colspan: def.numbered ? 5 : 4 }, t('legacyRow'))));
    }
    rows.push(
      el(
        'tr',
        {},
        def.numbered ? el('td', { class: 'left' }, `#${r.puzzle}`) : null,
        el('td', { class: 'left' }, fmtDate(p.date)),
        el('td', {}, fmt(r.score)),
        el('td', {}, `${p.rank.get(name)}/${p.results.length}`),
        el('td', { class: 'grid-cell' }, gridNode(id, r)),
      ),
    );
  }
  $('#pd-history').replaceChildren(
    el(
      'thead',
      {},
      el(
        'tr',
        {},
        def.numbered ? el('th', { class: 'left' }, t('colPuzzle')) : null,
        el('th', { class: 'left' }, t('colDate')),
        el('th', {}, t('colScore')),
        el('th', {}, t('colRank')),
        el('th', { class: 'left' }, t('colGrid')),
      ),
    ),
    el('tbody', {}, rows),
  );

  const c = colorOf(model, name);
  $('#pd-legend').replaceChildren(legendItem(name, c.color, c.cls), legendItem(t('groupAvg'), 'var(--ref)'));

  if (!dialog.open) dialog.showModal();
  const xs = model.puzzleList.filter((p) => p >= list[0].puzzle);
  lineChart($('#pd-chart'), {
    xs,
    series: [groupSeries(model, xs, 'score'), playerSeries(model, name, all, 'score')],
    xLabel: label(model),
  });
}

// ---------------------------------------------------------------------------
// Download dei dati (CSV, tutti i risultati, con i nomi mostrati sul sito)

function downloadCsv() {
  const model = game.career;
  const cell = (v) => {
    const text = String(v ?? '').replace(/\s*\n\s*/g, ' ');
    return /[",;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  const sent = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Europe/Zurich',
    dateStyle: 'short',
    timeStyle: 'short',
  });
  const rows = [
    ['colPuzzle', 'colDate', 'colPlayer', 'colScore', 'colRank', 'colParticipants', 'colGrid', 'colSent'].map(
      (k) => t(k),
    ),
  ];
  for (const n of model.puzzleList) {
    const p = model.puzzles.get(n);
    for (const r of [...p.results].sort((a, b) => p.rank.get(a.player) - p.rank.get(b.player))) {
      rows.push([
        def.numbered ? n : p.date,
        p.date ?? '',
        r.player,
        r.score,
        p.rank.get(r.player),
        p.results.length,
        r.grid ?? '',
        Number.isFinite(r.ts) ? sent.format(new Date(r.ts * 1000)) : '',
      ]);
    }
  }
  // BOM: Excel legge così le emoji e gli accenti
  const csv = '\ufeff' + rows.map((row) => row.map(cell).join(',')).join('\r\n') + '\r\n';
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = el('a', { href: url, download: `${id}_${new Date().toISOString().slice(0, 10)}.csv` });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ---------------------------------------------------------------------------
// Pagina

function setStatus(key, vars) {
  state.status = key ? { key, vars } : null;
  $('#status').textContent = key ? t(key, vars) : '';
}

function renderAll() {
  if (state.status) setStatus(state.status.key, state.status.vars);
  if (!game || !game.career.results.length) return;
  const range = periodRange(game.season, state.period);
  for (const b of document.querySelectorAll('#period button')) {
    b.setAttribute('aria-pressed', String(b.dataset.period === state.period));
  }
  $('#updated').textContent = game.updatedAt ? ` · ${fmtUpdated(game.updatedAt)}` : '';
  // Krillion appena ripartito: niente periodo né riquadri finché la nuova classifica è vuota
  const seasonEmpty = !game.season.results.length;
  $('#filters').hidden = seasonEmpty;
  $('#tiles').hidden = seasonEmpty;
  renderDay();
  renderTiles(range);
  renderLeaderboard(range);
  renderGenres(range);
  renderTrend(range);
  renderH2H(range);
}

function bindControls() {
  $('#download').addEventListener('click', () => game && downloadCsv());
  const step = (delta) => {
    const list = game.career.puzzleList;
    const i = list.indexOf(state.dayPuzzle) + delta;
    if (i >= 0 && i < list.length) state.dayPuzzle = list[i];
    renderDay();
  };
  $('#day-prev').addEventListener('click', () => step(-1));
  $('#day-next').addEventListener('click', () => step(1));
  for (const b of document.querySelectorAll('#period button')) {
    b.addEventListener('click', () => {
      state.period = b.dataset.period;
      state.selected = null;
      prefs.set(`period.${id}`, state.period);
      renderAll();
    });
  }
  for (const b of document.querySelectorAll('#trend-mode button')) {
    b.addEventListener('click', () => {
      state.trendMode = b.dataset.mode;
      prefs.set('trendMode', state.trendMode);
      renderTrend(periodRange(game.season, state.period));
    });
  }
  let lastWidth = window.innerWidth;
  let timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (!game || window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      renderTrend(periodRange(game.season, state.period));
    }, 150);
  });
}

async function main() {
  bindControls();
  setStatus('loading');
  try {
    const names = state.demo ? new Map() : await loadNames('../');
    game = await loadGame(id, { base: '../', names, demo: state.demo });
  } catch (err) {
    setStatus('error', { msg: err.message });
    return;
  }
  if (!game.career.results.length) {
    setStatus('empty', { game: def.name });
    return;
  }
  setStatus(state.demo ? 'demo' : null);
  $('#content').hidden = false;
  renderAll();
}

main();
