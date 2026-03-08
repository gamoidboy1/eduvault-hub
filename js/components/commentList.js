// js/components/commentList.js
// Renders comment list and handles posting

window.CommentListComponent = {

    render(comments, subjectId, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = comments.length
            ? comments.map(c => this._renderComment(c)).join('')
            : `<div style="padding:20px 16px;color:var(--text-muted);font-size:0.82rem;text-align:center;">No comments yet. Be the first to ask!</div>`;
    },

    _renderComment(c) {
        const aiTag = c.aiStatus === 'OFFICIAL'
            ? `<span class="tag tag-green">Official</span>`
            : c.aiStatus === 'APPROVED'
                ? `<span class="tag tag-green">AI Approved</span>`
                : `<span class="tag tag-yellow">AI Pending</span>`;

        const upBtn = c.role !== 'faculty'
            ? `<button class="upvote-btn btn-tiny mt-2" onclick="CommentListComponent.upvote(this)">↑ ${c.upvotes || 0}</button>`
            : '';

        return `
      <div class="comment-item">
        <div class="comment-meta">
          <span class="comment-author">${c.role === 'faculty' ? '🎓 ' : ''}${esc(c.author)}</span>
          <span>·</span>
          <span>${c.time || 'just now'}</span>
          ${aiTag}
        </div>
        <div class="comment-text">${esc(c.text)}</div>
        ${upBtn}
      </div>
    `;
    },

    upvote(btn) {
        const n = parseInt(btn.textContent.replace('↑ ', '')) + 1;
        btn.textContent = '↑ ' + n;
    },

    async postComment(subjectId, listId) {
        const input = document.getElementById('comment-input-' + subjectId);
        const anonChk = document.getElementById('anon-chk-' + subjectId);
        if (!input || !input.value.trim()) return;

        const isAnon = anonChk ? anonChk.checked : true;
        const comment = {
            text: input.value.trim(),
            author: isAnon ? 'Anonymous' : (window.DUMMY.currentUser.roll || 'student'),
            isAnon,
            role: 'student',
            time: 'just now',
            upvotes: 0,
            aiStatus: 'PENDING'
        };

        const saved = await FirestoreService.addComment(subjectId, comment);
        const list = document.getElementById(listId);
        if (list) list.insertAdjacentHTML('beforeend', this._renderComment(saved));
        input.value = '';
    }
};
