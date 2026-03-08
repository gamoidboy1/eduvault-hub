// js/views/subjects.js — Subject Grid v3.2 — Replaced Emojis with Faculty Images

window.SubjectsView = {
  _accentPalette: ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4'],

  render() {
    const main = document.getElementById('main-content');
    if (!main) return;
    
    // Inject global sharp styles if they don't exist yet
    let style = document.getElementById('sharp-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'sharp-styles';
      style.innerHTML = `
        .sharp-panel {
          background: rgba(25, 25, 25, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          border-radius: 0px !important;
        }
        .clicky {
          cursor: pointer;
          transition: background 0.1s ease, border-color 0.1s ease, transform 0.05s ease !important;
        }
        .clicky:hover {
          background: rgba(255, 255, 255, 0.05);
        }
        .clicky:active {
          transform: scale(0.97) !important;
        }
        .sharp-input {
          border-radius: 0px !important;
          border: 1px solid var(--border) !important;
          background: rgba(0,0,0,0.3) !important;
          transition: border-color 0.1s ease !important;
        }
        .sharp-input:focus {
          border-color: var(--red-light) !important;
          outline: none;
        }
      `;
      document.head.appendChild(style);
    }

    main.innerHTML = `
      <div class="view-container">
        <div style="display:flex;align-items:flex-end;justify-content:space-between;border-bottom: 1px solid var(--border); padding-bottom: 20px; flex-wrap: wrap; gap: 10px;">
          <div>
            <div style="font-size:1.4rem;font-weight:800;color:var(--text);text-transform:uppercase;letter-spacing:1px;">Study Materials</div>
            <div style="font-size:0.8rem;color:var(--text-muted);margin-top:4px;text-transform:uppercase;letter-spacing:0.5px;font-weight:600;">
              CS Cybersecurity | 
              <span style="color:var(--red-light);">${window.DUMMY.subjects.length} subjects</span>
            </div>
          </div>
        </div>

        <div style="padding:24px 0 0;">
          <div style="position:relative;">
            <span style="position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:.9rem;pointer-events:none;color:var(--text-muted);">🔍</span>
            <input type="text" id="subject-search" placeholder="Search subjects, teachers..."
              class="sharp-input"
              oninput="SubjectsView.filter(this.value)"
              style="width:100%;padding:14px 14px 14px 44px;font-size:0.9rem;color:var(--text);" />
          </div>
        </div>

        <div id="subjects-grid" style="padding:24px 0;">
          ${this._buildGrid(window.DUMMY.subjects)}
        </div>
      </div>
    `;
  },

  _buildGrid(subjects) {
    if (!subjects.length) return `
      <div style="text-align:center;padding:48px 16px;color:var(--text-muted);font-size:.85rem;text-transform:uppercase;letter-spacing:1px;">
        <div style="font-size:2rem;margin-bottom:12px;">🔍</div>
        No subjects found
      </div>`;
    return `<div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:16px;">
      ${subjects.map((s, i) => this._card(s, i)).join('')}
    </div>`;
  },

  _card(s, index) {
    const accent = this._accentPalette[index % this._accentPalette.length];
    return `
      <div class="sharp-panel clicky subject-card" onclick="App.openSubject('${s.id}')"
        style="padding:0;display:flex;flex-direction:column;position:relative;height:100%;"
        onmouseenter="this.style.borderColor='${accent}88'"
        onmouseleave="this.style.borderColor='var(--border)'">

        <div style="height:4px;background:${accent};width:100%;"></div>

        <div style="padding:20px;">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:16px;">
            <div style="width:48px;height:48px;background:var(--surface-2);border:1px solid var(--border);
                        display:flex;align-items:center;justify-content:center;overflow:hidden;">
               <img src="${s.profImage}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(s.teacher)}&background=random'"/>
            </div>
            <span style="font-size:0.7rem;font-weight:800;color:${accent};background:${accent}15;border:1px solid ${accent}33;padding:4px 8px;letter-spacing:0.5px;">${s.code}</span>
          </div>

          <div style="font-size:1.1rem;font-weight:700;color:var(--text);line-height:1.3;margin-bottom:12px;">${s.name}</div>

          <div style="border-top:1px solid var(--border);padding-top:16px;display:flex;justify-content:space-between;align-items:center;">
            <div style="font-size:0.75rem;color:var(--text-muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
                        max-width:100%;font-weight:600;" title="${s.teacher}">${s.teacher}</div>
          </div>
        </div>
      </div>
    `;
  },

  filter(q) {
    q = q.toLowerCase().trim();
    const filtered = q
      ? window.DUMMY.subjects.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.teacher.toLowerCase().includes(q))
      : window.DUMMY.subjects;
    const grid = document.getElementById('subjects-grid');
    if (grid) grid.innerHTML = this._buildGrid(filtered);
  }
};
