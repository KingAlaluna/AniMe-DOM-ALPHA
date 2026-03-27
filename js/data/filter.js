//templates btn filter
class Btn {
  constructor(props) {
    const key = props.key ? props.key : props.name;
    this.btn = `<button class="menu__btn" data-type="${props.type}" data-filter="${key}">${props.name}</button>`;
  }
}



//data filter
export const allFilter = {
  years: [],
  types: [],
  genres: [],
  seasons: [],
  ageRatings: [],
  ongoings: [],
  productions: [],
  generals: [],
};


//data constructor filter
let years = 2026;

const btnValue = {
types: [
  ['TV', 'ТВ'],
  ['ONA', 'ONA'],
  ['WEB', 'WEB'],
  ['OVA', 'OVA'],
  ['OAD', 'OAD'],
  ['MOVIE', 'Фільм'],
  ['DORAMA', 'Дорама'],
  ['SPECIAL', 'Спешл'],
],


genres: [
  [15, 'Бойові мистецтва'],
  [24, 'Вампіри'],
  [32, 'Гарем'],
  [16, 'Демони'],
  [25, 'Детектив'],
  [33, 'Джьосей'],
  [8, 'Драма'],
  [17, 'Ігри'],
  [34, 'Ісекай'],
  [26, 'Історичний'],
  [30, 'Кіберпанк'],
  [1, 'Комедія'],
  [18, 'Магія'],
  [2, 'Меха'],
  [9, 'Містика'],
  [19, 'Музика'],
  [36, 'Пародія'],
  [10, 'Повсякденність'],
  [27, 'Пригоди'],
  [3, 'Психологічне'],
  [11, 'Романтика'],
  [28, 'Надприродне'],
  [20, 'Сьоджьо'],
  [31, 'Сьоджьо-ай'],
  [5, 'Сейнен'],
  [4, 'Сьонен'],
  [12, 'Спорт'],
  [21, 'Суперсила'],
  [6, 'Трилер'],
  [13, 'Жахи'],
  [22, 'Фантастика'],
  [29, 'Фентезі'],
  [7, 'Школа'],
  [14, 'Екшен'],
  [23, 'Еччі']
],


seasons: [
  ['winter', 'Зима'],
  ['spring', 'Весна'],
  ['summer', 'Літо'],
  ['autumn', 'Осінь'],
],


ageRatings: [
  ['R18_PLUS', '18+'],
  ['R16_PLUS', '16+'],
  ['R12_PLUS', '12+'],
  ['R6_PLUS', '6+'],
  ['R0_PLUS', '0+'],
],


ongoings: [
  ['IS_ONGOING', 'Виходить'],
  ['IS_NOT_ONGOING', 'Завершено'],
],


productions: [
  ['IS_IN_PRODUCTION', 'Анонси'],
  ['IS_NOT_IN_PRODUCTION', 'Завершені'],
],


generals: [
  ['FRESH_AT_DESC', 'Нові оновлення'],
  ['FRESH_AT_ASC', 'Давні оновлення'],
  ['RATING_DESC', 'Високий рейтинг'],
  ['RATING_ASC', 'Низький рейтинг'],
  ['YEAR_DESC', 'Нові'],
  ['YEAR_ASC', 'Давні'],
],
};


export const btnMapValue = {};




//logic push btn filter
while (years > 1994) {
  allFilter.years.push(new Btn({type: 'years', name: years}).btn);
  //console.log('Year', allFilter.year)
  years -= 1;
}

function addGeneral(value) {
  btnMapValue[value] = new Map(btnValue[value]);
  
  btnValue[value].forEach(e => {
    allFilter[value].push(new Btn({type: value, key: e[0], name: e[1]}).btn);
    //console.log(`${value}`, allFilter[value])
  });
}

addGeneral('types');
addGeneral('genres');
addGeneral('seasons');
addGeneral('ageRatings');
addGeneral('ongoings');
addGeneral('productions');
addGeneral('generals');



