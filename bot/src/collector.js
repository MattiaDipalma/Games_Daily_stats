// Trasforma i messaggi WhatsApp (formato Baileys) in risultati dei giochi.

import { jidNormalizedUser, normalizeMessageContent, toNumber } from 'baileys';
import { parseMessage } from './parser.js';
import { aliasKey, localDate, maskPhone } from './stats.js';

const phoneOf = (jid) => (jid?.endsWith('@s.whatsapp.net') ? jid.split('@')[0] : null);

export function messageText(message) {
  const content = normalizeMessageContent(message);
  if (!content) return { text: null, forwarded: false };
  const text =
    content.conversation ||
    content.extendedTextMessage?.text ||
    content.imageMessage?.caption ||
    content.videoMessage?.caption ||
    null;
  const forwarded = !!content.extendedTextMessage?.contextInfo?.isForwarded;
  return { text, forwarded };
}

export class Collector {
  /**
   * @param {{ config: object, onResult: (r: object, info: { edit: boolean }) => unknown }} opts
   */
  constructor({ config, onResult }) {
    this.config = config;
    this.onResult = onResult;
    /** jid → { name?: nome in rubrica, notify?: nome scelto dalla persona } */
    this.contacts = new Map();
    this.groupJid = config.groupJid ?? null;
    this.groupLookupDone = !!this.groupJid;
    /** messaggi arrivati prima di sapere quale sia il gruppo */
    this.held = [];
  }

  /** @returns {boolean} true se la rubrica è cambiata */
  rememberContacts(list) {
    let changed = false;
    for (const c of list ?? []) {
      const ids = [c.id, c.lid, c.phoneNumber].filter(Boolean).map((j) => jidNormalizedUser(j));
      for (const id of ids) {
        const prev = this.contacts.get(id) ?? {};
        const next = { ...prev };
        if (c.name) next.name = c.name;
        if (c.notify) next.notify = c.notify;
        if (next.name !== prev.name || next.notify !== prev.notify) {
          this.contacts.set(id, next);
          changed = true;
        }
      }
    }
    return changed;
  }

  async senderIds(sock, msg) {
    // nei messaggi dello storico il mittente può essere in msg.participant
    const ids = [
      ...new Set([msg.key.participant, msg.key.participantAlt, msg.participant].filter(Boolean)),
    ].map((j) => jidNormalizedUser(j));
    if (!ids.some(phoneOf)) {
      const lid = ids.find((j) => j.endsWith('@lid'));
      if (lid) {
        try {
          const pn = await sock?.signalRepository?.lidMapping?.getPNForLID(lid);
          if (pn) ids.push(jidNormalizedUser(pn));
        } catch {
          // mappatura non disponibile: si usa il nome
        }
      }
    }
    return ids;
  }

  async senderName(sock, msg) {
    if (msg.key.fromMe) return this.config.myName || sock?.user?.name || 'Io';

    const ids = await this.senderIds(sock, msg);
    // 1. alias configurato per numero/jid
    for (const id of ids) {
      const alias = this.config.aliasMap?.get(aliasKey(phoneOf(id) ?? id));
      if (alias) return alias;
    }
    // 2. nome salvato in rubrica (come lo vedi su WhatsApp)
    for (const id of ids) {
      const name = this.contacts.get(id)?.name;
      if (name) return name;
    }
    // 3. nome scelto dalla persona sul proprio profilo
    if (msg.pushName) return msg.pushName;
    for (const id of ids) {
      const notify = this.contacts.get(id)?.notify;
      if (notify) return notify;
    }
    // 4. numero di telefono, mascherato: non viene mai pubblicato per intero
    const phone = ids.map(phoneOf).find(Boolean);
    return phone ? maskPhone(phone) : 'Sconosciuto';
  }

  /**
   * Legge i risultati di un messaggio del gruppo (anche più giochi nello stesso messaggio).
   * @returns {Promise<object[]>} i risultati trovati
   */
  async handleMessage(sock, msg, { edit = false } = {}) {
    if (!msg?.key?.remoteJid?.endsWith('@g.us') || !msg.message) return [];
    if (this.groupJid && msg.key.remoteJid !== this.groupJid) return [];

    const { text, forwarded } = messageText(msg.message);
    if (!text || forwarded) return [];
    const parsed = parseMessage(text);
    if (!parsed.length) return [];

    if (!this.groupJid) {
      // gruppo non ancora noto: si tengono da parte solo i risultati
      if (!this.groupLookupDone && this.held.length < 50000) this.held.push({ msg, edit });
      return [];
    }

    const ts = Number(toNumber(msg.messageTimestamp ?? 0)) || Math.floor(Date.now() / 1000);
    const date = localDate(ts, this.config.timeZone);
    const player = await this.senderName(sock, msg);
    const results = [];
    for (const p of parsed) {
      const result = {
        ...p,
        // Magnitudle senza data nel messaggio: vale il giorno in cui è stato mandato
        puzzle: p.puzzle ?? date,
        player,
        ts,
        date,
        ...(msg.key.id ? { msgId: msg.key.id } : {}),
      };
      await this.onResult(result, { edit });
      results.push(result);
    }
    return results;
  }

  /** Imposta il gruppo (o null se non trovato) e processa i messaggi in attesa. */
  async setGroup(sock, jid) {
    this.groupJid = jid ?? this.groupJid;
    this.groupLookupDone = true;
    const backlog = this.held;
    this.held = [];
    for (const { msg, edit } of backlog) await this.handleMessage(sock, msg, { edit });
  }

  /** Gestisce un aggiornamento di 'messages.update' (messaggio modificato). */
  async handleUpdate(sock, { key, update }) {
    if (!update?.message?.editedMessage) return [];
    return this.handleMessage(
      sock,
      { key, message: update.message, messageTimestamp: update.messageTimestamp },
      { edit: true },
    );
  }
}
