// Games Daily – home: un riquadro per gioco, con il podio dell'ultimo puzzle e chi è in testa.

import {
  GAMES,
  GAME_IDS,
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
  periodRange,
  sortStats,
  t,
} from './core.js?v=1';

const demo = new URLSearchParams(location.search).has('demo');
const shell = mountShell({ page: 'home', base: '', onLang: render });
shell.main.innerHTML = `
  <p id="status" class="status" role="status"></p>
  <p class="muted home-hint" data-i18n="homeHint"></p>
  <div class="games" id="games"></div>`;
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

function render() {
  $('#games').replaceChildren(...GAME_IDS.map(card));
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
