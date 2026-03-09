# Acadex Platform - File Structure & Architecture Guide

This document describes every file in the Acadex (EduConnect Hub) application and explains its purpose. The application is built using vanilla HTML, CSS, and component-based JavaScript, powered by Firebase and structured as a Progressive Web App (PWA).

## 📂 Root Directory

*   **`index.html`**
    *   **Purpose:** The main entry point of the app (Single Page Application). It contains the shell of the platform, the authentication interfaces (login page), PWA install banners, and the anchor point (`#app`) where all other views are dynamically rendered.
*   **`manifest.json`**
    *   **Purpose:** The Web App Manifest required for PWA functionality. It tells the browser how the app should behave when installed on a user's home screen (name, icons, theme colors, display mode).
*   **`sw.js`**
    *   **Purpose:** The Service Worker file. It runs in the background to cache assets, intercept network requests, and provide offline capabilities for the PWA.
*   **`README.md`**
    *   **Purpose:** The standard markdown file containing documentation about the project, likely covering setup instructions and features.
*   **`package.json` & `package-lock.json` / `node_modules/`**
    *   **Purpose:** Node.js package management files used exclusively for development tooling (like Live Server or build tools), not for the frontend run-time because this is a vanilla stack.

---

## 📂 `css/` (Styling System)

This directory contains the custom Design System for Acadex, split into logical domains.

*   **`base.css`**
    *   **Purpose:** Defines global CSS variables (colors, fonts, spacing, shadows), resets browser defaults, implements the baseline Dark/Light theme values, and defines standard typography scales.
*   **`layout.css`**
    *   **Purpose:** Handles the structural styling of the app. It dictates how the top header, the side navigation (`#top-nav`), and the main container area (`#main-content`) act across various screen sizes (Responsive Design).
*   **`components.css`**
    *   **Purpose:** Contains the styling for reusable UI elements. Buttons, hero-cards, glass-panels, status badges, request categories, tags, inputs, and form elements are all styled here to ensure consistent premium aesthetics.

---

## 📂 `data/` (Local Storage / Fallbacks)

Contains CSV files used to mock a college database, making the app usable even without a connected live backend.

*   **`students.csv`**
    *   **Purpose:** The core mock database for users. It contains mapped profiles for students, faculty, and admins, including their generated passwords and department associations.
*   **`branches.csv`**
    *   **Purpose:** Defines the relationship between academic branches (e.g., CS Cybersecurity) and the subject codes allowed within that branch.

---

## 📂 `js/` (Application Logic)

The JavaScript logic is tightly structured into folders imitating modern framework architectures (React/Vue), despite being vanilla JS.

### `js/app.js`
*   **Purpose:** The central Router and Application Controller. It initializes the app, restores sessions, handles the switch between Light and Dark themes, controls navigation (`switchView()`), and intercepts login events.

### `js/config/`
*   **`firebase.js`**
    *   **Purpose:** Holds the Firebase SDK initialization keys and sets up the connection to Firestore, Firebase Auth, and Firebase Storage.

### `js/data/`
*   **`csvLoader.js`**
    *   **Purpose:** A dedicated module that parses the CSV strings (from `data/` or offline fallbacks) into JSON objects so the JS components can read user and branch mappings natively.
*   **`dummy.js`**
    *   **Purpose:** Contains extensive mock state data for the app. It defines all the subjects, syllabus modules, faculty statuses, and note requests. It acts as the local state manager when Firebase isn't fully synced.

### `js/services/`
*   **`auth.js`**
    *   **Purpose:** Interacts with Firebase Authentication. Handles user login, logout, password resets, and Google Sign-in functionality.
*   **`firestore.js`**
    *   **Purpose:** Interacts with the Firebase Firestore database. Handles fetching and writing requests, note approvals, and real-time live sync of data.
*   **`storage.js`**
    *   **Purpose:** Interacts with Firebase Storage. It wraps logic to upload PDFs/files, generate download URLs, and handle document sharing within the app.

### `js/components/` (Reusable View partials)
*   **`header.js`**
    *   **Purpose:** Renders the top bar containing the brand name, the user's branch information, and the live application clock.
*   **`topNav.js`**
    *   **Purpose:** Renders the persistent left-hand side navigation panel, housing links to Dashboard, Courses, Requests, and settings/logout buttons. It swaps tabs conditionally based on standard/faculty user roles.
*   **`moduleTree.js`**
    *   **Purpose:** A reusable UI component that renders expandable/collapsible syllabus modules dynamically.
*   **`commentList.js`**
    *   **Purpose:** A reusable component to render the comment threads under material/requests, useful for interactive discussions.

### `js/views/` (Screens / Pages)
These files act as the "Pages" of the application. `app.js` selectively mounts their `.render()` methods based on browser navigation.

*   **`dashboard.js`**
    *   **Purpose:** The primary landing page for Students. Computes "New in Your Branch" feeds, greets the user, and shows their profile card.
*   **`facultyDashboard.js`**
    *   **Purpose:** The primary landing page for Faculty members. Displays faculty-specific stats, urgent upload requests, and high-priority action items.
*   **`subjects.js`**
    *   **Purpose:** The Study Tab view for students. Groups their enrolled topics natively using their branch data and shows completion progress.
*   **`subjectDetail.js`**
    *   **Purpose:** The view shown when a user clicks onto a specific Subject (e.g., Computer Networks). It lists the syllabus structure and available materials.
*   **`moduleDetail.js`**
    *   **Purpose:** The deep view of a specific topic/module within a subject. Here users can download PDFs, read notes, and engage with module-specific comments.
*   **`faculty.js`**
    *   **Purpose:** The Faculty Courses View. Allows teachers to manage courses they are presiding over, upload notes directly to specific cohorts, and manage class permissions.
*   **`requests.js`**
    *   **Purpose:** The central interaction hub for document sharing. Allows students to request specific notes, permits others to upload fulfillment documents, and features an upvoting/bounty system.
*   **`profile.js`**
    *   **Purpose:** Renders the user's unified account details page, displaying static platform registration info like Name, Semester, Roll Number, and Email.
