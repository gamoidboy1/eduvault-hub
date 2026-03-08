// js/components/header.js — Brand left, profile avatar right, used by both student & faculty
// v2.0 - Renamed to EduVault & Removed Online Counter

window.HeaderComponent = {
  render() {
    const el = document.getElementById('app-header');
    if (!el) return;
    const u = window.DUMMY.currentUser;
    const isFaculty = u.role === 'faculty';

    el.innerHTML = `
      <!-- Brand & Toggle -->
      <div style="display:flex; align-items:center;">
        <div class="header-brand" onclick="App.switchView('dashboard')"
          style="display:flex;align-items:center;gap:10px;cursor:pointer;">
          <div style="width:30px;height:30px;background:var(--red);border-radius:0px;
                      display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <span style="font-size:.75rem;font-weight:900;color:#fff;letter-spacing:-.5px;">SM</span>
          </div>
          <div class="brand-text-container">
              <div class="title" style="font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Studiom</div>
              <div class="subtitle">${u.branch} · ${u.roll}</div>
          </div>
        </div>
      </div>

      <!-- Right side -->
      <div class="header-right">
        <div style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
            ${isFaculty ? 'Faculty Portal' : 'Student Portal'}
        </div>
      </div>
    `;
  },

  setActiveToggle() { },
  setUserLabel() { },
  destroy() { }
};
