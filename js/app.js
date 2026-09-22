// ===== จัดรูปแบบเนื้อหาหนังสือตามระเบียบงานสารบรรณ พ.ศ. ๒๕๔๗ =====
function buildDocumentContent() {
  const runningNo = String(DB.reg.no + 1).padStart(3, '0');
  const { org, addr, signer, pos } = DB.s;
  const docType = document.getElementById('docType').value;
  const subject = document.getElementById('docSubject').value || '................................................';
  const recipient = document.getElementById('docTo').value || '................................................';
  const reference = document.getElementById('docRef').value;
  const enclosure = document.getElementById('docAttach').value;
  const bodyText = document.getElementById('docBody').value || '  ................................................';
  const date = thaiDate();
  const officialNo = `ที่ มท.๗๒๓๐๑/${runningNo}`;

  const refLine = reference ? `อ้างถึง ${reference}\n` : '';
  const encLine = enclosure ? `สิ่งที่ส่งมาด้วย ${enclosure}\n` : '';
  const garuda = `<div class="garuda"><img src="images/garuda.png" alt="ตราครุฑ" onerror="this.parentElement.innerHTML='☗'"></div>`;
  const orgHeader = `<div class="org-header">${org}\n${addr}</div>`;
  const boxClass = docType === 'internal' ? 'preview-box internal' : 'preview-box';

  let content = '';

  if (docType === 'external') {
    // ===== หนังสือภายนอก =====
    content = `${garuda}${orgHeader}
${officialNo}
วันที่ ${date}

เรื่อง ${subject}
เรียน ${recipient}
${refLine}${encLine}
${bodyText}

จึงเรียนมาเพื่อโปรดทราบ พิจารณา และดำเนินการในส่วนที่เกี่ยวข้องต่อไป

ขอแสดงความนับถือ

<div class="signature-block">
  <div class="signature-name">(${signer})<br>${pos}</div>
</div>`;
  } 
  else if (docType === 'internal') {
    // ===== หนังสือภายใน =====
    content = `${garuda}${orgHeader}
${officialNo}
วันที่ ${date}

เรื่อง ${subject}
เรียน ${recipient}
${refLine}${encLine}
${bodyText}

จึงเรียนมาเพื่อโปรดพิจารณา

<div class="signature-block">
  <div class="signature-name">(${signer})<br>นักวิเคราะห์นโยบายและแผน</div>
</div>`;
  }
  else if (docType === 'order') {
    // ===== คำสั่ง =====
    content = `${garuda}<div class="org-header">คำสั่ง${org}</div>
ที่ ${runningNo}/${DB.reg.y}

เรื่อง ${subject}

  โดยที่ ...................................................
  อาศัยอำนาจตาม ...................................................
  จึงมีคำสั่งดังต่อไปนี้

  ข้อ ๑ .................................................................
  ข้อ ๒ .................................................................

  ทั้งนี้ ตั้งแต่บัดนี้เป็นต้นไป

สั่ง ณ วันที่ ${date}

<div class="signature-block">
  <div class="signature-name">(${signer})<br>${pos}</div>
</div>`;
  }
  else if (docType === 'announce') {
    // ===== ประกาศ =====
    content = `${garuda}<div class="org-header">ประกาศ${org}</div>

เรื่อง ${subject}

  เนื่องจาก ...................................................
  อาศัยอำนาจตาม ...................................................
  จึงประกาศให้ทราบโดยทั่วกัน

ประกาศ ณ วันที่ ${date}

<div class="signature-block">
  <div class="signature-name">(${signer})<br>${pos}</div>
</div>`;
  }

  return `<div class="${boxClass}">${content.replace(/\n/g, '<br>')}</div>`;
}
