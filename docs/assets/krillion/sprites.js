// Krillion – gli sprite in pixel art del fondale marino.
// Ogni sprite è disegnato a caratteri: una lettera = un pixel del colore indicato in PALETTE
// (o nei colori propri dello sprite), il punto = trasparente. Diventano piccoli SVG.

const PALETTE = {
  k: '#06111f', // contorno
  w: '#f2fbff', // bianco
  f: 'rgba(155, 231, 245, 0.22)', // interno delle bolle
  c: '#9be7f5', // ciano chiaro
  C: '#3fbfd8', // ciano
  b: '#4fb3ea', // blu
  B: '#2b75b0', // blu scuro
  p: '#ff4f7b', // rosa krill
  P: '#c4285a', // rosa scuro
  q: '#ffa3ba', // rosa chiaro
  v: '#9277ff', // viola
  V: '#5b40c4', // viola scuro
  l: '#c3b5ff', // lilla
  y: '#ffd84a', // giallo
  Y: '#f59e0b', // arancio
  o: '#ff7a45', // arancio-rosso
  g: '#4a6684', // ardesia
  G: '#1d3148', // ardesia scura
  e: '#06111f', // occhio
  t: '#eaf6ff', // denti
};

export const SPRITES = {
  // --- risultati di Krillion (un simbolo per risposta) --------------------------------------
  // ⬛ nessuna risposta: 0 punti
  p0: [
    '..........',
    '..........',
    '..gggggg..',
    '..gGGGGg..',
    '..gGGGGg..',
    '..gGGGGg..',
    '..gGGGGg..',
    '..gggggg..',
    '..........',
    '..........',
  ],
  // 🫧 plancton: 10 punti
  p10: [
    '......cc..',
    '.....cffc.',
    '.....cffc.',
    '......cc..',
    '.cccc.....',
    'cwfffc....',
    'cwfffc..c.',
    'cffffc....',
    'cffffc....',
    '.cccc.....',
  ],
  // 🐟 pesce del branco: 30 punti
  p30: [
    '..........',
    '..........',
    '...cccc...',
    '.bbbbbbb.b',
    'bwebbbbbbb',
    'bbbbbbbbbb',
    '.BBBBBBB.B',
    '...BBBB...',
    '..........',
    '..........',
  ],
  // 🦑 calamaro: 60 punti
  p60: [
    '....pp....',
    '...pppp...',
    '..pqpppp..',
    '..pqpppp..',
    '..pppppp..',
    '..peppep..',
    '..PPPPPP..',
    '.p.p..p.p.',
    '.p.P..P.p.',
    'p..p..p..p',
  ],
  // 🏮 rana pescatrice con la lanterna: 85 punti
  p85: [
    '..........',
    '..lll.....',
    '.l...l....',
    'yy...l....',
    'yy.vvvvv.V',
    '..vwvvvvVV',
    '.vvvvvvvV.',
    '.tvtvvvvVV',
    '..vvvvvv.V',
    '...VVVV...',
  ],
  // 🌟 una su un krillione: 100 punti
  p100: [
    '....y.....',
    '....y.....',
    '...yyy....',
    'yyyywyyyy.',
    '.yyyyyyy..',
    '..yyyyY...',
    '..yyyyY...',
    '.yyY.yyY..',
    '.yY...yY..',
    '..........',
  ],

  // --- logo ---------------------------------------------------------------------------------
  shrimp: [
    '.qq.............',
    '...qq...........',
    '.....q..ppppp...',
    '......ppppppPp..',
    '.....pwpppppPPp.',
    '.....ppppppppPPp',
    '......pp.ppppPPp',
    '.........pppPPPp',
    '..........ppPPPp',
    '..........pPPPp.',
    '.........ppPPp..',
    '........pPPPp...',
    '......ppPPp.....',
    '...qqqppp.......',
    '..qqqq..........',
    '...qq...........',
  ],

  // --- cielo e superficie -------------------------------------------------------------------
  boat: {
    colors: { h: '#0a111c', H: '#111b2a', m: '#0a111c', r: '#ff3355', n: '#ffcf6b' },
    art: [
      '...............rrr............',
      '...............rrrrr..........',
      '...............rrr............',
      '...............m..............',
      '...............m......m.......',
      '..........HHHH.m......m.......',
      '..........HnnH.m.....mm.......',
      '..........HHHH.m....m.m.......',
      '.........HHHHHHHH..m..m.......',
      'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
      '.hhhhhhhhhhhhhhhhhhhhhhhhhhhh.',
      '..hhhhhhhhhhhhhhhhhhhhhhhhhh..',
      '...hhhhhhhhhhhhhhhhhhhhhhhh...',
    ],
  },
  cloudA: {
    colors: { a: '#3a475b', b: '#2d384a' },
    art: [
      '..........aaaaa...........',
      '.......aaaaaaaaaa.........',
      '....aaaaaaaaaaaaaaaa......',
      '..aaaaaaaaaaaaaaaaaaaaaa..',
      'aaaaaaaaaaaaaaaaaaaaaaaaaa',
      '.bbbbbbbbbbbbbbbbbbbbbbbb.',
    ],
  },
  cloudB: {
    colors: { a: '#344053', b: '#283244' },
    // prettier-ignore
    art: [
      '.....aaaa.......',
      '...aaaaaaaa.....',
      '.aaaaaaaaaaaaa..',
      'aaaaaaaaaaaaaaaa',
      '.bbbbbbbbbbbbbb.',
    ],
  },
  wave: {
    colors: { h: '#5d8db3', w: '#1d4466' },
    // prettier-ignore
    art: [
      '......hh........',
      '....hhwwhh......',
      'hhhhwwwwwwhhhhhh',
      'wwwwwwwwwwwwwwww',
    ],
  },

  // --- acqua --------------------------------------------------------------------------------
  fishS: {
    colors: { s: '#0b1f33' },
    // prettier-ignore
    art: [
      '..sss..s',
      '.sssssss',
      'sssssss.',
      '.sssssss',
      '..sss..s',
    ],
  },
  fishM: {
    colors: { s: '#0a1d31' },
    art: [
      '....sssss.....',
      '..sssssssss..s',
      '.sssssssssss.s',
      'sssssssssssss.',
      '.sssssssssssss',
      '..sssssssss..s',
      '....sssss.....',
    ],
  },
  school: {
    colors: { s: '#2b6e93', S: '#1f5475' },
    art: [
      '.............ss..s......',
      '............sSSSss......',
      '.....ss..s...ss..s......',
      '....sSSSss..............',
      '.....ss..s.......ss..s..',
      '................sSSSss..',
      '..ss..s..........ss..s..',
      '.sSSSss.................',
      '..ss..s.....ss..s.......',
      '...........sSSSss.......',
      '............ss..s.......',
    ],
  },
  krill: {
    colors: { p: 'rgba(255, 79, 123, 0.75)', q: 'rgba(255, 163, 186, 0.6)' },
    art: [
      '.........p..........',
      '...q.........pp.....',
      '.......pp.......q...',
      '..pp.......q........',
      '.........p....pp....',
      '....q..pp...........',
      '.pp.........p...q...',
      '......q...pp........',
      '...pp...........pp..',
      '..........q..p......',
    ],
  },
  jelly: {
    colors: { q: 'rgba(255, 163, 186, 0.75)', p: 'rgba(255, 79, 123, 0.55)', w: 'rgba(255, 240, 245, 0.9)' },
    art: [
      '...qqq...',
      '..qqqqq..',
      '.qqwqqqq.',
      '.qqqqqqq.',
      'qqqqqqqqq',
      'p.p.p.p.p',
      '.p.p.p.p.',
      'p..p.p..p',
      '.p..p..p.',
      'p..p.p..p',
      '..p...p..',
      '.p..p..p.',
      '...p.p...',
    ],
  },
  angler: {
    colors: { s: '#0d1726', S: '#152238', y: '#ffe680', l: '#24344d', t: '#cfd8e6' },
    art: [
      '................yy..',
      '...............yyyy.',
      '................yy..',
      '...........llll.l...',
      '.......sssss...l....',
      '....sssssssss.l.....',
      '..ssssssssssss......',
      '.sssssssssssy.s.....',
      'sSssssssssssssss....',
      'sSSssssssssssttt....',
      '.sSSsssssssst.t.t...',
      '..sSSSsssssssss.....',
      '....sSSSsssss.......',
      '.......sss..........',
    ],
  },

  // --- fondale ------------------------------------------------------------------------------
  sand: {
    colors: { s: '#3a4a5e', S: '#26364a', d: '#44566c', D: '#1d2b3c' },
    art: [
      '..........ssss..................',
      '......ssssSSSSssss..............',
      '..ssssSSSSSSSSSSSSsss.......ssss',
      'ssSSSSSSSSSSSSSSSSSSSsssssssSSSS',
      'SSSSSSSdSSSSSSSSSSSSSSSSSSSSSSSS',
      'SSSSSSSSSSSSSSSdSSSSSSSSSdSSSSSS',
      'SSSDSSSSSSSSSSSSSSSSSSSSSSSSSDSS',
      'SSSSSSSSSSSDSSSSSSSdSSSSSSSSSSSS',
      'SSSSSdSSSSSSSSSSSSSSSSSSSDSSSSSS',
      'SSSSSSSSSSSSSSSSSDSSSSSSSSSSSSSS',
    ],
  },
  rock: {
    colors: { r: '#2f4157', R: '#1f2d3f', h: '#3f5571' },
    art: [
      '.....hhhh.....',
      '...hhrrrrhh...',
      '..hrrrrrrrrr..',
      '.hrrrrrrrrrrR.',
      'hrrrrrrrrrrRRR',
      'rrrrrrrrrRRRRR',
      'RrrrrrrRRRRRRR',
      'RRRRRRRRRRRRRR',
    ],
  },
  pebble: {
    colors: { r: '#2a3a4e', h: '#3a4f68' },
    // prettier-ignore
    art: [
      '..hhh....',
      '.hrrrrh..',
      'hrrrrrrr.',
      'rrrrrrrrr',
      '.rrrrrrr.',
    ],
  },
  coral: {
    colors: { p: '#e2466f', q: '#ff7c9c', P: '#9e2048' },
    art: [
      '.q......q...',
      '.p..q...p.q.',
      '.p..p..pp.p.',
      '.pp.p..p..p.',
      '..p.pp.p.pp.',
      '..pp.p.ppp..',
      '...p.ppp....',
      '...pppp.....',
      '....pP......',
      '....PP......',
      '...PPPP.....',
    ],
  },
  anemone: {
    colors: { o: '#b48cff', O: '#7a52d6', y: '#e3d1ff' },
    art: [
      '.y...y..y...y.',
      '..o..o..o..o..',
      '.o...o..o...o.',
      '..o..o..o..o..',
      '...o.o..o.o...',
      '....oooooo....',
      '....oOoOoO....',
      '....oooooo....',
      '...OOOOOOOO...',
    ],
  },
  kelp: {
    colors: { l: '#2f9a78', L: '#1d6e57', h: '#4cc79a' },
    art: [
      '...h..',
      '..hl..',
      '..lL..',
      '.lL...',
      '.lL.h.',
      '..lLl.',
      '..lL..',
      '..lL..',
      '.hlL..',
      '.lL...',
      '.lL...',
      '..lL..',
      '..lLh.',
      '..lLl.',
      '..lL..',
      '.lL...',
      '.lL...',
      'hlL...',
      '.lL...',
      '..lL..',
      '..lL..',
      '..lL..',
      '..lL..',
      '..LL..',
    ],
  },
  starfish: {
    colors: { o: '#ff9d47', O: '#d96a1f', y: '#ffd08a' },
    art: [
      '....o....',
      '....o....',
      '...ooo...',
      'oooyooooo',
      '.ooooooO.',
      '..oooOO..',
      '..ooOOO..',
      '.ooO.OOO.',
      '.oO...OO.',
    ],
  },
  shell: {
    colors: { s: '#f2c4b3', S: '#c99482', d: '#a8705f' },
    // prettier-ignore
    art: [
      '...sss...',
      '..sSsSs..',
      '.sSsSsSs.',
      'sSsSsSsSs',
      'sSsSsSsSs',
      '.sSsSsSs.',
      '...ddd...',
    ],
  },
  crab: {
    colors: { o: '#ff6a4a', O: '#c2412a', w: '#f2fbff', e: '#06111f' },
    art: [
      '.o..we..we..o.',
      'oo...o..o...oo',
      '.o.oooooooo.o.',
      '..oooooooooo..',
      '..oOoooooOoo..',
      '.o.oOOOOOOo.o.',
      'o..o......o..o',
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
