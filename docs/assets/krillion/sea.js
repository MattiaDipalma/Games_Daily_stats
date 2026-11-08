// Krillion – il fondale marino (ispirato a krillion.io). Solo decorazione: cielo con le nuvole e la
// barca, acqua sempre più scura scendendo, raggi di luce, pesci, meduse, bolle e il fondale in fondo
// alla pagina. Le statistiche restano quelle di game.js; qui si aggiungono solo elementi aria-hidden.
// Con "riduci movimento" attivo nel sistema le animazioni si fermano (vedi sea.css).

import { fmt, ui } from '../core.js?v=3';
import { spriteSize, spriteUrl } from './sprites.js?v=2';

const root = document.documentElement;
const urls = new Map();
const url = (name, flip = false) => {
  const key = `${name}${flip ? '|flip' : ''}`;
  if (!urls.has(key)) urls.set(key, spriteUrl(name, flip));
  return urls.get(key);
};

// Gli sprite che usa il CSS: i simboli dei risultati, il logo, la barca e le onde.
for (const name of ['p0', 'p10', 'p30', 'p60', 'p85', 'p100', 'shrimp', 'boat', 'wave', 'sand']) {
  root.style.setProperty(`--spr-${name}`, url(name));
}
root.classList.add('sea-ready');

/** Uno sprite ingrandito `scale` volte; `vars` diventano variabili CSS (--x, --dur, …). */
function sprite(name, scale, cls, vars = {}, flip = false) {
  const { w, h } = spriteSize(name);
  const node = document.createElement('i');
  node.className = `spr ${cls}`;
  node.style.width = `${w * scale}px`;
  node.style.height = `${h * scale}px`;
  node.style.backgroundImage = url(name, flip);
  for (const [k, v] of Object.entries(vars)) node.style.setProperty(`--${k}`, v);
  return node;
}

function div(cls, vars = {}) {
  const node = document.createElement('div');
  node.className = cls;
  for (const [k, v] of Object.entries(vars)) node.style.setProperty(`--${k}`, v);
  return node;
}

// ---------------------------------------------------------------------------
// Cielo: nuvole che passano (la barca e le onde sono nel CSS dell'intestazione)

const header = document.querySelector('header.top');
if (header) {
  const sky = div('sky');
  sky.setAttribute('aria-hidden', 'true');
  // [sprite, scala, altezza, durata del passaggio (s), punto di partenza (0–1)]
  for (const [name, scale, top, dur, at] of [
    ['cloudA', 6, '10%', 170, 0.15],
    ['cloudB', 5, '38%', 130, 0.55],
    ['cloudA', 4, '58%', 210, 0.7],
    ['cloudB', 4, '4%', 150, 0.8],
  ]) {
    sky.append(
      sprite(name, scale, 'cloud', {
        top,
        dur: `${dur}s`,
        delay: `${-dur * at}s`,
        x: `${Math.round((1 - at) * 100)}vw`,
      }),
    );
  }
  header.prepend(sky);
}

// ---------------------------------------------------------------------------
// Acqua: dalla superficie (sotto l'intestazione) fino al fondale

const sea = div('sea');
sea.setAttribute('aria-hidden', 'true');

// raggi di luce dalla superficie
const rays = div('rays');
for (const [x, w, rot, dur, delay] of [
  ['6%', '70px', '14deg', '11s', '-2s'],
  ['21%', '130px', '18deg', '14s', '-7s'],
  ['43%', '90px', '12deg', '9s', '-4s'],
  ['64%', '150px', '17deg', '13s', '-10s'],
  ['85%', '80px', '15deg', '10s', '-1s'],
]) {
  rays.append(div('ray', { x, w, rot, dur, delay }));
}
sea.append(rays);

// pesci e altri abitanti: [sprite, scala, profondità (% della pagina), direzione, durata, posizione iniziale]
// Più si scende, meno luce: in alto i branchi colorati, in mezzo sagome e meduse, in fondo la rana pescatrice.
const swimmers = [
  ['school', 2, 4, 'left', 70, 0.2],
  ['fishS', 3, 9, 'right', 46, 0.65],
  ['krill', 2, 14, 'left', 120, 0.5],
  ['fishM', 3, 19, 'left', 64, 0.1],
  ['fishS', 2, 25, 'left', 38, 0.8],
  ['school', 2, 31, 'right', 85, 0.35, 'opt'],
  ['fishS', 3, 38, 'left', 52, 0.4],
  ['krill', 2, 44, 'right', 140, 0.15, 'opt'],
  ['fishM', 4, 50, 'right', 80, 0.75],
  ['fishS', 2, 57, 'left', 44, 0.25, 'opt'],
  ['fishM', 3, 64, 'left', 72, 0.55],
  ['fishS', 3, 71, 'right', 50, 0.9, 'opt'],
  ['fishM', 4, 78, 'left', 96, 0.3],
];
for (const [name, scale, top, dir, dur, at, extra] of swimmers) {
  sea.append(
    sprite(
      name,
      scale,
      `swim ${dir}${extra ? ` ${extra}` : ''}`,
      {
        top: `${top}%`,
        dur: `${dur}s`,
        delay: `${(-dur * at).toFixed(1)}s`,
        x: `${Math.round((dir === 'left' ? 1 - at : at) * 100)}vw`,
      },
      dir === 'right', // gli sprite guardano a sinistra
    ),
  );
}

// meduse che salgono e scendono piano
for (const [left, top, scale, dur, delay, extra] of [
  ['78%', '22%', 3, '14s', '-3s'],
  ['12%', '47%', 2, '17s', '-9s', 'opt'],
  ['88%', '61%', 3, '19s', '-12s'],
]) {
  sea.append(sprite('jelly', scale, `jelly${extra ? ` ${extra}` : ''}`, { left, top, dur, delay }));
}

// bolle in mezzo all'acqua
for (const [left, top, size, dur, delay, extra] of [
  ['9%', '30%', 6, 11, -2],
  ['10%', '30%', 4, 11, -6],
  ['94%', '45%', 6, 13, -5, 'opt'],
  ['93%', '45%', 4, 13, -10, 'opt'],
  ['30%', '68%', 4, 12, -7],
  ['72%', '84%', 6, 10, -1],
]) {
  sea.append(bubble(left, top, size, dur, delay, extra));
}

function bubble(left, top, size, dur, delay, extra) {
  return div(`bubble${extra ? ` ${extra}` : ''}`, {
    left,
    top,
    size: `${size}px`,
    dur: `${dur}s`,
    delay: `${delay}s`,
  });
}

// ---------------------------------------------------------------------------
// Fondale: sabbia, rocce, alghe che ondeggiano, coralli, una stella marina e un granchio

const floor = div('floor');
floor.append(div('floor-glow'), div('sand'));

const things = [
  // [sprite, scala, sinistra, classi extra, variabili]
  ['kelp', 3, '2%', 'kelp', { dur: '6s', delay: '-1s' }],
  ['kelp', 4, '3.8%', 'kelp', { dur: '7s', delay: '-4s' }],
  ['rock', 3, '7%'],
  ['coral', 3, '13%'],
  ['pebble', 3, '19%', 'opt'],
  ['kelp', 3, '24%', 'kelp opt', { dur: '6.5s', delay: '-2s' }],
  ['kelp', 4, '25.8%', 'kelp opt', { dur: '8s', delay: '-5s' }],
  ['anemone', 3, '32%'],
  ['starfish', 3, '40%', 'low'],
  ['pebble', 3, '47%'],
  ['kelp', 3, '53%', 'kelp', { dur: '7.5s', delay: '-3s' }],
  ['coral', 3, '59%', 'opt'],
  ['kelp', 4, '66%', 'kelp', { dur: '6s', delay: '-2.5s' }],
  ['kelp', 3, '67.8%', 'kelp', { dur: '7s', delay: '-6s' }],
  ['rock', 4, '72%'],
  ['anemone', 3, '77%', 'opt'],
  ['shell', 3, '81%', 'low'],
  ['coral', 3, '86%'],
  // l'ultima alga resta lontana dal profondimetro sul bordo destro
  ['kelp', 4, '91%', 'kelp', { dur: '7s', delay: '-1.5s' }],
];
for (const [name, scale, left, extra = '', vars = {}] of things) {
  floor.append(sprite(name, scale, `thing ${extra}`, { left, ...vars }));
}
floor.append(sprite('crab', 3, 'crab', { left: '44%' }));
// la rana pescatrice guarda a destra e nuota verso destra, con la sua lucina
floor.append(sprite('angler', 3, 'swim right angler', { dur: '75s', delay: '-30s', x: '40vw' }));

// bolle che salgono dalle alghe
for (const [left, size, dur, delay, extra] of [
  ['3%', 6, 7, -1],
  ['3.5%', 4, 7, -4.5],
  ['25%', 5, 8, -2, 'opt'],
  ['54%', 6, 6.5, -3],
  ['54.5%', 4, 6.5, -0.5],
  ['67%', 5, 9, -6],
  ['96.5%', 4, 7.5, -2.5],
]) {
  floor.append(
    div(`bubble rising${extra ? ` ${extra}` : ''}`, {
      left,
      size: `${size}px`,
      dur: `${dur}s`,
      delay: `${delay}s`,
    }),
  );
}
sea.append(floor);

// ---------------------------------------------------------------------------
// Profondimetro sul bordo destro (schermi larghi): la pagina va dalla superficie a −7’000 m,
// cioè 700 punti, il massimo di Krillion (10 m per punto, come su krillion.io).

const ZONES = {
  it: ['Zona crepuscolare', 'Zona di mezzanotte', 'Abisso', 'Fossa'],
  de: ['Dämmerungszone', 'Mitternachtszone', 'Abyssal', 'Tiefseegraben'],
  en: ['Twilight zone', 'Midnight zone', 'Abyss', 'Trench'],
};
const MAX_DEPTH = 7000;
const ruler = div('ruler');
sea.append(ruler);

function renderRuler() {
  ruler.replaceChildren();
  for (let m = 0; m <= MAX_DEPTH; m += 500) {
    const tick = div(`tick${m % 1000 ? '' : ' major'}`, { y: `${(m / MAX_DEPTH) * 100}%` });
    if (m % 1000 === 0) tick.dataset.label = m ? `−${fmt(m)} m` : '0 m';
    ruler.append(tick);
  }
  const names = ZONES[ui.lang] ?? ZONES.it;
  [
    [200, 1000],
    [1000, 4000],
    [4000, 6000],
    [6000, MAX_DEPTH],
  ].forEach(([from, to], i) => {
    const zone = div('zone', { y: `${((from + to) / 2 / MAX_DEPTH) * 100}%` });
    zone.textContent = names[i];
    ruler.append(zone);
  });
}
renderRuler();
document.getElementById('lang')?.addEventListener('change', renderRuler);

// neve marina: puntini che scendono lenti (livello fisso, leggero)
const snow = div('snow');
snow.setAttribute('aria-hidden', 'true');
document.body.append(sea, snow);

// L'acqua comincia dove finisce l'intestazione (che cambia altezza sui telefoni).
function placeSurface() {
  if (header) sea.style.top = `${header.offsetHeight}px`;
}
placeSurface();
if (header && 'ResizeObserver' in window) new ResizeObserver(placeSurface).observe(header);
