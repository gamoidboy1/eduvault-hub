// js/services/firestore.js — Firebase Firestore v3.0 — Real-time Sync & Backend logic
// Structure:
// /subjects/{id}           - Subject metadata
// /modules/{id}            - Linked to subjectId, contains chapters[]
// /batches/{id}            - Batch definitions (e.g. CS-CY-2025-A)
// /mappings/faculty        - Doc with arrays: { facultyEmail: [subjectIds] }
// /mappings/students       - Doc with { studentEmail: batchCode }

window.FirestoreService = {
    _unsubs: [],

    // ── Real-time Global Sync ────────────────────────────────────────────────
    // This allows the app to react immediately to any DB changes
    initLiveSync() {
        if (!window._firebaseReady) return;
        this.destroy(); // Clear old subs

        // 1. Sync Subjects
        this._unsubs.push(window.db.collection('subjects').onSnapshot(snap => {
            if (!snap.empty) {
                window.DUMMY.subjects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                // Trigger re-render if on a relevant page
                this._refreshActiveView();
            }
        }));

        // 2. Sync Modules
        this._unsubs.push(window.db.collection('modules').onSnapshot(snap => {
            const mods = {};
            snap.docs.forEach(d => {
                const data = d.data();
                if (!mods[data.subjectId]) mods[data.subjectId] = [];
                mods[data.subjectId].push({ id: d.id, ...data });
            });
            window.DUMMY.modules = mods;
            this._refreshActiveView();
        }));

        // 3. Sync Batches
        this._unsubs.push(window.db.collection('batches').onSnapshot(snap => {
            if (!snap.empty) {
                window.DUMMY.facultyBatches = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                this._refreshActiveView();
            }
        }));
    },

    _refreshActiveView() {
        // Obtains the current "active" view and re-renders it if it's dynamic
        const currentView = TopNavComponent._current;
        if (currentView === 'dashboard') {
             if (window.DUMMY.currentUser.role === 'faculty') FacultyDashboardView.render();
             else DashboardView.render();
        } else if (currentView === 'faculty') {
             FacultyView.render();
        }
    },

    destroy() {
        this._unsubs.forEach(u => u());
        this._unsubs = [];
    },

    // ── Subject Methods ──────────────────────────────────────────────────────
    async saveSubject(subject) {
        if (window._firebaseReady) {
            try {
                await window.db.collection('subjects').doc(subject.id).set(subject, { merge: true });
                return { ok: true };
            } catch (e) { return { ok: false, error: e.message }; }
        }
        return { ok: true };
    },

    // ── Module & File Methods ────────────────────────────────────────────────
    async addModule(subjectId, num, title) {
        const id = subjectId + '-M' + num + '-' + Date.now();
        const mod = { subjectId, num, title, chapters: [] };
        if (window._firebaseReady) {
            try {
                await window.db.collection('modules').doc(id).set(mod);
                return { ok: true, id };
            } catch (e) { return { ok: false, error: e.message }; }
        }
        return { ok: true };
    },

    async deleteModule(moduleId) {
        if (window._firebaseReady) {
            try {
                await window.db.collection('modules').doc(moduleId).delete();
                return { ok: true };
            } catch (e) { return { ok: false, error: e.message }; }
        }
        return { ok: true };
    },

    async updateModuleFiles(moduleId, chapters) {
        if (window._firebaseReady) {
            try {
                await window.db.collection('modules').doc(moduleId).update({ chapters });
                return { ok: true };
            } catch (e) { return { ok: false, error: e.message }; }
        }
        return { ok: true };
    },

    // ── Office / Mapping Logic ───────────────────────────────────────────────
    async mapFacultyToSubject(email, subjectId, remove = false) {
        if (window._firebaseReady) {
            try {
                const ref = window.db.collection('mappings').doc('faculty');
                const snap = await ref.get();
                let data = snap.exists ? snap.data() : {};
                let subjects = data[email.replace(/\./g, '_')] || [];
                
                if (remove) subjects = subjects.filter(id => id !== subjectId);
                else if (!subjects.includes(subjectId)) subjects.push(subjectId);
                
                await ref.set({ [email.replace(/\./g, '_')]: subjects }, { merge: true });
                return { ok: true };
            } catch (e) { return { ok: false, error: e.message }; }
        }
        return { ok: true };
    },

    async mapStudentToBatch(email, batchCode) {
        if (window._firebaseReady) {
            try {
                await window.db.collection('mappings').doc('students').set({ 
                    [email.replace(/\./g, '_')]: batchCode 
                }, { merge: true });
                return { ok: true };
            } catch (e) { return { ok: false, error: e.message }; }
        }
        return { ok: true };
    },

    async getStudentBatch(email) {
        if (window._firebaseReady) {
            try {
                const snap = await window.db.collection('mappings').doc('students').get();
                if (snap.exists) return snap.data()[email.replace(/\./g, '_')] || null;
            } catch (e) { console.error(e); }
        }
        return null;
    }
};
