// --- Filters ---
async function loadTab(tab) {
  if (tab != 'scheduleNow') {
    setLoading();
    pageActive('mainPage');
  }
  try {
    //загальні
    if (tab === 'updates') {
      html.sectionTitle.innerHTML = 'Свіжі <em>оновлення</em>';
      const data = await apiFetch();
      renderGrid(data);
    } else if (tab === 'genres-random') {
      html.sectionTitle.innerHTML = '<em>Випадкові</em> жанри';
      const data = await apiFetch(api.randomGenres);
      console.log('рандом жанри:', data);
      renderGenresGrid(data);
    }
    
    //недільний розклад
    else if (tab === 'scheduleNow') {
      const datas = await apiFetch(api.scheduleNow);
      console.log('Теперішній розклад:', datas);
      data.scheduleNow = await datas;
    } 
    else if (tab === 'yesterday') {
      html.sectionTitle.innerHTML = '<em>Розклад на</em> вчора';
      const datas = await data.scheduleNow.yesterday;
      console.log('Розклад на вчора:', datas);
      renderReleaseGrid(datas);
    } else if (tab === 'today') {
      html.sectionTitle.innerHTML = '<em>Розклад на</em> сьогодні';
      const datas = await data.scheduleNow.today;
      console.log('Розклад на сьогоднї:', datas);
      renderReleaseGrid(datas);
    } else if (tab === 'tomorrow') {
      html.sectionTitle.innerHTML = '<em>Розклад на</em> завтра';
      const datas = await data.scheduleNow.tomorrow;
      console.log('Розклад на завтра:', datas);
      renderReleaseGrid(datas);
    }
    
    
    //розклад на неділю
    else if (tab === 'scheduleWeek') {
      html.sectionTitle.innerHTML = '<em>Недільний розклад</em> вихода';
      const data = await apiFetch(api.scheduleWeek);
      console.log('Недільний розклад:', data);
      renderReleaseGrid(data);
    }
  }  catch (e) {
    showError('Не вдалось завантажити дані: ' + e.message);
    html.mainPage.innerHTML = '<div class="empty"><div class="empty-icon">📡</div><div class="empty-title">Помилка завантаження</div><p>Провірте підключення до інтернету</p></div>';
  }
}

