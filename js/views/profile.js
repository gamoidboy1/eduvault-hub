// js/views/profile.js — Unified profile v2.2 — Final Clean Polish

window.ProfileView = {

  render() {
    const main = document.getElementById('main-content');
    if (!main) return;
    const u = window.DUMMY.currentUser;
    const isFaculty = u.role === 'faculty';
    const initials = u.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

    main.innerHTML = `
      <!-- Profile Hero -->
      <div>
        <div class="hero-card" style="text-align:center;">
          <div class="hero-glow" style="top:-70px;left:50%;transform:translateX(-50%);width:280px;height:280px;"></div>

          <!-- Avatar ring -->
          <div style="position:relative;display:inline-flex;align-items:center;justify-content:center;margin-bottom:14px;">
            <div style="width:76px;height:76px;
                        background:${isFaculty ? 'rgba(139,92,246,.12)' : 'var(--red-glow)'};
                        border:2px solid ${isFaculty ? 'rgba(139,92,246,.35)' : 'var(--red-border)'};
                        display:flex;align-items:center;justify-content:center;
                        font-size:1.55rem;font-weight:900;
                        color:${isFaculty ? '#D8B4FE' : 'var(--red-light)'};
                        position:relative;z-index:1;">${initials}</div>
            <div style="position:absolute;inset:-4px;border:1px solid ${isFaculty ? 'rgba(139,92,246,.2)' : 'var(--red-border)'};opacity:.5;"></div>
          </div>

          <div style="font-size:1.2rem;font-weight:800;color:#fff;margin-bottom:3px;letter-spacing:-.3px;">${u.name}</div>
          <div style="font-size:.73rem;color:var(--text-muted);margin-bottom:14px;">${u.email}</div>

          <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;">
            <span style="background:${isFaculty ? 'rgba(139,92,246,.1)' : 'var(--red-glow)'};
                         border:1px solid ${isFaculty ? 'rgba(139,92,246,.3)' : 'var(--red-border)'};
                         padding:4px 13px;font-size:.65rem;font-weight:700;
                         color:${isFaculty ? '#D8B4FE' : 'var(--red-light)'};">${isFaculty ? 'Faculty' : u.branch}</span>
            <span style="background:var(--surface);border:1px solid var(--border);
                         padding:4px 13px;font-size:.65rem;font-weight:600;color:var(--text-3);">${u.roll}</span>
            ${!isFaculty ? `<span style="background:var(--surface);border:1px solid var(--border);padding:4px 13px;font-size:.65rem;font-weight:600;color:var(--text-3);">Sem ${u.sem}</span>` : ''}
          </div>
        </div>
      </div>

      <div style="margin-bottom: 20px;"></div>

      <!-- Account Details -->
      <div class="section-label" style="padding-left:0; padding-right:0;">Account Details</div>
      <div class="t-box" style="margin-top:0;">
        <div style="padding:0 16px;">
          ${this._row('Full Name', u.name)}
          ${this._row('Email', u.email)}
          ${this._row(isFaculty ? 'Employee ID' : 'Reg. Number', u.roll)}
          ${this._row('Department', u.branch)}
          ${isFaculty ? '' : this._row('Semester', 'Semester ' + u.sem)}
          ${this._row('Academic Year', '2025–2026')}
          ${this._row('Institution', 'ABCD Institute of Technology')}
        </div>
      </div>

    `;
  },

  _row(key, val) {
    return `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:11px 0;
                  border-bottom:1px solid rgba(255,255,255,.04);">
        <span style="font-size:.77rem;color:var(--text-muted);font-weight:500;">${key}</span>
        <span style="font-size:.77rem;color:var(--text-2);font-weight:600;">${val}</span>
      </div>`;
  }
};
