// js/views/facultyDashboard.js — Faculty home dashboard - v2.0 Clean UI

window.FacultyDashboardView = {

  render() {
    const main = document.getElementById('main-content');
    if (!main) return;
    const u = window.DUMMY.currentUser;
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const batches = window.DUMMY.facultyBatches;

    main.innerHTML = `
      <div class="view-container">
      <!-- Hero -->
      <div>
        <div class="hero-card">
          <div class="hero-glow" style="top:-50px;right:-30px;width:220px;height:220px;"></div>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;flex-wrap:wrap;position:relative;">
            <div>
              <div class="hero-greet">${greeting}</div>
              <div class="hero-name">${u.name}</div>
              <div class="hero-meta"><span>${u.branch}</span><span class="dot"></span><span style="color:var(--red-light);font-weight:600;">Faculty</span></div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:1.8rem;font-weight:800;color:var(--red-light);line-height:1;">${batches.reduce((s, b) => s + b.students, 0)}</div>
              <div style="font-size:.6rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:1px;margin-top:2px;">Total Students</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div style="padding:24px 0 0;">
        <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;">
          <div class="stat-card"><div class="stat-val">${batches.length}</div><div class="stat-lbl">Assigned Batches</div></div>
          <div class="stat-card"><div class="stat-val">${batches.reduce((s, b) => s + b.subjects.length, 0)}</div><div class="stat-lbl">Total Subjects</div></div>
        </div>
      </div>

      <!-- Batches -->
      <div class="section-label" style="padding-left:0; padding-right:0;">Your Batches &amp; Subjects</div>
      <div style="padding:0 0 20px;">
        ${batches.map(batch => `
          <div style="background:var(--surface);border:1px solid var(--border);margin-bottom:10px;overflow:hidden;">
            <div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
              <div style="flex:1;">
                <div style="font-size:.88rem;font-weight:700;color:var(--text);">${batch.branch}</div>
                <div style="display:flex;align-items:center;gap:8px;margin-top:3px;flex-wrap:wrap;">
                  <span class="tag tag-gray" style="margin-left:0;">${batch.batchCode}</span>
                  <span style="font-size:.65rem;color:var(--text-muted);">${batch.year}</span>
                  <span class="dot"></span>
                  <span style="font-size:.65rem;color:var(--red-light);font-weight:600;">${batch.students} students</span>
                </div>
              </div>
            </div>
            <div style="padding:8px;">
              ${batch.subjects.map(code => {
      const s = window.DUMMY.subjects.find(x => x.id === code);
      return `<div onclick="App.openFacultyCourse('${batch.batchCode}','${code}')" class="clicky-element"
                  style="display:flex;align-items:center;gap:10px;padding:10px 12px;margin-bottom:4px;
                         background:var(--surface-2);border:1px solid var(--border);cursor:pointer;">
                  <div style="width:30px;height:30px;background:rgba(255,255,255,0.05);display:flex;align-items:center;justify-content:center;border:1px solid var(--border);overflow:hidden;">
                    <img src="${s ? s.profImage : ''}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(s ? s.teacher : 'F')}&background=random'"/>
                  </div>
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:.82rem;font-weight:600;color:var(--text-2);">${s ? s.name : code}</div>
                    <div style="font-size:.63rem;color:var(--text-muted);margin-top:1px;">${code}</div>
                  </div>
                  <span style="color:var(--text-muted);font-size:.9rem;">›</span>
                </div>`;
    }).join('')}
            </div>
          </div>`).join('')}
      </div>
      </div>
    `;
  }
};
