// js/views/moduleDetail.js — Module Detail v2.1 — Universal View & Save

window.ModuleDetailView = {

  _modColors: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6'],

  render(subjectId, moduleId) {
    const main = document.getElementById('main-content');
    const subject = window.DUMMY.subjects.find(s => s.id === subjectId);
    const mods = window.DUMMY.modules[subjectId]
      || (window.SubjectDetailView ? SubjectDetailView._generateModules(subject) : []);
    const mod = mods.find(m => m.id === moduleId);
    if (!main || !mod) return;

    const modIndex = mods.indexOf(mod);
    const accent = this._modColors[modIndex % this._modColors.length];

    const noteStyles = {
      'reminder': { bg: 'rgba(251,191,36,.06)', border: 'rgba(251,191,36,.18)', color: '#FDE047', icon: '' },
      'lab': { bg: 'rgba(168,85,247,.06)', border: 'rgba(168,85,247,.18)', color: '#D8B4FE', icon: '' },
      'important': { bg: 'rgba(239,68,68,.06)', border: 'rgba(239,68,68,.18)', color: '#F87171', icon: '' },
      'pre-class': { bg: 'rgba(59,130,246,.06)', border: 'rgba(59,130,246,.18)', color: '#93C5FD', icon: '' },
      'post-class': { bg: 'rgba(34,197,94,.06)', border: 'rgba(34,197,94,.18)', color: '#86EFAC', icon: '' },
      'tip': { bg: 'rgba(107,114,128,.06)', border: 'rgba(107,114,128,.18)', color: '#9CA3AF', icon: '' },
    };
    const ns = mod.note ? (noteStyles[mod.noteType] || noteStyles['reminder']) : null;

    main.innerHTML = `
      <div class="view-container">
      <div style="display:flex;align-items:center;gap:8px;padding:0;flex-wrap:wrap;">
        <button class="btn-outline btn-tiny" onclick="App.openSubject('${subjectId}')"
          style="border-radius:var(--r-pill)!important;">← ${subject ? subject.code : 'Back'}</button>
        <span style="color:var(--border);font-size:.8rem;">›</span>
        <span style="font-size:.73rem;color:var(--text-muted);">Module ${mod.num}</span>
      </div>

      <div style="padding:12px 0 0;">
        <div style="background:linear-gradient(145deg,#130404,#1a0606,#100303);border:1px solid ${accent}33;
                    border-radius:var(--r-xl);padding:20px 22px;position:relative;overflow:hidden;" class="glass-panel">
          <div style="position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,${accent},${accent}40,transparent);"></div>
          
          <div style="display:flex;align-items:center;gap:14px;position:relative;">
            <div style="width:56px;height:56px;border-radius:var(--r-lg);background:${accent}18;border:2px solid ${accent}44;
                        display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span style="font-size:1.25rem;font-weight:900;color:${accent};">${String(mod.num).padStart(2, '0')}</span>
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-size:.6rem;font-weight:700;color:${accent};text-transform:uppercase;letter-spacing:2px;margin-bottom:4px;">
                Module ${String(mod.num).padStart(2, '0')}
              </div>
              <div style="font-size:1.05rem;font-weight:800;color:var(--text);letter-spacing:-.2px;line-height:1.25;" class="module-title">${mod.title}</div>
              <div style="font-size:.68rem;color:var(--text-muted);margin-top:5px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                <span>${subject ? subject.name : subjectId}</span>
                <span class="dot"></span>
                <span>${mod.chapters.length} resources</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      ${mod.note && ns ? `
        <div style="margin:10px 0 0;background:var(--surface);border:1px solid ${ns.border};
                    border-radius:var(--r-lg);padding:13px 15px;display:flex;gap:10px;align-items:flex-start;">
          <span style="flex-shrink:0;font-size:1rem;margin-top:1px;">${ns.icon}</span>
          <div>
            <div style="font-size:.58rem;font-weight:800;color:${ns.color};text-transform:uppercase;letter-spacing:.8px;margin-bottom:3px;">
              ${(mod.noteType || 'reminder').replace('-', ' ')} · Teacher Note
            </div>
            <div style="font-size:.8rem;color:var(--text-3);line-height:1.6;">${mod.note}</div>
          </div>
        </div>` : ''}

      <div class="section-label" style="padding-left:0; padding-right:0;">Study Resources</div>
      <div style="padding:0 0 30px;display:flex;flex-direction:column;gap:12px;">
        ${mod.chapters.map((ch, i) => this._chapter(ch, i, mod.num, accent)).join('')}
      </div>
      </div>
    `;
  },

  _chapter(ch, index, modNum, accent) {
    let fileIcon = '📄';
    if (ch.hasPpt || (ch.title && ch.title.toLowerCase().includes('ppt'))) fileIcon = '📊';
    else if (ch.hasPdf || (ch.title && ch.title.toLowerCase().includes('pdf'))) fileIcon = '📕';

    return `
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-lg);
                  overflow:hidden;transition:var(--transition);"
           onmouseenter="this.style.borderColor='${accent}44'" onmouseleave="this.style.borderColor='var(--border)'">
        <div style="display:flex;align-items:center;">
          <div style="width:48px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
                      align-self:stretch;background:var(--surface-2);border-right:1px solid var(--border);padding:10px 6px;">
            <span style="font-size:1.2rem;margin-bottom:3px;">${fileIcon}</span>
            <span style="font-size:.58rem;font-weight:800;color:var(--text-muted);">${modNum}.${index + 1}</span>
          </div>

          <div style="flex:1;padding:14px 16px;min-width:0;">
            <div style="font-size:.9rem;font-weight:700;color:var(--text);margin-bottom:4px;line-height:1.3;">
              ${ch.title}
            </div>
            <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              ${ch.size ? `<span style="font-size:.65rem;color:var(--text-muted);font-weight:600;">Size: ${ch.size}</span>` : ''}
              <span class="date-badge">Added: ${ch.uploadDate || 'Legacy'}</span>
            </div>
          </div>
        </div>

        <div style="display:flex;border-top:1px solid var(--border);">
          <button onclick="ModuleDetailView.openResource('${ch.id}')"
            style="flex:1;padding:12px 0;font-size:.72rem;font-weight:800;color:var(--red-light);
                   font-family:var(--font);background:var(--red-glow);border:none;
                   border-right:1px solid var(--border);cursor:pointer;
                   display:flex;align-items:center;justify-content:center;gap:7px;transition:var(--transition);"
            onmouseenter="this.style.background='var(--red)';this.style.color='#fff'"
            onmouseleave="this.style.background='var(--red-glow)';this.style.color='var(--red-light)'">
            VIEW RESOURCE
          </button>
          <button onclick="ModuleDetailView.downloadResource('${ch.id}')"
            style="flex:1;padding:12px 0;font-size:.72rem;font-weight:800;color:var(--text-2);
                   font-family:var(--font);background:var(--surface-2);border:none;
                   cursor:pointer;display:flex;align-items:center;justify-content:center;gap:7px;transition:var(--transition);"
            onmouseenter="this.style.background='var(--surface-3)'"
            onmouseleave="this.style.background='var(--surface-2)'">
            SAVE TO DEVICE
          </button>
        </div>
      </div>`;
  },

  openResource(id) {
    const ch = this._findChapter(id);
    alert('Opening Document: ' + (ch ? ch.title : id));
  },
  downloadResource(id) {
    const ch = this._findChapter(id);
    alert('Saving Document: ' + (ch ? ch.title : id));
  },
  _findChapter(id) {
    for (const mods of Object.values(window.DUMMY.modules || {})) {
      for (const mod of mods) {
        const ch = mod.chapters.find(c => c.id === id);
        if (ch) return ch;
      }
    }
    return null;
  }
};
