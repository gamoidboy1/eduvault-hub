// js/components/header.js — Brand left, profile avatar right, used by both student & faculty
// v2.0 - Renamed to EduVault & Removed Online Counter

window.HeaderComponent = {
  render() {
    const el = document.getElementById('app-header');
    if (!el) return;
    const u = window.DUMMY.currentUser;
    const isFaculty = u.role === 'faculty';

    el.innerHTML = `
      <div style="display:flex; align-items:center;">
        <div class="header-brand" onclick="App.switchView('dashboard')"
          style="display:flex;align-items:center;gap:10px;cursor:pointer;">
          <img src="assets/logo.png" alt="Acadex Logo" 
               style="width:30px;height:30px;object-fit:contain;flex-shrink:0;">
          <div class="brand-text-container">
              <div class="title" style="font-family: 'Inter', sans-serif; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Acadex</div>
              <div class="subtitle">${u.branch} · ${u.roll}</div>
          </div>
        </div>
      </div>

      <!-- Right side -->
      <div class="header-right">
        <div id="header-clock" style="font-size: 0.72rem; color: var(--text-2); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; font-family:'Inter', sans-serif;"></div>
      </div>
    `;
    this.startClock();
  },

  startClock() {
    const update = () => {
        const clockEl = document.getElementById('header-clock');
        if (!clockEl) return;

        const now = new Date();
        
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
        clockEl.textContent = timeStr;
    };

    update();
    if (this._clockInterval) clearInterval(this._clockInterval);
    this._clockInterval = setInterval(update, 1000);
  },

  destroy() {
    if (this._clockInterval) clearInterval(this._clockInterval);
  }
};
