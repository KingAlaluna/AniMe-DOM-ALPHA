//html element
export const i = (id) => document.getElementById(id);
export const c = (classis) => document.querySelectorAll(`.${classis}`);
const ac = (autoClassis) => document.getElementsByClassName(autoClassis);


export const html = {
  tagMain: i('tag-main'),
  templatesPages: c('templates-pages'),
  
  //main page
  pagin: i('pagin'),
  loader: i('loader'),
  sectionTitle: i('section-title'),
  
  
  //page anime view
  animeViewAnimePoster: i('anime-view-anime-poster'),
  animeViewTitle: i('anime-view-title'),
  animeViewInfoWrap: i('anime-view-info-wrap'),
  animeViewDescription: i('anime-view-description'),
  animeViewTitleEn: i('anime-view-title-en'),
  animeViewGenresPanel: i('anime-view-genres-panel'),
  episodesGrid: i('episodes-grid'),
  videoPlayer: i('video-player'),
  franchisesGrid: i('franchises-grid'),
  similarGrid: i('similar-grid'),
  membersGrid: i('members-grid'),
  
  
  //general
  themeBtn: i('theme-btn'),
  searchInput: i('search-input'),
  allPage: c('page'),
  
  
  //menu
  menuBtn: i('menu-btn'),
  menu: i('menu'),
  modalMenu: i('modal-menu'),
  menuBtnDetails: i('menu-btn-details'),
  menuBtnLine: c('menu-btn__line'),
  cMenuBtn: c('menu__btn'),
  wrapFilterBtn: c('wrap-filter-btn'),
  
  
  //anime view
  episodeBtn: c('episode-btn'),
  animeCardImg: c('anime-card__poster'),
  animeFranchisesImg: c('anime-franchises__poster'),
  animeSimilarImg: c('anime-similar__poster'),
  animeMemberImg: c('anime-member__img'),
  genreImg: c('genre__img'),
  
  
  //pagination
  paginBtn: c('pagin-btn'),
  
  
  //tags
  body: document.body,
  html: document.documentElement,
};



//api data
export const api = {
  API: 'https://aniliberty.top/api/v1/anime/releases/latest',
  imgApi: 'https://static-libria.weekstorm.us',
  episodeApi: 'https://aniliberty.top/api/v1/anime/releases/episodes/',
  
  
  randomGenres: 'https://aniliberty.top/api/v1/anime/genres/random',
  allGenres: 'https://aniliberty.top/api/v1/anime/genres',
  
  scheduleNow: 'https://aniliberty.top/api/v1/anime/schedule/now',
  scheduleWeek: 'https://aniliberty.top/api/v1/anime/schedule/week',
  
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
  currentTab: null,
  descriptionActive: false,
  
  scheduleNow: {},
};



