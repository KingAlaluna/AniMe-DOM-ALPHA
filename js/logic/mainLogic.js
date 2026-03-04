// --- NAV ---
function switchTab(tab, btn) {
  data.currentTab = tab;
  html.tabBtn.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  html.searchInput.value = '';
  loadTab(tab);
}

function goHome() {
  html.searchInput.value = '';
  data.currentTab = 'updates';
  html.tabBtn.forEach((b, i) => b.classList.toggle('active', i === 0));
  loadTab('updates');
}



// --- FETCH HELPERS ---
async function apiFetch(endpoint) {
  const res = await fetch(endpoint || api.API);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function showError(msg) {
  html.errorBox.textContent = '⚠ ' + msg;
  html.errorBox.style.display = 'block';
  setTimeout(() => html.errorBox.style.display = 'none', 5000);
}

function setLoading() {
  //html.mainPage.innerHTML = '<div class="loader" id="loader"><div class="spinner"></div> Завантаження...</div>';
}


// utils
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}