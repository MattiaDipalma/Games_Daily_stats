// Noillirk – gli sprite in pixel art del bosco (disegni originali, nello spirito di noillirk.com).
// Ogni sprite è disegnato a caratteri: una lettera = un pixel del colore indicato in PALETTE
// (o nei colori propri dello sprite), il punto = trasparente. Diventano piccoli SVG.

const PALETTE = {
  k: '#111111', // contorno (l'inchiostro dei pulsanti di noillirk.com)
  w: '#fffbe8', // bianco caldo
  c: '#f4ebd7', // crema
  C: '#c9bfa6', // crema scuro
  y: '#ffc83d', // giallo
  Y: '#e0a21a', // giallo scuro
  h: '#fff1a8', // giallo chiaro
  o: '#ff7a59', // arancio
  O: '#d9503a', // arancio scuro
  v: '#9c7bff', // viola
  V: '#6e4fd6', // viola scuro
  r: '#ff5468', // rosso
  R: '#c7303f', // rosso scuro
  t: '#5fe3c0', // turchese
  T: '#2fa486', // turchese scuro
  b: '#3fb6e0', // blu
  B: '#1f86b0', // blu scuro
  l: '#8ee07f', // foglia chiara
  g: '#3fa65a', // foglia
  G: '#23794a', // foglia scura
  d: '#16503a', // sottobosco
  n: '#5a3f2b', // terra, corteccia
  N: '#3b2a1e', // terra scura
  e: '#7a5a3c', // terra chiara
  p: '#ff8fc7', // rosa
  P: '#e0559b', // rosa scuro
  s: '#f4ebd7', // filo dei palloncini
};

// --- i cerchi delle risposte: o contorno, h riflesso, f colore, s ombra --------------------------
const CIRCLE = ['..ooo..', '.ohhfo.', 'ohfffso', 'offffso', 'offfsso', '.ossso.', '..ooo..'];
const circle = (o, h, f, s) => ({ colors: { o, h, f, s }, art: CIRCLE });

// --- un palloncino sciolto: c colore, C ombra, w riflesso ----------------------------------------
const BALLOON = ['.ccc.', 'cwccc', 'cwccc', 'ccccC', '.cCC.', '..C..', '..s..', '.s...', '..s..', '...s.'];
const balloon = (c, C) => ({ colors: { c, C }, art: BALLOON });

// --- corteccia di un tronco (si ripete in verticale): n, N, e luce, m/M muschio ------------------
const TRUNK = [
  'NnnenNnnnnNN',
  'NnnenNnnmnNN',
  'NnnenNnmmnNN',
  'NnneNnnmMnNN',
  'NnneNnnnmnNN',
  'NnnenNnnnnNN',
  'NmnenNnnnNnN',
  'MmmenNnnnNnN',
  'MmnenNnnnNnN',
  'NmnenNnenNnN',
  'NnnenNnenNnN',
  'NnneNnnenNnN',
  'NnneNnnennNN',
  'NnnenNnnnnNN',
  'NnnenNnnnnNN',
  'NnnenNnnnnNN',
];

export const SPRITES = {
  // --- risultati di Noillirk (un cerchio per domanda) ----------------------------------------
  nk4: circle('#111111', '#fff1a8', '#ffc83d', '#e0a21a'), // 🟡 risposta n. 1
  nk3: circle('#111111', '#ffc2ad', '#ff7a59', '#d9503a'), // 🟠 2° o 3° posto
  nk2: circle('#111111', '#d6c8ff', '#9c7bff', '#6e4fd6'), // 🟣 top 5
  nk1: circle('#111111', '#bdeeff', '#3fb6e0', '#1f86b0'), // 🔵 top 10
  nk0: circle('#111111', '#ffffff', '#f4ebd7', '#c9bfa6'), // ⚪ fuori dal tabellone
  nkp: circle('#6d8183', '#040909', '#0a1415', '#1d3234'), // ⚫ saltata: un buco vuoto

  // --- la mascotte: il krill che sale appeso a tre palloncini --------------------------------
  krill: {
    colors: { q: '#ff9fb0' },
    art: [
      '......rrr........',
      '.....rwrrr.......',
      '.....rwrrr..ttt..',
      '.vvv.rrrrR.twttt.',
      'vwvvv.rRR..twttt.',
      'vwvvv..R...ttttT.',
      'vvvvV..s....tTT..',
      '.vVV...s.....T...',
      '..V....s.....s...',
      '...s...s....s....',
      '....s..s...s.....',
      '.....s.s..s......',
      '......ssss.......',
      '..q...oyyo.......',
      '...q.yyyyyyo.....',
      '....ykyyyyyoo....',
      '...yyyyyyyyyoO...',
      '....o.o.ooyyoO...',
      '.........oyyoO...',
      '........oohyoO...',
      '......ooyyoOO....',
      '....ooyyoOO......',
      '...yy.OOO........',
      '..yyy............',
      '...y.............',
    ],
  },
  balloonV: balloon('#9c7bff', '#6e4fd6'),
  balloonR: balloon('#ff5468', '#c7303f'),
  balloonT: balloon('#5fe3c0', '#2fa486'),

  // --- chioma e cespugli dell'intestazione (si ripetono in orizzontale) ----------------------
  leaves: {
    colors: { d: '#0d2c24', G: '#174a39', g: '#23794a', l: '#3fa65a' },
    art: [
      'dddddddddddddddddddddddddddddddd',
      'dGGdddGGGdddddGGdddddGGGddddGGdd',
      'GGgGdGGgGGddGGgGGdddGGgGGddGGgGd',
      '.GgG.GggGGd.GglgG.d.GgggG..GgG..',
      '.Gg..GglgG...GggG...GglgG...gG..',
      '..g...GgG....GgG.....GgG....g...',
      '......Gg......G.......Gg........',
      '......g...............g.........',
    ],
  },
  bushes: {
    colors: { z: '#12332c' },
    art: [
      '.........ll...............l.....',
      '.......lglgl.........l..lglg....',
      '..l...lgggggl.......lgllgggggl..',
      '.lgl.lgggGgggl..l..lgggggGggggl.',
      'lgggllggGGGgggllgllgggGGGGgggggl',
      'ggGgggggGGGGggggggggggGGGGGgggGg',
      'gGGGggGGGddGGGgggGGGgGGGddGGGGGG',
      'GGdGGGGGddddGGGGGGGGGGGddddGGdGG',
      'GddddGGdddddddGdddGGddddddddddGd',
      'dddddddddddddddddddddddddddddddd',
      'zzzdddzzzzzdddzzzzzzddddzzzzdddz',
      'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
    ],
  },

  // --- tronchi: vicini (bruni e muschiosi) e lontani (nella nebbia) ---------------------------
  trunk: { colors: { m: '#3f8f55', M: '#2c6b40' }, art: TRUNK },
  trunkFar: {
    colors: { n: '#24524a', N: '#1c443d', e: '#2e6358', m: '#2b6b55', M: '#24594a' },
    art: TRUNK,
  },

  // --- animaletti -----------------------------------------------------------------------------
  birdA: {
    art: [
      '..Y........',
      '..YY.......',
      '...YY..yy..',
      'Y..yyyyykyo',
      '.yyyyyyyyy.',
      '...yyyyy...',
      '...........',
    ],
  },
  birdB: {
    art: [
      '...........',
      '...........',
      '.......yy..',
      'Y..yyyyykyo',
      '.yyyyyYyyy.',
      '...yYYYy...',
      '....YY.....',
    ],
  },
  butterfly: {
    colors: { K: '#2a1a12' },
    // prettier-ignore
    art: [
      'yy...yy',
      'yoy.yoy',
      'yyyKyyy',
      '.oyKyo.',
      '.oo.oo.',
    ],
  },
  butterflyT: {
    colors: { y: '#5fe3c0', o: '#2fa486', K: '#10302a' },
    // prettier-ignore
    art: [
      'yy...yy',
      'yoy.yoy',
      'yyyKyyy',
      '.oyKyo.',
      '.oo.oo.',
    ],
  },

  // --- sottobosco -----------------------------------------------------------------------------
  ground: {
    colors: { z: '#1c140e' },
    art: [
      '...l.......l..........l......l..',
      '..lgl.l...lgl...l....lgl..l.lgl.',
      'lllgllglllgggllllglllgggllgllgll',
      'gggggggggggggggggggggggggggggggg',
      'GgGGgGGGgGGgGGGGgGGgGGGgGGGGgGGg',
      'GGGnGGGGGnGGGGGGnGGGGGnGGGGnGGGG',
      'nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
      'nnnennnnnnnnNnnnnnnnennnnnnnNnnn',
      'nnnnnnnNnnnnnnnnnnnnnnnnnnnnnnnn',
      'NnnnnnnnnnnennnnnNnnnnnnnnennnnN',
      'NNnnNnnnnnnnnnnnnnnnnnNnnnnnnnNN',
      'NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN',
      'NNzNNNNNzNNNNNNNNNzNNNNNNNNzNNNN',
      'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
    ],
  },
  path: {
    colors: { a: '#b08d5f', A: '#8a6a45', s: '#d9c19a' },
    art: [
      '......aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa........',
      '...aaaaAaaaaaaaaaasaaaaaaaaaaAaaaaaaaaaaaaaa....',
      'aaaaaaaaaAaaaasaaaaaaaaaaaaaaaaaaAaaaaaasaaaaaaa',
      '.aaaaaaaaaaaaaaaaaaAaaaaaaaaaaasaaaaaaaaaaaaaa..',
      '....AAAAaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaAAA....',
    ],
  },
  pond: {
    colors: { R: '#1d5c3c', w: '#bdeeff' },
    art: [
      '......RRRRRRRRRRRRRRRRRRRRRRRR......',
      '...RRRbbbbbbbbbbbbbbbbbbbbbbbbRRR...',
      '.RRbbbbwwwbbbbbbgggbbbbbbbbbbbbbbRR.',
      'RbbbbbbbbbbbbbbgggGgbbbbwwwwbbbbbbbR',
      'RbbBbbbggpgbbbbbgGgbbbbbbbbbbbBbbbbR',
      '.RbBBbbgGggbbbbbbbbbbbwwbbbbbBBbbbR.',
      '..RRBBBBbbbbbbbbbbbbbbbbbbBBBBBRR...',
      '.....RRRRRRRRRRRRRRRRRRRRRRRRR......',
    ],
  },
  fern: {
    art: [
      '.....l.l.....',
      '..l..g.g..l..',
      '.lg..g.g..gl.',
      'lg.l.g.g.l.gl',
      'g.lg.g.g.gl.g',
      'g.g.lg.gl.g.g',
      '.g.g.g.g.g.g.',
      '.g.gg.g.gg.g.',
      '..g.gG.Gg.g..',
      '..gg.GGG.gg..',
      '....gGGGg....',
      '......G......',
    ],
  },
  mushroom: {
    colors: { r: '#e8433f', R: '#a82a2a' },
    art: [
      '...rrr...',
      '.rrwrrrr.',
      'rrrrrrwrr',
      'rwwrrrrrR',
      'rrrrrwrRR',
      '.RRRRRRR.',
      '...ccC...',
      '...ccC...',
      '..cccCC..',
    ],
  },
  mushroomS: {
    colors: { r: '#e8433f', R: '#a82a2a' },
    // prettier-ignore
    art: [
      '..rrr..',
      '.rwrrr.',
      'rrrrwrr',
      'rwrrrrR',
      '.RRRRR.',
      '..ccC..',
      '..ccC..',
    ],
  },
  flower: {
    // prettier-ignore
    art: [
      '.p.p.',
      'ppypp',
      '.pPp.',
      '..g..',
      'g.g..',
      'gGg.g',
      '..gGg',
      '..G..',
    ],
  },
  flowerY: {
    colors: { p: '#fff1a8', P: '#ffc83d', y: '#ff7a59' },
    // prettier-ignore
    art: [
      '.p.p.',
      'ppypp',
      '.pPp.',
      '..g..',
      'g.g..',
      'gGg.g',
      '..gGg',
      '..G..',
    ],
  },
  bush: {
    art: [
      '.......ll.....l.......',
      '.....llgglll.lgl......',
      '...llggggggllgggl.l...',
      '..lgggggGggggggggllgl.',
      '.lgggGgGGGgggGggggggl.',
      'lgggGGGGGGGgGGGGgGgggl',
      'ggGGGGdGGGGGGGGGGGGGGg',
      'gGGGddddGGGdGGGddGGGGG',
      'GGdddddddddddddddddGGG',
      'Gddddddddddddddddddddd',
    ],
  },
  stone: {
    colors: { a: '#8a9a94', A: '#5d6c67', w: '#b9c6c0' },
    // prettier-ignore
    art: [
      '..www...',
      '.waaaaa.',
      'waaaaaAA',
      'AAAAAAAA',
    ],
  },
};

/** Larghezza e altezza in pixel dello sprite. */
export function spriteSize(name) {
  const art = rows(name);
  return { w: Math.max(...art.map((r) => r.length)), h: art.length };
}

function rows(name) {
  const s = SPRITES[name];
  return Array.isArray(s) ? s : s.art;
}

/** Lo sprite come SVG: un percorso per colore, pixel netti anche ingranditi. flip = specchiato. */
export function spriteSvg(name, flip = false) {
  const s = SPRITES[name];
  const colors = { ...PALETTE, ...(Array.isArray(s) ? {} : s.colors) };
  const { w, h } = spriteSize(name);
  const paths = new Map();
  rows(name).forEach((line, y) => {
    const row = flip ? [...line.padEnd(w, '.')].reverse().join('') : line;
    for (let x = 0; x < row.length; ) {
      const ch = row[x];
      let run = 1;
      while (row[x + run] === ch) run++;
      if (ch !== '.' && colors[ch]) paths.set(ch, `${paths.get(ch) ?? ''}M${x} ${y}h${run}v1h-${run}z`);
      x += run;
    }
  });
  const body = [...paths].map(([ch, d]) => `<path fill="${colors[ch]}" d="${d}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" shape-rendering="crispEdges">${body}</svg>`;
}

/** Lo sprite pronto per CSS: url("data:image/svg+xml,…") */
export function spriteUrl(name, flip = false) {
  return `url("data:image/svg+xml,${encodeURIComponent(spriteSvg(name, flip))}")`;
}
