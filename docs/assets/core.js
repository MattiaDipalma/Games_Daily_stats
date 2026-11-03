// Games Daily – codice comune a tutte le pagine del sito (home e pagine dei giochi).
// Legge i file in data/ (aggiornati dal bot WhatsApp) e calcola tutto lato client.

export const GAMES = {
  krillion: {
    id: 'krillion',
    name: 'Krillion',
    emoji: '🦐',
    numbered: true,
    // Le partite del vecchio gruppo Krillion Daily contano nelle statistiche personali,
    // ma la classifica riparte da zero da questo puzzle.
    legacyFile: 'krillion-legacy.json',
    seasonStart: 112,
  },
  songless: { id: 'songless', name: 'Songless', emoji: '🎵', numbered: true },
  // Magnitudle non ha un numero: il puzzle è la data scritta nel messaggio.
  magnitudle: { id: 'magnitudle', name: 'Magnitudle', emoji: '📏', numbered: false },
};
export const GAME_IDS = Object.keys(GAMES);

/** Punti di Songless per posizione del quadrato verde (come nel bot). */
export const SONGLESS_POINTS = [100, 85, 60, 30, 10];

const I18N = {
  it: {
    subtitle: 'Le statistiche del gruppo',
    updated: 'Aggiornato {time}',
    loading: 'Caricamento…',
    error: 'Impossibile caricare le statistiche ({msg}).',
    empty: 'Ancora nessun risultato: appena qualcuno manda il suo {game} nel gruppo, comparirà qui.',
    demo: 'Dati di esempio (modalità demo).',
    navLabel: 'Giochi',
    langLabel: 'Lingua',
    prev: 'Precedente',
    next: 'Successivo',
    missing: 'Non ha ancora giocato: {names}',
    missingMany: 'Non hanno ancora giocato: {names}',
    vsAvg: 'vs media',
    firstGame: 'prima partita',
    period: 'Periodo',
    periodAll: 'Sempre',
    period30: 'Ultimi 30',
    period7: 'Ultimi 7',
    tilePuzzles: 'Puzzle',
    tileDays: 'Giorni',
    tilePlayers: 'Giocatori',
    tileRecord: 'Record',
    tileAvg: 'Media del gruppo',
    tilePlayersHint: '{n} risultati',
    tileRange: 'da {from} a {to}',
    leaderboard: 'Classifica',
    colPlayer: 'Giocatore',
    colGames: 'Partite',
    colAvg: 'Media',
    colBest: 'Migliore',
    colWins: 'Vittorie',
    colAvgRank: 'Pos. media',
    colStreak: 'Serie',
    qualifyNote:
      'Chi non ha una serie attuale di almeno {n} partite di fila è in fondo alla classifica della media.',
    seasonNote:
      'La classifica è ripartita da zero con il Krillion #{start}. Le partite di Krillion Daily (#{from}–#{to}) contano nelle statistiche personali: clicca su un nome.',
    seasonEmpty:
      'La classifica riparte da zero: appena qualcuno manda il Krillion #{start} (o uno successivo) nel gruppo, comparirà qui.',
    others: 'Senza partite in classifica nel periodo:',
    trend: 'Andamento',
    trendPlayers: 'Giocatori nel grafico',
    modeScore: 'Punteggio',
    modeAvg: 'Media mobile (7)',
    groupAvg: 'Media del gruppo',
    noSelection: 'Seleziona almeno un giocatore.',
    h2h: 'Testa a testa',
    h2hHint:
      'Vittorie–sconfitte del giocatore della riga contro quello della colonna, nei puzzle giocati da entrambi.',
    h2hWorse: 'perde più spesso',
    h2hBetter: 'vince più spesso',
    h2hTip: '{a} contro {b}: {w} vinte, {l} perse, {d} pari',
    history: 'Storico',
    close: 'Chiudi',
    colPuzzle: 'Puzzle',
    colDate: 'Data',
    colScore: 'Punti',
    colRank: 'Pos.',
    colGrid: 'Risultato',
    tileWorst: 'Peggiore',
    tilePodiums: 'Podi',
    tileStreakBest: 'Serie migliore',
    tileSeasonGames: '{n} nella nuova classifica',
    legacyRow: 'Krillion Daily · il vecchio gruppo',
    footer: 'Dati raccolti dal bot WhatsApp del gruppo Games Daily',
    download: 'Scarica i dati (CSV)',
    colParticipants: 'Partecipanti',
    colSent: 'Inviato il',
    scoring_songless:
      'Punti per ogni genere, in base al tentativo in cui trovi la canzone (🟩): 1° 100, 2° 85, 3° 60, 4° 30, 5° 10, non trovata 0. Massimo 500.',
    scoring_magnitudle: 'Il punteggio è quello del gioco: 5 manche da 100 punti, massimo 500.',
    genres: 'Generi',
    genresHint: 'Come va il gruppo con ogni genere, nel periodo scelto.',
    colGenre: 'Genere',
    colHits: 'Trovate',
    colAvgPoints: 'Media punti',
    colAvgTry: 'Tentativo medio',
    colTop: 'Il migliore',
    songlessHit: '{genre}: trovata al {n}° tentativo, {p} punti',
    songlessMiss: '{genre}: non trovata, 0 punti',
    magnitudleRound: 'Manche {n}: {p} punti',
    homeHint: 'Scegli un gioco: classifica, andamento, testa a testa e la scheda di ogni giocatore.',
    homeNoData: 'Ancora nessun risultato.',
    homeLeader: 'In testa',
    homeSeasonEmpty: 'Classifica ripartita da zero',
    homePlayers: '{n} giocatori',
    homeOpen: 'Apri le statistiche',
  },
  de: {
    subtitle: 'Die Statistiken der Gruppe',
    updated: 'Aktualisiert {time}',
    loading: 'Laden…',
    error: 'Statistiken konnten nicht geladen werden ({msg}).',
    empty: 'Noch keine Resultate: Sobald jemand sein {game} in die Gruppe schickt, erscheint es hier.',
    demo: 'Beispieldaten (Demo-Modus).',
    navLabel: 'Spiele',
    langLabel: 'Sprache',
    prev: 'Zurück',
    next: 'Weiter',
    missing: 'Hat noch nicht gespielt: {names}',
    missingMany: 'Haben noch nicht gespielt: {names}',
    vsAvg: 'vs. Schnitt',
    firstGame: 'erstes Spiel',
    period: 'Zeitraum',
    periodAll: 'Gesamt',
    period30: 'Letzte 30',
    period7: 'Letzte 7',
    tilePuzzles: 'Rätsel',
    tileDays: 'Tage',
    tilePlayers: 'Spieler',
    tileRecord: 'Rekord',
    tileAvg: 'Gruppenschnitt',
    tilePlayersHint: '{n} Resultate',
    tileRange: 'von {from} bis {to}',
    leaderboard: 'Rangliste',
    colPlayer: 'Spieler',
    colGames: 'Spiele',
    colAvg: 'Schnitt',
    colBest: 'Bestes',
    colWins: 'Siege',
    colAvgRank: 'Ø Rang',
    colStreak: 'Serie',
    qualifyNote:
      'Wer keine aktuelle Serie von mindestens {n} Spielen am Stück hat, steht in der Schnitt-Rangliste unten.',
    seasonNote:
      'Die Rangliste hat mit Krillion #{start} bei null neu begonnen. Die Spiele von Krillion Daily (#{from}–#{to}) zählen in den persönlichen Statistiken: Klick auf einen Namen.',
    seasonEmpty:
      'Die Rangliste beginnt bei null: Sobald jemand Krillion #{start} (oder ein späteres) in die Gruppe schickt, erscheint es hier.',
    others: 'Ohne Spiele in der Rangliste im Zeitraum:',
    trend: 'Verlauf',
    trendPlayers: 'Spieler im Diagramm',
    modeScore: 'Punkte',
    modeAvg: 'Gleitender Schnitt (7)',
    groupAvg: 'Gruppenschnitt',
    noSelection: 'Wähle mindestens einen Spieler.',
    h2h: 'Direktvergleich',
    h2hHint:
      'Siege–Niederlagen des Spielers der Zeile gegen den der Spalte, bei Rätseln, die beide gespielt haben.',
    h2hWorse: 'verliert öfter',
    h2hBetter: 'gewinnt öfter',
    h2hTip: '{a} gegen {b}: {w} gewonnen, {l} verloren, {d} unentschieden',
    history: 'Verlauf',
    close: 'Schliessen',
    colPuzzle: 'Rätsel',
    colDate: 'Datum',
    colScore: 'Punkte',
    colRank: 'Rang',
    colGrid: 'Resultat',
    tileWorst: 'Schlechtestes',
    tilePodiums: 'Podestplätze',
    tileStreakBest: 'Beste Serie',
    tileSeasonGames: '{n} in der neuen Rangliste',
    legacyRow: 'Krillion Daily · die alte Gruppe',
    footer: 'Daten gesammelt vom WhatsApp-Bot der Gruppe Games Daily',
    download: 'Daten herunterladen (CSV)',
    colParticipants: 'Teilnehmer',
    colSent: 'Gesendet am',
    scoring_songless:
      'Punkte pro Genre, je nachdem bei welchem Versuch du den Song findest (🟩): 1. 100, 2. 85, 3. 60, 4. 30, 5. 10, nicht gefunden 0. Maximal 500.',
    scoring_magnitudle: 'Es zählt die Punktzahl des Spiels: 5 Runden zu 100 Punkten, maximal 500.',
    genres: 'Genres',
    genresHint: 'Wie die Gruppe in jedem Genre abschneidet, im gewählten Zeitraum.',
    colGenre: 'Genre',
    colHits: 'Gefunden',
    colAvgPoints: 'Ø Punkte',
    colAvgTry: 'Ø Versuch',
    colTop: 'Am besten',
    songlessHit: '{genre}: beim {n}. Versuch gefunden, {p} Punkte',
    songlessMiss: '{genre}: nicht gefunden, 0 Punkte',
    magnitudleRound: 'Runde {n}: {p} Punkte',
    homeHint: 'Wähle ein Spiel: Rangliste, Verlauf, Direktvergleich und die Statistiken jedes Spielers.',
    homeNoData: 'Noch keine Resultate.',
    homeLeader: 'An der Spitze',
    homeSeasonEmpty: 'Rangliste neu gestartet',
    homePlayers: '{n} Spieler',
    homeOpen: 'Statistiken öffnen',
  },
  en: {
    subtitle: 'The group stats',
    updated: 'Updated {time}',
    loading: 'Loading…',
    error: 'Could not load the stats ({msg}).',
    empty: 'No results yet: as soon as someone posts their {game} in the group, it will show up here.',
    demo: 'Sample data (demo mode).',
    navLabel: 'Games',
    langLabel: 'Language',
    prev: 'Previous',
    next: 'Next',
    missing: 'Still to play: {names}',
    missingMany: 'Still to play: {names}',
    vsAvg: 'vs avg',
    firstGame: 'first game',
    period: 'Period',
    periodAll: 'All time',
    period30: 'Last 30',
    period7: 'Last 7',
    tilePuzzles: 'Puzzles',
    tileDays: 'Days',
    tilePlayers: 'Players',
    tileRecord: 'Record',
    tileAvg: 'Group average',
    tilePlayersHint: '{n} results',
    tileRange: '{from} to {to}',
    leaderboard: 'Leaderboard',
    colPlayer: 'Player',
    colGames: 'Games',
    colAvg: 'Average',
    colBest: 'Best',
    colWins: 'Wins',
    colAvgRank: 'Avg. rank',
    colStreak: 'Streak',
    qualifyNote:
      'Players without a current streak of at least {n} games in a row sit at the bottom of the average ranking.',
    seasonNote:
      'The leaderboard restarted from zero with Krillion #{start}. Games from Krillion Daily (#{from}–#{to}) count in the personal stats: tap a name.',
    seasonEmpty:
      'The leaderboard restarts from zero: as soon as someone posts Krillion #{start} (or a later one) in the group, it will show up here.',
    others: 'No leaderboard games in this period:',
    trend: 'Trend',
    trendPlayers: 'Players in the chart',
    modeScore: 'Score',
    modeAvg: 'Rolling average (7)',
    groupAvg: 'Group average',
    noSelection: 'Select at least one player.',
    h2h: 'Head to head',
    h2hHint: 'Wins–losses of the row player against the column player, on puzzles both played.',
    h2hWorse: 'loses more often',
    h2hBetter: 'wins more often',
    h2hTip: '{a} vs {b}: {w} won, {l} lost, {d} tied',
    history: 'History',
    close: 'Close',
    colPuzzle: 'Puzzle',
    colDate: 'Date',
    colScore: 'Score',
    colRank: 'Rank',
    colGrid: 'Result',
    tileWorst: 'Worst',
    tilePodiums: 'Podiums',
    tileStreakBest: 'Best streak',
    tileSeasonGames: '{n} in the new leaderboard',
    legacyRow: 'Krillion Daily · the old group',
    footer: 'Data collected by the Games Daily WhatsApp bot',
    download: 'Download the data (CSV)',
    colParticipants: 'Players',
    colSent: 'Sent at',
    scoring_songless:
      'Points for each genre, by the attempt on which you find the song (🟩): 1st 100, 2nd 85, 3rd 60, 4th 30, 5th 10, not found 0. Maximum 500.',
    scoring_magnitudle: "The score is the game's own: 5 rounds of 100 points, maximum 500.",
    genres: 'Genres',
    genresHint: 'How the group does in each genre, in the selected period.',
    colGenre: 'Genre',
    colHits: 'Found',
    colAvgPoints: 'Avg. points',
    colAvgTry: 'Avg. attempt',
    colTop: 'Best at it',
    songlessHit: '{genre}: found on attempt {n}, {p} points',
    songlessMiss: '{genre}: not found, 0 points',
    magnitudleRound: 'Round {n}: {p} points',
    homeHint: "Pick a game: leaderboard, trend, head to head and every player's stats.",
    homeNoData: 'No results yet.',
    homeLeader: 'Leading',
    homeSeasonEmpty: 'Leaderboard restarted from zero',
    homePlayers: '{n} players',
    homeOpen: 'Open the stats',
  },
};

const LOCALES = { it: 'it-CH', de: 'de-CH', en: 'en-GB' };
export const MEDALS = ['🥇', '🥈', '🥉'];
// colori dei giocatori: 8 tinte in ordine fisso; dal nono in poi la stessa tinta
// con la linea tratteggiata, poi punteggiata (il colore da solo non basta mai)
const SLOTS = 8;
const DASHES = ['', '7 4', '1 5'];
const DASH_CLASS = ['', ' dashed', ' dotted'];
// partite minime nel periodo per stare in classifica (media e posizione media) insieme agli altri
const MIN_GAMES = 3;

// ---------------------------------------------------------------------------
// Preferenze (solo per comodità: se lo storage non è disponibile si va avanti)

export const prefs = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(`gamesdaily.${key}`);
      return v === null ? fallback : JSON.parse(v);
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(`gamesdaily.${key}`, JSON.stringify(value));
    } catch {
      /* ignora */
    }
  },
};

function detectLang() {
  const saved = prefs.get('lang', null);
  if (saved && I18N[saved]) return saved;
  for (const l of navigator.languages ?? [navigator.language]) {
    const code = String(l).slice(0, 2).toLowerCase();
    if (I18N[code]) return code;
  }
  return 'it';
}

export const ui = { lang: detectLang() };

export function t(key, vars = {}) {
  const s = I18N[ui.lang][key] ?? I18N.it[key] ?? key;
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

export const locale = () => LOCALES[ui.lang];
export const fmt = (n, digits = 0) =>
  new Intl.NumberFormat(locale(), { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
export const fmtDate = (iso, opts = { day: 'numeric', month: 'short' }) =>
  iso
    ? new Intl.DateTimeFormat(locale(), { ...opts, timeZone: 'UTC' }).format(new Date(`${iso}T12:00:00Z`))
    : '';
export const fmtLongDate = (iso) =>
  fmtDate(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const fmtUpdated = (iso) =>
  iso
    ? t('updated', {
        time: new Intl.DateTimeFormat(locale(), { dateStyle: 'medium', timeStyle: 'short' }).format(
          new Date(iso),
        ),
      })
    : '';

// ---------------------------------------------------------------------------
// DOM

export const $ = (sel) => document.querySelector(sel);

export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') node.className = v;
    else if (k === 'style') node.style.cssText = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) {
    if (c === undefined || c === null || c === false) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
export function svg(tag, attrs = {}, ...children) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null) continue;
    node.setAttribute(k, v);
  }
  for (const c of children.flat()) {
    if (c === undefined || c === null) continue;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  }
  return node;
}

/** Testi statici: data-i18n (contenuto) e data-i18n-label (aria-label). */
export function applyStaticTexts(root = document) {
  document.documentElement.lang = ui.lang;
  for (const node of root.querySelectorAll('[data-i18n]')) node.textContent = t(node.dataset.i18n);
  for (const node of root.querySelectorAll('[data-i18n-label]'))
    node.setAttribute('aria-label', t(node.dataset.i18nLabel));
  const lang = document.getElementById('lang');
  if (lang) lang.value = ui.lang;
}

/**
 * Intestazione (con i link ai tre giochi), contenuto e piè di pagina.
 * @param {{ page: string, base: string, onLang: () => void }} opts
 *   page: 'home' oppure l'id del gioco; base: percorso della radice del sito ('' o '../')
 */
export function mountShell({ page, base, onLang }) {
  const game = GAMES[page];
  const tabs = GAME_IDS.map((id) =>
    el(
      'a',
      {
        class: 'tab',
        href: `${base}${id}/`,
        'data-game': id,
        'aria-current': id === page ? 'page' : null,
      },
      el('span', { 'aria-hidden': 'true' }, GAMES[id].emoji),
      GAMES[id].name,
    ),
  );
  const lang = el(
    'select',
    { id: 'lang', 'data-i18n-label': 'langLabel' },
    el('option', { value: 'it' }, 'Italiano'),
    el('option', { value: 'de' }, 'Deutsch'),
    el('option', { value: 'en' }, 'English'),
  );
  lang.addEventListener('change', () => {
    ui.lang = lang.value;
    prefs.set('lang', ui.lang);
    applyStaticTexts();
    onLang();
  });

  const header = el(
    'header',
    { class: 'top' },
    el(
      'nav',
      { class: 'wrap bar', 'data-i18n-label': 'navLabel' },
      el(
        'a',
        { class: 'brand', href: base || './', 'aria-current': page === 'home' ? 'page' : null },
        el('span', { 'aria-hidden': 'true' }, '🎮'),
        ' Games Daily',
      ),
      el('div', { class: 'tabs' }, tabs),
      el('label', { class: 'lang' }, lang),
    ),
    el(
      'div',
      { class: 'wrap hero' },
      el(
        'h1',
        {},
        el('span', { class: 'hero-emoji', 'aria-hidden': 'true' }, game ? game.emoji : '🎮'),
        game ? game.name : 'Games Daily',
      ),
      el(
        'p',
        { class: 'sub' },
        el('span', { 'data-i18n': 'subtitle' }),
        el('span', { id: 'updated', class: 'updated' }),
      ),
    ),
  );
  const main = el('main', { class: 'wrap', id: 'main' });
  const footer = el(
    'footer',
    { class: 'wrap foot muted small' },
    el('span', { 'data-i18n': 'footer' }),
    ' · ',
    game
      ? el('button', { type: 'button', id: 'download', class: 'link-btn', 'data-i18n': 'download' })
      : null,
    game ? ' · ' : null,
    el('a', { href: 'https://github.com/MattiaDipalma/Games_Daily_stats' }, 'GitHub'),
  );
  const tip = el('div', { class: 'tooltip', id: 'tooltip', role: 'tooltip', hidden: true });
  document.body.append(header, main, footer, tip);
  window.addEventListener('scroll', hideTooltip, { passive: true });
  applyStaticTexts();
  return { main, header, footer };
}

// ---------------------------------------------------------------------------
// Dati

async function loadJson(path) {
  const res = await fetch(`${path}?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// Nomi da mostrare (data/names.json): { "nome come arriva da WhatsApp": "nome sul sito" }.
// Confronto senza maiuscole/spazi; i puntini dei numeri mascherati (+41∙∙∙46) valgono tutti uguale.
const nameKey = (s) =>
  String(s ?? '')
    .replace(/[\u200b-\u200f\u202a-\u202e\u2060\ufeff]/g, '')
    .replace(/[∙•·⋅]/g, '∙')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();

export async function loadNames(base) {
  try {
    const names = await loadJson(`${base}data/names.json`);
    const map = new Map();
    for (const [from, to] of Object.entries(names ?? {})) {
      if (!from.startsWith('_') && typeof to === 'string' && to.trim()) map.set(nameKey(from), to.trim());
    }
    return map;
  } catch {
    return new Map(); // senza names.json si usano i nomi di WhatsApp
  }
}

/** Chiave numerica del puzzle: il numero, oppure (Magnitudle) i giorni dal 1970 della data. */
export function puzzleX(def, puzzle) {
  if (def.numbered) return typeof puzzle === 'number' && Number.isFinite(puzzle) ? puzzle : NaN;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(puzzle));
  return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) / 864e5 : NaN;
}
export const dayIso = (x) => new Date(x * 864e5).toISOString().slice(0, 10);

/** Etichetta breve del puzzle ("#112" o "4 nov"). */
export function puzzleLabel(model, x) {
  return model.def.numbered ? `#${x}` : fmtDate(dayIso(x));
}

/** Etichetta lunga ("#112 · 4 nov" o "mar 4 nov"), per i tooltip. */
export function puzzleLongLabel(model, x) {
  const date = model.puzzles.get(x)?.date;
  if (!model.def.numbered) return fmtDate(dayIso(x), { weekday: 'short', day: 'numeric', month: 'short' });
  return date ? `#${x} · ${fmtDate(date)}` : `#${x}`;
}

/** Indice dei puzzle: puzzle → { puzzle, date, results ordinati, rank per giocatore } */
function indexPuzzles(results) {
  const map = new Map();
  for (const r of results) {
    if (!map.has(r.puzzle)) map.set(r.puzzle, { puzzle: r.puzzle, date: r.date, results: [] });
    const p = map.get(r.puzzle);
    p.results.push(r);
    if (r.date && (!p.date || r.date < p.date)) p.date = r.date;
  }
  for (const p of map.values()) {
    p.results.sort((a, b) => b.score - a.score || (a.ts ?? 0) - (b.ts ?? 0));
    p.rank = new Map();
    p.results.forEach((r, i) => {
      // classifica "sportiva": a pari punteggio, pari posizione (1, 2, 2, 4)
      const rank = i > 0 && r.score === p.results[i - 1].score ? p.rank.get(p.results[i - 1].player) : i + 1;
      p.rank.set(r.player, rank);
    });
    p.top = p.results[0]?.score;
    p.avg = p.results.reduce((s, r) => s + r.score, 0) / p.results.length;
  }
  return map;
}

/**
 * Colore fisso per giocatore, nell'ordine in cui ha giocato la prima volta:
 * chi arriva dopo prende il colore successivo e quelli degli altri non cambiano.
 */
function buildColors(byPlayer) {
  const order = [...byPlayer.entries()]
    .map(([name, list]) => ({ name, first: list[0] }))
    .sort(
      (a, b) =>
        a.first.puzzle - b.first.puzzle ||
        (a.first.ts ?? 0) - (b.first.ts ?? 0) ||
        a.name.localeCompare(b.name),
    );
  return new Map(
    order.map(({ name }, i) => {
      const style = Math.floor(i / SLOTS) % DASHES.length;
      return [name, { color: `var(--s${(i % SLOTS) + 1})`, dash: DASHES[style], cls: DASH_CLASS[style] }];
    }),
  );
}

export function colorOf(model, name) {
  return model.colors.get(name) ?? { color: 'var(--ref)', dash: '', cls: '' };
}

/**
 * Modello di un gioco: risultati con i nomi da mostrare, un risultato per giocatore e puzzle.
 * @param {object[]} rows risultati come nei file JSON
 * @param {{ def: object, names?: Map<string, string>, colors?: Map }} opts
 */
export function prepare(rows, { def, names = new Map(), colors = null }) {
  // Due nomi di WhatsApp possono diventare la stessa persona: un risultato per puzzle, vale il primo.
  const byKey = new Map();
  for (const r of rows ?? []) {
    if (!r || !Number.isFinite(r.score) || typeof r.player !== 'string') continue;
    const x = puzzleX(def, r.puzzle);
    if (!Number.isFinite(x)) continue;
    const player = names.get(nameKey(r.player)) ?? r.player.trim();
    if (!player) continue;
    const key = `${x}\u0000${player.toLowerCase()}`;
    const prev = byKey.get(key);
    if (!prev || (r.ts ?? Infinity) < (prev.ts ?? Infinity)) {
      byKey.set(key, { ...r, puzzle: x, player, date: def.numbered ? r.date : dayIso(x) });
    }
  }
  // Stesso nome con maiuscole diverse (malena / Malena) = stessa persona.
  // Si mostra la versione con l'iniziale maiuscola, altrimenti la più usata.
  const variants = new Map();
  for (const r of byKey.values()) {
    const k = r.player.toLowerCase();
    if (!variants.has(k)) variants.set(k, new Map());
    const v = variants.get(k);
    v.set(r.player, (v.get(r.player) ?? 0) + 1);
  }
  const canonical = new Map();
  for (const [k, v] of variants) {
    const capital = (n) => n[0] !== n[0].toLowerCase();
    const [best] = [...v.entries()].sort(
      ([a, na], [b, nb]) => Number(capital(b)) - Number(capital(a)) || nb - na || a.localeCompare(b),
    )[0];
    canonical.set(k, best);
  }
  const results = [...byKey.values()].map((r) => ({ ...r, player: canonical.get(r.player.toLowerCase()) }));
  const puzzles = indexPuzzles(results);
  const puzzleList = [...puzzles.keys()].sort((a, b) => a - b);
  const index = new Map(puzzleList.map((p, i) => [p, i]));
  const players = [...new Set(results.map((r) => r.player))].sort((a, b) => a.localeCompare(b, locale()));
  const byPlayer = new Map(players.map((p) => [p, []]));
  for (const r of results) byPlayer.get(r.player).push(r);
  for (const list of byPlayer.values()) list.sort((a, b) => a.puzzle - b.puzzle);
  return {
    def,
    results,
    puzzles,
    puzzleList,
    index,
    players,
    byPlayer,
    colors: colors ?? buildColors(byPlayer),
  };
}

/**
 * Carica un gioco e prepara due modelli:
 *  - career: tutte le partite (per Krillion anche quelle del vecchio gruppo), per le schede personali
 *  - season: le partite che contano per la classifica (per Krillion solo quelle nuove)
 */
export async function loadGame(id, { base = '', names = new Map(), demo = false } = {}) {
  const def = GAMES[id];
  let current;
  let legacy = [];
  let updatedAt = null;
  let seasonStart = def.seasonStart ?? -Infinity;
  if (demo) {
    const sample = demoData(id);
    current = sample.current;
    legacy = sample.legacy;
    if (sample.seasonStart) seasonStart = sample.seasonStart;
    updatedAt = new Date().toISOString();
  } else {
    const [data, old] = await Promise.all([
      loadJson(`${base}data/${id}.json`),
      def.legacyFile ? loadJson(`${base}data/${def.legacyFile}`).catch(() => null) : null,
    ]);
    current = data?.results ?? [];
    legacy = old?.results ?? [];
    updatedAt = [data?.updatedAt, old?.updatedAt].filter(Boolean).sort().at(-1) ?? null;
  }
  const career = prepare([...legacy, ...current], { def, names });
  // Classifica separata solo per Krillion: le partite del vecchio gruppo non contano mai, e quelle
  // nuove contano da seasonStart in poi.
  const separate = Number.isFinite(seasonStart);
  const season = separate
    ? prepare(
        current.filter((r) => puzzleX(def, r.puzzle) >= seasonStart),
        { def, names, colors: career.colors },
      )
    : career;
  const legacyPuzzles = legacy.map((r) => r.puzzle).filter(Number.isFinite);
  return {
    def,
    career,
    season,
    updatedAt,
    seasonStart: separate ? seasonStart : null,
    legacyRange: legacyPuzzles.length
      ? { from: Math.min(...legacyPuzzles), to: Math.max(...legacyPuzzles) }
      : null,
  };
}

// ---------------------------------------------------------------------------
// Calcoli

export function periodRange(model, period) {
  const list = model.puzzleList;
  if (!list.length) return { from: Infinity, to: -Infinity };
  if (period === 'all') return { from: list[0], to: list.at(-1) };
  return { from: list[Math.max(0, list.length - Number(period))], to: list.at(-1) };
}

export const inRange = (x, range) => x >= range.from && x <= range.to;

/** Serie di puzzle consecutivi (tra quelli giocati dal gruppo). Attuale = arriva all'ultimo o al penultimo. */
function streaks(list, model) {
  let best = 0;
  let run = 0;
  let prev = null;
  for (const r of list) {
    const i = model.index.get(r.puzzle);
    run = prev !== null && i === prev + 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = i;
  }
  const last = model.puzzleList.length - 1;
  const current = prev !== null && prev >= last - 1 ? run : 0;
  return { current, best };
}

export function playerStats(model, range) {
  const stats = [];
  for (const [name, all] of model.byPlayer) {
    const list = all.filter((r) => inRange(r.puzzle, range));
    if (!list.length) continue;
    let total = 0;
    let wins = 0;
    let rankSum = 0;
    const podium = [0, 0, 0]; // volte primo, secondo, terzo (come le medaglie del puzzle del giorno)
    let best = list[0];
    let worst = list[0];
    for (const r of list) {
      const p = model.puzzles.get(r.puzzle);
      total += r.score;
      const rank = p.rank.get(name);
      rankSum += rank;
      if (rank === 1 && p.results.length > 1) wins++;
      if (rank <= 3 && p.results.length > 1) podium[rank - 1]++;
      if (r.score > best.score) best = r;
      if (r.score < worst.score) worst = r;
    }
    const s = streaks(all, model);
    stats.push({
      name,
      games: list.length,
      avg: total / list.length,
      best,
      worst,
      wins,
      podium,
      podiums: podium[0] + podium[1] + podium[2],
      avgRank: rankSum / list.length,
      streak: s.current,
      bestStreak: s.best,
    });
  }
  return stats;
}

export function minGames(model, range) {
  // serve una serie attuale di MIN_GAMES partite di fila;
  // se nel periodo ci sono meno puzzle di MIN_GAMES, basta averli giocati tutti
  const n = model.puzzleList.filter((p) => inRange(p, range)).length;
  return Math.max(1, Math.min(MIN_GAMES, n));
}

export function sortStats(stats, sort, threshold) {
  const dir = sort.dir === 'asc' ? 1 : -1;
  const value = (s) => (sort.key === 'best' ? s.best.score : sort.key === 'name' ? s.name : s[sort.key]);
  const qualifies = sort.key === 'avg' || sort.key === 'avgRank';
  return [...stats].sort((a, b) => {
    if (qualifies) {
      const qa = a.streak >= threshold;
      const qb = b.streak >= threshold;
      if (qa !== qb) return qa ? -1 : 1;
    }
    const va = value(a);
    const vb = value(b);
    const cmp = typeof va === 'string' ? va.localeCompare(vb, locale()) : va - vb;
    return dir * cmp || b.games - a.games || a.name.localeCompare(b.name, locale());
  });
}

export function rolling(values, size = 7) {
  const out = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= size) sum -= values[i - size];
    out.push(sum / Math.min(i + 1, size));
  }
  return out;
}

// ---------------------------------------------------------------------------
// Griglie dei risultati

const GREEN = new Set(['🟩', '🟢']);
const SQUARES = new Set([...GREEN, ...'⬜⬛🟥🟨🟧🟦🟪🟫◻◼▫▪◽◾⚪⚫🔴🟡🟠🔵🟣🟤']);

/** Righe di Songless: genere, tentativo in cui è stata trovata la canzone (0 = no) e punti. */
export function songlessRows(grid) {
  const rows = [];
  for (const line of String(grid ?? '').split('\n')) {
    const squares = [];
    let rest = '';
    for (const c of line.replace(/\ufe0f/g, '')) {
      if (SQUARES.has(c)) squares.push(c);
      else rest += c;
    }
    if (squares.length < 3) continue;
    const i = squares.findIndex((c) => GREEN.has(c));
    rows.push({
      genre: rest
        .trim()
        .replace(/^\[(.*)\]$/, '$1')
        .trim(),
      guess: i + 1,
      points: i === -1 ? 0 : (SONGLESS_POINTS[i] ?? 0),
    });
  }
  return rows;
}

/** Punti delle manche di Magnitudle ("🟥🟥🟥🟥⬜ 71" → 71). */
export function magnitudleRounds(grid) {
  const rounds = [];
  for (const line of String(grid ?? '').split('\n')) {
    const m = line.match(/(\d{1,3})\s*$/);
    if (m) rounds.push(Number(m[1]));
  }
  return rounds;
}

/** Il risultato in forma compatta, diverso per ogni gioco. */
export function gridNode(id, r) {
  if (id === 'songless') {
    const rows = songlessRows(r.grid);
    if (rows.length) {
      const tips = rows.map((row, i) => {
        const genre = row.genre || `#${i + 1}`;
        return row.guess
          ? t('songlessHit', { genre, n: row.guess, p: row.points })
          : t('songlessMiss', { genre });
      });
      return el(
        'span',
        { class: 'mini sg', role: 'img', 'aria-label': tips.join('; ') },
        rows.map((row, i) =>
          el(
            'span',
            { class: `cell ${row.guess ? `t${Math.min(row.guess, 5)}` : 'miss'}`, title: tips[i] },
            row.guess ? String(row.guess) : '✕',
          ),
        ),
      );
    }
  }
  if (id === 'magnitudle') {
    const rounds = magnitudleRounds(r.grid);
    if (rounds.length) {
      const tips = rounds.map((p, i) => t('magnitudleRound', { n: i + 1, p }));
      return el(
        'span',
        { class: 'mini mg', role: 'img', 'aria-label': tips.join('; ') },
        rounds.map((p, i) =>
          el(
            'span',
            { class: 'cell', title: tips[i], style: `--fill:${Math.max(0, Math.min(100, p))}%` },
            String(p),
          ),
        ),
      );
    }
  }
  return el('span', { class: 'emoji-grid' }, String(r.grid ?? '').replace(/\s*\n\s*/g, ' '));
}

/**
 * Statistiche per genere di Songless: { genre, plays, hits, points, tries } in ordine di apparizione
 * (partendo dai puzzle più recenti).
 */
export function genreStats(results) {
  const map = new Map();
  for (const r of [...results].sort((a, b) => b.puzzle - a.puzzle)) {
    for (const row of songlessRows(r.grid)) {
      if (!row.genre) continue;
      if (!map.has(row.genre))
        map.set(row.genre, { genre: row.genre, plays: 0, hits: 0, points: 0, tries: 0 });
      const g = map.get(row.genre);
      g.plays++;
      g.points += row.points;
      if (row.guess) {
        g.hits++;
        g.tries += row.guess;
      }
    }
  }
  return [...map.values()];
}

// ---------------------------------------------------------------------------
// Tooltip e grafico a linee (SVG)

export function showTooltip(title, rows, clientX, clientY) {
  const tooltip = $('#tooltip');
  tooltip.replaceChildren(
    el('div', { class: 'tt-title' }, title),
    ...rows.map((r) =>
      el(
        'div',
        { class: 'tt-row' },
        el('span', { class: `key${r.cls ?? ''}`, style: `color:${r.color}` }),
        el('strong', {}, r.value),
        el('span', {}, r.label),
      ),
    ),
  );
  tooltip.hidden = false;
  const { width, height } = tooltip.getBoundingClientRect();
  let x = clientX + 14;
  let y = clientY + 14;
  if (x + width > window.innerWidth - 8) x = clientX - width - 14;
  if (y + height > window.innerHeight - 8) y = clientY - height - 14;
  tooltip.style.left = `${Math.max(8, x)}px`;
  tooltip.style.top = `${Math.max(8, y)}px`;
}

export function hideTooltip() {
  const tooltip = document.getElementById('tooltip');
  if (tooltip) tooltip.hidden = true;
}

function niceScale(min, max, count = 5) {
  if (min === max) {
    min -= 10;
    max += 10;
  }
  const raw = (max - min) / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm = raw / mag;
  const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v = lo; v <= hi + step / 2; v += step) ticks.push(Math.round(v * 1e6) / 1e6);
  return { lo, hi, ticks };
}

/**
 * @param {HTMLElement} container
 * @param {{ xs: number[], series: Array<{ name, color, dash?, cls?, points: Map<number, number>, ref?: boolean }>,
 *           xLabel: (x, long?) => string, digits?: number }} spec
 */
export function lineChart(container, spec) {
  container.replaceChildren();
  const { xs, series } = spec;
  if (!xs.length || !series.length) return;

  const W = Math.max(280, Math.round(container.clientWidth || 600));
  const H = Math.round(Math.min(340, Math.max(220, W * 0.42)));
  const narrow = W < 520;
  const m = { t: 12, r: narrow ? 12 : 84, b: 26, l: 40 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;

  const xMin = xs[0];
  const xMax = xs.at(-1);
  const all = series.flatMap((s) => [...s.points.values()]).filter(Number.isFinite);
  if (!all.length) return;
  const y = niceScale(Math.min(...all), Math.max(...all));
  const sx = (x) => m.l + (xMax === xMin ? pw / 2 : ((x - xMin) / (xMax - xMin)) * pw);
  const sy = (v) => m.t + ph - ((v - y.lo) / (y.hi - y.lo)) * ph;
  const pos = new Map(xs.map((x, i) => [x, i]));

  const root = svg('svg', {
    viewBox: `0 0 ${W} ${H}`,
    width: W,
    height: H,
    role: 'img',
    tabindex: 0,
    'aria-label': series.map((s) => s.name).join(', '),
  });

  // griglia e assi
  for (const v of y.ticks) {
    root.append(svg('line', { class: 'gridline', x1: m.l, x2: m.l + pw, y1: sy(v), y2: sy(v) }));
    root.append(svg('text', { x: m.l - 6, y: sy(v) + 4, 'text-anchor': 'end' }, fmt(v)));
  }
  root.append(svg('line', { class: 'baseline', x1: m.l, x2: m.l + pw, y1: m.t + ph, y2: m.t + ph }));
  const every = Math.max(1, Math.ceil(xs.length / Math.max(2, Math.floor(pw / 60))));
  xs.forEach((x, i) => {
    if (i % every !== 0 && i !== xs.length - 1) return;
    if (i !== xs.length - 1 && xs.length - 1 - i < every / 2) return;
    root.append(svg('text', { x: sx(x), y: H - 6, 'text-anchor': 'middle' }, spec.xLabel(x)));
  });

  // linee: si interrompono quando un giocatore salta dei puzzle
  const ordered = [...series].sort((a, b) => (b.ref ? 1 : 0) - (a.ref ? 1 : 0));
  for (const s of ordered) {
    const pts = [...s.points.entries()].filter(([, v]) => Number.isFinite(v)).sort((a, b) => a[0] - b[0]);
    const segments = [];
    let seg = [];
    for (const [x, v] of pts) {
      const prev = seg.at(-1);
      if (prev && pos.get(x) - pos.get(prev[0]) > 1) {
        segments.push(seg);
        seg = [];
      }
      seg.push([x, v]);
    }
    if (seg.length) segments.push(seg);
    const style = `stroke:${s.color}${s.dash ? `;stroke-dasharray:${s.dash}` : ''}`;
    for (const sg of segments) {
      if (sg.length === 1) {
        root.append(
          svg('circle', { class: 'dot', cx: sx(sg[0][0]), cy: sy(sg[0][1]), r: 4, style: `fill:${s.color}` }),
        );
      } else {
        const d = sg.map(([x, v], i) => `${i ? 'L' : 'M'}${sx(x).toFixed(1)},${sy(v).toFixed(1)}`).join('');
        root.append(svg('path', { class: `series${s.ref ? ' ref' : ''}`, d, style }));
      }
    }
    const lastPt = pts.at(-1);
    if (lastPt && !s.ref) {
      root.append(
        svg('circle', { class: 'dot', cx: sx(lastPt[0]), cy: sy(lastPt[1]), r: 4, style: `fill:${s.color}` }),
      );
    }
  }

  // etichette a fine linea, solo se non si sovrappongono (prima i giocatori, poi la media)
  if (!narrow) {
    const placed = [];
    for (const s of [...series].sort((a, b) => (a.ref ? 1 : 0) - (b.ref ? 1 : 0))) {
      const v = s.points.get(xMax);
      if (!Number.isFinite(v)) continue;
      const ly = sy(v);
      if (placed.some((p) => Math.abs(p - ly) < 14)) continue;
      placed.push(ly);
      const name = s.name.length > 11 ? `${s.name.slice(0, 10)}…` : s.name;
      root.append(svg('text', { class: 'end-label', x: m.l + pw + 8, y: ly + 4 }, name));
    }
  }

  // livello interattivo: mirino verticale + tooltip con tutti i valori
  const cross = svg('line', { class: 'crosshair', y1: m.t, y2: m.t + ph, visibility: 'hidden' });
  const marks = svg('g');
  root.append(cross, marks);
  const hit = svg('rect', { class: 'hit', x: m.l - 8, y: m.t, width: pw + 16, height: ph });
  root.append(hit);

  let current = -1;
  const showAt = (i, clientX, clientY) => {
    current = i;
    const x = xs[i];
    cross.setAttribute('x1', sx(x));
    cross.setAttribute('x2', sx(x));
    cross.setAttribute('visibility', 'visible');
    marks.replaceChildren();
    const rows = [];
    for (const s of series) {
      const v = s.points.get(x);
      if (!Number.isFinite(v)) continue;
      marks.append(svg('circle', { class: 'dot', cx: sx(x), cy: sy(v), r: 4, style: `fill:${s.color}` }));
      rows.push({
        value: fmt(v, spec.digits ?? 0),
        label: s.name,
        color: s.color,
        cls: s.cls,
        v,
        ref: s.ref,
      });
    }
    rows.sort((a, b) => (a.ref ? 1 : 0) - (b.ref ? 1 : 0) || b.v - a.v);
    showTooltip(spec.xLabel(x, true), rows, clientX, clientY);
  };
  const hide = () => {
    current = -1;
    cross.setAttribute('visibility', 'hidden');
    marks.replaceChildren();
    hideTooltip();
  };
  const nearest = (clientX) => {
    const rect = root.getBoundingClientRect();
    const px = ((clientX - rect.left) / rect.width) * W;
    let best = 0;
    for (let i = 1; i < xs.length; i++) if (Math.abs(sx(xs[i]) - px) < Math.abs(sx(xs[best]) - px)) best = i;
    return best;
  };
  hit.addEventListener('pointermove', (e) => showAt(nearest(e.clientX), e.clientX, e.clientY));
  hit.addEventListener('pointerdown', (e) => showAt(nearest(e.clientX), e.clientX, e.clientY));
  hit.addEventListener('pointerleave', hide);
  root.addEventListener('blur', hide);
  root.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const i =
      current < 0
        ? xs.length - 1
        : Math.min(xs.length - 1, Math.max(0, current + (e.key === 'ArrowLeft' ? -1 : 1)));
    const rect = root.getBoundingClientRect();
    showAt(i, rect.left + (sx(xs[i]) / W) * rect.width, rect.top + m.t);
  });

  container.append(root);
}

// ---------------------------------------------------------------------------
// Dati inventati per ?demo (per vedere il sito prima che arrivino risultati veri)

function demoData(id) {
  let seed = { krillion: 7, songless: 11, magnitudle: 13 }[id];
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const gauss = () => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());
  // nome, bravura (0–1), primo giorno
  const people = [
    ['Nils', 0.62, 1],
    ['Daniel', 0.58, 1],
    ['Nic', 0.5, 1],
    ['Flu', 0.55, 3],
    ['Jonas', 0.47, 1],
    ['Anna', 0.68, 6],
    ['Fuldup', 0.45, 2],
    ['Elia', 0.4, 10],
    ['Julian', 0.52, 14],
    ['Max', 0.43, 1],
    ['Malena', 0.5, 4],
    ['rafael', 0.48, 8],
  ];
  const DAYS = 40;
  const start = Date.UTC(2026, 8, 25);
  const genres = ['Top Hits', 'Pop', 'Rock', 'Hip Hop', 'EDM'];
  const fish = ['🦑', '🐟', '🏮', '🫧', '⬛'];
  const rows = [];
  for (let d = 0; d < DAYS; d++) {
    const date = new Date(start + d * 864e5).toISOString().slice(0, 10);
    const difficulty = gauss() * 0.12;
    for (const [player, skill, from] of people) {
      if (d + 1 < from || rand() < 0.13) continue;
      const ts = start / 1000 + d * 86400 + 6 * 3600 + Math.floor(rand() * 50000);
      const level = skill - difficulty + gauss() * 0.12;
      if (id === 'krillion') {
        const score = Math.max(60, Math.round((140 + level * 330 + gauss() * 30) / 5) * 5);
        const grid = Array.from({ length: 7 }, () => fish[Math.floor(rand() * fish.length)]).join('');
        rows.push({ puzzle: 72 + d, player, score, date, ts, grid });
      } else if (id === 'songless') {
        const lines = genres.map((genre) => {
          const found = rand() < 0.15 + level * 0.8;
          const guess = found ? Math.max(1, Math.min(5, 1 + Math.floor(rand() * 5 * (1.15 - level)))) : 0;
          const squares = Array.from({ length: 5 }, (_, i) =>
            !guess ? (rand() < 0.3 ? '🟥' : '⬜') : i + 1 < guess ? '⬜' : i + 1 === guess ? '🟩' : '⬛',
          ).join('');
          return { line: `${squares} [${genre}]`, points: guess ? SONGLESS_POINTS[guess - 1] : 0 };
        });
        const score = lines.reduce((s, l) => s + l.points, 0);
        rows.push({ puzzle: 425 + d, player, score, date, ts, grid: lines.map((l) => l.line).join('\n') });
      } else {
        const rounds = Array.from({ length: 5 }, () =>
          Math.max(0, Math.min(100, Math.round(level * 100 + gauss() * 28))),
        );
        const grid = rounds
          .map((p) => `${'🟥'.repeat(Math.round(p / 20))}${'⬜'.repeat(5 - Math.round(p / 20))} ${p}`)
          .join('\n');
        rows.push({ puzzle: date, player, score: rounds.reduce((a, b) => a + b, 0), date, ts, grid });
      }
    }
  }
  if (id !== 'krillion') return { current: rows, legacy: [] };
  // Krillion: i primi 25 giorni sono "il vecchio gruppo"
  const seasonStart = 72 + 25;
  return {
    legacy: rows.filter((r) => r.puzzle < seasonStart),
    current: rows.filter((r) => r.puzzle >= seasonStart),
    seasonStart,
  };
}
