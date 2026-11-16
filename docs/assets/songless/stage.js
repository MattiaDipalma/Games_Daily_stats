// Songless – solo decorazione: l'equalizzatore accanto al titolo e la forma d'onda sotto l'intestazione.
// Le statistiche restano quelle di game.js; qui si aggiungono solo elementi aria-hidden.
// Con "riduci movimento" attivo nel sistema le animazioni si fermano (vedi stage.css).

function node(tag, cls, vars = {}) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  for (const [k, v] of Object.entries(vars)) n.style.setProperty(`--${k}`, v);
  return n;
}

// L'equalizzatore prende il posto della nota musicale: cinque barre, ognuna col suo ritmo.
const emoji = document.querySelector('.hero-emoji');
if (emoji) {
  const eq = node('span', 'eq');
  // [durata (s), ritardo (s), altezza da ferma (0–1)]
  for (const [dur, delay, rest] of [
    [0.9, -0.2, 0.55],
    [1.3, -0.7, 1],
    [1.05, -0.4, 0.7],
    [1.45, -1.1, 0.9],
    [0.8, -0.5, 0.4],
  ]) {
    eq.append(node('i', '', { dur: `${dur}s`, delay: `${delay}s`, rest }));
  }
  emoji.replaceChildren(eq);
}

// La forma d'onda: sempre la stessa (numeri pseudo-casuali con seme fisso), disegnata due volte,
// in grigio e in verde; quella verde si scopre da sinistra come una canzone che suona.
const hero = document.querySelector('header.top .hero');
if (hero) {
  let seed = 432;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const BARS = 150;
  const heights = Array.from({ length: BARS }, (_, i) => {
    // strofe e ritornelli: un'onda lenta che alza e abbassa il volume, più un po' di rumore
    const envelope = 0.5 + 0.34 * Math.sin(i * 0.085 + 0.9) + 0.16 * Math.sin(i * 0.31);
    return Math.round(Math.max(10, Math.min(100, (envelope * 0.72 + rand() * 0.42) * 100)));
  });
  const bars = (cls) => {
    const row = node('div', `wave-bars ${cls}`);
    for (const h of heights) row.append(node('i', '', { h: `${h}%` }));
    return row;
  };
  const wave = node('div', 'wave');
  wave.setAttribute('aria-hidden', 'true');
  wave.append(bars('off'), bars('on'));
  hero.append(wave);
}
