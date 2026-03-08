// js/views/requests.js — Student Note Requests View

window.RequestsView = {

    render() {
        const main = document.getElementById('main-content');
        if (!main) return;
        const currentUser = window.DUMMY.currentUser;

        // Ensure noteRequests exists in DUMMY and filter them by the student's branch
        const allRequests = window.DUMMY.noteRequests || [];
        const noteRequests = allRequests.filter(req => !req.branch || req.branch === currentUser.branch);

        main.innerHTML = `
            <style>
                .requests-container {
                    animation: fadeInScale 0.2s ease-out forwards;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .req-card {
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    border-radius: 0px !important;
                    position: relative;
                }
                .req-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }
                .req-title {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: white;
                }
                .req-meta {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    display: flex;
                    gap: 10px;
                }
                .req-desc {
                    font-size: 0.95rem;
                    color: var(--text-2);
                    line-height: 1.5;
                }
                .req-uploads {
                    margin-top: 12px;
                    border-top: 1px solid var(--border);
                    padding-top: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .upload-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: rgba(255,255,255,0.05);
                    padding: 10px;
                    border-radius: 4px;
                    border: 1px solid var(--border);
                }
                .upload-item a {
                    color: var(--red-light);
                    text-decoration: none;
                    font-weight: 600;
                }
                .upload-item a:hover {
                    text-decoration: underline;
                }
                .btn-request {
                    background: var(--red-light);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    font-weight: 700;
                    cursor: pointer;
                    border-radius: 4px;
                    align-self: flex-start;
                }
                .btn-request:hover {
                    background: #b90000;
                }
                #new-request-form {
                    display: none;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 20px;
                    padding: 20px;
                    border: 1px solid var(--border);
                    background: rgba(255,255,255,0.02);
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .form-group input, .form-group textarea {
                    padding: 10px;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    color: white;
                    border-radius: 4px;
                }
                .upload-form {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    margin-top: 10px;
                }
                .file-input-themed {
                    color: var(--text-muted);
                    background: var(--surface-2);
                    border: 1px solid var(--border);
                    cursor: pointer;
                    transition: var(--transition);
                }
                .file-input-themed::file-selector-button {
                    background: var(--red-glow);
                    color: var(--red-light);
                    border: none;
                    border-right: 1px solid var(--red-border);
                    padding: 8px 16px;
                    margin-right: 12px;
                    font-family: var(--font);
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    transition: var(--transition);
                }
                .file-input-themed:hover {
                    border-color: var(--red-border);
                    background: var(--surface-3);
                    color: var(--text-2);
                }
                .file-input-themed:hover::file-selector-button {
                    background: var(--red);
                    color: white;
                }
            </style>

            <div class="requests-container">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h1 style="color:white; font-size:1.5rem;">Note Requests</h1>
                    <button class="btn-request clicky-element" onclick="document.getElementById('new-request-form').style.display='flex'">+ New Request</button>
                </div>

                <div id="new-request-form">
                    <h3 style="color:white; margin:0;">Create a Note Request</h3>
                    <div class="form-group">
                        <label>Topic / Subject</label>
                        <input type="text" id="req-topic" placeholder="e.g. Network Security Module 2 Notes">
                    </div>
                    <div class="form-group">
                        <label>Description (What exactly do you need?)</label>
                        <textarea id="req-desc" rows="3" placeholder="I need detailed notes on IPSec and VPNs..."></textarea>
                    </div>
                    <div style="display:flex; gap:10px; margin-top:10px;">
                        <button class="btn-solid-red" style="padding:10px 20px;" onclick="RequestsView.submitRequest()">Submit Request</button>
                        <button class="btn-hollow" style="padding:10px 20px;" onclick="document.getElementById('new-request-form').style.display='none'">Cancel</button>
                    </div>
                </div>

                <div id="requests-list" style="display:flex; flex-direction:column; gap:16px;">
                    ${noteRequests.length === 0 ? '<div style="color:var(--text-muted); padding:20px; text-align:center;">No note requests yet.</div>' : ''}
                    ${noteRequests.map(req => {
                        const isOwner = req.studentId === currentUser.email;
                        const dateStr = new Date(req.createdAt).toLocaleString();
                        const accentColor = window.App.getSubjectColor(req.topic);
                        
                        return `
                            <div class="glass-panel req-card" style="border-top: 4px solid ${accentColor};">
                                <div class="req-header">
                                    <div class="req-title" style="color:${accentColor};">${esc(req.topic)}</div>
                                    <div style="background:${req.status === 'open' ? 'var(--red-glow)' : 'rgba(34, 197, 94, 0.1)'}; color:${req.status === 'open' ? 'var(--red-light)' : '#22c55e'}; padding:4px 8px; font-size:0.7rem; font-weight:700; border-radius:4px; border: 1px solid ${req.status === 'open' ? 'var(--red-border)' : 'rgba(34, 197, 94, 0.2)'}; text-transform:uppercase;">
                                        ${req.status}
                                    </div>
                                </div>
                                <div class="req-meta">
                                    <span>Requested by ${req.studentName}</span>
                                    <span>•</span>
                                    <span>${dateStr}</span>
                                </div>
                                <div class="req-desc">${esc(req.description)}</div>

                                ${req.uploads && req.uploads.length > 0 ? `
                                    <div class="req-uploads">
                                        <div style="font-size:0.85rem; font-weight:700; color:white; margin-bottom:4px;">Uploaded Notes</div>
                                        ${req.uploads.map(up => `
                                            <div class="upload-item" style="border-left: 3px solid ${up.approved ? '#22c55e' : 'var(--border)'}">
                                                <div>
                                                    <a href="${up.fileUrl}" target="_blank">${esc(up.fileName)}</a>
                                                    <div style="font-size:0.7rem; color:var(--text-muted); margin-top:4px;">Uploaded by ${up.uploaderName} • ${up.approved ? '<span style="color:#22c55e; font-weight:700;">Approved</span>' : 'Pending Approval'}</div>
                                                </div>
                                                ${!up.approved && isOwner ? `<button class="btn-solid-red" style="padding:6px 12px; font-size:0.75rem;" onclick="RequestsView.approveUpload('${req.id}', '${up.uploadId}')">Approve</button>` : ''}
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : ''}

                                ${req.status === 'open' && !isOwner ? `
                                    <div class="upload-form">
                                        <input type="file" id="upload-file-${req.id}" class="file-input-themed" style="padding:0; font-size:0.8rem; width:100%; border-radius:4px;" accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.png">
                                        <button class="btn-solid-red" style="padding:10px 16px; white-space:nowrap; height:36px;" onclick="RequestsView.handleUpload('${req.id}')">Upload Notes</button>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    },

    async submitRequest() {
        const topic = document.getElementById('req-topic').value.trim();
        const desc = document.getElementById('req-desc').value.trim();
        
        if (!topic || !desc) {
            alert('Please fill out both topic and description.');
            return;
        }

        const currentUser = window.DUMMY.currentUser;
        const branch = currentUser.branch || 'General';
        const res = await window.FirestoreService.addNoteRequest(currentUser.email, currentUser.name, branch, topic, desc);
        
        if (res.ok) {
            alert('Request submitted successfully!');
            // Re-render handled by firestore snapshot or dummy fallback
        } else {
            alert('Error: ' + res.error);
        }
    },

    // Save changes in a folder logic (Storage locally via downloads or demo UI flow)
    async handleUpload(requestId) {
        const fileInput = document.getElementById(`upload-file-${requestId}`);
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert('Please select a file to upload.');
            return;
        }

        const file = fileInput.files[0];
        const btn = fileInput.nextElementSibling;
        const oldText = btn.textContent;
        btn.textContent = 'Uploading...';
        btn.disabled = true;

        try {
            const uploadRes = await window.StorageService.uploadFile(file, file.name, 'requests', requestId);
            if (uploadRes.ok) {
                const currentUser = window.DUMMY.currentUser;
                const fileSize = (file.size / 1024 / 1024).toFixed(2) + ' MB';
                const addRes = await window.FirestoreService.addUploadToRequest(
                    requestId, currentUser.email, currentUser.name, uploadRes.url, file.name, fileSize
                );
                
                if (addRes.ok) {
                    alert('Notes uploaded successfully! They are saved in the Requests folder structure.');
                } else {
                    alert('Error adding note record: ' + addRes.error);
                }
            } else {
                alert('Upload failed: ' + uploadRes.error);
            }
        } catch (e) {
            alert('Error: ' + e.message);
        } finally {
            btn.textContent = oldText;
            btn.disabled = false;
        }
    },

    async approveUpload(requestId, uploadId) {
        const res = await window.FirestoreService.approveNoteUpload(requestId, uploadId);
        if (res.ok) {
            alert('Upload approved! Request marked as fulfilled.');
        } else {
            alert('Error: ' + res.error);
        }
    }
};
