// Magnitudle – solo decorazione: l'intestazione diventa un righello (i trattini e i numeri lungo il bordo
// inferiore) con cinque quadrati che crescono, come nel gioco ("Size It Up").
// Le statistiche restano quelle di game.js; qui si aggiungono solo elementi aria-hidden.

function node(tag, cls, vars = {}) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  for (const [k, v] of Object.entries(vars)) n.style.setProperty(`--${k}`, v);
  return n;
}

const header = document.querySelector('header.top');
if (header) {
  // Il righello: i trattini sono uno sfondo (ruler.css), qui ci sono i numeri, uno ogni 100 px
  // a partire dal bordo sinistro del contenuto.
  const ruler = node('div', 'ruler');
  ruler.setAttribute('aria-hidden', 'true');
  const wrap = node('div', 'wrap');
  const nums = node('div', 'ruler-nums');
  for (let i = 0; i < 40; i++) {
    const n = node('span');
    n.textContent = String(i);
    nums.append(n);
  }
  wrap.append(node('div', 'ruler-ticks'), nums);
  ruler.append(wrap);
  header.append(ruler);

  // Cinque quadrati che crescono (13, 21, 34, 55, 89 px), sempre più pieni.
  const hero = header.querySelector('.hero');
  if (hero) {
    const sizes = node('div', 'sizes');
    sizes.setAttribute('aria-hidden', 'true');
    [13, 21, 34, 55, 89].forEach((s, i) => sizes.append(node('i', '', { s: `${s}px`, o: 0.32 + i * 0.17 })));
    hero.append(sizes);
  }
}
