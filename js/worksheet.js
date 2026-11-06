/* =====================================================================
   활동지 인쇄 (worksheet.js) – 교사용 화면
   오늘 고른 구역의 수첩 내용으로 A4 활동지를 만듦
   핵심 빈칸형: content.js의 worksheetBlanks 낱말을 빈칸으로 / 수첩 전체형: 문장마다 점검 칸
   [인쇄하기]는 브라우저 인쇄 창, [PDF로 저장]은 그림으로 바꿔 PDF 파일을 바로 내려받음
   ===================================================================== */
const Worksheet = {
  PAGE_BODY: 900,        // A4 한 장에서 머리글·바닥글을 뺀 높이 (px)

  /* 구역별 문장 묶음: [{ title, sub, lines, blanks }] */
  blocks(zoneIds) {
    const C = CONTENT, out = [];
    [...zoneIds].sort((a, b) => a - b).forEach(id => {
      const z = C.zones.find(x => x.id === id);
      const rounds = z.id === 10 ? [{ lines: C.cpr.notebook, key: '10' }]
        : z.rounds.map(r => ({ lines: C.rounds[r].notebook, key: r, sub: z.rounds.length === 2 ? C.rounds[r].title : '' }));
      rounds.forEach(r => out.push({ title: `${z.id}구역 ${z.topic}`, sub: r.sub, lines: r.lines, words: C.worksheetBlanks[r.key] || [] }));
    });
    return out;
  },

  /* 낱말을 차례대로 찾아 빈칸으로 (같은 낱말은 첫 번째만) */
  blankLines(b) {
    const lines = b.lines.map(l => esc(l.replace(/\[\[|\]\]/g, '')));
    b.words.forEach(w => {
      const word = esc(w), i = lines.findIndex(l => l.includes(word));
      if (i >= 0) lines[i] = lines[i].replace(word, `<span class="ws-blank" style="min-width:${Math.max(3, w.length * 1.3)}em"></span>`);
    });
    return lines;
  },

  blockHTML(b, kind) {
    const nums = ['①', '②', '③', '④', '⑤'];
    const rows = kind === 'blank'
      ? this.blankLines(b).map((l, i) => `<li>${nums[i]} ${l}</li>`)
      : b.lines.map(l => `<li><span class="ws-check"></span>${notebookLine(l)}</li>`);
    return `<section class="ws-block"><h3>${esc(b.title)}${b.sub ? ` <small>· ${esc(b.sub)}</small>` : ''}</h3><ol>${rows.join('')}</ol></section>`;
  },

  pageHTML(blocks) {
    const T = CONTENT.teacher;
    return `<article class="ws-page">
      <header><h1>${esc(T.sheetPaperTitle)}</h1><p>____학년 ____반 ____번 이름: ______________</p></header>
      <div class="ws-body">${blocks.join('')}</div>
      <footer>${esc(T.sheetPaperFoot)}</footer></article>`;
  },

  /* 묶음 높이를 재서 A4 장수로 나눔 */
  render(host, zoneIds, kind) {
    const html = this.blocks(zoneIds).map(b => this.blockHTML(b, kind));
    host.innerHTML = this.pageHTML(html);
    const heights = [...host.querySelectorAll('.ws-block')].map(el => {
      const s = getComputedStyle(el);
      return el.offsetHeight + parseFloat(s.marginBottom);
    });
    const pages = [[]]; let used = 0;
    html.forEach((h, i) => {
      if (used + heights[i] > this.PAGE_BODY && pages[pages.length - 1].length) { pages.push([]); used = 0; }
      pages[pages.length - 1].push(h); used += heights[i];
    });
    host.innerHTML = pages.map(p => this.pageHTML(p)).join('');
  },

  /* 인쇄: 활동지만 담은 새 창을 열고 글꼴을 불러온 뒤 인쇄 창을 띄움 */
  print(host) {
    const w = window.open('', '_blank');
    if (!w) { toast(CONTENT.teacher.sheetPrintBlocked); return; }
    const links = [...document.querySelectorAll('link[rel="stylesheet"]')].map(l => `<link rel="stylesheet" href="${l.href}">`).join('');
    w.document.write(`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>${esc(CONTENT.teacher.sheetPaperTitle)}</title>${links}
      <style>@page { size: A4; margin: 0; }
      html, body { height: auto; margin: 0; background: #fff; }
      .ws-page { height: 296mm; overflow: hidden; break-after: page; margin: 0 auto; }
      .ws-page:last-child { break-after: auto; }
      .ws-page, .ws-page * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }</style></head>
      <body>${host.innerHTML}</body></html>`);
    w.document.close();
    const go = () => {
      w.document.fonts.ready.then(() => {
        w.focus(); w.print();
      });
    };
    if (w.document.readyState === 'complete') go(); else w.addEventListener('load', go);
  },

  loadScript(src) {
    return new Promise((ok, no) => {
      const s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = no;
      document.head.appendChild(s);
    });
  },

  /* PDF 파일 바로 내려받기 (필요할 때만 도구를 불러옴) */
  async savePDF(host, kindName) {
    if (!window.html2canvas) await this.loadScript('js/vendor/html2canvas.min.js');
    if (!window.jspdf) await this.loadScript('js/vendor/jspdf.umd.min.js');
    await document.fonts.ready;
    const stage = document.createElement('div');
    stage.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;background:#fff';
    stage.innerHTML = host.innerHTML;
    document.body.appendChild(stage);
    try {
      const pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
      const pages = [...stage.querySelectorAll('.ws-page')];
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], { scale: 2, backgroundColor: '#ffffff' });
        if (i) pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
      }
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdf.output('blob'));
      link.download = `응급처치마을방범대_활동지_${kindName}.pdf`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 10000);
    } finally { stage.remove(); }
  },

  /* 활동지 인쇄 창 */
  open(zoneIds) {
    const T = CONTENT.teacher;
    if (!zoneIds.size) {
      showPopup({ title: T.noZoneTitle, body: `<p style="text-align:center">${esc(T.noZoneNote)}</p>` });
      return;
    }
    const kinds = [['blank', T.sheetBlank, T.sheetBlankNote], ['full', T.sheetFull, T.sheetFullNote]];
    const { overlay } = showPopup({
      title: T.sheetTitle, wide: true,
      body: `<p class="note" style="text-align:center;margin-top:0">${esc(fillText(T.sheetIntro, { n: zoneIds.size }))}</p>
        <div class="ws-kinds">${kinds.map(k => `<button class="switch" data-k="${k[0]}"><b>${esc(k[1])}</b><span class="note">${esc(k[2])}</span></button>`).join('')}</div>
        <div class="ws-actions"><button class="btn" id="wsPrint">${esc(T.sheetPrint)}</button><button class="btn secondary" id="wsPdf">${esc(T.sheetPdf)}</button></div>
        <p class="note" style="text-align:center;margin:6px 0">${esc(T.sheetGuide)}</p>
        <div class="ws-preview" id="wsPreview"></div>`,
      buttons: [{ label: CONTENT.text.close }]
    });
    const host = overlay.querySelector('#wsPreview');
    let kind = 'blank';
    const draw = () => {
      overlay.querySelectorAll('.ws-kinds .switch').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === kind));
      this.render(host, zoneIds, kind);
    };
    overlay.querySelectorAll('.ws-kinds .switch').forEach(b => b.addEventListener('click', () => { kind = b.dataset.k; draw(); }));
    overlay.querySelector('#wsPrint').addEventListener('click', () => this.print(host));
    const pdfBtn = overlay.querySelector('#wsPdf');
    pdfBtn.addEventListener('click', async () => {
      pdfBtn.disabled = true; pdfBtn.textContent = T.sheetPdfWorking;
      try { await this.savePDF(host, kind === 'blank' ? '핵심빈칸형' : '수첩전체형'); }
      catch (e) { toast(T.sheetPdfFail); }
      pdfBtn.disabled = false; pdfBtn.textContent = T.sheetPdf;
    });
    document.fonts.ready.then(draw);
    draw();
  }
};
