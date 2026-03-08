// js/services/storage.js — Firebase Storage with demo fallback

window.StorageService = {

    // Upload a file to Firebase Storage (or simulate in demo mode)
    // fileBlob: File object from <input type="file"> — null in demo
    // filename:  display name / path in storage
    async uploadFile(fileBlob, filename, subjectId = 'general', moduleId = 'unknown') {
        if (window._firebaseReady && fileBlob) {
            try {
                const path = `uploads/${subjectId}/${moduleId}/${Date.now()}_${filename}`;
                const ref = window.storage.ref().child(path);
                const snap = await ref.put(fileBlob);
                const url = await snap.ref.getDownloadURL();
                return { ok: true, url, path };
            } catch (e) {
                return { ok: false, error: e.message };
            }
        }

        // Demo: simulate upload delay
        await new Promise(r => setTimeout(r, 600));
        return { ok: true, url: '#demo', path: `demo/${filename}` };
    },

    // Get download URL for a stored path
    async getDownloadUrl(storagePath) {
        if (window._firebaseReady && storagePath && storagePath !== '#demo') {
            try {
                const url = await window.storage.ref().child(storagePath).getDownloadURL();
                return { ok: true, url };
            } catch (e) {
                return { ok: false, error: e.message };
            }
        }
        return { ok: true, url: '#demo' };
    },

    // Delete a file from Storage
    async deleteFile(storagePath) {
        if (window._firebaseReady && storagePath && storagePath !== '#demo') {
            try {
                await window.storage.ref().child(storagePath).delete();
                return { ok: true };
            } catch (e) {
                return { ok: false, error: e.message };
            }
        }
        await new Promise(r => setTimeout(r, 200));
        return { ok: true };
    },

    // List all files in a folder path
    async listFiles(folderPath) {
        if (window._firebaseReady) {
            try {
                const list = await window.storage.ref().child(folderPath).listAll();
                const items = await Promise.all(
                    list.items.map(async item => ({
                        name: item.name,
                        path: item.fullPath,
                        url: await item.getDownloadURL()
                    }))
                );
                return { ok: true, files: items };
            } catch (e) {
                return { ok: false, error: e.message, files: [] };
            }
        }
        return { ok: true, files: [] };
    }
};
