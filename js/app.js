// js/app.js — Main Router with Quick Login

function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.App = {
    async init() {
        await CSVData.load();
        
        // Initialize real-time sync if firebase is ready
        if (window.FirestoreService && window.FirestoreService.initLiveSync) {
            window.FirestoreService.initLiveSync();
        }

        // Restore Theme before rendering anything
        const savedTheme = localStorage.getItem('acadex_theme');
        if (savedTheme === 'light') {
            this.toggleTheme(true);
        }

        // Close nav on overlay click
        document.body.addEventListener('click', (e) => {
            if (document.body.classList.contains('nav-open') && e.target === document.body) {
                this.closeNav();
            }
        });

        // Auto-login from session storage to prevent refresh wipeout
        const savedSession = localStorage.getItem('educonnect_session');
        if (savedSession) {
            try {
                const data = JSON.parse(savedSession);
                let user = window.CSVData.students.find(s => s.email === data.email);
                if (user) {
                    const savedView = localStorage.getItem('educonnect_view') || 'dashboard';
                    // Pre-set nav state so first render is correct
                    if (window.TopNavComponent) window.TopNavComponent._current = savedView;
                    
                    this._loginUser(user, true); 
                    this.switchView(savedView);
                } else {
                    this._showLogin();
                }
            } catch(e) {
                this._showLogin();
            }
        } else {
            this._showLogin();
        }

        // PWA Install logic
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            window.App.deferredPrompt = e;
            const isAndroid = /Android/i.test(navigator.userAgent);
            if (isAndroid) {
                const banner = document.getElementById('pwa-install-banner');
                if (banner) banner.style.display = 'flex';
            }
        });
    },

    async handleLogin() {
        const email = document.getElementById('login-email').value.trim();
        const pass = document.getElementById('login-password').value;
        const msgEl = document.getElementById('login-msg');

        if (!email || !pass) {
            if (msgEl) { msgEl.style.color = 'var(--red-light)'; msgEl.textContent = 'Please enter email and password.'; }
            return;
        }

        if (msgEl) { msgEl.style.color = 'var(--text-muted)'; msgEl.textContent = 'Authenticating...'; }

        const res = await window.AuthService.login(email, pass);
        
        if (res.ok) {
            if (msgEl) { msgEl.style.color = '#6EE7B7'; msgEl.textContent = `✓ Welcome, ${window.DUMMY.currentUser.name}`; }
            setTimeout(() => this._loginUser(window.DUMMY.currentUser, false), 400);
        } else {
            if (msgEl) { msgEl.style.color = 'var(--red-light)'; msgEl.textContent = res.error; }
        }
    },

    async handleGoogleLogin() {
        const msgEl = document.getElementById('login-msg');
        if (msgEl) { msgEl.style.color = 'var(--text-muted)'; msgEl.textContent = 'Redirecting to Google...'; }

        const res = await window.AuthService.googleLogin();
        
        if (res.ok) {
            if (msgEl) { msgEl.style.color = '#6EE7B7'; msgEl.textContent = `✓ Welcome, ${window.DUMMY.currentUser.name}`; }
            setTimeout(() => this._loginUser(window.DUMMY.currentUser, false), 400);
        } else {
            if (msgEl) { msgEl.style.color = 'var(--red-light)'; msgEl.textContent = res.error; }
        }
    },

    async handleResetPassword() {
        const email = document.getElementById('login-email').value.trim();
        const msgEl = document.getElementById('login-msg');

        if (!email) {
            if (msgEl) { msgEl.style.color = 'var(--red-light)'; msgEl.textContent = 'Please enter your email address first.'; }
            return;
        }

        if (msgEl) { msgEl.style.color = 'var(--text-muted)'; msgEl.textContent = 'Sending reset link...'; }

        const res = await window.AuthService.resetPassword(email);
        
        if (res.ok) {
            if (msgEl) { msgEl.style.color = '#6EE7B7'; msgEl.textContent = `✓ Password reset email sent to ${email}`; }
        } else {
            if (msgEl) { msgEl.style.color = 'var(--red-light)'; msgEl.textContent = res.error; }
        }
    },

    _loginUser(user, isAutoRestore = false) {
        Object.assign(window.DUMMY.currentUser, user);
        
        if (user.role === 'student' && user.branch && window.CSVData.branches[user.branch]) {
            const branchCourses = window.CSVData.branches[user.branch];
            if (!window.DUMMY._allSubjects) window.DUMMY._allSubjects = [...window.DUMMY.subjects];
            window.DUMMY.subjects = window.DUMMY._allSubjects.filter(s => branchCourses.includes(s.id));
        }

        localStorage.setItem('educonnect_session', JSON.stringify({ email: user.email }));
        
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('app').style.display = 'block';

        HeaderComponent.render();
        TopNavComponent.render();

        if (!isAutoRestore) {
            if (user.role === 'faculty') this.switchView('dashboard');
            else this.switchView('dashboard');
        }
    },

    _showLogin() {
        document.getElementById('splash-screen').style.display = 'none';
        document.getElementById('login-overlay').style.display = 'flex';
    },

    switchView(view) {
        localStorage.setItem('educonnect_view', view);
        window.scrollTo({ top: 0, behavior: 'instant' });
        const role = window.DUMMY.currentUser.role;

        if (view === 'dashboard') {
            TopNavComponent.setActive('dashboard');
            if (role === 'faculty') FacultyDashboardView.render();
            else DashboardView.render();
            return;
        }

        const tabMap = { subjects: 'subjects', faculty: 'faculty', profile: 'profile', requests: 'requests' };
        if (tabMap[view] !== undefined) {
            TopNavComponent.setActive(tabMap[view]);
        }

        switch (view) {
            case 'subjects': SubjectsView.render(); break;
            case 'faculty': FacultyView.render(); break;
            case 'profile': ProfileView.render(); break;
            case 'requests': RequestsView.render(); break;
        }
    },

    openSubject(subjectId) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        TopNavComponent.setActive('subjects');
        SubjectDetailView.render(subjectId);
    },

    openModule(subjectId, moduleId) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        TopNavComponent.setActive('subjects');
        ModuleDetailView.render(subjectId, moduleId);
    },

    openFacultyCourse(batchCode, subjectCode) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        FacultyView.renderCourse(batchCode, subjectCode);
    },

    toggleTheme(isInitialLoad = false) {
        if (!isInitialLoad) {
            document.documentElement.classList.toggle('light-theme');
            const currentTheme = document.documentElement.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('acadex_theme', currentTheme);
        } else {
            document.documentElement.classList.add('light-theme');
        }

        if (!document.getElementById('light-theme-styles')) {
            const style = document.createElement('style');
            style.id = 'light-theme-styles';
            style.innerHTML = `
                .light-theme {
                    --bg: #f5f5f7;
                    --surface: #ffffff;
                    --surface-2: #f0f0f2;
                    --text: #1d1d1f;
                    --text-2: #424245;
                    --text-muted: #86868b;
                    --border: rgba(0, 0, 0, 0.1);
                    --red-light: #d10000;
                    --red-glow: rgba(209, 0, 0, 0.05);
                    --red-border: rgba(209, 0, 0, 0.2);
                    --grad-logo: linear-gradient(135deg, #1d1d1f 0%, #d10000 120%);
                }
                .light-theme body, .light-theme #app-header, .light-theme #top-nav {
                    background-color: var(--bg) !important;
                    color: var(--text) !important;
                    border-bottom: 1px solid var(--border) !important;
                }
                .light-theme #top-nav { background: var(--surface) !important; border-right: 1px solid var(--border) !important; }
                .light-theme .glass-panel, .light-theme .sharp-panel, .light-theme .hero-card, .light-theme .stat-card, .light-theme .subject-card, .light-theme .admin-card, .light-theme .assignment-card,
                .light-theme [style*="background:linear-gradient"]:not(.btn-logout-hover),
                .light-theme [style*="background: linear-gradient"]:not(.btn-logout-hover),
                .light-theme [style*="background:rgba(0,0,0,.25)"], 
                .light-theme [style*="background: rgba(0,0,0,0.6)"] {
                    background: var(--surface) !important; background-image: none !important; border: 1px solid var(--border) !important; color: var(--text) !important; box-shadow: 0 4px 12px rgba(0,0,0,0.05) !important;
                }
                .btn-logout-hover:hover {
                    filter: brightness(0.8) !important;
                }
                .light-theme .t-box, .light-theme .stat-box, .light-theme .t-tab { background: var(--surface) !important; border: 1px solid var(--border) !important; }
                .light-theme .t-tab:hover { background: var(--surface-2) !important; }
                .light-theme .tag-gray, .light-theme .tag { background: var(--surface-2) !important; color: var(--text-2) !important; border: 1px solid var(--border) !important; }
                .light-theme .clicky-element:not(.btn-logout-hover):hover, .light-theme .clicky:hover { background: var(--surface-2) !important; }
                .light-theme h1, .light-theme h2, .light-theme .title, .light-theme .hero-name, .light-theme .subject-name, .light-theme .module-title, .light-theme .section-title, .light-theme .meta-text { color: var(--text) !important; }
                .light-theme .section-label { color: var(--text-muted) !important; border-bottom-color: var(--border) !important; }
                .light-theme .t-tab.active { background: var(--red-glow) !important; color: var(--red-light) !important; }
                .light-theme input { background: var(--surface) !important; color: var(--text) !important; border-color: var(--border) !important; }
            `;
            document.head.appendChild(style);
        }
    },

    getSubjectColor(identifier) {
        const palette = ['#EF4444', '#F97316', '#EAB308', '#22C55E', '#3B82F6', '#8B5CF6', '#EC4899', '#06B6D4'];
        
        // Find subject index globally for consistency
        const subjects = window.DUMMY._allSubjects || window.DUMMY.subjects || [];
        const index = subjects.findIndex(s => s.id === identifier || s.code === identifier || s.name === identifier);
        
        if (index !== -1) {
            return palette[index % palette.length];
        }

        // If not found, hash the identifier string to pick a stable color
        let hash = 0;
        const str = String(identifier || '');
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return palette[Math.abs(hash) % palette.length];
    },

    toggleNav() {
        document.body.classList.toggle('nav-open');
    },

    closeNav() {
        document.body.classList.remove('nav-open');
    },

    // PWA Handlers
    handlePWAInstall() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.style.display = 'none';
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                this.deferredPrompt = null;
            });
        }
    },

    hidePWAInstall() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.style.display = 'none';
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
