const DB = {
  s: {
    org: 'องค์การบริหารส่วนตำบลบก',
    addr: 'ตำบลบก อำเภอโนนคูณ จังหวัดศรีสะเกษ ๓๓๑๒๐',
    signer: 'นายไพจิตร สมหวัง',
    pos: 'นายกองค์การบริหารส่วนตำบลบก',
    geminiKey: ''
  },
  reg: { no: 0, y: new Date().getFullYear() + 543 },
  list: []
};

function thaiDate(d=new Date()) {
  const m = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear()+543}`;
}
function saveAll() {
  localStorage.setItem('obt_bk', JSON.stringify({v:'3.0', db:DB}));
  updateList();
}
function loadAll() {
  const s = localStorage.getItem('obt_bk');
  if(s) Object.assign(DB, JSON.parse(s).db);
  document.getElementById('orgName').value = DB.s.org;
  document.getElementById('orgAddress').value = DB.s.addr;
  document.getElementById('signerName').value = DB.s.signer;
  document.getElementById('signerPos').value = DB.s.pos;
  document.getElementById('geminiKey').value = DB.s.geminiKey;
  updatePreview(); updateList();
}
function saveSettings() {
  DB.s.org = document.getElementById('orgName').value;
  DB.s.addr = document.getElementById('orgAddress').value;
  DB.s.signer = document.getElementById('signerName').value;
  DB.s.pos = document.getElementById('signerPos').value;
  DB.s.geminiKey = document.getElementById('geminiKey').value.trim();
  saveAll(); alert('✅ บันทึกแล้ว');
}
function garudaImg(isInt) {
  const h = isInt ? 'g-int' : 'g-ext';
  return `<div class="garuda"><img src="images/garuda.png" alt="ตรา" onerror="this.parentElement.innerHTML='☗'"></div>`;
}
function build() {
  const n = String(DB.reg.no+1).padStart(3,'0');
  const {org,addr,signer,pos} = DB.s;
  const t = document.getElementById('docType').value;
  const sub = document.getElementById('docSubject').value || '....................';
  const to = document.getElementById('docTo').value || '....................';
  const ref = document.getElementById('docRef').value;
  const att = document.getElementById('docAttach').value;
  const body = document.getElementById('docBody').value || '  ....................';
  const date = thaiDate();
  const no = `มท.72301/${n}`;
  const g = garudaImg(t==='internal');
  const head = `<div class="org-header">${org}<br>${addr}</div>`;
  const rl = ref?`อ้างถึง ${ref}<br>`:'';
  const al = att?`สิ่งที่ส่งมาด้วย ${att}<br>`:'';
  const cls = t==='internal'?'preview-box internal':'preview-box';
  let c='';
  if(t==='external') c=`${g}${head}
<div class="doc-no">ที่ ${no}</div>
<div class="doc-date">วันที่ ${date}</div>

เรื่อง ${sub}<br>
เรียน ${to}<br>
${rl}${al}
${body.replace(/\n/g,'<br>')}

จึงเรียนมาเพื่อโปรดทราบ พิจารณา และดำเนินการต่อไป
ขอแสดงความนับถือ

<div class="signature-block"><div class="signature-name">(${signer})<br>${pos}</div></div>`;
  else if(t==='internal') c=`${g}${head}
<div class="doc-no">ที่ ${no}</div>
<div class="doc-date">วันที่ ${date}</div>

เรื่อง ${sub}<br>
เรียน ${to}<br>
${rl}${al}
${body.replace(/\n/g,'<br>')}

จึงเรียนมาเพื่อโปรดพิจารณา

<div class="signature-block"><div class="signature-name">(${signer})<br>นักวิเคราะห์นโยบายและแผน</div></div>`;
  else if(t==='order') c=`${g}<div class="org-header">คำสั่ง${org}</div>
<div class="doc-no">ที่ ${n}/${DB.reg.y}</div>

เรื่อง ${sub}

  โดยที่เป็นการสมควร ...................................................<br>
  อาศัยอำนาจตาม ...................................................<br>
  จึงมีคำสั่งดังต่อไปนี้

  ข้อ ๑ .................................................................<br>
  ข้อ ๒ .................................................................

  ทั้งนี้ ตั้งแต่บัดนี้เป็นต้นไป

<div class="doc-date">สั่ง ณ วันที่ ${date}</div>
<div class="signature-block"><div class="signature-name">(${signer})<br>${pos}</div></div>`;
  else c=`${g}<div class="org-header">ประกาศ${org}</div>

เรื่อง ${sub}

  เนื่องจาก ...................................................<br>
  อาศัยอำนาจตาม ...................................................<br>
  จึงประกาศให้ทราบโดยทั่วกัน

<div class="doc-date">ประกาศ ณ วันที่ ${date}</div>
<div class="signature-block"><div class="signature-name">(${signer})<br>${pos}</div></div>`;
  return `<div class="${cls}">${c}</div>`;
}
function updatePreview() {
  document.getElementById('previewArea').innerHTML = build();
}
function saveDoc() {
  DB.reg.no++;
  const rec = {
    id: `${DB.reg.y}-${String(DB.reg.no).padStart(3,'0')}`,
    t: document.getElementById('docType').value,
    sub: document.getElementById('docSubject').value,
    to: document.getElementById('docTo').value,
    ref: document.getElementById('docRef').value,
    att: document.getElementById('docAttach').value,
    body: document.getElementById('docBody').value,
    at: new Date().toISOString()
  };
  DB.list.unshift(rec);
  saveAll();
  alert(`✅ บันทึก เลขที่ ${rec.id}`);
  ['docSubject','docTo','docRef','docAttach','docBody'].forEach(id=>document.getElementById(id).value='');
  updatePreview();
}
function updateList() {
  document.getElementById('total').textContent = DB.list.length;
  document.getElementById('docList').innerHTML = DB.list.map(d=>`<div><strong>${d.id}</strong> — ${d.sub||'ไม่มีชื่อเรื่อง'}<br><small>${new Date(d.at).toLocaleDateString('th-TH')}</small></div>`).join('');
}
function exportFile() {
  const b = new Blob([JSON.stringify({db:DB},null,2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = `สำรอง_${thaiDate().replace(/\s/g,'_')}.json`;
  a.click();
}
function importData(e) {
  const f = e.target.files[0]; if(!f) return;
  if(!confirm('แทนที่ข้อมูลปัจจุบัน?')) return;
  const r = new FileReader();
  r.onload = evt=>{
    try{
      const d = JSON.parse(evt.target.result);
      Object.assign(DB, d.db);
      saveAll(); loadAll(); alert('✅ นำเข้าเรียบร้อย');
    }catch(err){alert('❌ ไม่สามารถอ่านได้')}
  };
  r.readAsText(f);
}

// === Gemini AI ===
let imgBase64 = null;
function previewImg() {
  const f = document.getElementById('imgUpload').files[0];
  if(!f) return;
  const r = new FileReader();
  r.onload = e=>{ imgBase64 = e.target.result };
  r.readAsDataURL(f);
}
async function gemini(prompt, hasImg=false) {
  const key = DB.s.geminiKey;
  if(!key) return alert('⚠️ ใส่ Gemini API Key ก่อน — รับฟรีที่ aistudio.google.com');
  const parts = [];
  if(hasImg && imgBase64) {
    parts.push({inline_data: {mime_type: 'image/jpeg', data: imgBase64.split(',')[1]}});
  }
  parts.push({text: `${prompt}

ตอบเฉพาะ JSON เท่านั้น:
{
  "subject": "เรื่อง",
  "to": "ผู้รับ",
  "ref": "อ้างถึง",
  "attach": "สิ่งที่ส่งมาด้วย",
  "body": "เนื้อความ ย่อหน้าแรกเว้น ๒ ช่อง ใช้สำนวนราชการ"
}`});
  try{
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        contents: [{parts}],
        generationConfig: {response_mime_type:'application/json', temperature:0.3}
      })
    });
    if(!res.ok) throw new Error(`ผิดพลาด ${res.status}`);
    const d = await res.json();
    return JSON.parse(d.candidates[0].content.parts[0].text);
  }catch(err){alert(`❌ ${err.message}`); return null;}
}
async function analyzeWithGemini() {
  if(!imgBase64) return alert('เลือกภาพก่อนครับ');
  const btn = event.target; btn.disabled = true; btn.textContent = '⏳ กำลังอ่าน...';
  const res = await gemini('อ่านภาพหนังสือแล้วแยกรายการตามรูปแบบ', true);
  btn.disabled = false; btn.textContent = '📖 อ่านจากภาพ & ร่าง';
  if(!res) return;
  fillRes(res);
}
async function rewriteByGemini() {
  const txt = document.getElementById('docBody').value.trim();
  if(!txt) return alert('พิมพ์เนื้อความที่ต้องการปรับก่อนครับ');
  const btn = event.target; btn.disabled = true; btn.textContent = '⏳ กำลังร่าง...';
  const res = await gemini(`จงร่างหนังสือราชการจากข้อความนี้ให้ถูกระเบียบ พ.ศ.๒๕๔๗: ${txt}`);
  btn.disabled = false; btn.textContent = '✨ ปรับสำนวนให้ถูกระเบียบ';
  if(!res) return;
  fillRes(res);
}
function fillRes(r) {
  if(r.subject) document.getElementById('docSubject').value = r.subject;
  if(r.to) document.getElementById('docTo').value = r.to;
  if(r.ref) document.getElementById('docRef').value = r.ref;
  if(r.attach) document.getElementById('docAttach').value = r.attach;
  if(r.body) document.getElementById('docBody').value = r.body;
  updatePreview();
  alert('✅ เสร็จแล้ว ตรวจสอบและแก้ไขได้ครับ');
}
document.addEventListener('DOMContentLoaded', loadAll);