import {html, api, data, c} from '../data/config.js';
import {allFilter} from '../data/filter.js';
import {apiFetch} from './mainLogic.js';
import {renderGrid, renderGenresGrid, paginBtn} from './renderAnimeLists.js';

// --- Filters ---
export const filters = {
  config: {
    page: 1,
  },
};


//generals filter
export async function loadTab(tab) {
  if (data.currentTab == tab) {
    return;
    console.log('tab равен!!!');
  } else {
    data.currentTab = tab;
    console.log('tab НЕ равен!!!');
  }
  
  try {
    paginBtn.status = false;
    filters.config = {page: 1};
    
    //загальні
    if (tab === 'main') {
      html.sectionTitle.innerHTML = '<em>Головна</em> сторінка';
      const result = await apiFetch(api.catalog);
      renderGrid(result);
    } else if (tab === 'updates') {
      html.sectionTitle.innerHTML = '<em>Свіжі</em> оновлення';
      const result = await apiFetch();
      renderGrid(result);
    }
    
    //жанри
    else if (tab === 'genres-all') {
      html.sectionTitle.innerHTML = '<em>Всі</em> жанри';
      const result = await apiFetch(api.allGenres);
      console.log('всі жанри:', result);
      renderGenresGrid(result);
    } else if (tab === 'genres-random') {
      html.sectionTitle.innerHTML = '<em>Випадкові</em> жанри';
      const result = await apiFetch(api.randomGenres);
      console.log('рандом жанри:', result);
      renderGenresGrid(result);
    }
    
    //теперішній розклад
    else if (tab === 'scheduleNow') {
      const result = await apiFetch(api.scheduleNow);
      console.log('Теперішній розклад:', result);
      data.scheduleNow = await result;
    } 
    else if (tab === 'yesterday') {
      html.sectionTitle.innerHTML = '<em>Розклад</em> на вчора';
      const result = await data.scheduleNow.yesterday;
      console.log('Розклад на вчора:', result);
      renderGrid(result);
    } else if (tab === 'today') {
      html.sectionTitle.innerHTML = '<em>Розклад</em> на сьогодні';
      const result = await data.scheduleNow.today;
      console.log('Розклад на сьогоднї:', result);
      renderGrid(result);
    } else if (tab === 'tomorrow') {
      html.sectionTitle.innerHTML = '<em>Розклад</em> на завтра';
      const result = await data.scheduleNow.tomorrow;
      console.log('Розклад на завтра:', result);
      renderGrid(result);
    }
    
    
    //розклад на неділю
    else if (tab === 'scheduleWeek') {
      html.sectionTitle.innerHTML = '<em>Недільний</em> розклад';
      const result = await apiFetch(api.scheduleWeek);
      console.log('Недільний розклад:', result);
      renderGrid(result);
    }
    
    
    //каталог тест
    //const catalog = await apiFetch(api.catalog);
    //console.log('каталог', catalog);
  } catch (e) {
    //showError('Не вдалось завантажити дані: ' + e.message);
    html.mainPage.innerHTML = `<div class="empty"><div class="empty-icon">📡</div><div class="empty-title">Помилка завантаження</div><p>${e.message}</p></div>`;
  }
}


html.wrapFilterBtn.forEach(e => {
  const data = e.dataset.wrapFilter;
  e.insertAdjacentHTML('beforeend', allFilter[data].join(''));
});
html.cMenuBtn = c('menu__btn');



//filter anime
export async function anineFilter(dataType, data, name) {
  try {
    console.log('тип', dataType);
    console.log('значення', data);
    
    paginBtn.status = false;
    filters.config = {page: 1};
    
    
    //filter
    if (dataType == 'years') {
      html.sectionTitle.innerHTML = `<em>Фільтр</em> рік ${data}`;
      filters.config['f[years][from_year]'] = data;
      filters.config['f[years][to_year]'] = data;
    } 
    else if (dataType == 'types') {
      html.sectionTitle.innerHTML = `<em>Фільтр</em> тип ${name}`;
      filters.config['f[types]'] = data;
    }
    else if (dataType == 'genres') {
      html.sectionTitle.innerHTML = `<em>Фільтр</em> жанр ${name}`;
      filters.config['f[genres]'] = data;
    }
    else if (dataType == 'seasons') {
      html.sectionTitle.innerHTML = `<em>Фільтр</em> сезон ${name}`;
      filters.config['f[seasons]'] = data;
    }
    else if (dataType == 'ageRatings') {
      html.sectionTitle.innerHTML = `<em>Фільтр</em> віковий рейтинг ${name}`;
      filters.config['f[age_ratings]'] = data;
    }
    else if (dataType == 'ongoings') {
      html.sectionTitle.innerHTML = `<em>Фільтр</em> онгоїнг статус ${name}`;
      filters.config['f[publish_statuses]'] = data;
    }
    else if (dataType == 'productions') {
      html.sectionTitle.innerHTML = `<em>Фільтр</em> випуск статус ${name}`;
      filters.config['f[production_statuses]'] = data;
    }
    else if (dataType == 'generals') {
      html.sectionTitle.innerHTML = `<em>Фільтр</em> загальне ${name}`;
      filters.config['f[sorting]'] = data;
    }
    /*//search
    else if (dataType == 'search') {
      html.sectionTitle.innerHTML = `<em>Фільтр</em> загальне ${name}`;
      filters['f[search]'] = data;
    }*/
    
    
    api.active = `${api.catalog}?${new URLSearchParams(filters.config).toString()}`;
    const result = await apiFetch(api.active);
    console.log('Фільтер результат:', result);
    renderGrid(result);
    
  } catch (e) {
    console.error('Помилка фільтру аніме', e);
  }
}