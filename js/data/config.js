//html element
const i = (id) => document.getElementById(id);
export const c = (classis) => document.querySelectorAll(`.${classis}`);
const ac = (autoClassis) => document.getElementsByClassName(autoClassis);


export const html = {
  //page
  mainPage: i('main-page'),
  animeViewing: i('anime-viewing'),
  
  
  searchInput: i('searchInput'),
  episodesGrid: i('episodesGrid'),
  videoPlayer: i('video-player'),
  franchisesGrid: i('franchises-grid'),
  similarGrid: i('similar-grid'),
  membersGrid: i('members-grid'),
  
  modalTitle: i('title'),
  modalPoster: i('anime-poster-img'),
  modalBadges: i('badges'),
  description: i('description'),
  sectionTitle: i('sectionTitle'),
  errorBox: i('errorBox'),
  menuBtn: i('menu-btn'),
  menu: i('menu'),
  modalMenu: i('modal-menu'),
  menuBtnDetails: i('menu-btn-details'),
  loader: i('loader'),
  titleEn: i('title-en'),
  genresPanel: i('genres-panel'),
  
  episodeBtn: c('episode-btn'),
  tabBtn: c('tab-btn'),
  menuBtnLine: c('menu-btn__line'),
  cMenuBtn: c('menu__btn'),
  allPage: c('page'),
  
  animeCardImg: c('anime-card__poster'),
  animeFranchisesImg: c('anime-franchises__poster'),
  animeSimilarImg: c('anime-similar__poster'),
  animeMemberImg: c('anime-member__img'),
  
  //animeCardImg: ac('anime-card__poster'),
  genreImg: c('genre__img'),
  wrapFilterBtn: c('wrap-filter-btn'),
  
  //пагинация
  pagin: i('pagin'),
  paginBtn: c('pagin-btn'),
  
  
  //tags
  body: document.body,
  html: document,
};



//api data
export const api = {
  API: 'https://aniliberty.top/api/v1/anime/releases/latest',
  imgApi: 'https://static-libria.weekstorm.us',
  episodeApi: 'https://aniliberty.top/api/v1/anime/releases/episodes/',
  //search: 'https://aniliberty.top/api/v1/app/search/releases?query=',
  //search: 'https://anilibria.top/api/v1/anime/catalog/releases?f[search]=',
  
  
  randomGenres: 'https://aniliberty.top/api/v1/anime/genres/random',
  allGenres: 'https://aniliberty.top/api/v1/anime/genres',
  
  scheduleNow: 'https://aniliberty.top/api/v1/anime/schedule/now',
  scheduleWeek: 'https://aniliberty.top/api/v1/anime/schedule/week',
  
  //anime: 'https://anilibria.top/api/v1/anime/releases/list?ids=9951,9433,5692&aliases=darling-in-the-franxx&page=1&limit=10&include=id,type.genres&exclude=poster,description',
  animeId: 'https://anilibria.top/api/v1/anime/releases/list?ids=',
  
  catalog: 'https://anilibria.top/api/v1/anime/catalog/releases',
  franchises: 'https://anilibria.top/api/v1/anime/franchises/release/',
  
  filterTotal: 'https://anilibria.top/api/v1/anime/catalog/releases?limit=10&page=1&f[genres]=15,20&f[types]=TV,WEB&f[years][from_year]=2016&f[years][to_year]=2020&f[sorting]=RATING_DESC',
  
  active: 'https://anilibria.top/api/v1/anime/catalog/releases',
  activeSimilar: 'https://anilibria.top/api/v1/anime/catalog/releases',
};



//video data
export const vData = {
  episode: 0,
  quality: '480',
  hls: null,
  player: null,
};



//data
export const data = {
  page: null,
  btnFiltersActive: null,
  currentTab: null,
  
  scheduleNow: {},
};



