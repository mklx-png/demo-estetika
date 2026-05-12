(function () {
  const script = document.currentScript;

  // ── CONFIG (editable via data attributes on the script tag) ─────────────────
  const API      = script?.dataset.api      || 'https://project-zk9l5.vercel.app/api/chat';
  const CLINIC   = script?.dataset.clinic   || 'DEMO ESTETIKA';
  const SUB      = script?.dataset.sub      || 'Asistentė';
  const COLOR    = script?.dataset.color    || '#c9a96e';
  const TOOLTIP  = script?.dataset.tooltip  || 'Pasiteirauk ir užsiregistruok 😊';
  const GREETING = script?.dataset.greeting || 'Sveiki! 👋 Galiu papasakoti apie procedūras, kainas ar padėti užsiregistruoti. Ką norėtumėte sužinoti?';
  const BOOK_BTN = script?.dataset.bookBtn  || '📅 Rezervuoti vizitą';
  const BOOK_MSG = script?.dataset.bookMsg  || 'Pasirinkite patogų laiką — registracija užtruks mažiau nei minutę.';

  // ── CSS ─────────────────────────────────────────────────────────────────────
  const css = `
    #cw-bubble {
      position:fixed;bottom:24px;right:24px;width:64px;height:64px;border-radius:50%;
      background:${COLOR};color:white;display:flex;align-items:center;justify-content:center;
      cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.2);z-index:9998;transition:transform 0.2s;
      font-family:-apple-system,sans-serif;animation:cwBubbleIn 0.5s cubic-bezier(0.175,0.885,0.32,1.275) 0.4s both;
    }
    @keyframes cwBubbleIn{from{opacity:0;transform:scale(0.4)}to{opacity:1;transform:scale(1)}}
    #cw-bubble:hover{transform:scale(1.08);filter:brightness(0.88)}
    #cw-bubble svg{width:28px;height:28px}
    #cw-badge{position:absolute;top:-6px;right:-6px;background:#ff4444;color:white;font-size:11px;
      width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;
      font-weight:bold;font-family:-apple-system,sans-serif}
    #cw-tooltip{
      position:fixed;bottom:104px;right:24px;background:#2c2c2c;color:#f0ebe4;font-size:12.5px;
      font-weight:400;letter-spacing:0.2px;line-height:1.5;padding:10px 16px;border-radius:20px;
      box-shadow:0 4px 18px rgba(0,0,0,0.18);white-space:nowrap;text-align:center;
      z-index:9997;font-family:-apple-system,BlinkMacSystemFont,sans-serif;
      animation:cwFadeUp 0.5s ease 1.2s both;
    }
    #cw-tooltip::after{content:'';position:absolute;bottom:-6px;right:28px;width:0;height:0;
      border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid #2c2c2c}
    @keyframes cwFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    #cw-panel{
      position:fixed;bottom:100px;right:24px;width:380px;max-width:calc(100vw - 32px);
      height:580px;max-height:calc(100vh - 120px);background:white;border-radius:16px;
      box-shadow:0 8px 40px rgba(0,0,0,0.18);display:none;flex-direction:column;
      z-index:9999;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,sans-serif;
      transition:height 0.35s ease,width 0.35s ease,bottom 0.35s ease;
    }
    #cw-panel.cw-open{display:flex;animation:cwPanelIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both}
    @keyframes cwPanelIn{from{opacity:0;transform:translateY(20px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
    #cw-panel.cw-expanded{height:calc(100vh - 40px);bottom:20px;width:420px}
    #cw-header{background:#2c2c2c;color:white;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
    #cw-header .cw-name{font-weight:600;font-size:15px;letter-spacing:1px}
    #cw-header .cw-sub{font-size:12px;color:#aaa;margin-top:2px}
    #cw-close{background:none;border:none;color:white;cursor:pointer;font-size:22px;padding:0;width:auto}
    #cw-restart{background:none;border:none;color:white;cursor:pointer;padding:4px;font-size:18px;line-height:1;transition:color 0.2s}
    #cw-restart:hover{color:${COLOR} !important}
    #cw-messages{flex:1;overflow-y:auto;padding:16px;background:#faf7f3;display:flex;flex-direction:column;gap:10px}
    .cw-msg{max-width:82%;padding:10px 14px;border-radius:14px;font-size:14px;line-height:1.5;word-wrap:break-word;animation:cwMsgIn 0.25s ease both}
    @keyframes cwMsgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .cw-msg.cw-ai{background:white;color:#333;align-self:flex-start;border-bottom-left-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,0.07)}
    .cw-msg.cw-ai a{color:${COLOR};font-weight:600}
    .cw-msg.cw-user{background:${COLOR};color:white;align-self:flex-end;border-bottom-right-radius:4px}
    .cw-card{align-self:flex-start;background:white;border:1.5px solid ${COLOR};border-radius:14px;border-bottom-left-radius:4px;
      padding:14px 16px;max-width:90%;box-shadow:0 1px 3px rgba(0,0,0,0.07);width:100%;animation:cwMsgIn 0.25s ease both}
    .cw-card p{font-size:13px;color:#666;margin-bottom:10px;line-height:1.4}
    .cw-book-btn{width:100%;padding:11px;background:${COLOR};color:white;border:none;border-radius:8px;
      font-size:14px;cursor:pointer;font-weight:600;letter-spacing:0.5px;display:flex;align-items:center;justify-content:center;gap:8px}
    .cw-book-btn:hover{filter:brightness(0.88)}
    .cw-contact-input{width:100%;padding:9px 12px;border:1px solid #ddd;border-radius:8px;
      font-size:16px;margin-bottom:8px;font-family:inherit;outline:none;box-sizing:border-box}
    .cw-contact-input:focus{border-color:${COLOR}}
    .cw-contact-input::placeholder{font-size:13px;color:#aaa}
    .cw-submit-btn{width:100%;padding:10px;background:${COLOR};color:white;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer}
    .cw-submit-btn:hover{filter:brightness(0.88)}
    .cw-submit-btn:disabled{background:#ccc;cursor:not-allowed}
    .cw-slot-btn{padding:8px 4px;background:#fdf6f0;border:1.5px solid ${COLOR};border-radius:8px;
      font-size:13px;font-weight:600;color:${COLOR};cursor:pointer;transition:all 0.15s;text-align:center}
    .cw-slot-btn:hover{background:${COLOR};color:white}
    .cw-slot-btn:disabled{opacity:0.35;cursor:not-allowed}
    .cw-cal-header{font-size:13px;font-weight:600;color:#2c2c2c;text-align:center;margin-bottom:10px}
    .cw-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}
    .cw-cal-dow{text-align:center;font-size:10px;font-weight:600;color:#bbb;text-transform:uppercase;padding:3px 0 5px}
    .cw-cal-day{text-align:center;font-size:13px;padding:6px 2px;border-radius:7px;line-height:1}
    .cw-cal-avail{background:#fdf6f0;border:1.5px solid ${COLOR};color:${COLOR};cursor:pointer;font-weight:600;transition:all 0.15s}
    .cw-cal-avail:hover,.cw-cal-sel{background:${COLOR} !important;color:white !important}
    .cw-cal-na,.cw-cal-past{color:#ddd}
    .cw-cal-times{margin-top:12px;border-top:1px solid #f0ebe4;padding-top:10px}
    .cw-time-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
    .cw-confirm{background:white;border:none;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,0.08);
      width:auto;max-width:200px;padding:16px 18px;text-align:left;align-self:flex-start;animation:cwMsgIn 0.25s ease both}
    .cw-confirm-icon{width:28px;height:28px;border-radius:50%;background:${COLOR};display:flex;
      align-items:center;justify-content:center;font-size:14px;margin-bottom:10px;color:white}
    .cw-confirm strong{color:#1a1a1a;font-size:13px;display:block;margin-bottom:8px;font-weight:600}
    .cw-confirm p{font-size:12px;color:#888;margin-bottom:4px;line-height:1.5}
    .cw-confirm p strong{color:#555;font-size:12px;display:inline}
    .cw-edit-btn{margin-top:10px;padding:0;background:transparent;border:none;color:${COLOR};
      font-size:11px;cursor:pointer;font-family:inherit;text-decoration:underline;text-underline-offset:2px}
    .cw-edit-btn:disabled{opacity:0.4;cursor:not-allowed}
    .cw-typing{display:flex;gap:4px;padding:12px 14px;background:white;border-radius:14px;
      align-self:flex-start;width:fit-content;box-shadow:0 1px 3px rgba(0,0,0,0.07)}
    .cw-typing span{width:7px;height:7px;background:${COLOR};border-radius:50%;animation:cwBounce 1.4s infinite ease-in-out}
    .cw-typing span:nth-child(2){animation-delay:0.2s}
    .cw-typing span:nth-child(3){animation-delay:0.4s}
    @keyframes cwBounce{0%,80%,100%{transform:scale(0.6);opacity:.5}40%{transform:scale(1);opacity:1}}
    #cw-input-wrap{padding:12px;background:white;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0}
    #cw-input{flex:1;padding:10px 14px;border:1px solid #ddd;border-radius:20px;font-size:16px;margin:0;outline:none;font-family:inherit}
    #cw-input:focus{border-color:${COLOR}}
    #cw-send{width:auto;padding:0 18px;background:${COLOR};color:white;border:none;border-radius:20px;cursor:pointer;font-size:14px;font-weight:600}
    #cw-send:disabled{background:#ccc;cursor:not-allowed}
    @media(max-width:600px){
      #cw-panel,#cw-panel.cw-open,#cw-panel.cw-expanded{
        top:0!important;left:0!important;right:0!important;bottom:0!important;
        width:100%!important;height:100dvh!important;max-width:100vw!important;max-height:100dvh!important;border-radius:0!important}
      #cw-input{font-size:16px}
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // ── HTML ─────────────────────────────────────────────────────────────────────
  const html = `
    <div id="cw-tooltip">${TOOLTIP}</div>
    <div id="cw-bubble" onclick="cwToggle()">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
      <div id="cw-badge">1</div>
    </div>
    <div id="cw-panel">
      <div id="cw-header">
        <div>
          <div class="cw-name">${CLINIC}</div>
          <div class="cw-sub">${SUB}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <button id="cw-restart" onclick="cwRestart()" title="Pradėti iš naujo">↺</button>
          <button id="cw-close" onclick="cwToggle()">×</button>
        </div>
      </div>
      <div id="cw-messages"></div>
      <div id="cw-input-wrap">
        <input type="text" id="cw-input" placeholder="Užduokite klausimą...">
        <button id="cw-send" onclick="cwSend()">Siųsti</button>
      </div>
      <div style="text-align:center;padding:8px;font-size:11px;color:#bbb;background:white;flex-shrink:0"></div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);

  // ── STATE ────────────────────────────────────────────────────────────────────
  const LT_DAYS   = ['Sekmadienis','Pirmadienis','Antradienis','Trečiadienis','Ketvirtadienis','Penktadienis','Šeštadienis'];
  const LT_MONTHS = ['Sausis','Vasaris','Kovas','Balandis','Gegužė','Birželis','Liepa','Rugpjūtis','Rugsėjis','Spalis','Lapkritis','Gruodis'];
  const BOOK_KW   = ['užsiregistruoti','registruotis','registracija','rezervuoti','rezervacija',
                     'užsisakyti','kada galima','laisvas laikas','vizitas','apsilankyti','book','booking','appointment'];

  let opened = false, bookingShown = false;
  let bookName = '', bookEmail = '', bookEventTypeId = null, bookingUid = null, allSlots = {};

  const panel   = () => document.getElementById('cw-panel');
  const msgsEl  = () => document.getElementById('cw-messages');
  const scrollB = () => { msgsEl().scrollTop = msgsEl().scrollHeight; };
  const hasKW   = t  => BOOK_KW.some(k => t.toLowerCase().includes(k));

  // ── MESSAGES ─────────────────────────────────────────────────────────────────
  function cwAddMsg(role, text) {
    const d = document.createElement('div');
    d.className = 'cw-msg cw-' + role;
    d.innerHTML = text.replace(/https?:\/\/cal\.com\/[^\s]*/g,'')
      .replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank">$1</a>').trim();
    msgsEl().appendChild(d); scrollB();
  }

  function cwType(text) {
    const plain = text.replace(/https?:\/\/cal\.com\/[^\s]*/g,'').trim();
    const d = document.createElement('div');
    d.className = 'cw-msg cw-ai';
    msgsEl().appendChild(d); scrollB();
    const chars = [...plain]; let i = 0;
    function step() {
      i++; d.textContent = chars.slice(0,i).join(''); scrollB();
      if (i < chars.length) setTimeout(step, 18);
      else d.innerHTML = plain.replace(/(https?:\/\/[^\s]+)/g,'<a href="$1" target="_blank">$1</a>');
    }
    step();
  }

  function cwCard(html) {
    const d = document.createElement('div'); d.innerHTML = html;
    msgsEl().appendChild(d.firstElementChild); scrollB();
  }

  function cwTyping() {
    const d = document.createElement('div');
    d.className = 'cw-typing'; d.id = 'cw-typing';
    d.innerHTML = '<span></span><span></span><span></span>';
    msgsEl().appendChild(d); scrollB();
  }
  function cwHideTyping() { document.getElementById('cw-typing')?.remove(); }

  // ── BOOKING FLOW ─────────────────────────────────────────────────────────────
  function cwShowBookBtn() {
    if (bookingShown) return; bookingShown = true;
    cwCard(`<div class="cw-card"><p>${BOOK_MSG}</p><button class="cw-book-btn" onclick="cwStartBooking()">${BOOK_BTN}</button></div>`);
  }

  window.cwStartBooking = function() {
    cwCard(`<div class="cw-card" id="cw-contact">
      <p>Įveskite savo kontaktus:</p>
      <input class="cw-contact-input" type="text" id="cw-name" placeholder="Vardas Pavardė">
      <input class="cw-contact-input" type="email" id="cw-email" placeholder="el.pastas@gmail.com">
      <button class="cw-submit-btn" id="cw-submit" onclick="cwSubmitContact()">Toliau →</button>
    </div>`);
  };

  window.cwSubmitContact = async function() {
    const n = document.getElementById('cw-name')?.value.trim();
    const e = document.getElementById('cw-email')?.value.trim();
    const btn = document.getElementById('cw-submit');
    if (!n || !e) { alert('Įveskite vardą ir el. paštą'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) { alert('Įveskite teisingą el. paštą'); return; }
    if (btn) { btn.disabled = true; btn.textContent = 'Kraunama...'; }
    bookName = n; bookEmail = e;
    const card = document.getElementById('cw-contact');
    if (card) card.innerHTML = `
      <p style="margin-bottom:8px;font-weight:600;font-size:13px;color:#333">Kontaktai patvirtinti ✓</p>
      <div style="background:#f5f5f5;border-radius:8px;padding:8px 12px;font-size:13px;color:#555;line-height:1.8">
        <div>👤 ${n}</div><div>✉️ ${e}</div></div>`;
    cwTyping();
    try {
      const res = await fetch(API + '?action=slots');
      const data = await res.json();
      cwHideTyping();
      if (data.error) throw new Error(data.error);
      bookEventTypeId = data.eventTypeId;
      cwShowSlots(data.slots);
    } catch { cwHideTyping(); cwType('Nepavyko gauti laisvų laikų. Bandykite vėliau.'); }
  };

  function cwShowSlots(slots) {
    allSlots = slots;
    const avail = new Set(Object.keys(slots).filter(d =>
      slots[d].some(s => { const m = new Date(s.time).getMinutes(); return m===0||m===30; })));
    if (!avail.size) { cwType('Šiuo metu laisvų laikų nėra. Pabandykite vėliau.'); return; }
    const first = new Date([...avail].sort()[0]+'T12:00:00Z');
    const yr = first.getUTCFullYear(), mo = first.getUTCMonth();
    const dim = new Date(Date.UTC(yr,mo+1,0)).getUTCDate();
    const fdow = (new Date(Date.UTC(yr,mo,1)).getUTCDay()+6)%7;
    const today = new Date().toISOString().slice(0,10);
    const DOW = ['Pr','An','Tr','Kt','Pn','Št','Sk'];
    let html = `<div class="cw-card"><p style="margin-bottom:10px">Pasirinkite dieną:</p>
      <div class="cw-cal-header">${LT_MONTHS[mo]} ${yr}</div>
      <div class="cw-cal-grid">`;
    for (const h of DOW) html += `<div class="cw-cal-dow">${h}</div>`;
    for (let i=0;i<fdow;i++) html += `<div class="cw-cal-day"></div>`;
    for (let d=1;d<=dim;d++) {
      const ds = `${yr}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      html += ds<today||!avail.has(ds)
        ? `<div class="cw-cal-day ${ds<today?'cw-cal-past':'cw-cal-na'}">${d}</div>`
        : `<div class="cw-cal-day cw-cal-avail" onclick="cwSelectDay('${ds}',this)">${d}</div>`;
    }
    html += `</div><div class="cw-cal-times" id="cw-times"></div></div>`;
    cwCard(html);
    panel().classList.add('cw-expanded');
  }

  window.cwSelectDay = function(ds, el) {
    document.querySelectorAll('.cw-cal-avail').forEach(d=>d.classList.remove('cw-cal-sel'));
    el.classList.add('cw-cal-sel');
    const timesEl = document.getElementById('cw-times');
    if (!timesEl) return;
    const daySlots = (allSlots[ds]||[]).filter(s=>{const m=new Date(s.time).getMinutes();return m===0||m===30;});
    if (!daySlots.length) { timesEl.innerHTML='<p style="font-size:12px;color:#999">Šią dieną laikų nėra.</p>'; return; }
    const d = new Date(ds+'T12:00:00Z');
    const label = LT_DAYS[d.getUTCDay()]+', '+d.getUTCDate()+' '+LT_MONTHS[d.getUTCMonth()];
    let html = `<p style="font-size:12px;font-weight:600;color:#999;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px">${label}</p><div class="cw-time-grid">`;
    for (const slot of daySlots) {
      const t = new Date(slot.time);
      const hhmm = t.toLocaleTimeString('lt-LT',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Vilnius'});
      html += `<button class="cw-slot-btn" onclick="cwPreConfirm('${slot.time}','${label}, ${hhmm}')">${hhmm}</button>`;
    }
    timesEl.innerHTML = html+'</div>';
    scrollB();
  };

  window.cwPreConfirm = function(start, label) {
    document.querySelectorAll('.cw-slot-btn').forEach(b=>{b.disabled=true;b.style.opacity='0.45';});
    cwCard(`<div class="cw-card" id="cw-preconfirm">
      <p>Pasirinktas laikas:</p>
      <div style="font-weight:600;font-size:14px;color:#2c2c2c;margin-bottom:14px">🕐 ${label}</div>
      <div style="display:flex;gap:8px">
        <button onclick="cwBook('${start.replace(/'/g,"\\'")}','${label.replace(/'/g,"\\'")}');document.querySelectorAll('#cw-preconfirm button').forEach(b=>b.disabled=true)"
          style="flex:1;padding:10px;background:${COLOR};color:white;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">Patvirtinti ✓</button>
        <button onclick="cwCancelPreConfirm()"
          style="flex:1;padding:10px;background:#f0ebe4;color:#555;border:none;border-radius:10px;font-size:14px;cursor:pointer">Atšaukti</button>
      </div></div>`);
  };

  window.cwCancelPreConfirm = function() {
    document.getElementById('cw-preconfirm')?.remove();
    document.querySelectorAll('.cw-slot-btn').forEach(b=>{b.disabled=false;b.style.opacity='1';});
  };

  window.cwBook = async function(start, label) {
    document.getElementById('cw-preconfirm')?.remove();
    cwAddMsg('user','🕐 '+label);
    cwTyping();
    try {
      const params = new URLSearchParams({action:'book',start,name:bookName,email:bookEmail,eventTypeId:bookEventTypeId});
      const res = await fetch(API+'?'+params);
      const data = await res.json();
      cwHideTyping();
      if (data.status==='error'||data.error) throw new Error(data.message||data.error);
      bookingUid = data.data?.uid||data.uid||data.bookingId||data.id||null;
      panel().classList.remove('cw-expanded');
      cwCard(`<div class="cw-confirm">
        <div class="cw-confirm-icon">✓</div>
        <strong>Vizitas užregistruotas!</strong>
        <p style="margin-top:6px">${label}</p>
        <p>Patvirtinimas išsiųstas į<br><strong>${bookEmail}</strong></p>
        <button class="cw-edit-btn" onclick="cwEditBooking()">✏️ Keisti vizito laiką</button>
      </div>`);
    } catch { cwHideTyping(); cwType('Nepavyko užregistruoti. Bandykite dar kartą arba skambinkite tiesiogiai.'); }
  };

  window.cwEditBooking = async function() {
    const btn = document.querySelector('.cw-edit-btn');
    if (btn) { btn.disabled=true; btn.textContent='Atšaukiama...'; }
    try {
      if (bookingUid) {
        const res = await fetch(API+'?action=cancel&bookingUid='+encodeURIComponent(bookingUid));
        const data = await res.json();
        if (data.error) throw new Error(data.error);
      }
      bookingUid = null;
      document.querySelector('.cw-confirm')?.remove();
      panel().classList.add('cw-expanded');
      cwType('Vizitas atšauktas. Pasirinkite naują laiką:');
      cwTyping();
      const r2 = await fetch(API+'?action=slots');
      const d2 = await r2.json();
      cwHideTyping();
      if (d2.error) throw new Error(d2.error);
      bookEventTypeId = d2.eventTypeId;
      cwShowSlots(d2.slots);
    } catch {
      cwHideTyping();
      if (btn) { btn.disabled=false; btn.textContent='✏️ Keisti vizito laiką'; }
      cwType('Nepavyko atšaukti. Skambinkite tiesiogiai.');
    }
  };

  // ── CHAT ─────────────────────────────────────────────────────────────────────
  window.cwSend = async function() {
    const input = document.getElementById('cw-input');
    const btn = document.getElementById('cw-send');
    const text = input.value.trim();
    if (!text) return;
    const wantsBook = hasKW(text);
    cwAddMsg('user', text);
    input.value=''; input.disabled=true; btn.disabled=true;
    cwTyping();
    try {
      const res = await fetch(API+'?message='+encodeURIComponent(text));
      const data = await res.json();
      cwHideTyping();
      cwType(data.reply||'Atsiprašau, įvyko klaida.');
      if (wantsBook||hasKW(data.reply||'')) setTimeout(cwShowBookBtn, 400);
    } catch { cwHideTyping(); cwType('Atsiprašau, prarastas ryšys. Bandykite dar kartą.'); }
    input.disabled=false; btn.disabled=false; input.focus();
  };

  document.getElementById('cw-input').addEventListener('keypress', e => { if (e.key==='Enter') cwSend(); });

  // ── PANEL TOGGLE / RESTART ────────────────────────────────────────────────────
  function cwBodyLock(on) {
    if (window.innerWidth>600) return;
    document.body.style.overflow = on ? 'hidden' : '';
  }

  function cwUpdateHeight() {
    if (window.innerWidth>600) return;
    const p = panel();
    if (!p.classList.contains('cw-open')) return;
    const vp = window.visualViewport;
    if (vp) { p.style.height=vp.height+'px'; p.style.top=vp.offsetTop+'px'; }
  }

  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', cwUpdateHeight);
    window.visualViewport.addEventListener('scroll', cwUpdateHeight);
  }

  window.cwToggle = function() {
    const p = panel();
    p.classList.toggle('cw-open');
    document.getElementById('cw-badge').style.display='none';
    document.getElementById('cw-tooltip').style.display='none';
    cwBodyLock(p.classList.contains('cw-open'));
    if (!opened && p.classList.contains('cw-open')) {
      opened = true;
      cwType(GREETING);
      setTimeout(cwShowBookBtn, 300);
    }
  };

  window.cwRestart = function() {
    msgsEl().innerHTML='';
    panel().classList.remove('cw-expanded');
    opened=true; bookingShown=false;
    bookName=''; bookEmail=''; bookEventTypeId=null; bookingUid=null;
    cwType(GREETING);
    setTimeout(cwShowBookBtn, 300);
  };
})();
