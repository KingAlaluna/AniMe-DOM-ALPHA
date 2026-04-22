import {html, data} from '../data/config.js';
import {router} from './main-logic.js';
import {loadTab, anineFilter} from './filter-anime.js';


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
    btnActive(e);
  });
});


function btnActive(e) {
  const dataFilter = e.dataset.filter;
  const dataList = e.dataset.filterList;
  const dataType = e.dataset.type;
  
  
  if (dataList) {
    e.classList.toggle('active');
  }
  
  if (dataFilter && data.currentTab != dataFilter && !dataType) {
    if (dataFilter != 'main') {
      router.navigate(`/${dataFilter}`);
    } else {
      router.navigate(`/`);
    }
  } 
  
  if (dataFilter && data.currentTab != dataFilter && dataType) {
    router.navigate(`/filters/${dataType}/${dataFilter}`);
  }
  
  if (dataList) {
    loadTab(dataList);
  }
}


//modal menu
html.menuBtnDetails.addEventListener('click', () => {
  html.modalMenu.classList.toggle('active');
});

