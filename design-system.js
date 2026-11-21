/* =====================================================================
   Gemeinsames Design-System – Verhalten (wird von build.py in die Web-Tools kopiert)
   Hover-Infos: Jedes Element mit title="…" oder data-tip="…" (HTML erlaubt) zeigt nach
   kurzer Verzögerung eine graue Infobox (.ds-tip aus design-system.css) statt der weißen
   Systembox. title-Texte werden beim Darüberfahren automatisch übernommen – auch solche,
   die das Programm später ändert.
   Für Hinweise, die sich mit der Mausposition ändern (z. B. über einer Zeichenfläche):
   DS.hoverTip(element, text, event) aufrufen – die Box folgt dann dem Mauszeiger.
   ===================================================================== */
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const TIP = document.createElement('div'); TIP.className = 'ds-tip';
  const mount = () => document.body.append(TIP);
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);
  let timer = 0, cur = null, mx = 0, my = 0;
  const hide = () => { clearTimeout(timer); TIP.classList.remove('on'); };
  /* title → data-tip (data-tt markiert übernommene Texte, damit spätere Änderungen ankommen) */
  const adopt = el => { const t = el.getAttribute('title'); if (t == null) return; el.removeAttribute('title');
    if (t && (!el.dataset.tip || el.dataset.tt)) { el.dataset.tip = esc(t).replace(/\n/g, '<br>'); el.dataset.tt = '1'; } };
  const place = (el, follow) => { const w = TIP.offsetWidth, h = TIP.offsetHeight; let x, y;
    if (follow) { x = mx + 14; y = my + 18; if (y + h > innerHeight - 8) y = my - h - 12; }
    else { const r = el.getBoundingClientRect(); x = r.left + Math.min(24, r.width / 2); y = r.bottom + 6; if (y + h > innerHeight - 8) y = Math.max(8, r.top - h - 6); }
    if (x + w > innerWidth - 8) x = innerWidth - w - 8; if (x < 8) x = 8; TIP.style.left = x + 'px'; TIP.style.top = y + 'px'; };
  const show = el => { if (!el.isConnected || !el.dataset.tip) return; TIP.innerHTML = el.dataset.tip; TIP.classList.add('on'); place(el, !!el.dataset.follow); };
  document.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; if (cur && cur.dataset.follow && TIP.classList.contains('on')) place(cur, true); }, true);
  document.addEventListener('pointerover', e => { const el = e.target.closest && e.target.closest('[data-tip],[title]'); if (el) adopt(el);
    if (el === cur) return; hide(); cur = el; if (el && el.dataset.tip) timer = setTimeout(() => show(el), 450); });
  document.addEventListener('pointerout', e => { if (cur && !(e.relatedTarget && cur.contains(e.relatedTarget))) { hide(); cur = null; } });
  for (const ev of ['pointerdown', 'keydown', 'wheel']) document.addEventListener(ev, hide, true);
  document.addEventListener('scroll', hide, true);
  window.DS = Object.assign(window.DS || {}, {
    /* Hinweis, der von der Mausposition abhängt: Box folgt dem Zeiger; leerer Text = keine Box */
    hoverTip(el, text, e) { if (e) { mx = e.clientX; my = e.clientY; } const html = text ? esc(text) : '';
      el.dataset.follow = '1'; if ((el.dataset.tip || '') === html) return; el.dataset.tip = html; el.removeAttribute('title');
      hide(); cur = el; if (html) timer = setTimeout(() => show(el), 600); },
    hideTip: hide,
  });
})();

/* =====================================================================
   Auswahllisten (<select>): Statt der eckigen System-Liste klappt ein abgerundetes Menü
   im Stil des Design-Systems auf (.ds-dd in design-system.css). Das <select> selbst bleibt
   erhalten – Wert, change-Ereignis und Tastatur (Pfeiltasten im zugeklappten Feld) funktionieren wie gewohnt.
   ===================================================================== */
(function () {
  let menu = null, sel = null, items = [], hi = -1;
  const close = () => { if (!menu) return; menu.remove(); menu = null; if (sel) sel.classList.remove('ds-open'); sel = null; items = []; };
  const pick = i => { const it = items[i]; if (!it || it.disabled) return; const s = sel; close();
    if (s.value !== it.value) { s.value = it.value; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); } s.focus(); };
  const mark = i => { items.forEach((it, k) => it.el.classList.toggle('hi', k === i)); hi = i; if (items[i]) items[i].el.scrollIntoView({ block: 'nearest' }); };
  function open(s) {
    close(); sel = s; s.classList.add('ds-open'); menu = document.createElement('div'); menu.className = 'ds-dd'; menu.setAttribute('role', 'listbox');
    const add = (o, inGroup) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = o.textContent; if (inGroup) b.classList.add('ing');
      if (o.selected) b.classList.add('on'); if (o.disabled) b.disabled = true; const i = items.length; items.push({ el: b, value: o.value, disabled: o.disabled });
      b.addEventListener('click', e => { e.stopPropagation(); pick(i); }); b.addEventListener('pointerenter', () => mark(i)); menu.append(b); };
    for (const ch of s.children) {
      if (ch.tagName === 'OPTGROUP') { const l = document.createElement('div'); l.className = 'grp'; l.textContent = ch.label; menu.append(l); for (const o of ch.children) add(o, true); }
      else if (ch.tagName === 'OPTION' && !ch.hidden) add(ch, false);
    }
    document.body.append(menu);
    const r = s.getBoundingClientRect(), w = Math.max(r.width, menu.offsetWidth), below = innerHeight - r.bottom - 10, above = r.top - 10;
    menu.style.minWidth = r.width + 'px'; menu.style.maxHeight = Math.max(120, Math.min(360, Math.max(below, above))) + 'px';
    const h = menu.offsetHeight; let x = Math.min(r.left, innerWidth - w - 8), y = below >= h || below >= above ? r.bottom + 4 : r.top - h - 4;
    menu.style.left = Math.max(8, x) + 'px'; menu.style.top = Math.max(8, y) + 'px';
    mark(items.findIndex(it => it.el.classList.contains('on')));
  }
  /* Mausklick auf ein <select>: System-Liste unterdrücken, eigenes Menü öffnen (zweiter Klick schließt) */
  document.addEventListener('mousedown', e => { const s = e.target.closest && e.target.closest('select');
    if (menu && !menu.contains(e.target) && (!s || s !== sel)) close();
    if (!s || s.multiple || s.size > 1 || s.disabled || e.button !== 0) return; e.preventDefault(); s.focus(); if (sel === s) close(); else open(s); }, true);
  document.addEventListener('keydown', e => {
    if (!menu) { const s = e.target; if (s && s.tagName === 'SELECT' && (e.key === 'Enter' || e.key === ' ' || (e.altKey && e.key === 'ArrowDown'))) { e.preventDefault(); open(s); } return; }
    const step = d => { let i = hi; for (let n = 0; n < items.length; n++) { i = (i + d + items.length) % items.length; if (!items[i].disabled) break; } mark(i); };
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); const s = sel; close(); s && s.focus(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); step(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); step(-1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); pick(hi); }
    else if (e.key === 'Tab') close();
  }, true);
  document.addEventListener('scroll', e => { if (menu && !menu.contains(e.target)) close(); }, true);
  window.addEventListener('resize', close); window.addEventListener('blur', close);
})();

/* =====================================================================
   Mac: Tastenbezeichnungen anpassen – „Strg“ wird zu ⌘, „Alt“ zu ⌥.
   (Die Kürzel selbst funktionieren auf dem Mac schon mit ⌘, die Apps prüfen ctrlKey ODER metaKey.)
   Wirkt auch auf später erscheinende Texte (Meldungen, Menüs, Hover-Infos). Zum Testen: ?mac=1
   ===================================================================== */
(function () {
  const mac = /Mac|iPhone|iPad/.test(navigator.platform || '') || /Mac OS X/.test(navigator.userAgent) || /[?&]mac=1/.test(location.search);
  if (!mac) return;
  document.documentElement.classList.add('ds-mac');
  const fix = s => s.replace(/\bStrg\s*\+\s*/g, '⌘').replace(/\bStrg\b/g, '⌘').replace(/\bAlt\s*\+\s*/g, '⌥').replace(/^\s*Alt\s*$/, '⌥');
  const need = s => s && (s.includes('Strg') || /\bAlt\b/.test(s));
  const attr = el => { for (const a of ['title', 'data-tip', 'aria-label']) { const v = el.getAttribute && el.getAttribute(a); if (need(v)) { const f = fix(v); if (f !== v) el.setAttribute(a, f); } } };
  const walk = n => {
    if (n.nodeType === 3) { if (need(n.nodeValue)) { const f = fix(n.nodeValue); if (f !== n.nodeValue) n.nodeValue = f; } return; }
    if (n.nodeType !== 1 || n.tagName === 'SCRIPT' || n.tagName === 'STYLE') return;
    attr(n); for (const c of n.childNodes) walk(c);
  };
  const start = () => {
    walk(document.body);
    new MutationObserver(ms => { for (const m of ms) {
      if (m.type === 'characterData') walk(m.target);
      else if (m.type === 'attributes') attr(m.target);
      else for (const n of m.addedNodes) walk(n);
    } }).observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['title', 'data-tip', 'aria-label'] });
  };
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
