// ============================================================
// POSTS LIST
//
// Add a new post:
//   1. Create posts/your-post.html (copy posts/example.html as a
//      starting template — only the meta tags need editing).
//   2. Add the path below. Order doesn't matter — posts are sorted
//      by their post-date meta tag automatically.
// ============================================================

window.POSTS = [
  "posts/hello_world.html",
];

// ============================================================
// Rendering logic. You probably don't need to touch anything below.
// ============================================================

(function () {
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d.getTime())) return iso;
    return String(d.getDate()).padStart(2, '0') + ' ' + MONTHS[d.getMonth()] + ', ' + d.getFullYear();
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[c]);
  }

  async function fetchMeta(url) {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) return null;
      const text = await res.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');
      const titleMeta = doc.querySelector('meta[name="post-title"]');
      const dateMeta  = doc.querySelector('meta[name="post-date"]');
      const title = titleMeta && titleMeta.getAttribute('content');
      const date  = dateMeta  && dateMeta.getAttribute('content');
      if (!title || !date) return null;
      return { url, title, date };
    } catch (e) {
      console.warn('Could not load post:', url, e);
      return null;
    }
  }

  async function loadAll() {
    const list = window.POSTS || [];
    const all = await Promise.all(list.map(fetchMeta));
    return all.filter(Boolean).sort((a, b) => b.date.localeCompare(a.date));
  }

  async function renderLatest(target) {
    const limit = parseInt(target.dataset.limit || '5', 10);
    const posts = await loadAll();
    if (!posts.length) {
      target.innerHTML = '<li class="empty">No posts yet.</li>';
      return;
    }
    target.innerHTML = posts.slice(0, limit).map(p => `
      <li>
        <span class="date">${escapeHtml(formatDate(p.date))}</span>
        <a class="title" href="${escapeHtml(p.url)}">${escapeHtml(p.title)}</a>
      </li>`).join('');
  }

  async function renderArchive(target) {
    const posts = await loadAll();
    if (!posts.length) {
      target.innerHTML = '<p class="empty-state">No posts yet.</p>';
      return;
    }
    const byYear = {};
    for (const p of posts) {
      const y = p.date.slice(0, 4);
      (byYear[y] = byYear[y] || []).push(p);
    }
    const years = Object.keys(byYear).sort().reverse();
    target.innerHTML = years.map(y => `
      <div class="year-label">${y}</div>
      <ul class="archive-list">
        ${byYear[y].map(p => `<li><a href="${escapeHtml(p.url)}">${escapeHtml(p.title)}</a></li>`).join('')}
      </ul>`).join('');
  }

  // Auto-fill post-page elements with [data-from="post-title"] /
  // [data-from="post-date"] from the page's own <meta> tags.
  function fillPostPage() {
    const titleMeta = document.querySelector('meta[name="post-title"]');
    const dateMeta  = document.querySelector('meta[name="post-date"]');
    if (!titleMeta) return;
    const title = titleMeta.getAttribute('content');
    const date  = dateMeta && dateMeta.getAttribute('content');
    document.querySelectorAll('[data-from="post-title"]').forEach(el => { el.textContent = title; });
    if (date) {
      document.querySelectorAll('[data-from="post-date"]').forEach(el => { el.textContent = formatDate(date); });
    }
    // Sync browser tab title.
    document.title = title + ' — jeremy zhang';
  }

  window.addEventListener('DOMContentLoaded', async () => {
    fillPostPage();

    const latest  = document.querySelector('[data-render="latest"]');
    const archive = document.querySelector('[data-render="archive"]');

    if (latest)  await renderLatest(latest);
    if (archive) await renderArchive(archive);
  });
})();
