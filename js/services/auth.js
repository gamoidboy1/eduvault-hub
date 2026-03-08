// js/services/auth.js — Firebase Auth with demo fallback

window.AuthService = {

    async login(email, pass, role) {
        // ── CSV Login Logic ──────────────────────────────────────────
        const user = window.CSVData.students.find(s => s.email === email && s.password === pass);
        
        if (!user) {
            return { ok: false, error: 'Invalid email or password (CSV verify)' };
        }

        if (user.role !== role) {
            return { ok: false, error: `Account exists but role is not ${role}` };
        }

        // Apply data to DUMMY
        Object.assign(window.DUMMY.currentUser, user);
        
        // Filter subjects based on branch
        if (user.branch && window.CSVData.branches[user.branch]) {
            const branchCourses = window.CSVData.branches[user.branch];
            // Store original subjects if not already stored
            if (!window.DUMMY._allSubjects) window.DUMMY._allSubjects = [...window.DUMMY.subjects];
            
            // Filter
            window.DUMMY.subjects = window.DUMMY._allSubjects.filter(s => branchCourses.includes(s.id));
        }

        return { ok: true };
    },

    async logout() {
        if (window._firebaseReady) {
            try { await window.auth.signOut(); } catch (_) { }
        }
    },

    onAuthStateChanged(cb) {
        if (window._firebaseReady) {
            return window.auth.onAuthStateChanged(user => cb(user ? user.uid : null));
        }
        return () => { };
    }
};
