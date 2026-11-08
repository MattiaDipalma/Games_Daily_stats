// Games Daily – home: un riquadro per gioco, con il podio dell'ultimo puzzle e chi è in testa,
// e sotto la classifica generale dei tre giochi (per posizione media).

import {
  GAMES,
  GAME_IDS,
  LEADERBOARD_RULE,
  MEDALS,
  $,
  applyStaticTexts,
  el,
  fmt,
  fmtLongDate,
  fmtUpdated,
  loadGame,
  leaderboardStats,
  loadNames,
  mountShell,
  overallStats,
  periodRange,
  sortStats,
  t,
} from './core.js?v=3';

const demo = new URLSearchParams(location.search).has('demo');
const shell = mountShell({ page: 'home', base: '', onLang: render });
shell.main.innerHTML = `
  <p id="status" class="status" role="status"></p>
  <p class="muted home-hint" data-i18n="homeHint"></p>
  <div class="games" id="games"></div>
  <section class="card overall" id="overall-card" aria-labelledby="overall-title" hidden>
    <h2 id="overall-title" data-i18n="overall"></h2>
    <p class="muted small overall-hint" data-i18n="overallHint"></p>
    <div class="table-wrap">
      <table class="lb" id="overall"></table>
    </div>
    <p id="overall-empty" class="empty-note"></p>
    <p id="overall-note" class="muted small"></p>
  </section>`;
applyStaticTexts();

/** id → risultato di loadGame(), oppure { error } */
const loaded = {};

function podium(model, p) {
  return el(
    'ol',
    { class: 'gc-podium' },
    p.results.slice(0, 3).map((r) => {
      const rank = p.rank.get(r.player);
      return el(
        'li',
        {},
        el('span', { class: 'gc-rank' }, rank <= 3 && p.results.length > 1 ? MEDALS[rank - 1] : rank),
        el('span', { class: 'gc-name' }, r.player),
        el('span', { class: 'gc-score' }, fmt(r.score)),
      );
    }),
  );
}

function card(id) {
  const def = GAMES[id];
  const g = loaded[id];
  const body = [];
  if (!g) {
    body.push(el('p', { class: 'muted' }, t('loading')));
  } else if (g.error) {
    body.push(el('p', { class: 'muted' }, t('error', { msg: g.error })));
  } else if (!g.career.results.length) {
    body.push(el('p', { class: 'muted gc-empty' }, t('homeNoData')));
  } else {
    const model = g.career;
    const last = model.puzzleList.at(-1);
    const p = model.puzzles.get(last);
    body.push(
      el(
        'p',
        { class: 'gc-puzzle' },
        def.numbered ? `#${last} · ${fmtLongDate(p.date)}` : fmtLongDate(p.date),
      ),
      podium(model, p),
      el('p', { class: 'gc-meta muted small' }, t('homePlayers', { n: fmt(p.results.length) })),
    );
    // in testa alla classifica (per Krillion quella ripartita da zero)
    const season = g.season;
    const range = periodRange(season, 'all');
    const stats = sortStats(leaderboardStats(season, range), { key: 'avg', dir: 'desc' });
    body.push(
      el(
        'p',
        { class: 'gc-leader small' },
        stats.length
          ? [`🏆 ${t('homeLeader')}: `, el('strong', {}, stats[0].name), ` · ${fmt(stats[0].avg, 1)}`]
          : t('homeSeasonEmpty'),
      ),
    );
  }
  return el(
    'a',
    { class: 'game-card', href: `${id}/${demo ? '?demo' : ''}`, 'data-game': id },
    el(
      'div',
      { class: 'gc-head' },
      el('span', { class: 'gc-emoji', 'aria-hidden': 'true' }, def.emoji),
      el('h2', {}, def.name),
      el('span', { class: 'gc-arrow', 'aria-hidden': 'true', title: t('homeOpen') }, '→'),
    ),
    body,
  );
}

// Classifica generale: chi è nella classifica di tutti e tre i giochi (per Krillion quella ripartita da
// zero), ordinato per posizione media. Compare quando tutti e tre i giochi sono caricati.
function renderOverall() {
  const ready = GAME_IDS.every((id) => loaded[id] && !loaded[id].error);
  $('#overall-card').hidden = !ready;
  if (!ready) return;
  const stats = overallStats(Object.fromEntries(GAME_IDS.map((id) => [id, loaded[id].season])));
  const table = $('#overall');
  table.hidden = !stats.length;
  $('#overall-empty').textContent = stats.length ? '' : t('overallEmpty');
  $('#overall-note').textContent = t('overallNote', LEADERBOARD_RULE);

  const head = el(
    'tr',
    {},
    el('th', { class: 'pos', scope: 'col' }, '#'),
    el('th', { class: 'left c-name', scope: 'col' }, t('colPlayer')),
    el('th', { class: 'c-avg', scope: 'col' }, t('colAvgRank')),
    // ogni colonna di gioco col colore del suo gioco (data-game)
    GAME_IDS.map((id) =>
      el(
        'th',
        { class: `c-game c-${id}`, scope: 'col', 'data-game': id },
        el('span', { 'aria-hidden': 'true' }, GAMES[id].emoji),
        el('span', { class: 'g-name' }, ` ${GAMES[id].name}`),
      ),
    ),
    el('th', { class: 'c-games', scope: 'col' }, t('colGames')),
  );
  const rows = stats.map((s, i) =>
    el(
      'tr',
      {},
      el('td', { class: 'pos' }, i < 3 && stats.length > 1 ? MEDALS[i] : i + 1),
      el('td', { class: 'left c-name' }, s.name),
      el('td', { class: 'c-avg' }, fmt(s.avgRank, 2)),
      GAME_IDS.map((id) =>
        el(
          'td',
          {
            class: `c-game c-${id}`,
            title: t('overallTip', { game: GAMES[id].name, n: fmt(s.byGame[id].games) }),
          },
          fmt(s.byGame[id].avgRank, 2),
        ),
      ),
      el('td', { class: 'c-games' }, fmt(s.games)),
    ),
  );
  table.replaceChildren(el('thead', {}, head), el('tbody', {}, rows));
}

function render() {
  $('#games').replaceChildren(...GAME_IDS.map(card));
  renderOverall();
  const updated = GAME_IDS.map((id) => loaded[id]?.updatedAt)
    .filter(Boolean)
    .sort()
    .at(-1);
  $('#updated').textContent = updated ? ` · ${fmtUpdated(updated)}` : '';
  $('#status').textContent = demo ? t('demo') : '';
}

async function main() {
  render();
  const names = demo ? new Map() : await loadNames('');
  await Promise.all(
    GAME_IDS.map(async (id) => {
      try {
        loaded[id] = await loadGame(id, { base: '', names, demo });
      } catch (err) {
        loaded[id] = { error: err.message };
      }
      render();
    }),
  );
}

main();
