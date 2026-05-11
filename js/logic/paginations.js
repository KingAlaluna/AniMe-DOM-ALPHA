import {html, api, c} from '../data/config.js';


export const paginBtn = {
  status: false,
};


//templates
class PaginBtn {
  constructor(page) {
    this.btn = `<button class="btn-number pagin-btn ${page == 1 ? 'active' : ''}" aria-label="Пагінація, сторінка ${page}" data-page="${page}">${page}</button>`;
  }
}


//logic 
function paginBtnRender(pagesTotal, pagesTotalStatus) {
  paginBtn.status = true;
  
  let btnPaginLeft = '';
  let btnPaginRight = '';
  let btn = 0;
  let btnMax = Math.ceil((pagesTotal / 2) > 8 ? 8 : pagesTotal / 2);
  
  while (btn < pagesTotal / 2 && btn < 8) {
    btnPaginLeft += new PaginBtn(btn + 1).btn;
    if (pagesTotal <= 15) {
      if (pagesTotal % 2 != 0) {
        btnPaginRight += btnMax < Math.ceil(pagesTotal / 2) ? new PaginBtn(pagesTotal - (btnMax - 1)).btn : '';
      } else {
        btnPaginRight += new PaginBtn(pagesTotal - (btnMax - 1)).btn;
      }
    } else {
      btnPaginRight += new PaginBtn(pagesTotal - (btnMax - 1)).btn;
    }
    
    btn += 1;
    btnMax -= 1;
  }
  
  
  html.pagin.innerHTML = `
    ${btnPaginLeft}
    ${(pagesTotal / 2) > 8 ? '<input class="btn-number pagin-btn" aria-label="Пагінація, введіть сторінку" type="number" placeholder="Сторінка" />' : ''}
    ${btnPaginRight}
  `;
  
  if (!pagesTotalStatus) {
    return;
  }
  
  //click
  html.paginBtn = c('pagin-btn');
  
  html.paginBtn.forEach(e => {
    ['click', 'keydown'].forEach(ev => {
      e.addEventListener(ev, async (en) => {
        if (ev == 'click') {
          html.paginBtn.forEach(e => {
            e.classList.remove('active');
          });
          e.classList.add('active');
          
          const page = e.dataset.page;
          if (page) {
            filters.config.page = page;
            api.active = `${api.catalog}?${new URLSearchParams(filters.config).toString()}`;
            const newAnimes = await apiFetch(`${api.active}`);
            renderGrid(newAnimes);
          }
        }
        if (ev == 'keydown' && en.key == 'Enter') {
          const page = e.dataset.page;
          if (!page) {
            if (e.value > 0 && e.value <= pagesTotal) {
              filters.config.page = e.value;
              api.active = `${api.catalog}?${new URLSearchParams(filters.config).toString()}`;
              const newAnimes = await apiFetch(`${api.active}`);
              renderGrid(newAnimes);
            } else {
              e.value = '';
              e.placeholder = 'Помилка!';
              e.classList.add('error');
              setTimeout(() => {
                e.placeholder = 'Сторінка';
                e.classList.remove('error');
              }, 1000);
            }
          }
        }
      });
    });
  });
}


export function paginCheck(list) {
  if (!paginBtn.status) {
    const pagesStatus = list?.meta?.pagination?.total_pages;
    const checkPagesTotal = pagesStatus ? pagesStatus : 1;
    const pagesTotal = Number(checkPagesTotal);
    paginBtnRender(pagesTotal, pagesStatus ? true : false);
  }
}
