// js/views/dashboard.js — Student Dashboard v4.3 — Branch Filtering Fixed

window.DashboardView = {

  render() {
    const main = document.getElementById('main-content');
    if (!main) return;
    const u = window.DUMMY.currentUser;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    // Get courses for current student's branch from CSV
    const branchCourses = window.CSVData.branches[u.branch] || [];
    const filteredSubjects = window.DUMMY._allSubjects 
      ? window.DUMMY._allSubjects.filter(s => branchCourses.includes(s.id))
      : window.DUMMY.subjects;

    main.innerHTML = `
      <div class="view-container">
      <style>
        
        .glass-panel {
          background: rgba(25, 25, 25, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid var(--border);
          border-radius: 0px;
          position: relative;
        }
        
        .clicky-element {
          cursor: pointer;
          transition: background 0.1s ease, border-color 0.1s ease, transform 0.05s ease !important;
        }
        .clicky-element:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(239, 68, 68, 0.5);
        }
        
        .profile-hero {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 24px;
          z-index: 1;
        }
        @media (max-width: 600px) {
          .profile-hero {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
        }
        .profile-avatar {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, var(--red-light), #ff7e67);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          color: white;
          font-weight: 800;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.2);
          flex-shrink: 0;
        }
        .profile-details h1 {
          font-size: 1.8rem;
          font-weight: 800;
          margin: 0 0 6px 0;
          color: white;
          letter-spacing: -0.5px;
        }
        .profile-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--red-light);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .meta-text {
          color: var(--text-2);
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin: 12px 0 16px 0;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border);
        }
        .section-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .subjects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        .subject-card {
          padding: 20px;
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .subject-icon {
          width: 44px; height: 44px;
          background: rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          overflow: hidden;
        }
        .subject-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          margin-bottom: 10px;
          line-height: 1.3;
        }
        .subject-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }
        .subject-code {
          font-size: 0.7rem;
          padding: 4px 8px;
          background: rgba(239, 68, 68, 0.15);
          color: var(--red-light);
          font-weight: 700;
        }
      </style>
      
      <div style="display:flex; flex-direction:column; gap:12px; position:relative;">
        <!-- Profile Card -->
        <div class="glass-panel profile-hero">
          <div class="profile-avatar">${u.name.charAt(0)}</div>
          <div class="profile-details">
            <div style="font-size: 0.9rem; color: var(--red-light); font-weight: 600; margin-bottom: 4px; letter-spacing: 0.5px; text-transform: uppercase;">
              ${greeting}
            </div>
            <h1>${u.name}</h1>
            <div style="display: flex; flex-wrap: wrap; gap: 12px; align-items: center; margin-top: 8px;">
              <span class="profile-badge">${u.roll}</span>
              <span class="meta-text">${u.branch}</span>
              <span style="color: var(--border);">|</span>
              <span class="meta-text">Semester ${u.sem}</span>
            </div>
          </div>
        </div>

        <!-- Recently Updated for Branch -->
        <div style="margin-top: 24px; position: relative;">
          <div class="section-header">
            <div class="section-title">New in ${u.branch}</div>
            <div onclick="App.switchView('subjects')" style="font-size:0.75rem; color:var(--red-light); cursor:pointer; font-weight:700;">BROWSE ALL →</div>
          </div>
          
          <div class="subjects-grid">
            ${filteredSubjects.length > 0 ? filteredSubjects.map(s => {
      const categories = ['Modules', 'PYQ', 'Assignment', 'Syllabus'];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const isAsgn = cat === 'Assignment';
      return `
              <div class="glass-panel clicky-element subject-card" onclick="App.openSubject('${s.id}')">
                <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                  <div class="subject-icon">
                    <img src="${s.profImage}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(s.teacher)}&background=random'"/>
                  </div>
                  <div style="font-size:0.55rem; background:${isAsgn ? 'var(--red)' : 'var(--red-glow)'}; color:${isAsgn ? '#fff' : 'var(--red-light)'}; padding:2px 6px; font-weight:700; border:1px solid var(--red-border); animation: ${isAsgn ? 'pulse 2s infinite' : 'none'};">
                    ${isAsgn ? 'EXTRA IMPORTANT' : 'JUST UPDATED'}
                  </div>
                </div>
                <div class="subject-name">${s.name}</div>
                <div style="font-size:0.68rem; color:var(--text-3); margin-top:-4px; margin-bottom:12px; font-weight:600; line-height:1.4;">
                  New in ${cat}
                </div>
                <div class="subject-meta">
                  <span class="subject-code">${s.code}</span>
                </div>
              </div>
            `;
    }).join('') : `<div style="padding:40px; color:var(--text-muted); text-align:center; width:100%;">No branch activity found.</div>`}
          </div>
        </div>
      </div>
      </div>
    `;
  }
};
