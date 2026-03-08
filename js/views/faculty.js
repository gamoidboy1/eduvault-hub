// js/views/faculty.js — Faculty Courses v3.3 — Batch & Subject Selectors as Dropdowns

window.FacultyView = {
  _batch: null,
  _subject: null,
  _liveTimer: null,
  _collapsed: {},
  _mmAbort: null,
  _pendingFiles: {},
  _pendingAsgnFile: null,
  _activeTab: 'modules', // 'modules' | 'assignments' | 'submissions'

  renderCourse(batchCode, subjectCode) {
    try {
      this._batch = window.DUMMY.facultyBatches.find(b => b.batchCode === batchCode) || null;
      this._subject = window.DUMMY.subjects.find(s => s.id === subjectCode) || null;
      clearInterval(this._liveTimer);
      TopNavComponent.setActive('faculty');
      this._paint();
    } catch (e) { this._err(e); }
  },

  render() {
    try {
      if (!this._batch && window.DUMMY.facultyBatches && window.DUMMY.facultyBatches.length > 0) {
        const b = window.DUMMY.facultyBatches[0];
        this._batch = b;
        this._subject = window.DUMMY.subjects.find(s => s.id === b.subjects[0]) || null;
      }
      clearInterval(this._liveTimer);
      TopNavComponent.setActive('faculty');
      this._paint();
    } catch (e) { this._err(e); }
  },

  _err(e) {
    const m = document.getElementById('main-content');
    if (m) m.innerHTML = `<div style="padding:28px;color:var(--red-light);font-size:.85rem;">⚠ Courses failed to load: ${e.message}</div>`;
    console.error('[FacultyView]', e);
  },

  _paint() {
    const main = document.getElementById('main-content');
    if (!main) return;

    const batches = window.DUMMY.facultyBatches || [];
    const B = this._batch;
    const S = this._subject;
    const code = S ? S.id : '';

    main.innerHTML = `
      <style>
        .fac-tab-nav { display: flex; gap: 5px; margin: 15px 0 10px; border-bottom: 1px solid var(--border); }
        .fac-tab { padding: 8px 16px; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.2s; }
        .fac-tab.active { color: var(--red-light); border-bottom-color: var(--red-light); background: var(--red-glow); }
        .date-badge { font-size: 0.6rem; color: var(--text-muted); font-weight: 500; font-family: 'Courier New', monospace; }
        .asgn-upload-zone { border: 1px dashed var(--border); padding: 15px; text-align: center; background: var(--surface-2); cursor: pointer; margin-bottom: 15px; transition: var(--transition); }
        .asgn-upload-zone:hover { border-color: var(--red-light); background: var(--red-glow); }
        
        .selector-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 24px;
            background: var(--surface);
            padding: 24px;
            border: 1px solid var(--border);
            border-radius: var(--r-md);
        }
        .selector-group { display: flex; flex-direction: column; gap: 6px; }
        .selector-label { font-size: 0.63rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--text-muted); }
        .fac-dropdown {
            background: var(--surface-2);
            border: 1px solid var(--border);
            color: var(--text);
            padding: 10px;
            font-size: 0.85rem;
            font-weight: 600;
            border-radius: 4px;
            cursor: pointer;
            outline: none;
            transition: all 0.2s;
            width: 100%;
        }
        .fac-dropdown:focus { border-color: var(--red-light); background: var(--surface-3); }
        
        /* Themed Date Picker */
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
            filter: invert(1) sepia(100%) saturate(10000%) hue-rotate(0deg) brightness(1);
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.2s;
        }
        input[type="datetime-local"]::-webkit-calendar-picker-indicator:hover {
            opacity: 1;
        }
        .fac-input-themed {
            background: var(--surface-2) !important;
            border: 1px solid var(--border) !important;
            color: white !important;
            padding: 12px !important;
            font-size: 0.85rem !important;
            font-weight: 600 !important;
            border-radius: 4px !important;
            outline: none !important;
            transition: border-color 0.2s !important;
        }
        .fac-input-themed:focus {
            border-color: var(--red-light) !important;
        }
      </style>

      <div class="view-container">
      <div class="selector-container">
        <div class="selector-group">
          <label class="selector-label">Active Batch</label>
          <select id="batch-select" class="fac-dropdown" onchange="FacultyView._pickBatch(this.value)">
            ${batches.map(b => `<option value="${b.batchCode}" ${B && b.batchCode === B.batchCode ? 'selected' : ''}>${b.batchCode} — ${b.branch}</option>`).join('')}
          </select>
        </div>
        <div class="selector-group">
          <label class="selector-label">Active Subject</label>
          <select id="subject-select" class="fac-dropdown" onchange="FacultyView._pickSubject(this.value)">
            ${(B ? B.subjects : []).map(sid => {
                const sub = window.DUMMY.subjects.find(s => s.id === sid);
                return `<option value="${sid}" ${sid === code ? 'selected' : ''}>${sub ? sub.name : sid}</option>`;
            }).join('')}
          </select>
        </div>
      </div>

      <div style="background:linear-gradient(140deg, #1a0505, #0a0202); border: 1px solid var(--red-border); padding: 24px; position: relative; overflow: hidden; margin-bottom: 15px;">
        <div style="position:absolute; top:0; left:0; right:0; height:3px; background:var(--red);"></div>
        <div style="display:flex; align-items:center; gap:20px; position:relative;">
           <div style="width:54px; height:54px; border:1px solid var(--red-border); overflow:hidden;">
              <img src="${S ? S.profImage : ''}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://ui-avatars.com/api/?name=F'"/>
           </div>
           <div>
              <div style="font-size:1.2rem; font-weight:800; color:var(--red-light); line-height:1;">${S ? S.name : code}</div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:6px;">${code} &middot; <span style="color:var(--text-2); font-weight:700;">${B ? B.batchCode : ''}</span></div>
           </div>
        </div>
      </div>

      <div class="fac-tab-nav">
        <div class="fac-tab ${this._activeTab === 'modules' ? 'active' : ''}" onclick="FacultyView._setTab('modules')">MODULES</div>
        <div class="fac-tab ${this._activeTab === 'assignments' ? 'active' : ''}" onclick="FacultyView._setTab('assignments')">ASSIGNMENTS</div>
      </div>

      <div id="faculty-view-content">
        ${this._renderActiveTab(code)}
      </div>
    `;

    this._bindEvents(code);
  },

  _setTab(tab) {
    this._activeTab = tab;
    this._paint();
  },

  _renderActiveTab(code) {
    if (this._activeTab === 'modules') return this._renderModulesView(code);
    if (this._activeTab === 'assignments') return this._renderAssignmentsView(code);
  },

  _renderModulesView(code) {
    const mods = window.DUMMY.modules[code] || [];
    return `
      <div id="module-manager">
        ${mods.length ? mods.map(m => this._renderModuleItem(m, code)).join('') : `<div style="padding:40px; text-align:center; color:var(--text-muted);">No modules yet.</div>`}
      </div>
      <button id="btn-add-module" class="btn-outline" style="width:100%; margin-top:10px; padding:12px; font-weight:800;">+ ADD NEW MODULE</button>
    `;
  },

  _renderModuleItem(mod, code) {
    const collapsed = !!this._collapsed[mod.num];
    const lastMod = mod.lastModified ? new Date(mod.lastModified).toLocaleString() : 'Never';
    return `
      <div style="background:var(--surface); border:1px solid var(--border); margin-bottom:12px;">
        <div style="padding:14px; display:flex; align-items:center; gap:12px;">
          <button data-action="toggle" data-modnum="${mod.num}" class="clicky-element" style="width:28px; height:28px; border:1px solid var(--border); background:var(--surface-2); color:var(--text-muted); font-size:0.7rem;">${collapsed ? '▶' : '▼'}</button>
          <div style="flex:1;">
            <div style="font-size:0.9rem; font-weight:700; color:var(--text);">${mod.title}</div>
            <div class="date-badge">Last modified: ${lastMod}</div>
          </div>
          <button data-action="delete-mod" data-modnum="${mod.num}" class="tag tag-gray" style="border:none; cursor:pointer; padding:4px 10px;">REMOVE</button>
        </div>
        ${collapsed ? '' : this._renderModuleFiles(mod, code)}
      </div>
    `;
  },

  _renderModuleFiles(mod, code) {
    return `
      <div style="border-top:1px solid var(--border); background:var(--surface-2);">
        ${mod.chapters.map((ch, i) => `
          <div style="border-bottom:1px solid var(--border); overflow:hidden;">
            <div style="padding:12px 15px; display:flex; justify-content:space-between; align-items:center; background:var(--surface);">
              <div>
                <div style="font-size:0.8rem; font-weight:700; color:var(--text-2);">${ch.title}</div>
                <div class="date-badge">Uploaded: ${ch.uploadDate || 'Legacy'}</div>
              </div>
              <button data-action="file-delete" data-modnum="${mod.num}" data-fileid="${ch.id}" 
                      style="background:none; border:none; cursor:pointer; color:var(--red-light); font-size:0.85rem;">🗑</button>
            </div>
            <div style="display:flex; border-top:1px solid var(--border);">
              <button data-action="file-view" data-fileid="${ch.id}" 
                style="flex:1; padding:12px; font-size:0.7rem; font-weight:700; color:var(--red-light); background:var(--red-glow); border:none; border-right:1px solid var(--border); cursor:pointer;">📄 VIEW</button>
              <button data-action="file-save" data-fileid="${ch.id}" 
                style="flex:1; padding:12px; font-size:0.7rem; font-weight:700; color:var(--text-2); background:var(--surface-2); border:none; cursor:pointer;">💾 SAVE</button>
            </div>
          </div>
        `).join('')}
        <div style="padding:15px;">
           <div data-drop-zone="${mod.num}" style="border:1px dashed var(--red-border); padding:25px; text-align:center; background:var(--red-glow); cursor:pointer;" onclick="if(!FacultyView._pendingFiles[${mod.num}]) document.getElementById('ffile-${mod.num}').click()">
              <div id="drop-text-${mod.num}">
                <div style="font-size:0.75rem; font-weight:700; color:var(--text-3);">Drop resource or <span style="color:var(--red-light);">browse files</span></div>
              </div>
              <div id="drop-pending-${mod.num}" style="display:none;">
                <div id="drop-name-${mod.num}" style="font-size:0.75rem; font-weight:700; color:var(--text); margin-bottom:10px;"></div>
                <div style="display:flex; gap:10px; justify-content:center;">
                  <button data-action="upload-confirm" data-modnum="${mod.num}" class="btn-solid-red" style="font-size:0.65rem; padding:6px 15px; border-radius:0;">CONFIRM UPLOAD</button>
                  <button data-action="upload-cancel" data-modnum="${mod.num}" class="btn-outline" style="font-size:0.65rem; padding:6px 15px; border-radius:0;">CANCEL</button>
                </div>
              </div>
              <input type="file" id="ffile-${mod.num}" style="display:none;" onchange="FacultyView._onFileSelect(${mod.num}, this.files[0])">
           </div>
           <div id="umsg-${mod.num}" style="display:none;font-size:0.7rem;margin-top:8px;text-align:center;font-weight:700;color:var(--red-light);"></div>
        </div>
      </div>
    `;
  },

  _renderAssignmentsView(code) {
    if (!window.DUMMY.assignments) window.DUMMY.assignments = {};
    const assigns = window.DUMMY.assignments[code] || [];
    return `
      <div class="admin-card" style="padding:24px; margin-bottom:24px;">
        <div style="font-size:0.9rem; font-weight:800; color:var(--red-light); margin-bottom:20px; text-transform:uppercase; letter-spacing:1px;">Create New Assignment</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
            <div class="selector-group">
              <label class="selector-label">Task Title</label>
              <input type="text" id="asgn-title" placeholder="e.g. Lab Exercise 1" class="fac-input-themed">
            </div>
            <div class="selector-group">
              <label class="selector-label">Submission Deadline</label>
              <input type="datetime-local" id="asgn-deadline" class="fac-input-themed">
            </div>
        </div>
        
        <div class="selector-label" style="margin-bottom:8px;">Instruction Document</div>
        <div class="asgn-upload-zone" onclick="document.getElementById('asgn-file').click()">
           <input type="file" id="asgn-file" style="display:none;" onchange="FacultyView._onAsgnFileSelect(this.files[0])">
           <div id="asgn-file-status" style="font-size:0.75rem; font-weight:700; color:var(--text-3);">
             ${this._pendingAsgnFile ? 'Attached: ' + this._pendingAsgnFile.name : '📄 Drag & Drop Question Paper or Browse'}
           </div>
        </div>

        <div style="display:flex; align-items:center; gap:25px; margin-bottom:20px;">
           <label style="font-size:0.75rem; display:flex; align-items:center; gap:10px; color:var(--text-2); font-weight:700; cursor:pointer;">
              <input type="checkbox" id="asgn-late" style="width:16px; height:16px; cursor:pointer;"> Allow Late Submissions
           </label>
           <label style="font-size:0.75rem; display:flex; align-items:center; gap:10px; color:var(--text-2); font-weight:700; cursor:pointer;">
              <input type="checkbox" id="asgn-visible" checked style="width:16px; height:16px; cursor:pointer;"> Publishing Active
           </label>
        </div>
        <button id="btn-publish-asgn" onclick="FacultyView._createAssignment('${code}')" class="btn-solid-red" style="width:100%; padding:14px; font-weight:800; border-radius:0; font-size:0.8rem;">PUBLISH ASSIGNMENT</button>
      </div>

      <div class="section-header" style="margin-bottom:15px; border-bottom:1px solid var(--border); padding-bottom:10px;">
        <div class="section-title" style="font-size:1rem;">Subject Portfolio</div>
      </div>
      
      ${assigns.map(a => `
        <div class="admin-card assignment-card" style="padding:0; overflow:hidden; margin-bottom:15px;">
           <div style="padding:18px; display:flex; justify-content:space-between; align-items:flex-start;">
             <div>
                <div style="font-size:1rem; font-weight:800; color:var(--text);">${a.title}</div>
                <div class="date-badge" style="color:var(--red-light); margin-top:4px;">Deadline: ${new Date(a.deadline).toLocaleString()}</div>
                <div style="font-size:0.65rem; color:var(--text-muted); margin-top:6px; font-weight:600;">
                  ${a.allowLate ? '🔓 LATE ENABLED' : '🔒 HARD DEADLINE'} &middot; PUBLISHED: ${new Date(a.createdAt).toLocaleDateString()}
                </div>
             </div>
             <div style="display:flex; gap:8px;">
                <button class="btn-outline" style="padding:6px 12px; font-size:0.65rem; border-radius:0; font-weight:700;" onclick="FacultyView._extendDeadline('${code}','${a.id}')">EXTEND</button>
                <button class="btn-outline" style="padding:6px 12px; font-size:0.65rem; color:var(--red-light); border-radius:0; font-weight:700;" onclick="FacultyView._deleteAssignment('${code}','${a.id}')">DELETE</button>
             </div>
           </div>
           ${a.file ? `
           <div style="display:flex; border-top:1px solid var(--border);">
              <button class="btn-red" style="flex:1; border:none; border-right:1px solid var(--border); padding:10px; font-size:0.7rem; font-weight:800; background:var(--red-glow); cursor:pointer;" onclick="alert('Viewing assignment...')">📄 VIEW REF</button>
              <button class="btn-outline" style="flex:1; border:none; padding:10px; font-size:0.7rem; font-weight:800; background:var(--surface-2); cursor:pointer;" onclick="alert('Downloading assignment...')">💾 SAVE REF</button>
           </div>` : ''}
        </div>
      `).join('')}
      </div>
    `;
  },

  _bindEvents(code) {
    const mm = document.getElementById('module-manager');
    if (mm) {
      mm.addEventListener('click', e => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const { action, modnum, fileid } = btn.dataset;
        if (action === 'toggle') this._toggle(parseInt(modnum), code);
        else if (action === 'delete-mod') this._deleteModule(code, parseInt(modnum));
        else if (action === 'upload-confirm') this._confirmUpload(code, parseInt(modnum));
        else if (action === 'upload-cancel') this._cancelUpload(parseInt(modnum));
        else if (action === 'file-delete') this._deleteFile(code, parseInt(modnum), fileid);
        else if (action === 'file-view') alert('Opening file for review...');
        else if (action === 'file-save') alert('Downloading file to system...');
      });
    }

    const addBtn = document.getElementById('btn-add-module');
    if (addBtn) addBtn.onclick = () => this._addModule(code);
  },

  _onAsgnFileSelect(file) {
    if (!file) return;
    this._pendingAsgnFile = file;
    const el = document.getElementById('asgn-file-status');
    if (el) {
      el.textContent = 'Attached: ' + file.name;
      el.style.color = 'var(--red-light)';
    }
  },

  _pickBatch(code) {
    this._batch = window.DUMMY.facultyBatches.find(b => b.batchCode === code) || this._batch;
    // Auto-select first subject of new batch
    this._subject = window.DUMMY.subjects.find(s => s.id === this._batch.subjects[0]) || null;
    this._paint();
  },

  _pickSubject(id) {
    this._subject = window.DUMMY.subjects.find(s => s.id === id) || null;
    this._paint();
  },

  _toggle(num, code) {
    this._collapsed[num] = !this._collapsed[num];
    this._paint();
  },

  _addModule(code) {
    if (!window.DUMMY.modules[code]) window.DUMMY.modules[code] = [];
    const mods = window.DUMMY.modules[code];
    const num = mods.length ? Math.max(...mods.map(m => m.num)) + 1 : 1;
    mods.push({ id: code + '-M' + num, title: 'Module ' + num, num: num, chapters: [], lastModified: Date.now() });
    this._paint();
  },

  _onFileSelect(modNum, file) {
    if (!file) return;
    this._pendingFiles[modNum] = file;
    this._paint();
    setTimeout(() => {
        const textEl = document.getElementById('drop-text-' + modNum);
        const pendingEl = document.getElementById('drop-pending-' + modNum);
        const nameEl = document.getElementById('drop-name-' + modNum);
        if (textEl) textEl.style.display = 'none';
        if (pendingEl) pendingEl.style.display = 'block';
        if (nameEl) nameEl.textContent = 'READY: ' + file.name;
    }, 10);
  },

  _cancelUpload(modNum) {
    delete this._pendingFiles[modNum];
    this._paint();
  },

  async _confirmUpload(code, modNum) {
    const file = this._pendingFiles[modNum];
    if (!file) return;
    const msg = document.getElementById('umsg-' + modNum);
    if (msg) { msg.style.display = 'block'; msg.textContent = 'TRANSMITTING TO CLOUD...'; }

    const result = await StorageService.uploadFile(file, file.name);
    if (result.ok) {
       const mod = window.DUMMY.modules[code].find(m => m.num === modNum);
       if (mod) {
          mod.chapters.push({
            id: 'f' + Date.now(),
            title: file.name,
            uploadDate: new Date().toLocaleString()
          });
          mod.lastModified = Date.now();
       }
       delete this._pendingFiles[modNum];
       this._paint();
    } else alert(result.error);
  },

  _deleteFile(code, modNum, fileId) {
     if (!confirm('Permanently delete this resource?')) return;
     const mod = window.DUMMY.modules[code].find(m => m.num === modNum);
     if (mod) {
        mod.chapters = mod.chapters.filter(c => c.id !== fileId);
        mod.lastModified = Date.now();
        this._paint();
     }
  },

  _deleteModule(code, num) {
     if (!confirm('Wipe this module and all associated files?')) return;
     window.DUMMY.modules[code] = window.DUMMY.modules[code].filter(m => m.num !== num);
     this._paint();
  },

  async _createAssignment(code) {
    const title = document.getElementById('asgn-title').value;
    const deadline = document.getElementById('asgn-deadline').value;
    const allowLate = document.getElementById('asgn-late').checked;
    const file = this._pendingAsgnFile;

    if (!title || !deadline) return alert('Assignment Title and Deadline are mandatory.');

    const btn = document.getElementById('btn-publish-asgn');
    if (btn) { btn.disabled = true; btn.textContent = 'UPLOADING DOCS...'; }

    let fileId = null;
    let fileName = null;
    if (file) {
      const res = await StorageService.uploadFile(file, file.name);
      if (res.ok) {
        fileId = 'f' + Date.now();
        fileName = file.name;
      }
    }

    if (!window.DUMMY.assignments) window.DUMMY.assignments = {};
    if (!window.DUMMY.assignments[code]) window.DUMMY.assignments[code] = [];
    
    window.DUMMY.assignments[code].push({ 
      id: 'asg-' + Date.now(), 
      title, 
      deadline, 
      allowLate, 
      createdAt: Date.now(),
      file: fileName ? { id: fileId, name: fileName } : null
    });

    this._pendingAsgnFile = null;
    alert('Assignment Portal Opened Successfully.');
    this._paint();
  },

  _deleteAssignment(code, id) {
     if (confirm('Trash this assignment?')) {
        window.DUMMY.assignments[code] = window.DUMMY.assignments[code].filter(a => a.id !== id);
        this._paint();
     }
  },

  _extendDeadline(code, id) {
     const newDate = prompt('New Deadline (YYYY-MM-DDTHH:MM):');
     if (newDate) {
        const a = window.DUMMY.assignments[code].find(x => x.id === id);
        if (a) a.deadline = newDate;
        this._paint();
     }
  }
};
