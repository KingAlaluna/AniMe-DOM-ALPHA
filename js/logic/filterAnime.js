import {html, api, data} from '../data/config.js';
import {apiFetch} from './mainLogic.js';
import {renderGrid, renderGenresGrid} from './renderAnimeLists.js';

// --- Filters ---
export async function loadTab(tab) {
  if (tab != 'scheduleNow') {
    //setLoading();
    //pageActive('mainPage');
  }
  if (data.currentTab == tab) {
    return;
    console.log('tab равен!!!');
  } else {
    data.currentTab = tab;
    console.log('tab НЕ равен!!!');
  }
  
  try {
    //загальні
    if (tab === 'updates') {
      html.sectionTitle.innerHTML = 'Свіжі <em>оновлення</em>';
      const result = await apiFetch();
      renderGrid(result);
    } else if (tab === 'genres-random') {
      html.sectionTitle.innerHTML = '<em>Випадкові</em> жанри';
      const result = await apiFetch(api.randomGenres);
      console.log('рандом жанри:', result);
      renderGenresGrid(result);
    }
    
    //недільний розклад
    else if (tab === 'scheduleNow') {
      const result = await apiFetch(api.scheduleNow);
      console.log('Теперішній розклад:', result);
      data.scheduleNow = await result;
    } 
    else if (tab === 'yesterday') {
      html.sectionTitle.innerHTML = '<em>Розклад на</em> вчора';
      const result = await data.scheduleNow.yesterday;
      console.log('Розклад на вчора:', result);
      renderGrid(result);
    } else if (tab === 'today') {
      html.sectionTitle.innerHTML = '<em>Розклад на</em> сьогодні';
      const result = await data.scheduleNow.today;
      console.log('Розклад на сьогоднї:', result);
      renderGrid(result);
    } else if (tab === 'tomorrow') {
      html.sectionTitle.innerHTML = '<em>Розклад на</em> завтра';
      const result = await data.scheduleNow.tomorrow;
      console.log('Розклад на завтра:', result);
      renderGrid(result);
    }
    
    
    //розклад на неділю
    else if (tab === 'scheduleWeek') {
      html.sectionTitle.innerHTML = '<em>Недільний розклад</em> вихода';
      const result = await apiFetch(api.scheduleWeek);
      console.log('Недільний розклад:', result);
      renderGrid(result);
    }
  } catch (e) {
    //showError('Не вдалось завантажити дані: ' + e.message);
    html.mainPage.innerHTML = `<div class="empty"><div class="empty-icon">📡</div><div class="empty-title">Помилка завантаження</div><p>${e.message}</p></div>`;
  }
}

