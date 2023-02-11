import './css/styles.css';
import { fetchCountries } from './api/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(e) {
  e.preventDefault();

  const inputValue = e.target.value.trim();
  if (!inputValue) {
    resetMarkup(refs.countryList);
    resetMarkup(refs.countryInfo);
    return;
  }

  fetchCountries(inputValue)
    .then(dataCountry => {
      if (dataCountry.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (dataCountry.length >= 2 && dataCountry.length <= 10) {
        resetMarkup(refs.countryList);
        createMarkupCountryList(dataCountry);
        resetMarkup(refs.countryInfo);
      } else {
        resetMarkup(refs.countryInfo);
        createMarkupCountryInfo(dataCountry);
        resetMarkup(refs.countryList);
      }
    })
    .catch(() => {
      resetMarkup(refs.countryList);
      resetMarkup(refs.countryInfo);
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function createMarkupCountryList(dataCountry) {
  const markup = dataCountry
    .map(({ name, flags }) => {
      return `<li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" alt="flag" />
        <p class="country-list__text">${name.official}</p>
      </li>`;
    })
    .join('');
  return refs.countryList.insertAdjacentHTML('beforeend', markup);
}

function createMarkupCountryInfo(dataCountry) {
  const markup = dataCountry
    .map(({ name, capital, population, flags, languages }) => {
      return `
  <div class="country__flag">
    <img class="country__img" src="${flags.svg}" alt="flag">
    <p class="country__name">${name.official}</p>
  </div>
  <ul class="country__info">
      <li class="country__item"> <b>Capital</b>:
    <span class="country__span">${capital}</span>
      </li>
      <li class="country__item"> <b>Population</b>:
    <span class="country__span">${population}</span>
      </li>
      <li class="country__item"> <b>Languages</b>:
    <span class="country__span">${Object.values(languages).join(', ')}</span>
      </li>
  </ul>`;
    })
    .join('');

  return refs.countryInfo.insertAdjacentHTML('beforeend', markup);
}

function resetMarkup(el) {
  el.innerHTML = '';
}
