/* Vintage Newspaper Maker - vanilla JS, no backend */
const $ = s => document.querySelector(s);
const SIZES = { A4: [794, 1123, 210, 297], A3: [1123, 1587, 297, 420], Letter: [816, 1056, 215.9, 279.4] }; // px@96dpi, mm
const KEY = 'vnm_projects';

/* ---------- Sample content ---------- */
const TPL = [
  ['Classic 1920s', 'The Daily Courier', 'JAZZ AGE CROWDS FILL CITY SQUARE AS NEW BRIDGE OPENS', 'Thousands gather to witness the ribbon cut at dawn'],
  ['Breaking News Edition', 'The Morning Extra', 'Extra! Harbor Fire Sends City Racing to the Docks', 'Fire crews battle the blaze through the night'],
  ['Old English', 'The London Gazette', 'Royal Fair Brings Joy to the Countryside', 'Merchants and farmers celebrate a record harvest'],
  ['1940s Historical', 'The Evening Standard', 'Peace Declared: Nation Rejoices', 'Church bells ring from coast to coast'],
  ['Vintage Sepia', 'The Weekly Chronicle', 'Old Town Market Returns After Long Winter', 'Stalls reopen with fresh bread, flowers and music'],
  ['Bold Headline', 'The City Herald', 'Record Crowd Cheers Home Team to Victory', 'A last-minute goal stuns the visitors'],
  ['Minimal Classic', 'The Quiet Times', 'New Library Opens Its Doors to Readers', 'A century-old building finds a second life'],
  ['War-Time', 'The Bulletin', 'Factories Work Around the Clock', 'Citizens urged to conserve and support the effort'],
  ['Editorial', 'The Observer', 'Why Our Cities Need Public Gardens', 'An editorial on the value of shared green space'],
  ['Modern Vintage', 'The Saturday Review', 'Moon Landing Fever Grips the Nation', 'Families gather around their television sets']
];
const PHOTO = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cbb98f"/><stop offset="1" stop-color="#8a7451"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><path d="M0 300 L120 190 L220 270 L340 150 L460 260 L600 180 V400 H0Z" fill="#4a3d2a"/><circle cx="470" cy="90" r="38" fill="#efe3c2"/></svg>');
const BODY = `Crowds began arriving well before sunrise, filling the streets with chatter and the smell of fresh bread. By midmorning the square was packed from one end to the other, and officials took their places on the wooden platform.\n\nThe mayor praised the people of the city for their patience and hard work, noting that every family had played a part in bringing the day about. "This is a day we shall remember," he told the cheering audience.\n\nLocal shopkeepers reported brisk business, while children climbed lampposts for a better view. Musicians played until late in the evening as lanterns were lit along the avenue.\n\nObservers say the occasion marks the beginning of a new chapter for the district, with further improvements promised before the year is out.`;
const EXTRAS = [
  ['Market Prices Hold Steady', 'Grain and produce merchants report calm trading this week, with prices unchanged since the last market day.'],
  ['Weather Outlook', 'Clear skies are expected through the weekend, with mild evenings and a light breeze from the west.'],
  ['Notices & Events', 'The Town Hall will host a public meeting on Thursday at seven o\'clock. All residents are welcome to attend.']
];
function sample(i) {
  const t = TPL[i], d = { mast: t[1], issue: 'Vol. XXIV · No. 128', date: '1945-05-08', head: t[2], sub: t[3], by: 'Staff Reporter', body: BODY, photo: PHOTO, cap: 'A view of the celebrations, as photographed for this edition.' };
  EXTRAS.forEach((e, k) => { d['e' + (k + 1) + 'h'] = e[0]; d['e' + (k + 1) + 't'] = e[1]; });
  return { id: 'p' + Date.now() + Math.random().toString(36).slice(2, 6), name: 'Untitled ' + t[0], tpl: i + 1, d, page: { size: 'A4', orient: 'portrait' }, updated: Date.now() };
}

/* ---------- Rendering ---------- */
const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pagePx = p => { const [w, h] = SIZES[p.page.size]; return p.page.orient === 'landscape' ? [h, w] : [w, h]; };
function render(p) {
  const d = p.d, [w, h] = pagePx(p);
  const km = d.font && d.font !== 'default';
  const dt = d.date ? new Date(d.date + 'T12:00:00').toLocaleDateString(km ? 'km-KH' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const paras = (d.body || '').split(/\n\s*\n/).filter(x => x.trim()).map(x => `<p>${esc(x.trim())}</p>`).join('');
  const ex = [1, 2, 3].map(i => (d['e' + i + 'h'] || d['e' + i + 't']) ? `<aside class="x x${i}"><h4>${esc(d['e' + i + 'h'])}</h4><p>${esc(d['e' + i + 't'])}</p></aside>` : '').join('');
  const len = (d.head || '').length, hs = len > 90 ? .55 : len > 60 ? .7 : len > 35 ? .85 : 1;
  return `<div class="paper t${p.tpl}${km ? ' fk fk-' + d.font : ''}" style="width:${w}px;min-height:${h}px;--hs:${hs}">
    <header class="m"><h1>${esc(d.mast)}</h1><div class="dl"><span>${esc(d.issue)}</span><span>${esc(dt)}</span><span>${km ? 'តម្លៃ ៥០០ រៀល' : 'Price: Two Cents'}</span></div></header>
    <section class="l"><h2>${esc(d.head)}</h2>${d.sub ? `<h3>${esc(d.sub)}</h3>` : ''}${d.by ? `<p class="by">By ${esc(d.by)}</p>` : ''}</section>
    ${d.photo ? `<figure class="f"><img src="${d.photo}" alt="">${d.cap ? `<figcaption>${esc(d.cap)}</figcaption>` : ''}</figure>` : ''}
    <article class="b">${paras}</article>${ex}</div>`;
}
function thumb(p, width = 210) {
  const [w, h] = pagePx(p), s = width / w;
  return `<div class="thumb" style="width:${width}px;height:${h * s}px"><div style="transform:scale(${s});transform-origin:0 0;width:${w}px">${render(p)}</div></div>`;
}

/* ---------- Storage ---------- */
let projects = [];
try { projects = JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { projects = []; }
function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(projects)); return true; }
  catch (e) { toast('Browser storage is full. Export projects to files and delete some, or use smaller photos.'); return false; }
}
let tt;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.style.display = 'block'; clearTimeout(tt); tt = setTimeout(() => t.style.display = 'none', 3500); }
function download(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); }

/* ---------- Views ---------- */
function show(v) {
  document.querySelectorAll('.view').forEach(e => e.classList.toggle('on', e.id === v));
  if (v === 'projects') listProjects();
  if (v === 'editor') fit();
  window.scrollTo(0, 0);
}
document.querySelectorAll('[data-go]').forEach(b => b.onclick = () => show(b.dataset.go));

function buildGallery() {
  $('#gal').innerHTML = TPL.map((t, i) => `<div class="card" data-i="${i}">${thumb(sample(i))}<h3>${i + 1}. ${t[0]}</h3><button>Use this template</button></div>`).join('');
  document.querySelectorAll('#gal .card').forEach(c => c.onclick = () => openEditor(sample(+c.dataset.i), true));
}

function listProjects() {
  const L = [...projects].sort((a, b) => b.updated - a.updated);
  if (!L.length) { $('#plist').innerHTML = '<div class="empty">No saved projects yet. Choose a template, edit it, then press <b>Save</b>.</div>'; return; }
  $('#plist').innerHTML = L.map(p => `<div class="card" data-id="${p.id}">${thumb(p)}<h3>${esc(p.name)}</h3><small>Edited ${new Date(p.updated).toLocaleString()}</small>
    <button data-a="open">Open</button><button data-a="ren">Rename</button><button data-a="dup">Duplicate</button><button data-a="exp">Export</button><button data-a="del">Delete</button></div>`).join('');
  document.querySelectorAll('#plist .card').forEach(c => {
    const p = projects.find(x => x.id === c.dataset.id);
    c.querySelector('.thumb').onclick = () => openEditor(p);
    c.querySelectorAll('button').forEach(b => b.onclick = () => {
      const a = b.dataset.a;
      if (a === 'open') openEditor(p);
      if (a === 'ren') { const n = prompt('New project name:', p.name); if (n && n.trim()) { p.name = n.trim().slice(0, 60); p.updated = Date.now(); persist(); listProjects(); } }
      if (a === 'dup') { projects.push({ ...JSON.parse(JSON.stringify(p)), id: 'p' + Date.now(), name: p.name + ' (copy)', updated: Date.now() }); if (persist()) listProjects(); }
      if (a === 'exp') download(new Blob([JSON.stringify(p)], { type: 'application/json' }), p.name.replace(/\W+/g, '_') + '.vnm.json');
      if (a === 'del' && confirm('Delete "' + p.name + '"? This cannot be undone.')) { projects = projects.filter(x => x.id !== p.id); persist(); listProjects(); }
    });
  });
}
$('#bImport').onclick = () => $('#impFile').click();
$('#impFile').onchange = e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  const r = new FileReader();
  r.onload = () => {
    try {
      const p = JSON.parse(r.result);
      if (!p || !p.d || !SIZES[p.page && p.page.size] || !(p.tpl >= 1 && p.tpl <= 10)) throw 0;
      p.id = 'p' + Date.now(); p.updated = Date.now(); projects.push(p);
      if (persist()) { listProjects(); toast('Project imported.'); }
    } catch (x) { toast('That file is not a valid newspaper project.'); }
  };
  r.readAsText(f);
};

/* ---------- Editor ---------- */
let cur = null, hist = [], hi = -1, ht;
const FIELDS = [
  ['Masthead & Date', [['mast', 'Newspaper name'], ['issue', 'Edition / issue number'], ['date', 'Publication date', 'date']]],
  ['Main Story', [['head', 'Main headline *'], ['sub', 'Subheadline'], ['by', 'Author name'], ['body', 'Article content (blank line = new paragraph)', 'area', 8]]],
  ['Photograph', 'photo'],
  ['More Stories', [['e1h', 'Headline 2'], ['e1t', 'Short article 2', 'area'], ['e2h', 'Headline 3'], ['e2t', 'Short article 3', 'area'], ['e3h', 'Headline 4'], ['e3t', 'Short article 4', 'area']]]
];
function buildForm() {
  const inp = f => f[2] === 'area' ? `<textarea data-k="${f[0]}"></textarea>` : `<input data-k="${f[0]}" type="${f[2] || 'text'}">`;
  let h = `<fieldset><legend>Layout</legend><label>Template</label><select id="fTpl">${TPL.map((t, i) => `<option value="${i + 1}">${i + 1}. ${t[0]}</option>`).join('')}</select>
    <label>Font style</label><select id="fFont"><option value="default">Template default (English)</option><option value="km1">Khmer Vintage · Moul + Hanuman</option><option value="km2">Khmer Classic · Bokor + Battambang</option><option value="km3">Khmer Bold · Koulen + Noto Serif</option><option value="km4">Khmer Formal · Moulpali + Hanuman</option></select><button type="button" id="fKm" style="margin-top:6px">Fill with Khmer sample text</button>
    <label>Page size</label><select id="fSize">${Object.keys(SIZES).map(s => `<option>${s}</option>`).join('')}</select>
    <label>Orientation</label><select id="fOri"><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select></fieldset>`;
  FIELDS.forEach(([title, fs]) => {
    h += `<fieldset><legend>${title}</legend>`;
    if (fs === 'photo') h += `<label>Upload photo (JPG, PNG, WebP, GIF)</label><input id="fPhoto" type="file" accept="image/*"><label>Photo style</label><select id="fTone"><option value="grayscale(1) contrast(1.1)">Black &amp; white</option><option value="sepia(.85) contrast(1.05)">Sepia</option><option value="none">Original colors</option></select><div class="err" id="photoErr"></div><button type="button" id="fNoPhoto">Remove photo</button><label>Caption</label><input data-k="cap">`;
    else fs.forEach(f => { h += `<label>${f[1]}</label>${inp(f)}${f[0] === 'head' ? '<div class="err" id="headErr"></div>' : ''}`; });
    h += '</fieldset>';
  });
  $('#panel').innerHTML = h;
  $('#panel').oninput = e => {
    const k = e.target.dataset.k; if (!k) return;
    cur.d[k] = e.target.value; refresh(); queueSnap();
  };
  $('#fTpl').onchange = e => { cur.tpl = +e.target.value; refresh(); snap(); };
  $('#fFont').onchange = e => { cur.d.font = e.target.value; refresh(); snap(); };
  $('#fKm').onclick = () => {
    Object.assign(cur.d, {
      font: 'km1', mast: 'ភ្នំពេញប្រចាំថ្ងៃ', issue: 'លេខ ១២៨', by: 'អ្នកយកព័ត៌មាន',
      head: 'ពិធីបុណ្យអុំទូកបើកដំណើរការយ៉ាងអធិកអធម', sub: 'ប្រជាពលរដ្ឋរាប់ពាន់នាក់ចូលរួមនៅមាត់ទន្លេ',
      body: 'ព្រឹកនេះ ប្រជាពលរដ្ឋជាច្រើនបានមកជួបជុំគ្នានៅមាត់ទន្លេ ដើម្បីទស្សនាការប្រណាំងទូកដ៏ធំ។ បរិយាកាសពោរពេញដោយភាពសប្បាយរីករាយ។\n\nអាជ្ញាធរបានអំពាវនាវឱ្យប្រជាជនរក្សាសុវត្ថិភាព និងសណ្តាប់ធ្នាប់ក្នុងអំឡុងពេលកម្មវិធី។',
      cap: 'ទិដ្ឋភាពនៃពិធីបុណ្យ ដូចដែលបានថតសម្រាប់ព្រឹត្តិបត្រនេះ។',
      e1h: 'តម្លៃទីផ្សារ', e1t: 'តម្លៃទំនិញនៅទីផ្សារមានស្ថិរភាពក្នុងសប្តាហ៍នេះ។',
      e2h: 'អាកាសធាតុ', e2t: 'អាកាសធាតុល្អ មានពន្លឺថ្ងៃពេញមួយចុងសប្តាហ៍។',
      e3h: 'ដំណឹងសំខាន់ៗ', e3t: 'កិច្ចប្រជុំសាធារណៈនឹងប្រព្រឹត្តទៅនៅសាលាឃុំថ្ងៃព្រហស្បតិ៍។'
    });
    fillForm(); refresh(); snap(); toast('Khmer sample text loaded.');
  };
  $('#fSize').onchange = e => { cur.page.size = e.target.value; refresh(); snap(); };
  $('#fOri').onchange = e => { cur.page.orient = e.target.value; refresh(); snap(); };
  $('#fNoPhoto').onclick = () => { cur.d.photo = ''; refresh(); snap(); };
  $('#fPhoto').onchange = e => {
    const f = e.target.files[0], err = $('#photoErr'); err.textContent = ''; if (!f) return;
    if (!/^image\/(jpeg|png|webp|gif)$/.test(f.type)) { err.textContent = 'Invalid file. Please choose a JPG, PNG, WebP or GIF image.'; e.target.value = ''; return; }
    if (f.size > 15e6) { err.textContent = 'Image is larger than 15 MB. Please choose a smaller one.'; e.target.value = ''; return; }
    const url = URL.createObjectURL(f), img = new Image();
    img.onerror = () => { err.textContent = 'This image could not be read. It may be corrupted.'; URL.revokeObjectURL(url); };
    img.onload = () => {
      const s = Math.min(1, 1600 / Math.max(img.width, img.height)), c = document.createElement('canvas');
      c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
      const x = c.getContext('2d'); x.filter = $('#fTone').value; x.drawImage(img, 0, 0, c.width, c.height);
      cur.d.photo = c.toDataURL('image/jpeg', .88); URL.revokeObjectURL(url); refresh(); snap();
    };
    img.src = url;
  };
}
function fillForm() {
  document.querySelectorAll('#panel [data-k]').forEach(i => i.value = cur.d[i.dataset.k] || '');
  $('#fTpl').value = cur.tpl; $('#fFont').value = cur.d.font || 'default'; $('#fSize').value = cur.page.size; $('#fOri').value = cur.page.orient; $('#pname').value = cur.name;
}
function openEditor(p, isNew) {
  cur = JSON.parse(JSON.stringify(p)); cur.isNew = !!isNew;
  if (!$('#fTpl')) buildForm();
  fillForm(); hist = []; hi = -1; snap(); refresh(); show('editor');
}
function refresh() {
  $('#prev').innerHTML = render(cur);
  $('#headErr').textContent = cur.d.head.trim() ? '' : 'Please enter a headline.';
  fit(); updUndo();
}
function fit() {
  const p = $('#prev').firstElementChild; if (!p) return;
  const st = $('#stage'), w = p.offsetWidth, s = Math.min(1, (st.clientWidth - 20) / w);
  $('#prev').style.transform = `scale(${s})`;
  $('#wrap').style.width = w * s + 'px'; $('#wrap').style.height = p.offsetHeight * s + 'px';
}
addEventListener('resize', fit);

/* undo / redo */
const state = () => JSON.stringify({ tpl: cur.tpl, d: cur.d, page: cur.page });
function snap() { const s = state(); if (hist[hi] === s) return; hist = hist.slice(0, hi + 1); hist.push(s); if (hist.length > 40) hist.shift(); hi = hist.length - 1; updUndo(); }
function queueSnap() { clearTimeout(ht); ht = setTimeout(snap, 500); }
function updUndo() { $('#bUndo').disabled = hi <= 0; $('#bRedo').disabled = hi >= hist.length - 1; }
function go(n) { if (hi + n < 0 || hi + n >= hist.length) return; hi += n; Object.assign(cur, JSON.parse(hist[hi])); fillForm(); refresh(); }
$('#bUndo').onclick = () => { clearTimeout(ht); snap(); go(-1); };
$('#bRedo').onclick = () => go(1);
document.addEventListener('keydown', e => {
  if (!$('#editor').classList.contains('on') || !(e.ctrlKey || e.metaKey)) return;
  if (e.key === 's') { e.preventDefault(); $('#bSave').click(); }
});

/* save */
$('#pname').oninput = e => cur.name = e.target.value.slice(0, 60);
$('#bSave').onclick = () => {
  cur.name = $('#pname').value.trim() || 'Untitled newspaper'; cur.updated = Date.now();
  const { isNew, ...p } = JSON.parse(JSON.stringify(cur)), i = projects.findIndex(x => x.id === p.id);
  if (i >= 0) projects[i] = p; else projects.push(p);
  if (persist()) toast('Project saved: ' + cur.name);
};

/* ---------- Export & print ---------- */
function validate() { if (!cur.d.head.trim()) { toast('Please add a main headline before exporting.'); $('[data-k=head]').focus(); return false; } return true; }
$('#bDown').onclick = () => {
  if (!validate()) return;
  $('#fname').value = ($('#pname').value.trim() || 'My_Newspaper').replace(/\s+/g, '_');
  $('#dlg').showModal();
};
$('#ffmt').onchange = () => $('#qrow').style.display = $('#ffmt').value === 'jpg' ? 'block' : 'none';
$('#qrow').style.display = 'none';
$('#dform').onsubmit = e => { if (e.submitter && e.submitter.value === 'go') doExport(); };

async function doExport() {
  if (!window.html2canvas || !window.jspdf) { toast('Export libraries did not load. Check your internet connection and reload.'); return; }
  const name = ($('#fname').value.trim() || 'newspaper').replace(/[\\/:*?"<>|]+/g, '_');
  const fmt = $('#ffmt').value, sc = +$('#fscale').value, q = +$('#fq').value / 100;
  const box = document.createElement('div'); box.style.cssText = 'position:fixed;left:-99999px;top:0';
  box.innerHTML = render(cur); document.body.append(box);
  toast('Preparing ' + fmt.toUpperCase() + '…');
  try {
    await document.fonts.ready;
    await Promise.all([...box.querySelectorAll('img')].map(i => i.decode().catch(() => { })));
    const cv = await html2canvas(box.firstElementChild, { scale: sc, useCORS: true, backgroundColor: null });
    if (fmt === 'pdf') {
      const [, , mw, mh] = SIZES[cur.page.size], land = cur.page.orient === 'landscape';
      const pw = land ? mh : mw, ph = land ? mw : mh;
      const pdf = new jspdf.jsPDF({ orientation: land ? 'l' : 'p', unit: 'mm', format: [mw, mh] });
      const r = Math.min(pw / cv.width, ph / cv.height), iw = cv.width * r, ih = cv.height * r;
      pdf.addImage(cv.toDataURL('image/jpeg', .95), 'JPEG', (pw - iw) / 2, 0, iw, ih);
      pdf.save(name + '.pdf');
    } else {
      const mime = fmt === 'png' ? 'image/png' : 'image/jpeg';
      cv.toBlob(b => b ? download(b, name + '.' + fmt) : toast('Image too large for this browser. Try a lower resolution.'), mime, q);
    }
    toast('Download started: ' + name + '.' + fmt);
  } catch (err) { toast('Export failed: ' + err.message); }
  finally { box.remove(); }
}

$('#bPrint').onclick = () => {
  if (!validate()) return;
  const [, , mw, mh] = SIZES[cur.page.size], land = cur.page.orient === 'landscape';
  let st = $('#pageStyle'); if (!st) { st = document.createElement('style'); st.id = 'pageStyle'; document.head.append(st); }
  st.textContent = `@page{size:${land ? mh : mw}mm ${land ? mw : mh}mm;margin:0}`;
  const root = $('#printRoot'); root.innerHTML = render(cur);
  const pp = root.firstElementChild, [w] = pagePx(cur);
  pp.style.zoom = ((land ? mh : mw) / 25.4 * 96) / w; // fit page width exactly
  document.fonts.ready.then(() => { print(); root.innerHTML = ''; });
};

/* ---------- Start ---------- */
buildGallery();
show('home');
