// Noillirk – il bosco in pixel art (ispirato a noillirk.com, "Sky Climb"): la chioma degli alberi con
// la luce nell'intestazione, tronchi nella nebbia lungo la pagina, lucciole, farfalle, un uccellino,
// palloncini sciolti che salgono e il sottobosco con lo stagno in fondo. Le statistiche restano quelle
// di game.js; qui si aggiungono solo elementi aria-hidden. Con "riduci movimento" le animazioni si
// fermano (vedi forest.css).

import { GAMES, NOILLIRK_ZONES, fmtAltitude, noillirkAltitude } from '../core.js?v=5';
import { spriteSize, spriteUrl } from './sprites.js?v=1';

const root = document.documentElement;
const urls = new Map();
const url = (name, flip = false) => {
  const key = `${name}${flip ? '|flip' : ''}`;
  if (!urls.has(key)) urls.set(key, spriteUrl(name, flip));
  return urls.get(key);
};

// Gli sprite che usa il CSS: i cerchi delle risposte, la mascotte, chioma, cespugli e terreno.
for (const name of ['nk4', 'nk3', 'nk2', 'nk1', 'nk0', 'nkp', 'krill', 'leaves', 'bushes', 'ground']) {
  root.style.setProperty(`--spr-${name}`, url(name));
}
for (const name of ['birdA', 'birdB', 'balloonV', 'balloonR', 'balloonT']) {
  root.style.setProperty(`--spr-${name}`, url(name));
}
root.classList.add('forest-ready');

/** Uno sprite ingrandito `scale` volte; `vars` diventano variabili CSS (--x, --dur, …). */
function sprite(name, scale, cls, vars = {}, flip = false) {
  const { w, h } = spriteSize(name);
  const node = document.createElement('i');
  node.className = `spr ${cls}`;
  node.style.width = `${w * scale}px`;
  node.style.height = `${h * scale}px`;
  node.style.backgroundImage = url(name, flip);
  setVars(node, vars);
  return node;
}

function div(cls, vars = {}) {
  const node = document.createElement('div');
  node.className = cls;
  setVars(node, vars);
  return node;
}

function setVars(node, vars) {
  for (const [k, v] of Object.entries(vars)) node.style.setProperty(`--${k}`, v);
}

/** Un tronco alto quanto il suo contenitore: la corteccia si ripete in verticale. */
function trunk(name, scale, left, cls = '') {
  const { w, h } = spriteSize(name);
  return div(`trunk ${cls}`, {
    left,
    w: `${w * scale}px`,
    tile: `${h * scale}px`,
    img: url(name),
  });
}

/** Una lucciola che vaga e si accende piano. */
function firefly(left, top, dur, delay, extra = '') {
  return div(`firefly ${extra}`, { left, top, dur: `${dur}s`, delay: `${delay}s` });
}

// ---------------------------------------------------------------------------
// Intestazione: luce tra gli alberi, tronchi lontani, lucciole e l'uccellino che passa
// (la chioma in alto e i cespugli in basso sono nel CSS dell'intestazione)

const header = document.querySelector('header.top');
if (header) {
  const canopy = div('canopy');
  canopy.setAttribute('aria-hidden', 'true');
  for (const [x, w, rot, dur, delay] of [
    ['8%', '90px', '-16deg', '12s', '-3s'],
    ['30%', '140px', '-20deg', '15s', '-8s'],
    ['58%', '100px', '-14deg', '10s', '-5s'],
    ['80%', '160px', '-18deg', '14s', '-1s'],
  ]) {
    canopy.append(div('ray', { x, w, rot, dur, delay }));
  }
  // tronchi nella nebbia, dietro il titolo: più fitti ai lati
  for (const [left, scale, extra] of [
    ['3%', 4],
    ['13%', 3, 'opt'],
    ['72%', 3, 'opt'],
    ['86%', 5],
    ['95%', 3],
  ]) {
    canopy.append(trunk('trunkFar', scale, left, extra));
  }
  for (const [left, top, dur, delay, extra] of [
    ['22%', '58%', 9, -2],
    ['48%', '72%', 11, -6, 'opt'],
    ['66%', '40%', 10, -4],
    ['90%', '64%', 12, -8, 'opt'],
  ]) {
    canopy.append(firefly(left, top, dur, delay, extra));
  }
  canopy.append(sprite('butterfly', 3, 'flutter opt', { left: '76%', top: '46%', dur: '16s', delay: '-5s' }));
  // l'uccellino attraversa il cielo sopra la chioma, sbattendo le ali
  canopy.append(div('bird opt', { dur: '38s', delay: '-12s' }));
  header.prepend(canopy);
}

// ---------------------------------------------------------------------------
// Pagina: il bosco nella nebbia, dai cespugli dell'intestazione fino al sottobosco

const forest = div('forest');
forest.setAttribute('aria-hidden', 'true');

// banchi di nebbia
for (const [top, dur, delay] of [
  ['8%', '60s', '-10s'],
  ['34%', '75s', '-40s'],
  ['62%', '68s', '-25s'],
  ['86%', '80s', '-55s'],
]) {
  forest.append(div('mist', { top, dur, delay }));
}

// tronchi: lontani (nella nebbia, più chiari) e vicini (bruni, nei margini della pagina)
for (const [left, scale, extra] of [
  ['1%', 3],
  ['9%', 4],
  ['24%', 3, 'opt'],
  ['41%', 4, 'opt'],
  ['57%', 3, 'opt'],
  ['74%', 4, 'opt'],
  ['89%', 3],
  ['97%', 4],
]) {
  forest.append(trunk('trunkFar', scale, left, `far ${extra ?? ''}`));
}
for (const [left, scale, extra] of [
  ['1.5%', 5],
  // a destra solo dove non c'è l'altimetro
  ['94%', 4, 'opt no-ruler'],
]) {
  forest.append(trunk('trunk', scale, left, `near ${extra ?? ''}`));
}

// lucciole lungo i margini
for (const [left, top, dur, delay, extra] of [
  ['3%', '18%', 10, -1],
  ['95%', '27%', 12, -5],
  ['6%', '44%', 11, -7, 'opt'],
  ['92%', '55%', 9, -3],
  ['4%', '71%', 13, -9],
  ['96%', '80%', 10, -4, 'opt'],
]) {
  forest.append(firefly(left, top, dur, delay, extra));
}

// palloncini sciolti che salgono piano nei margini (solo schermi larghi)
for (const [name, left, dur, delay] of [
  ['balloonV', '4%', 70, -20],
  ['balloonT', '8%', 85, -55],
  ['balloonR', '2.5%', 95, -70],
]) {
  forest.append(sprite(name, 3, 'loose wide', { left, dur: `${dur}s`, delay: `${delay}s` }));
}

// farfalle
for (const [name, left, top, dur, delay] of [
  ['butterflyT', '2%', '36%', 18, -4],
  ['butterfly', '95%', '64%', 20, -11],
]) {
  forest.append(sprite(name, 3, 'flutter opt', { left, top, dur: `${dur}s`, delay: `${delay}s` }));
}

// ---------------------------------------------------------------------------
// Sottobosco: terreno, sentiero, stagno con le ninfee, felci, funghi, fiori, cespugli e sassi

const floor = div('floor');
floor.append(div('floor-glow'), div('ground'));

const things = [
  // [sprite, scala, sinistra, classi extra]
  ['bush', 5, '3%'],
  ['fern', 5, '10%', 'sway opt'],
  ['mushroom', 4, '14.5%'],
  ['flower', 4, '17.5%', 'sway'],
  ['stone', 4, '20.5%', 'low opt'],
  ['flowerY', 4, '24%', 'sway opt'],
  ['path', 5, '34%', 'flat opt'],
  ['fern', 4, '46.5%', 'sway opt'],
  ['mushroomS', 4, '50.5%', 'opt'],
  ['flower', 4, '54%', 'sway opt'],
  // sui telefoni lo stagno va in mezzo (vedi forest.css)
  ['pond', 5, '64%', 'flat pond'],
  ['fern', 5, '76%', 'sway opt'],
  ['mushroomS', 4, '80%', 'opt'],
  ['mushroom', 4, '83%'],
  ['flowerY', 4, '86%', 'sway'],
  // l'ultimo cespuglio resta lontano dall'altimetro sul bordo destro
  ['bush', 5, '89%', 'opt'],
];
for (const [name, scale, left, extra = ''] of things) {
  floor.append(sprite(name, scale, `thing ${extra}`, { left }));
}
for (const [left, top, dur, delay, extra] of [
  ['12%', '30%', 8, -2],
  ['38%', '45%', 10, -6, 'opt'],
  ['60%', '25%', 9, -4],
  ['85%', '40%', 11, -1],
]) {
  floor.append(firefly(left, top, dur, delay, extra));
}
floor.append(sprite('butterfly', 3, 'flutter', { left: '68%', top: '30%', dur: '14s', delay: '-3s' }));
forest.append(floor);

// ---------------------------------------------------------------------------
// Altimetro sul bordo destro (schermi larghi): dal sottobosco (0 m, in fondo) ai 14 km in cima alla
// pagina, cioè 2’500 punti, il massimo di un daily. La scala segue i punti: ogni zona della salita
// occupa lo spazio dei punti che servono per attraversarla, con la quota del gioco all'inizio.
// Le zone sono quelle di core.js (le stesse della quota accanto ai punti).

const ZONES = NOILLIRK_ZONES.map((zone) => [zone.name, zone.from]);
const MAX_POINTS = GAMES.noillirk.max;
const y = (points) => `${(1 - points / MAX_POINTS) * 100}%`;
const ruler = div('ruler');
forest.append(ruler);
/** i nomi delle zone, con la parte della scala che occupa ognuna (0–1) */
const zoneLabels = [];

function renderRuler() {
  ruler.replaceChildren();
  zoneLabels.length = 0;
  const top = div('tick major peak', { y: y(MAX_POINTS) });
  top.dataset.label = fmtAltitude(noillirkAltitude(MAX_POINTS));
  ruler.append(top);
  ZONES.forEach(([name, from], i) => {
    const to = ZONES[i + 1]?.[1] ?? MAX_POINTS;
    const tick = div('tick major', { y: y(from) });
    // le prime zone sono strette: lì basta la tacca, senza scritta
    if (from === 0 || from >= 100) tick.dataset.label = fmtAltitude(noillirkAltitude(from));
    ruler.append(tick);
    if (to - from >= 150) {
      const zone = div('zone', { y: y((from + to) / 2) });
      zone.textContent = name;
      ruler.append(zone);
      zoneLabels.push({ node: zone, share: (to - from) / MAX_POINTS });
    }
  });
  fitZones();
}

// Su una pagina corta (per esempio quando non ci sono ancora risultati) i nomi delle zone non stanno
// nella loro fascia e si sovrapporrebbero: si mostrano solo quelli che ci stanno.
function fitZones() {
  const height = ruler.clientHeight;
  for (const { node, share } of zoneLabels) {
    node.style.visibility = node.offsetHeight + 12 <= share * height ? '' : 'hidden';
  }
}
renderRuler();
if ('ResizeObserver' in window) new ResizeObserver(fitZones).observe(ruler);
// i numeri seguono la lingua scelta (separatore delle migliaia)
document.getElementById('lang')?.addEventListener('change', () => setTimeout(renderRuler));

// pulviscolo nella luce: puntini che salgono lentissimi (livello fisso, leggero)
const motes = div('motes');
motes.setAttribute('aria-hidden', 'true');
document.body.append(forest, motes);

// Il bosco comincia dove finisce l'intestazione (che cambia altezza sui telefoni).
function placeForest() {
  if (header) forest.style.top = `${header.offsetHeight}px`;
}
placeForest();
if (header && 'ResizeObserver' in window) new ResizeObserver(placeForest).observe(header);
