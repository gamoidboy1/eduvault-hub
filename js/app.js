// js/app.js — Main Router with Quick Login

function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

window.App = {
    async init() {
        await CSVData.load();
        this._populateQuickLogin();
        this._bindLogin();
        
        // Initialize real-time sync if firebase is ready
        if (window.FirestoreService && window.FirestoreService.initLiveSync) {
            window.FirestoreService.initLiveSync();
        }

        // Close nav on overlay click
        document.body.addEventListener('click', (e) => {
            if (document.body.classList.contains('nav-open') && e.target === document.body) {
                this.closeNav();
            }
        });
    },

    _populateQuickLogin() {
        const select = document.getElementById('login-quick-select');
        if (!select) return;

        const users = window.CSVData.students; // Contains both students and faculty
        select.innerHTML = users.map(u => `
            <option value="${u.email}" data-role="${u.role}">
                ${u.role.toUpperCase()}: ${u.name} (${u.branch || 'General'})
            </option>
        `).join('');
    },

    _bindLogin() {
        const btnLogin = document.getElementById('btn-login');
        if (btnLogin) {
            btnLogin.addEventListener('click', async () => {
                const select = document.getElementById('login-quick-select');
                if (!select) return;

                const email = select.value;
                const option = select.options[select.selectedIndex];
                const role = option.dataset.role;
                const msgEl = document.getElementById('login-msg');

                if (msgEl) { msgEl.style.color = 'var(--text-muted)'; msgEl.textContent = 'Entering Hub...'; }

                let user = window.CSVData.students.find(s => s.email === email);

                if (user) {
                    Object.assign(window.DUMMY.currentUser, user);
                    
                    if (user.role === 'student' && user.branch && window.CSVData.branches[user.branch]) {
                        const branchCourses = window.CSVData.branches[user.branch];
                        if (!window.DUMMY._allSubjects) window.DUMMY._allSubjects = [...window.DUMMY.subjects];
                        window.DUMMY.subjects = window.DUMMY._allSubjects.filter(s => branchCourses.includes(s.id));
                    }

                    if (msgEl) { msgEl.style.color = '#6EE7B7'; msgEl.textContent = `✓ Welcome, ${user.name}`; }
                    setTimeout(() => this._launchApp(role), 400);
                }
            });
        }
    },

    _launchApp(role) {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('app').style.display = 'block';

        HeaderComponent.render();
        TopNavComponent.render();

        if (role === 'faculty') this.switchView('dashboard');
        else this.switchView('dashboard');
    },

    switchView(view) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        const role = window.DUMMY.currentUser.role;

        if (view === 'dashboard') {
            TopNavComponent.setActive('dashboard');
            if (role === 'faculty') FacultyDashboardView.render();
            else DashboardView.render();
            return;
        }

        const tabMap = { subjects: 'subjects', faculty: 'faculty', profile: 'profile' };
        if (tabMap[view] !== undefined) {
            TopNavComponent.setActive(tabMap[view]);
        }

        switch (view) {
            case 'subjects': SubjectsView.render(); break;
            case 'faculty': FacultyView.render(); break;
            case 'profile': ProfileView.render(); break;
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

    toggleTheme() {
        document.documentElement.classList.toggle('light-theme');
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

    toggleNav() {
        document.body.classList.toggle('nav-open');
    },

    closeNav() {
        document.body.classList.remove('nav-open');
    }
};

document.addEventListener('DOMContentLoaded', () => App.init());
