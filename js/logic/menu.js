import {html, data} from '../data/config.js';
import {router} from './mainLogic.js';
import {loadTab, anineFilter} from './filterAnime.js';


//main menu
html.menuBtn.addEventListener('click', () => {
  html.menuBtnLine.forEach(e => {
    e.classList.toggle('active');
  });
  html.menu.classList.toggle('active');
  html.menuBtn.classList.toggle('active');
});

html.cMenuBtn.forEach(e => {
  e.addEventListener('click', () => {
    const data2 = e.dataset.filter;
    const dataList = e.dataset.filterList;
    const dataType = e.dataset.type;
    
    if (data2) {
      data.btnFiltersActive = e;
    }
    
    if (!dataList) {
      html.cMenuBtn.forEach(e => {
        const data3 = e.dataset.filter;
        if (data3 && data.btnFiltersActive.dataset.filter != e.dataset.filter) {
          e.classList.remove('active');
        }
      });
    } else {
      e.classList.toggle('active');
    }
    
    
    if (!e.classList.contains('active') && !dataList) {
      html.cMenuBtn.forEach(e => {
        const data3 = e.dataset.filter;
        if (data2 == data3) {
          e.classList.toggle('active');
        }
      });
    }
    
    if (data2 && data.currentTab != data2 && !dataType) {
      if (data2 != 'main') {
        router.navigate(`/${data2}`);
      } else {
        router.navigate(`/`);
      }
    } 
    
    if (data2 && data.currentTab != data2 && dataType) {
      //anineFilter(dataType, data2);
      router.navigate(`/filters/${dataType}/${data2}`);
      console.log('Клік на кнопку фільтру!', e.textContent);
    }
    
    if (dataList) {
      loadTab(dataList);
    }
  });
});


//modal menu
html.menuBtnDetails.addEventListener('click', () => {
  html.modalMenu.classList.toggle('active');
});

