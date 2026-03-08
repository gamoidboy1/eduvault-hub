// js/services/auth.js — Firebase Auth with demo fallback

window.AuthService = {

    async login(email, pass) {
        // Firebase true login if available
        if (window._firebaseReady) {
            try {
                await window.auth.signInWithEmailAndPassword(email, pass);
                // Return to let snapshot handlers or onAuthStateChanged take over, but for dummy compatibility we also load CSV user:
            } catch (e) {
                return { ok: false, error: e.message };
            }
        }

        // ── CSV Login Logic (Fallback or matching DUMMY data) ──────
        const user = window.CSVData.students.find(s => s.email === email && s.password === pass);
        
        if (!user) {
            return { ok: false, error: 'Invalid email or password.' };
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

    async googleLogin() {
        if (window._firebaseReady) {
            try {
                const provider = new window.firebase.auth.GoogleAuthProvider();
                await window.auth.signInWithPopup(provider);
            } catch (e) {
                return { ok: false, error: e.message };
            }
        }
        
        // Mock Google login success finding first student matching google email (or default to Jude)
        const user = window.CSVData.students[0]; 
        Object.assign(window.DUMMY.currentUser, user);
        
        if (user.branch && window.CSVData.branches[user.branch]) {
            const branchCourses = window.CSVData.branches[user.branch];
            if (!window.DUMMY._allSubjects) window.DUMMY._allSubjects = [...window.DUMMY.subjects];
            window.DUMMY.subjects = window.DUMMY._allSubjects.filter(s => branchCourses.includes(s.id));
        }

        return { ok: true };
    },

    async resetPassword(email) {
        if (window._firebaseReady) {
            try {
                await window.auth.sendPasswordResetEmail(email);
                return { ok: true };
            } catch (e) {
                return { ok: false, error: e.message };
            }
        }
        // Mock success
        return { ok: true };
    },

    onAuthStateChanged(cb) {
        if (window._firebaseReady) {
            return window.auth.onAuthStateChanged(user => cb(user ? user.uid : null));
        }
        return () => { };
    }
};
