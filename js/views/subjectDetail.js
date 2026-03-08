// js/views/subjectDetail.js — Subject Detail v2.4 — Updated Assignments with Viewable Documents

window.SubjectDetailView = {
  _subjectId: null,
  _activeTab: 'modules',

  // Rainbow for module numbering
  _modColors: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6'],

  render(subjectId, tab) {
    this._subjectId = subjectId;
    this._activeTab = tab || 'modules';
    const main = document.getElementById('main-content');
    const subject = window.DUMMY.subjects.find(s => s.id === subjectId);
    if (!main || !subject) return;
    this._paint(main, subject);
  },

  _paint(main, subject) {
    const mods = window.DUMMY.modules[subject.id] || this._generateModules(subject);
    const tab = this._activeTab;

    const tabs = [
      { id: 'modules', icon: '', label: 'Modules' },
      { id: 'assignments', icon: '', label: 'Assignments' },
      { id: 'syllabus', icon: '', label: 'Syllabus' },
      { id: 'pyq', icon: '', label: 'PYQ' },
    ];

    main.innerHTML = `
      <style>
        .date-badge { font-size: 0.6rem; color: var(--text-muted); font-weight: 500; font-family: monospace; }
      </style>
      <div class="view-container">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;">
          <button id="btn-back-subjects" class="btn-outline btn-tiny clicky-element" style="padding:5px 14px;gap:4px;">
            ← Back
          </button>
          <div style="font-size:.7rem;color:var(--text-muted);">Study Materials / ${subject.code}</div>
        </div>

        <div style="background:var(--surface);border:1px solid var(--border); overflow:hidden;position:relative;">
          <div style="height:3px;background:linear-gradient(90deg,var(--red),rgba(239,68,68,.2));"></div>
          <div style="padding:24px;">
            <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:14px;">
              <div style="width:52px;height:52px;border-radius:var(--r-lg);background:var(--red-glow);
                          border:1px solid var(--red-border);display:flex;align-items:center;
                          justify-content:center;overflow:hidden;flex-shrink:0;">
                <img src="${subject.profImage}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(subject.teacher)}&background=random'"/>
              </div>
              <div style="flex:1;min-width:0;">
                <div class="subject-name" style="font-size:1.05rem;font-weight:800;color:var(--text);letter-spacing:-.2px;line-height:1.2;margin-bottom:4px;">${subject.name}</div>
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                  <span style="font-size:.62rem;font-weight:800;color:var(--red-light);background:var(--red-glow);border:1px solid var(--red-border);padding:2px 8px;">${subject.code}</span>
                  <span style="font-size:.67rem;color:var(--text-muted);">${mods.length} modules</span>
                </div>
              </div>
            </div>

            <div style="display:flex;align-items:center;gap:10px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-md);padding:14px;">
              <div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,rgba(59,130,246,.15),rgba(139,92,246,.15));
                          border:1px solid rgba(139,92,246,.25);display:flex;align-items:center;justify-content:center;font-size:.95rem;flex-shrink:0;">👨‍🏫</div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:.82rem;font-weight:700;color:var(--text-2);">${subject.teacher}</div>
                <div style="font-size:.62rem;color:var(--text-muted);margin-top:1px;">Course Instructor</div>
              </div>
              <span style="font-size:.6rem;background:rgba(139,92,246,.1);color:#D8B4FE;border:1px solid rgba(139,92,246,.25);
                           padding:3px 10px;font-weight:700;white-space:nowrap;">Faculty</span>
            </div>
          </div>
        </div>
      </div>

      <div style="padding:24px 0 0;">
        <div id="subj-tabs"
          style="display:flex;gap:0;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-lg);padding:4px;overflow:hidden;">
          ${tabs.map(t => `
            <button data-tab="${t.id}"
              style="flex:1;padding:8px 4px;font-size:.72rem;font-weight:700;font-family:var(--font);
                     border:none;cursor:pointer;white-space:nowrap;
                     letter-spacing:.3px;text-transform:uppercase;transition:var(--transition);
                     background:${tab === t.id ? 'var(--red)' : 'transparent'};
                     color:${tab === t.id ? '#fff' : 'var(--text-muted)'};
                     box-shadow:${tab === t.id ? '0 2px 10px rgba(239,68,68,.3)' : 'none'};">
              ${t.icon} ${t.label}
            </button>`).join('')}
        </div>
      </div>

      <div id="subj-tab-content" style="padding:0 0 24px;">
        ${this._renderTab(tab, mods, subject)}
      </div>
      </div>
    `;

    document.getElementById('btn-back-subjects').addEventListener('click', () => App.switchView('subjects'));
    document.getElementById('subj-tabs').addEventListener('click', e => {
      const btn = e.target.closest('[data-tab]');
      if (btn) { this._activeTab = btn.dataset.tab; this._paint(main, subject); }
    });

    document.getElementById('subj-tab-content').addEventListener('click', e => {
      const card = e.target.closest('[data-open-module]');
      if (card) {
        const [subjId, modId] = card.dataset.openModule.split(':');
        App.openModule(subjId, modId);
      }
    });
  },

  _renderTab(tab, mods, subject) {
    if (tab === 'modules') return this._renderModules(mods);
    if (tab === 'assignments') return this._renderAssignments(subject);
    if (tab === 'syllabus') return this._renderSyllabus(subject);
    if (tab === 'pyq') return this._renderPYQ(subject);
    return '';
  },

  _renderModules(mods) {
    return `
      <div class="section-label" style="padding-left:0; padding-right:0;">Course Modules</div>
      <div style="padding:0 0;">
        ${mods.map((mod, i) => this._renderModuleCard(mod, i)).join('')}
      </div>`;
  },

  _renderModuleCard(mod, index) {
    const accent = this._modColors[index % this._modColors.length];
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const lastModified = mod.lastModified ? new Date(mod.lastModified).toLocaleDateString() : 'Legacy';
    return `
      <div data-open-module="${mod.subjectId}:${mod.id}" class="clicky-element subject-card"
        style="background:var(--surface);border:1px solid var(--border);
               padding:0;margin-bottom:10px;cursor:pointer;overflow:hidden;
               position:relative;"
        onmouseenter="this.style.borderColor='${accent}44'"
        onmouseleave="this.style.borderColor='var(--border)'">
        <div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:${accent};border-radius:3px 0 0 3px;"></div>
        <div style="padding:14px 16px 14px 20px;display:flex;align-items:center;gap:14px;">
          <div style="width:40px;height:40px;border-radius:50%;background:${accent}18;border:2px solid ${accent}44;
                      display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <span style="font-size:.82rem;font-weight:900;color:${accent};">${mod.num < 10 ? '0' + mod.num : mod.num}</span>
          </div>
          <div style="flex:1;min-width:0;">
            <div class="module-title" style="font-size:.88rem;font-weight:700;color:var(--text);margin-bottom:5px;line-height:1.3;">${esc(mod.title)}</div>
            <div style="display:flex;gap:5px;flex-wrap:wrap; align-items:center;">
              <span style="font-size:.6rem;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--r-pill);padding:2px 7px;color:var(--text-3);">${mod.chapters.length} files</span>
              <span class="date-badge">Modified: ${lastModified}</span>
            </div>
          </div>
          <div style="color:var(--text-muted);font-size:1.1rem;flex-shrink:0;">›</div>
        </div>
      </div>`;
  },

  _renderAssignments(subject) {
    if (!window.DUMMY.assignments) window.DUMMY.assignments = {};
    const assigns = window.DUMMY.assignments[subject.id] || [];

    return `
      <div class="section-label" style="padding-left:0; padding-right:0;">Active Assignments</div>
      <div style="display:grid; grid-template-columns: 1fr; gap:12px;">
        ${assigns.length ? assigns.map(a => {
          const isOverdue = new Date(a.deadline) < new Date();
          const color = isOverdue ? '#EF4444' : '#22C55E';
          return `
          <div class="glass-panel clicky-element assignment-card" style="padding:0; border-left: 4px solid ${color}; overflow:hidden;">
            <div style="padding:16px; display:flex; align-items:center; gap:16px;">
              <div style="flex:1;">
                <div style="font-size:.9rem; font-weight:700; color:var(--text);">${a.title}</div>
                <div style="font-size:.7rem; color:var(--text-muted); margin-top:4px;">Deadline: ${new Date(a.deadline).toLocaleString()}</div>
                <div class="date-badge" style="margin-top:2px;">Issued: ${new Date(a.createdAt).toLocaleDateString()}</div>
              </div>
              <div style="text-align:right;">
                  <div style="font-size:.6rem; font-weight:800; color:${color}; border:1px solid ${color}33; padding:3px 8px; text-transform:uppercase; margin-bottom:5px; display:inline-block;">
                      ${isOverdue ? 'Overdue' : 'Active'}
                  </div>
                  <button class="btn-solid-red" style="font-size:0.6rem; padding:4px 10px; display:block; width:100%;" onclick="alert('Submission portal opening...')">SUBMIT</button>
              </div>
            </div>
            ${a.file ? `
            <div style="display:flex; border-top:1px solid var(--border);">
               <button style="flex:1; border:none; border-right:1px solid var(--border); padding:10px; font-size:0.65rem; font-weight:700; color:var(--red-light); background:var(--red-glow); cursor:pointer;" onclick="alert('Opening: ${a.file.name}')">📄 VIEW DOC</button>
               <button style="flex:1; border:none; padding:10px; font-size:0.65rem; font-weight:700; color:var(--text-2); background:var(--surface-2); cursor:pointer;" onclick="alert('Downloading: ${a.file.name}')">💾 SAVE DOC</button>
            </div>` : ''}
          </div>
        `}).join('') : `<div style="padding:40px; text-align:center; color:var(--text-muted);">No assignments posted.</div>`}
      </div>
    `;
  },

  _renderSyllabus(subject) {
    const syllabus = subject.syllabus || [];
    const outcomes = subject.outcomes || [];
    return `
      <div class="section-label" style="padding-left:0; padding-right:0;">Syllabus</div>
      <div style="padding:0 0 4px;">
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-xl);overflow:hidden;">
          ${syllabus.length
        ? syllabus.map((item, i) => `
              <div style="display:flex;align-items:flex-start;gap:12px;padding:13px 16px;
                          border-bottom:${i < syllabus.length - 1 ? '1px solid var(--border)' : 'none'};"
                    class="syllabus-row">
                <div style="width:26px;height:26px;border-radius:50%;background:var(--red-glow);border:1px solid var(--red-border);
                            display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
                  <span style="font-size:.62rem;font-weight:800;color:var(--red-light);">${i + 1}</span>
                </div>
                <div style="font-size:.84rem;color:var(--text-2);font-weight:500;line-height:1.5;padding-top:3px;">${item}</div>
              </div>`).join('')
        : `<div style="padding:28px;text-align:center;color:var(--text-muted);font-size:.83rem;">No syllabus data available.</div>`}
        </div>
      </div>
      <div class="section-label" style="padding-left:0; padding-right:0;">Course Outcomes</div>
      <div style="padding:0 0;">
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--r-xl);overflow:hidden;">
          ${outcomes.length
        ? outcomes.map((item, i) => `
              <div style="display:flex;align-items:flex-start;gap:12px;padding:13px 16px;
                          border-bottom:${i < outcomes.length - 1 ? '1px solid var(--border)' : 'none'};"
                    class="outcome-row">
                <div style="width:26px;height:26px;border-radius:50%;background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.25);
                            display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px;">
                  <span style="font-size:.75rem;">✓</span>
                </div>
                <div style="font-size:.84rem;color:var(--text-2);line-height:1.5;padding-top:3px;">${item}</div>
              </div>`).join('')
        : `<div style="padding:28px;text-align:center;color:var(--text-muted);font-size:.83rem;">No outcomes data available.</div>`}
        </div>
      </div>`;
  },

  _renderPYQ(subject) {
    const pyq = subject.pyq || [];
    if (!pyq.length) {
      return `
        <div style="padding:48px 24px;text-align:center;">
          <div style="color:var(--text-muted);font-size:.85rem;">No previous year questions available for this subject.</div>
        </div>`;
    }
    return `
      <div class="section-label" style="padding-left:0; padding-right:0;">Previous Year Questions</div>
      <div style="padding:0 0;">
        ${pyq.map((entry, ei) => `
          <div class="glass-panel" style="margin-bottom:12px;overflow:hidden;">
            <div style="padding:12px 16px;background:var(--surface-2);border-bottom:1px solid var(--border);
                        display:flex;align-items:center;gap:12px;">
              <div style="width:42px;height:42px;border-radius:var(--r-md);background:var(--red-glow);border:1px solid var(--red-border);
                          display:flex;flex-direction:column;align-items:center;justify-content:center;flex-shrink:0;">
                <span style="font-size:.58rem;font-weight:900;color:var(--red-light);line-height:1.2;text-align:center;">${entry.year}</span>
              </div>
              <div style="flex:1;min-width:0;">
                <div style="font-size:.85rem;font-weight:700;color:var(--text);">${entry.sem}</div>
                <div style="font-size:.62rem;color:var(--text-muted);margin-top:2px;">${entry.qs.length} questions</div>
              </div>
            </div>
            ${entry.qs.map((q, qi) => `
              <div style="display:flex;align-items:flex-start;gap:12px;padding:13px 16px;
                          border-bottom:${qi < entry.qs.length - 1 ? '1px solid var(--border)' : 'none'};"
                    class="question-row">
                <div style="min-width:26px;height:26px;border-radius:50%;background:var(--surface-2);border:1px solid var(--border);
                            display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                  <span style="font-size:.6rem;font-weight:800;color:var(--text-muted);">Q${qi + 1}</span>
                </div>
                <div style="font-size:.84rem;color:var(--text-2);line-height:1.6;padding-top:3px;">${q}</div>
              </div>`).join('')}
          </div>`).join('')}
      </div>`;
  },

  _generateModules(subject) {
    return Array.from({ length: subject.modules }, (_, i) => ({
      id: `${subject.id}-M${i + 1}`,
      subjectId: subject.id,
      num: i + 1,
      title: `Module ${i + 1}`,
      lastModified: Date.now() - (i * 86400000),
      chapters: [
        { id: `${subject.id}-m${i + 1}c1`, title: 'Introduction', size: '1.2 MB', uploadDate: 'Oct 01, 2025' },
      ]
    }));
  }
};
