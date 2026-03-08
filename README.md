# ACADEX v2.0
> **Premium Educational Asset Management Platform**  
> Stack: Vanilla HTML + CSS + JavaScript · Firebase (Auth, Firestore, Storage)

---

## 🚀 Getting Started

**No build step required.** Just open `index.html` in any browser or use a "Live Server" extension.

```
educonnect_hub/
└── index.html        ← Open this
```

For Firebase features, edit `js/config/firebase.js` and add your real project config.  
Without it, the app runs in **demo mode** with the high-end UI populated by `dummy.js`.

---

## 🧹 Optimized Project Structure

The project has been cleaned and sorted to keep only essential components:

```
educonnect_hub/
├── index.html                  ← Main Entry
├── .gitignore                  ← Git Maintenance
│
├── css/
│   ├── base.css                ← Variables & Design System
│   ├── components.css          ← Premium UI Components
│   └── layout.css              ← Page Layouts & Themes
│
└── js/
    ├── app.js                  ← Core Router & Theme Engine
    ├── config/
    │   └── firebase.js         ← Firebase Configuration
    ├── data/
    │   ├── dummy.js            ← Prototype Data
    │   └── csvLoader.js        ← Batch/Student CSV Processor
    ├── services/
    │   ├── auth.js             ← Session Management
    │   ├── firestore.js        ← Real-time Database Sync
    │   └── storage.js          ← Academic Resource Uploads
    ├── components/
    │   ├── header.js           ← Unified Navigation Header
    │   ├── topNav.js           ← Sidebar Navigation
    │   ├── moduleTree.js       ← Resource Hierarchy View
    │   └── commentList.js      ← Discussion Logic
    └── views/
        ├── dashboard.js        ← Student Home
        ├── facultyDashboard.js ← Faculty Home
        ├── faculty.js          ← Course Management
        ├── subjects.js         ← Study Material Grid
        ├── subjectDetail.js    ← Academic Content Central
        ├── moduleDetail.js     ← Resource Viewer & Downloader
        └── profile.js          ← User Settings
```

---

## ⬆️ How to Upload to Git

Follow these steps to upload your project to GitHub/GitLab:

1. **Initialize Git** (if not already done):
   ```bash
   git init
   ```

2. **Add all files**:
   ```bash
   git add .
   ```

3. **Commit your changes**:
   ```bash
   git commit -m "Optimize project structure and implement premium UI"
   ```

4. **Connect to your Remote Repo**:
   *Go to GitHub, create a new repository, and copy the URL.*
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
   ```

5. **Push to GitHub**:
   ```bash
   git push -u origin main
   ```

## 🎨 Customizing the Logo

1. Create an `assets` folder in the root directory.
2. Add your logo image as `logo.png` inside the `assets` folder.
3. The platform will automatically detect and use your logo, falling back to the text logo if the file is missing.

---

## 🎨 Professional Theme Engine

Acadex features a high-end **Dark/Light Theme** system.  
*   **Aesthetic**: Modern black/red high-contrast design.
*   **Safe-to-Read**: Optimized typography and spacing.
*   **Dynamic**: Real-time theme switching via the "Themes" button in the sidebar.

---

## 🔒 Security & Roles

*   **Student Hub**: Personalized dashboards based on Branch/Batch.
*   **Faculty Portal**: Robust course management and resource uploading.
*   **Universal Access**: Every resource includes "View" and "Save to Device" functionality.
