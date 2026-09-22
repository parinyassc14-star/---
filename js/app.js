// ===== ฐานข้อมูลหลัก =====
const DB = {
  org: { name: 'องค์การบริหารส่วนตำบลบก', addr: 'ตำบลบก อำเภอโนนคูณ จังหวัดศรีสะเกษ ๓๓๑๒๐' },
  depts: [
    { id: 1, name: 'ที่ทำการปกครองอำเภอโนนคูณ' },
    { id: 2, name: 'สำนักงานส่งเสริมการปกครองท้องถิ่นอำเภอโนนคูณ' },
    { id: 3, name: 'จังหวัดศรีสะเกษ' },
    { id: 4, name: 'สำนักงานทรัพยากรน้ำภาคที่ ๗' },
    { id: 5, name: 'เทศบาลตำบลโนนคูณ' },
    { id: 6, name: 'โรงพยาบาลโนนคูณ' },
    { id: 7, name: 'โรงเรียนโนนคูณวิทยาคม' }
  ],
  signers: [
    { id: 1, name: 'นายไพจิตร สมหวัง', position: 'นายกองค์การบริหารส่วนตำบลบก' },
    { id: 2, name: 'นายสมชาย มั่นคง', position: 'รองนายกองค์การบริหารส่วนตำบลบก' },
    { id: 3, name: 'นางสาวสุนีย์ ดีมาก', position: 'ปลัดองค์การบริหารส่วนตำบลบก' },
    { id: 4, name: 'นายวิชัย รักงาน', position: 'นักวิเคราะห์นโยบายและแผน' }
  ],
  selectedDeptIds: [],
  regNo: 0, regYear: new Date().getFullYear() + 543
};

// ===== เครื่องมือ =====
function thaiDate(d = new Date()) {
  const m = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'];
  return `${d.getDate()} ${m[d.getMonth()]} ${d.getFullYear() + 543}`;
}
function saveDB() {
  localStorage.setItem('obt_bk_dept_db', JSON.stringify(DB));
}
function loadDB() {
  const s = localStorage.getItem('obt_bk_dept_db');
  if (s) {
    const saved = JSON.parse(s);
    Object.assign(DB.depts, saved.depts);
    Object.assign(DB.signers, saved.signers);
    if (saved.regNo) DB.regNo = saved.regNo;
  }
  renderDeptList();
  renderSignerList();
  updateSignerOptions();
}

// ===== สลับแท็บ =====
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.getElementById('deptTab').style.display = tab === 'dept' ? 'block' : 'none';
  document.getElementById('signerTab').style.display = tab === 'signer' ? 'block' : 'none';
}

// ===== หน่วยงาน =====
function renderDeptList() {
  const box = document.getElementById('deptList');
  box.innerHTML = DB.depts.map(d => `
    <div class="list-item">
      <div class="left">
        <input type="checkbox" id="dept-${d.id}" ${DB.selectedDeptIds.includes(d.id) ? 'checked' : ''}
          onchange="toggleDept(${d.id})">
        <label for="dept-${d.id}">${d.name}</label>
      </div>
      <button class="btn danger" onclick="delDept(${d.id})">ลบ</button>
    </div>
  `).join('');
  updateSelectedDisplay();
}
function addDept() {
  const name = document.getElementById('newDeptName').value.trim();
  if (!name) return alert('⚠️ ใส่ชื่อหน่วยงานก่อนครับ');
  DB.depts.push({ id: Date.now(), name });
  document.getElementById('newDeptName').value = '';
  saveDB(); renderDeptList();
}
function delDept(id) {
  if (!confirm('ลบรายการนี้?')) return;
  DB.depts = DB.depts.filter(d => d.id !== id);
  DB.selectedDeptIds = DB.selectedDeptIds.filter(i => i !== id);
  saveDB(); renderDeptList();
}
function toggleDept(id) {
  if (DB.selectedDeptIds.includes(id)) {
    DB.selectedDeptIds = DB.selectedDeptIds.filter(i => i !== id);
  } else {
    DB.selectedDeptIds.push(id);
  }
  saveDB(); updateSelectedDisplay(); updatePreview();
}
function clearDeptSelection() {
  DB.selectedDeptIds = [];
  saveDB(); renderDeptList(); updatePreview();
}
function updateSelectedDisplay() {
  const box = document.getElementById('selectedDepts');
  if (DB.selectedDeptIds.length === 0) {
    box.innerHTML = '<em>เลือกหน่วยงานจากด้านบน</em>';
    return;
  }
  box.innerHTML = DB.selectedDeptIds.map(id => {
    const d = DB.depts.find(x => x.id === id);
    return d ? `<span class="selected-tag">${d.name}</span>` : '';
  }).join('');
}

// ===== ผู้ลงนาม =====
function renderSignerList() {
  const box = document.getElementById('signerList');
  box.innerHTML = DB.signers.map(s => `
    <div class="list-item">
      <div class="left">
        <strong>${s.name}</strong> — ${s.position}
      </div>
      <button class="btn danger" onclick="delSigner(${s.id})">ลบ</button>
    </div>
  `).join('');
}
function addSigner() {
  const name = document.getElementById('newSignerName').value.trim();
  const pos = document.getElementById('newSignerPos').value.trim();
  if (!name || !pos) return alert('⚠️ ใส่ชื่อและตำแหน่งครบถ้วนครับ');
  DB.signers.push({ id: Date.now(), name, position: pos });
  document.getElementById('newSignerName').value = '';
  document.getElementById('newSignerPos').value = '';
  saveDB(); renderSignerList(); updateSignerOptions();
}
function delSigner(id) {
  if (!confirm('ลบรายการนี้?')) return;
  DB.signers = DB.signers.filter(s => s.id !== id);
  saveDB(); renderSignerList(); updateSignerOptions();
}
function updateSignerOptions() {
  const sel = document.getElementById('selectedSigner');
  const cur = sel.value;
  sel.innerHTML = '<option value="">-- เลือกผู้ลงนาม --</option>' +
    DB.signers.map(s => `<option value="${s.id}">${s.name} — ${s.position}</option>`).join('');
  if (cur) sel.value = cur;
  updatePreview();
}
function getSelectedSigner() {
  const id = parseInt(document.getElementById('selectedSigner').value);
  return DB.signers.find(s => s.id === id) || null;
}

// ===== สร้างเนื้อหาหนังสือ =====
function buildForDept(dept) {
  DB.regNo++;
  const signer = getSelectedSigner();
  if (!signer) return '<p>กรุณาเลือกผู้ลงนาม</p>';
  
  const no = `ที่ มท.๗๒๓๐๑/${String(DB.regNo).padStart(3,'0')}`;
  const date = thaiDate();
  const sub = document.getElementById('docSubject').value || '....................';
  const ref = document.getElementById('docRef').value;
  const att = document.getElementById('docAttach').value;
  const body = document.getElementById('docBody').value || '  ....................';
  const rl = ref ? `อ้างถึง ${ref}\n` : '';
  const al = att ? `สิ่งที่ส่งมาด้วย ${att}\n` : '';
  const garuda = `<div class="garuda"><img src="images/garuda.png" alt="ตรา" onerror="this.parentElement.innerHTML='☗'"></div>`;
  const head = `<div class="org-header">${DB.org.name}\n${DB.org.addr}</div>`;

  return `${garuda}${head}
${no}
วันที่ ${date}

เรื่อง ${sub}
เรียน ${dept.name}
${rl}${al}
${body.replace(/\n/g, '<br>')}

จึงเรียนมาเพื่อโปรดทราบ พิจารณา และดำเนินการต่อไป

ขอแสดงความนับถือ

<div class="signature-block"><div class="signature-name">(${signer.name})<br>${signer.position}</div></div>`;
}
function updatePreview() {
  const area = document.getElementById('previewArea');
  if (DB.selectedDeptIds.length === 0) {
    area.innerHTML = '<em>เลือกหน่วยงานเพื่อแสดงตัวอย่าง</em>';
    return;
  }
  // แสดงตัวอย่างแค่รายการแรก
  const first = DB.depts.find(d => d.id === DB.selectedDeptIds[0]);
  area.innerHTML = buildForDept(first);
  if (DB.selectedDeptIds.length > 1) {
    area.innerHTML += `<p style="margin-top:20px;color:${getComputedStyle(document.documentElement).getPropertyValue('--info')}">📬 มีอีก ${DB.selectedDeptIds.length - 1} ฉบับ ที่สร้างพร้อมกัน</p>`;
  }
}

// ===== สร้างหนังสือทั้งหมด & บันทึก =====
function generateLetters() {
  if (DB.selectedDeptIds.length === 0) return alert('เลือกหน่วยงานอย่างน้อย 1 แห่งครับ');
  if (!getSelectedSigner()) return alert('เลือกผู้ลงนามครับ');
  
  let output = '';
  DB.selectedDeptIds.forEach(id => {
    const dept = DB.depts.find(d => d.id === id);
    output += `\n${'='.repeat(60)}\nส่งถึง: ${dept.name}\n${'='.repeat(60)}\n\n`;
    output += buildForDept(dept).replace(/<br>/g, '\n').replace(/<[^>]+>/g, '');
    output += '\n\n\n';
  });

  const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `หนังสือเวียน_${thaiDate().replace(/\s/g, '_')}.txt`;
  a.click();
  saveDB();
  alert(`✅ สร้างสำเร็จ ${DB.selectedDeptIds.length} ฉบับ — ดาวน์โหลดเรียบร้อย`);
}

// ===== สำรอง-นำเข้า =====
function saveAllData() {
  const blob = new Blob([JSON.stringify({ depts: DB.depts, signers: DB.signers, regNo: DB.regNo }, null, 2)], 
    { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `ฐานข้อมูล_หน่วยงาน-ผู้ลงนาม_${thaiDate().replace(/\s/g, '_')}.json`;
  a.click();
}
function importData() {
  document.getElementById('importFile').click();
}
function doImport(e) {
  const f = e.target.files[0]; if (!f) return;
  if (!confirm('แทนที่ข้อมูลปัจจุบัน?')) return;
  const r = new FileReader();
  r.onload = evt => {
    try {
      const d = JSON.parse(evt.target.result);
      DB.depts = d.depts || [];
      DB.signers = d.signers || [];
      if (d.regNo) DB.regNo = d.regNo;
      saveDB();
      renderDeptList(); renderSignerList(); updateSignerOptions();
      alert('✅ นำเข้าข้อมูลเรียบร้อย');
    } catch { alert('❌ ไฟล์ไม่ถูกต้อง') }
  };
  r.readAsText(f);
}

document.addEventListener('DOMContentLoaded', loadDB);
