//html element
const i = (id) => document.getElementById(id);
const c = (classis) => document.querySelectorAll(`.${classis}`);


const html = {
  //page
  mainPage: i('main-page'),
  animeViewing: i('anime-viewing'),
  
  
  searchInput: i('searchInput'),
  episodesGrid: i('episodesGrid'),
  videoPlayer: i('video-player'),
  modalTitle: i('title'),
  modalPoster: i('anime-poster-img'),
  modalBadges: i('badges'),
  modalDesc: i('description'),
  sectionTitle: i('sectionTitle'),
  errorBox: i('errorBox'),
  menuBtn: i('menu-btn'),
  menu: i('menu'),
  loader: i('loader'),
  
  episodeBtn: c('episode-btn'),
  tabBtn: c('tab-btn'),
  menuBtnLine: c('menu-btn__line'),
  cMenuBtn: c('menu__btn'),
  
  
  //tags
  body: document.body,
  html: document,
};



//api data
const api = {
  API: 'https://aniliberty.top/api/v1/anime/releases/latest',
  imgApi: 'https://static-libria.weekstorm.us',
  episodeApi: 'https://aniliberty.top/api/v1/anime/releases/episodes/',
  search: 'https://aniliberty.top/api/v1/app/search/releases?query=',
  
  
  randomGenres: 'https://aniliberty.top/api/v1/anime/genres/random',
  scheduleNow: 'https://aniliberty.top/api/v1/anime/schedule/now',
  scheduleWeek: 'https://aniliberty.top/api/v1/anime/schedule/week',
  
};



//video data
const vData = {
  episode: 0,
  quality: '480',
  hls: null,
};



//data
const data = {
  currentTab: 'updates',
  btnFiltersActive: null,
  
  scheduleNow: {},
};