// Cleaned and consolidated SPA client for Blog Admin
// Uses: index.html elements (#post-form, #post-id, #title, #body, #save-btn, #reset-btn, #posts-list)

const API = '/api/posts';

document.addEventListener('DOMContentLoaded', () => {
  initForm();
  loadPosts();
});

function initForm() {
  const form = document.getElementById('post-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('post-id').value || null;
    const title = document.getElementById('title').value.trim();
    const body = document.getElementById('body').value.trim();
    const tagsEl = document.getElementById('tags');
    const tags = tagsEl ? tagsEl.value.split(',').map(t => t.trim()).filter(Boolean) : [];

    const payload = { title, body, author: 'cmoore322', tags };
    try {
      if (id) {
        await fetch(`${API}/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      } else {
        await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      }
      form.reset();
      document.getElementById('post-id').value = '';
      await loadPosts();
    } catch (err) {
      alert('Save failed: ' + err.message);
    }
  });

  const resetBtn = document.getElementById('reset-btn');
  if (resetBtn) resetBtn.addEventListener('click', () => { form.reset(); document.getElementById('post-id').value = ''; });
}

async function loadPosts() {
  const list = document.getElementById('posts-list');
  if (!list) return;
  list.innerHTML = '<div class="p-3 text-center">Loading...</div>';
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('Fetch failed');
    const posts = await res.json();
    renderPosts(posts || []);
  } catch (err) {
    list.innerHTML = '<div class="p-3 text-danger">Error loading posts</div>';
  }
}

function renderPosts(posts) {
  const list = document.getElementById('posts-list');
  list.innerHTML = '';
  if (!posts || posts.length === 0) { list.innerHTML = '<div class="p-3">No posts yet.</div>'; return; }

  posts.forEach(p => {
    const el = document.createElement('div');
    el.className = 'list-group-item';
    el.innerHTML = `
      <div class="d-flex w-100 justify-content-between">
        <h5 class="mb-1">${escapeHtml(p.title)}</h5>
        <small>${new Date(p.createdAt).toLocaleString()}</small>
      </div>
      <p class="mb-1">${escapeHtml(truncate(p.body, 200))}</p>
      <div>${(p.tags || []).map(t => `<span class="badge bg-secondary me-1">${escapeHtml(t)}</span>`).join('')}</div>
      <div class="mt-2">
        <button class="btn btn-sm btn-primary me-1" data-id="${p._id}" data-action="view">View</button>
        <button class="btn btn-sm btn-secondary me-1" data-id="${p._id}" data-action="edit">Edit</button>
        <button class="btn btn-sm btn-danger" data-id="${p._id}" data-action="delete">Delete</button>
      </div>
    `;
    list.appendChild(el);
  });

  list.querySelectorAll('button').forEach(b => b.addEventListener('click', onListAction));
}

function escapeHtml(s) { if (!s) return ''; return String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]||c)); }
function truncate(s, n) { return s && s.length > n ? s.slice(0, n) + '...' : s || ''; }

async function onListAction(e) {
  const id = e.currentTarget.dataset.id;
  const action = e.currentTarget.dataset.action;
  if (action === 'view') return viewPost(id);
  if (action === 'edit') return loadForEdit(id);
  if (action === 'delete') {
    if (!confirm('Delete this post?')) return;
    try { await fetch(`${API}/${id}`, { method: 'DELETE' }); await loadPosts(); } catch (err) { alert('Delete failed: ' + err.message); }
  }
}

async function viewPost(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error('Not found');
    const p = await res.json();
    const content = `<h4>${escapeHtml(p.title)}</h4><p>${escapeHtml(p.body)}</p><p class="text-muted">By ${escapeHtml(p.author)}</p>`;
    $('<div>').html(content).dialog({ title: 'View Post', modal: true, width: 600, close: function () { $(this).dialog('destroy').remove(); } });
  } catch (err) { alert('View failed'); }
}

async function loadForEdit(id) {
  try {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error('Not found');
    const p = await res.json();
    document.getElementById('post-id').value = p._id;
    document.getElementById('title').value = p.title;
    document.getElementById('body').value = p.body;
    if (!document.getElementById('tags')) { const inp = document.createElement('input'); inp.id = 'tags'; inp.className = 'form-control mt-2'; inp.placeholder = 'tags, comma-separated'; document.getElementById('post-form').insertBefore(inp, document.getElementById('save-btn')); }
    document.getElementById('tags').value = (p.tags || []).join(', ');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) { alert('Load for edit failed'); }
}

