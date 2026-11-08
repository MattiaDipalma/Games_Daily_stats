# 🎮 Games Daily – statistiche

Un bot legge i risultati che mandate nel gruppo WhatsApp **Games Daily** e li pubblica su un sito con
una pagina per ogni gioco, ognuna col suo colore:

| Gioco | Pagina | Colore |
| --- | --- | --- |
| 🦐 Krillion | `/krillion/` | fondale marino in pixel art, ispirato a [krillion.io](https://krillion.io) |
| 🎵 Songless | `/songless/` | nero |
| 📏 Magnitudle | `/magnitudle/` | rosso |

```
WhatsApp (gruppo)  ──►  bot (bot/)  ──►  docs/data/<gioco>.json su GitHub  ──►  sito (GitHub Pages)
```

È lo stesso bot di [Krillion Daily](https://github.com/MattiaDipalma/krillion_stats), che ora legge
tre giochi nella stessa chat.

## I giochi

### 🦐 Krillion

```
Krillion #111 🦐
335

🦑🐟🏮🐟🦑🦑🫧
```

Il punteggio è il numero sulla riga dopo `Krillion #N`: è la somma delle 7 risposte, una per simbolo.

| Simbolo | ⬛ | 🫧 | 🐟 | 🦑 | 🏮 | 🌟 |
| --- | --- | --- | --- | --- | --- | --- |
| Punti | 0 | 10 | 30 | 60 | 85 | 100 |

Sul sito i simboli sono disegnati in pixel art e accanto a ogni punteggio c'è la profondità raggiunta,
come su krillion.io: 10 m per punto (285 punti = −2850 m, il massimo 700 = −7000 m).

La pagina di Krillion è un'immersione: in alto il cielo con la barca, poi l'acqua sempre più scura con
pesci, meduse e bolle, e in fondo alla pagina il fondale marino. Sugli schermi larghi un profondimetro sul
bordo destro va dalla superficie a −7000 m. Le animazioni si fermano se nel sistema è attivo "riduci
movimento". Tutto questo è in [`docs/assets/krillion/`](docs/assets/krillion/) e non tocca le altre pagine.

**La classifica è ripartita da zero con il Krillion #112.** Le partite del vecchio gruppo Krillion
Daily (#79–#111, in [`docs/data/krillion-legacy.json`](docs/data/krillion-legacy.json)) contano lo
stesso nelle statistiche personali di ogni giocatore: la scheda che si apre cliccando su un nome
(partite, media, record, vittorie, podi, serie, grafico e storico) le comprende tutte. Si vedono anche
sfogliando i puzzle passati, ma non entrano nella classifica (nemmeno in quella generale della home), nei
riquadri, nel grafico dell'andamento e nel testa a testa. Per spostare l'inizio della nuova classifica
cambia `seasonStart` in [`docs/assets/core.js`](docs/assets/core.js).

`krillion-legacy.json` è una copia di `docs/data/stats.json` del vecchio sito (aggiornato al 3 novembre
2026). Il bot non lo tocca: se il vecchio gruppo va avanti e vuoi aggiungere le partite nuove alle
statistiche personali, basta copiarlo di nuovo.

### 🎵 Songless

```
Songless #432

⬜⬜⬜⬜⬜ [Top Hits]
⬜⬜⬜⬜⬜ [Pop]
⬜⬜⬜⬜⬜ [Rock]
⬜⬜🟩⬛⬛ [Hip Hop]
⬜⬜🟩⬛⬛ [EDM]
```

Songless non dà un punteggio: il bot lo calcola riga per riga, guardando dove si trova il quadrato
verde 🟩.

| Quadrato verde | Punti |
| --- | --- |
| 1° | 100 |
| 2° | 85 |
| 3° | 60 |
| 4° | 30 |
| 5° | 10 |
| nessuno | 0 |

I quadrati bianchi, neri e rossi non danno punti. Con cinque generi il massimo è 500. Nell'esempio
Hip Hop ed EDM sono al 3° quadrato: 60 + 60 = **120 punti**. Sul sito ogni risultato è una fila di
caselle, una per genere, con il tentativo in cui è stata trovata la canzone (✕ = non trovata); la pagina
mostra anche come va il gruppo con ogni genere.

### 📏 Magnitudle

```
Magnitudle — Size It Up
2026-11-03

Score: 246/500

🟥🟥🟥🟥⬜ 71
🟥⬜⬜⬜⬜ 12
🟥⬜⬜⬜⬜ 14
🟥🟥⬜⬜⬜ 49
🟥🟥🟥🟥🟥 100
```

Il punteggio è quello del gioco (`Score`). Magnitudle non ha un numero: il puzzle è la data scritta nel
messaggio.

### Regole comuni

- Un risultato per persona e per puzzle: vale il primo messaggio. Se il messaggio viene modificato su
  WhatsApp, vale la versione modificata.
- Più giochi nello stesso messaggio vanno bene.
- I messaggi inoltrati vengono ignorati.
- I numeri di telefono non vengono mai pubblicati: chi non è in rubrica compare come `+41∙∙∙∙∙∙∙46`
  (vedi [Nomi dei giocatori](#nomi-dei-giocatori)).

## Il sito

Il sito è in [`docs/`](docs/) (HTML/CSS/JS, nessuna dipendenza). La home ha un riquadro per ogni gioco
(il podio dell'ultimo puzzle e chi è in testa; un clic apre la pagina del gioco) e sotto la
**classifica generale**: per ogni gioco la posizione media del giocatore (1 = primo del giorno, come nella
colonna "Pos. media" della classifica del gioco) e, per ordinare, la media dei tre giochi, così ogni
gioco conta allo stesso modo. Ci entra solo chi è nella classifica di tutti e tre i giochi.

Ogni pagina di gioco mostra:

- la classifica (media, partite, record, vittorie, posizione media, serie di giorni consecutivi); ci entra solo chi ha giocato almeno 4 volte negli ultimi 7 giorni, in tutti e tre i giochi (chi non ha i requisiti resta raggiungibile dalla sua scheda);
- il grafico dell'andamento (punteggio o media mobile su 7 partite);
- il testa a testa tra ogni coppia di giocatori;
- la scheda di ogni giocatore (clic sul nome);
- il download di tutti i dati in CSV.

Filtri per periodo (sempre, ultimi 30, ultimi 7) e lingua italiano/tedesco/inglese. Per vedere una
pagina con dati inventati aggiungi `?demo` all'indirizzo (es. `…/songless/?demo`).

### Pubblicarlo con GitHub Pages

1. Su GitHub: **Settings → Pages**.
2. *Source*: **Deploy from a branch**, branch **main**, cartella **/docs** → *Save*.
3. Dopo un minuto il sito è su **https://mattiadipalma.github.io/Games_Daily_stats/**

Ogni volta che il bot aggiorna i dati, GitHub Pages ripubblica il sito da solo.

## Il bot

Il bot usa [Baileys](https://github.com/WhiskeySockets/Baileys) e si collega al tuo WhatsApp come
**dispositivo collegato** (come WhatsApp Web). Legge e basta: non manda messaggi, non segna nulla come
letto e non risulta "online", quindi le notifiche continuano ad arrivarti sul telefono.

Deve restare acceso per raccogliere i risultati: va bene un PC sempre acceso, un Raspberry Pi o un
piccolo server. Se resta spento per un po', alla riaccensione WhatsApp gli consegna di solito i messaggi
arrivati nel frattempo; se manca qualcosa, puoi recuperarlo con l'[export della chat](#recuperare-lo-storico).

### 1. Token GitHub

Serve per permettere al bot di aggiornare i file in `docs/data/`.

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**
   (oppure modifica il token del vecchio bot e aggiungi il repository).
2. *Repository access*: **Only select repositories** → `Games_Daily_stats`.
3. *Permissions → Repository permissions → Contents*: **Read and write**.
4. Copia il token (inizia con `github_pat_…`).

### 2. Installazione

Serve [Node.js](https://nodejs.org) 20.12 o più recente.

```bash
git clone https://github.com/MattiaDipalma/Games_Daily_stats.git
cd Games_Daily_stats/bot
npm install
cp .env.example .env
```

Apri `.env` e compila almeno `GITHUB_TOKEN` e `MY_NAME` (il tuo nome: su WhatsApp i tuoi messaggi
risultano "Tu"). Il gruppo è già impostato (`GROUP_NAME=Games Daily`); le altre opzioni sono spiegate
nel file. Dal vecchio bot puoi copiare `bot/aliases.json`, se lo usavi.

### 3. Avvio e collegamento

```bash
npm start
```

Nel terminale compare un QR code: sul telefono apri **WhatsApp → Impostazioni → Dispositivi collegati →
Collega un dispositivo** e scansionalo. Su un server senza schermo puoi usare invece un codice:
imposta `PAIRING_PHONE` nel file `.env` con il tuo numero (es. `41791234567`) e inserisci su WhatsApp il
codice stampato dal bot (**Collega con numero di telefono**).

Il nuovo bot è un dispositivo collegato a parte: il vecchio bot di Krillion Daily può restare acceso
(aggiorna solo il vecchio sito) oppure puoi fermarlo. Non copiare la cartella `bot/auth/` dal vecchio
bot mentre è acceso: due bot con la stessa sessione si scollegano a vicenda.

Il bot cerca il gruppo per nome (`GROUP_NAME`). Se non lo trova, stampa l'elenco dei tuoi gruppi.
Al primo collegamento WhatsApp di solito manda anche lo **storico recente dei messaggi**: i risultati
già presenti nel gruppo vengono importati in automatico.

Esempio di output:

```
04/11/2026, 08:00:00 | 🎮 Games Daily stats bot – gruppo "Games Daily"
04/11/2026, 08:00:01 |    Krillion       0 risultati – github.com/MattiaDipalma/Games_Daily_stats (main:docs/data/krillion.json)
04/11/2026, 08:00:01 |    Songless       0 risultati – github.com/MattiaDipalma/Games_Daily_stats (main:docs/data/songless.json)
04/11/2026, 08:00:01 |    Magnitudle     0 risultati – github.com/MattiaDipalma/Games_Daily_stats (main:docs/data/magnitudle.json)
04/11/2026, 08:00:31 | ✅ Collegato a WhatsApp come Mattia
04/11/2026, 08:00:32 | 👥 Gruppo trovato: "Games Daily" (120363…@g.us)
04/11/2026, 08:31:10 | 📥 Krillion #112 – Daniel: 285
04/11/2026, 08:31:10 | 📥 Songless #433 – Daniel: 145
04/11/2026, 08:32:10 | 💾 Krillion salvato su github.com/MattiaDipalma/Games_Daily_stats (main:docs/data/krillion.json): 1 nuovi, 0 aggiornati
04/11/2026, 08:32:11 | 💾 Songless salvato su github.com/MattiaDipalma/Games_Daily_stats (main:docs/data/songless.json): 1 nuovi, 0 aggiornati
```

I risultati vengono salvati a gruppi (dopo `FLUSH_DELAY_SECONDS`, 60 secondi di default): al massimo un
commit per gioco.

### 4. Tenerlo acceso

Con [pm2](https://pm2.keymetrics.io):

```bash
npm install -g pm2
cd Games_Daily_stats/bot
pm2 start src/index.js --name games-daily-bot
pm2 save && pm2 startup   # riavvio automatico al boot
pm2 logs games-daily-bot  # per vedere i log
```

Oppure con systemd (Linux / Raspberry Pi), in `/etc/systemd/system/games-daily-bot.service`:

```ini
[Unit]
Description=Games Daily stats bot
After=network-online.target

[Service]
WorkingDirectory=/home/pi/Games_Daily_stats/bot
ExecStart=/usr/bin/node src/index.js
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now games-daily-bot
journalctl -u games-daily-bot -f
```

## Nomi dei giocatori

Il bot usa il nome con cui hai salvato la persona in rubrica; se non c'è, il nome che la persona ha
scelto sul suo profilo WhatsApp (o un numero mascherato come `+41∙∙∙∙∙∙∙46`).

Per decidere come compare un nome sul sito modifica [`docs/data/names.json`](docs/data/names.json)
direttamente su GitHub: a sinistra il nome come compare nei file dei dati, a destra il nome da mostrare.
Vale per tutti e tre i giochi e anche per le vecchie partite di Krillion Daily, subito e senza toccare il
bot. Due nomi che puntano allo stesso nome diventano la stessa persona. I nomi del vecchio sito sono già
dentro.

```json
{
  "Nils Geigy": "Nils",
  "+41∙∙∙∙∙∙∙46": "Flu"
}
```

Per togliere qualcuno dalla classifica senza cancellare i suoi dati aggiungi il suo nome (quello da
mostrare) a `"_hidden": ["Mael", "Nils"]`: basta toglierlo da lì per farlo tornare.

`names.json` è pubblico: non metterci numeri di telefono completi. Per quelli crea invece
`bot/aliases.json` partendo da [`bot/aliases.example.json`](bot/aliases.example.json): il bot salva
direttamente il nome giusto (dopo un riavvio) e lo applica anche ai risultati già salvati alla scrittura
successiva. `aliases.json` non viene pubblicato (è nel `.gitignore`).

## Recuperare lo storico

Se lo storico automatico non basta:

1. Su WhatsApp apri il gruppo → nome del gruppo → **Esporta chat** → **Senza media**.
2. Su iPhone ottieni uno `.zip`: estrailo, dentro c'è `_chat.txt`.
3. Importa:

```bash
cd bot
npm run import -- percorso/_chat.txt --dry-run   # mostra cosa trova, senza salvare
npm run import -- percorso/_chat.txt             # salva su GitHub (o in locale senza token)
```

Legge tutti e tre i giochi. Funziona con gli export di iPhone e Android, in italiano, tedesco o inglese.
Se le date risultano sbagliate (giorno e mese invertiti) aggiungi `--date-format dmy` oppure
`--date-format mdy`. Importare più volte lo stesso file non crea doppioni.

## Correggere un risultato a mano

I file in `docs/data/` contengono un risultato per riga e si possono modificare direttamente su GitHub
(per togliere un risultato cancella la sua riga, attenzione alle virgole):

```json
{"puzzle":112,"player":"Daniel","score":285,"date":"2026-11-04","ts":1793790645,"grid":"🦑🐟🏮🐟🦑🦑🫧"}
{"puzzle":433,"player":"Anna","score":120,"date":"2026-11-04","ts":1793791000,"grid":"⬜⬜⬜⬜⬜ [Top Hits]\n…"}
{"puzzle":"2026-11-04","player":"Nils","score":246,"date":"2026-11-04","ts":1793792000,"grid":"🟥🟥🟥🟥⬜ 71\n…"}
```

Per Songless `score` è già calcolato dal bot: se correggi la griglia, ricalcola anche i punti.

## Struttura

```
bot/
  src/index.js           connessione a WhatsApp, salvataggio a gruppi
  src/collector.js       dai messaggi WhatsApp ai risultati (nomi, modifiche, gruppo)
  src/parser.js          riconosce Krillion, Songless e Magnitudle e calcola i punti di Songless
  src/stats.js           formato dei file dei dati, unione dei risultati, numeri mascherati
  src/store.js           salvataggio su GitHub (API) o su file, un file per gioco
  src/import-chat.js     import dall'export della chat
  src/whatsapp-export.js lettura del file esportato da WhatsApp
  test/                  test (npm test)
docs/                    il sito (GitHub Pages)
  index.html             home
  krillion/ songless/ magnitudle/   le pagine dei giochi
  assets/core.js         dati, calcoli, grafici e testi comuni (anche seasonStart di Krillion)
  assets/game.js         pagina di un gioco
  assets/home.js         home: i riquadri dei giochi e la classifica generale
  assets/style.css       stile e colori dei tre giochi
  assets/krillion/       il fondale marino della pagina di Krillion:
    sea.css                colori, caratteri pixel, cielo, acqua e fondale
    sea.js                 nuvole, barca, pesci, meduse, bolle, fondale e profondimetro
    sprites.js             gli sprite in pixel art, disegnati a caratteri
  assets/fonts/          Silkscreen, Jersey 10 e Space Mono (licenza OFL, in OFL.txt)
  data/krillion.json     i risultati (uno per gioco, scritti dal bot)
  data/songless.json
  data/magnitudle.json
  data/krillion-legacy.json   le partite del vecchio gruppo Krillion Daily
  data/names.json        i nomi da mostrare sul sito
```

Per i test: `cd bot && npm test`.

## Note

- Baileys non è un client ufficiale di WhatsApp. Un bot che legge soltanto, sul tuo account, è un uso a
  basso rischio, ma WhatsApp in teoria può bloccare gli account che usano client non ufficiali.
- La cartella `bot/auth/` contiene la sessione WhatsApp: non condividerla e non pubblicarla
  (è già nel `.gitignore`). Per scollegare il bot: WhatsApp → Dispositivi collegati → esci dal dispositivo,
  poi cancella `bot/auth/`.
- Se WhatsApp scollega il dispositivo, il bot lo segnala e si ferma: cancella `bot/auth/` e rifai il collegamento.
