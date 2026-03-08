// js/components/moduleTree.js
// Collapsible module/chapter tree — modern card style

window.ModuleTreeComponent = {

  render(modules) {
    return modules.map(mod => this._renderModule(mod)).join('');
  },

  _renderModule(mod) {
    const chapters = mod.chapters.map(ch => this._renderChapter(ch)).join('');
    const note = mod.note
      ? `<div class="chapter-note"><span class="note-label">★ Note:</span> ${mod.note}</div>`
      : '';
    const viewBadge = mod.viewers > 0
      ? `<span class="tag tag-red">${mod.viewers} viewing</span>`
      : '';

    return `
      <div class="module-header" onclick="ModuleTreeComponent.toggle('${mod.id}')">
        <div class="mod-title">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color:var(--red-light);flex-shrink:0"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
          ${mod.title}
          ${viewBadge}
        </div>
        <span class="module-arrow" id="arrow-${mod.id}">▸</span>
      </div>
      <div class="module-body" id="body-${mod.id}">
        ${chapters}
        ${note}
      </div>
    `;
  },

  _renderChapter(ch) {
    const pdf = ch.hasPdf
      ? `<button class="btn-green btn-tiny" onclick="dummyOpen('${ch.id}.pdf')">PDF</button>`
      : '';
    const ppt = ch.hasPpt
      ? `<button class="btn-green btn-tiny" onclick="dummyOpen('${ch.id}.ppt')">PPT</button>`
      : '';
    const viewing = ch.viewers > 0
      ? `<span class="tag tag-red" style="margin-left:0;">${ch.viewers} viewing</span>`
      : '';

    return `
      <div class="chapter-row">
        <span class="ch-name">${ch.title}</span>
        ${pdf} ${ppt} ${viewing}
      </div>
    `;
  },

  toggle(modId) {
    const body = document.getElementById('body-' + modId);
    const arrow = document.getElementById('arrow-' + modId);
    if (!body) return;
    const isOpen = body.classList.contains('open');
    body.classList.toggle('open', !isOpen);
    if (arrow) arrow.textContent = isOpen ? '▸' : '▾';
  }
};
