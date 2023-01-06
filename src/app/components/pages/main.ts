import { possibleCards } from '../../../assets/samples/possible-cards';
import { AbstractPage } from '../../abstracts/abstracts';
import { Cards } from '../storage/cards';

export class MainPage extends AbstractPage {
  constructor() {
    super();
    this.setPageTitle('Shop Cart');
  }

  getPageContent(): HTMLElement {
    this.setPageTitle('Online Shop');
    const content = document.createElement('div');
    content.innerHTML = ` 
    <h1>Online Shop</h1>
    `;
    const cards = new Cards (possibleCards.products);
    if (!localStorage.getItem('main-current-state')) localStorage.setItem('main-current-state', 'Table'); // table state at first page loading
    
    const mainWrapper = document.createElement('div');
    mainWrapper.classList.add('row');

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('content-wrapper');
    contentWrapper.classList.add('col-9');

    const filtersWrapper = document.createElement('div');
    filtersWrapper.classList.add('filters-wrapper');
    filtersWrapper.classList.add('col'); 

    cards.generateFiltersField(filtersWrapper);

    // !temporary! this is a button for delete all cards from local storage
    const resetCardBtn = document.createElement('button');
    resetCardBtn.classList.add('card__btn');
    resetCardBtn.textContent = 'remove cards from cart';
    resetCardBtn.style.height = '100px';
    resetCardBtn.addEventListener('click', e => {
      const target = e.target as HTMLElement;
      if (target.parentElement?.classList.contains('filters-wrapper')) {
        console.log('local storage is clear now \n deleted cards:')
        console.log(localStorage.getItem('cart-products'));
        localStorage.setItem('cart-products', '');
      }

    })
    filtersWrapper.append(resetCardBtn);
    // !end of temporary button

    const cardsWrapper = document.createElement('div');
    cardsWrapper.classList.add('cards-wrapper'); // loading stance from storage
    if (localStorage.getItem('main-current-state') === 'Table') cardsWrapper.classList.add('cards-wrapper-table');
    if (localStorage.getItem('main-current-state') === 'Row') cardsWrapper.classList.add('cards-wrapper-row');
    cards.generateCards(cardsWrapper);

    const sortingWrapper = document.createElement('div'); // generate sorting line
    sortingWrapper.classList.add('sorting-wrapper');
    const nameSort = document.createElement('span');
    nameSort.innerText = 'sort by name';
    nameSort.classList.add('sort-item');
    nameSort.addEventListener('click', () => {
      cards.removeCards();
      cards.properties.sortProperty = 'title';
      cards.generateCards(cardsWrapper);
    })
    const priceSort = document.createElement('span');
    priceSort.innerText = 'sort by price';
    priceSort.classList.add('sort-item');
    priceSort.addEventListener('click', () => {
      cards.removeCards();
      cards.properties.sortProperty = 'price';
      cards.generateCards(cardsWrapper);
    })
    const ratingSort = document.createElement('span');
    ratingSort.innerText = 'sort by rating';
    ratingSort.classList.add('sort-item');
    ratingSort.addEventListener('click', () => {
      cards.removeCards();
      cards.properties.sortProperty = 'rating';
      cards.generateCards(cardsWrapper);
    })
    sortingWrapper.append(nameSort);
    sortingWrapper.append(priceSort);
    sortingWrapper.append(ratingSort);

    contentWrapper.append(sortingWrapper);
    contentWrapper.append(cardsWrapper);
    mainWrapper.append(contentWrapper);
    mainWrapper.append(filtersWrapper);
    content.append(mainWrapper);

    const searchBtn = document.querySelector('.btn-outline-secondary');
    const searchField = document.querySelector('.form-control') as HTMLInputElement;
    searchBtn?.addEventListener('click', () => {
      cards.removeCards();
      cards.properties.searchProperty = searchField.value;
      cards.generateCards(cardsWrapper);
    })

    return content;
  }
}

export const mainPage = new MainPage();