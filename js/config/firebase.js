// js/config/firebase.js
// ─────────────────────────────────────────────────────────────
// TO ENABLE REAL FIREBASE: replace the config below with your
// Firebase project config from  console.firebase.google.com
// Project Settings → Your apps → SDK setup → Config snippet
// ─────────────────────────────────────────────────────────────

const FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// ── Init ─────────────────────────────────────────────────────
(function () {
    try {
        if (
            typeof firebase !== 'undefined' &&
            FIREBASE_CONFIG.apiKey !== 'YOUR_API_KEY'
        ) {
            if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
            window._firebaseReady = true;
            window.db = firebase.firestore();
            window.auth = firebase.auth();
            window.storage = firebase.storage();
            console.log('[EduConnect] Firebase connected ✓');
        } else {
            window._firebaseReady = false;
            console.log('[EduConnect] Running in demo mode (no Firebase config)');
        }
    } catch (e) {
        window._firebaseReady = false;
        console.warn('[EduConnect] Firebase init failed — demo mode', e);
    }
})();
