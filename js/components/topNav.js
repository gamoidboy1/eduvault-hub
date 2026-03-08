// js/components/topNav.js — 2-tab navigation only (no profile tab, it's in header)

window.TopNavComponent = {
    _current: 'dashboard',

    _studentTabs: [
        { id: 'dashboard', label: 'Home', icon: '' },
        { id: 'requests', label: 'Requests', icon: '' },
        { id: 'subjects', label: 'Study', icon: '' }
    ],

    _facultyTabs: [
        { id: 'dashboard', label: 'Home', icon: '' },
        { id: 'faculty', label: 'Courses', icon: '' }
    ],

    _tabs() {
        return window.DUMMY.currentUser.role === 'faculty'
            ? this._facultyTabs
            : this._studentTabs;
    },

    render() {
        const nav = document.getElementById('top-nav');
        if (!nav) return;
        nav.innerHTML = `
      <div class="sidebar-top">
        <div style="display:flex; align-items:center; justify-content:space-between; padding:0 10px 10px; border-bottom:1px solid var(--border); margin-bottom:10px;" class="mobile-only-header">
            <span style="font-weight:800; font-size:0.8rem; color:var(--red-light);">MENU</span>
            <button onclick="App.closeNav()" style="background:none; border:none; color:white; font-size:1.4rem; cursor:pointer;">×</button>
        </div>
        ${this._tabs().map(tab => `
          <button
            class="t-tab ${tab.id === this._current ? 'active' : ''}"
            id="ttab-${tab.id}"
            onclick="TopNavComponent.navigate('${tab.id}')"
          >${tab.icon} &nbsp;${tab.label}</button>
        `).join('')}
      </div>
      <div class="sidebar-footer" style="margin-top:auto; padding-top:20px;">
        <button class="t-tab" onclick="App.switchView('profile'); App.closeNav();">Profile</button>
        <button class="t-tab" onclick="alert('Settings — Coming Soon')">Settings</button>
        <button class="t-tab" onclick="App.toggleTheme(); App.closeNav();">Themes</button>
        <div style="padding:16px 8px 0;">
          <button class="clicky-element btn-logout-hover" 
            style="width:100%; padding:14px; background: linear-gradient(135deg, rgba(217, 43, 43, 0.8), rgba(217, 43, 43, 0.9)); 
                   color:white !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 4px;
                   font-weight:800; font-size:0.75rem; display:flex; align-items:center; 
                   justify-content:center; gap:10px; transition:all 0.2s cubic-bezier(0.4, 0, 0.2, 1); 
                   box-shadow: 0 4px 15px rgba(217, 43, 43, 0.25) !important; 
                   letter-spacing: 0.8px; text-transform: uppercase;"
            onclick="localStorage.removeItem('educonnect_session'); localStorage.removeItem('educonnect_view'); AuthService.logout().then(() => location.reload())">
            LOG OUT
          </button>
        </div>
      </div>
    `;
    },

    navigate(id) {
        App.switchView(id);
        App.closeNav(); // Close mobile sidebar after click
    },

    setActive(id) {
        this._current = id;
        this._tabs().forEach(tab => {
            const btn = document.getElementById('ttab-' + tab.id);
            if (btn) btn.className = 't-tab' + (tab.id === id ? ' active' : '');
        });
    }
};
