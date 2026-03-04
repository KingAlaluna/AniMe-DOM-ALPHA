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
    if (data2) {
      data.btnFiltersActive = e;
    }
    
    html.cMenuBtn.forEach(e => {
      const data3 = e.dataset.filter;
      if (data3 && data.btnFiltersActive != e) {
        e.classList.remove('active');
      }
    });
    
    if (!e.classList.contains('active') || dataList) {
      e.classList.toggle('active');
    }
    
    if (data2) {
      loadTab(data2);
    }
    
    if (dataList) {
      loadTab(dataList);
    }
  });
});