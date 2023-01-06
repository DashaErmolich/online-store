import { possibleCards } from '../../../assets/samples/possible-cards';
import { AbstractPage } from '../../abstracts/abstracts';
import { Cards } from '../storage/cards';
import { MainPageSettings } from '../../models/interfaces';
import { cardsAppearanceSearchParam } from '../../constants/constants';
import { CardsAppearance } from '../../enums/enums';
import { appRouter } from '../router/router';


export class MainPage extends AbstractPage {
  mainPageSettings: MainPageSettings;

  constructor() {
    super();
    this.setPageTitle('Shop Cart');
    this.mainPageSettings = {
      cardsAppearance: this.getCardsAppearance(),
    }
  }

  private getCardsAppearance(): string {
    const possibleValues: string[] = Object.values(CardsAppearance);
    const value = this.getValidStringValueFromUrl(cardsAppearanceSearchParam.key, possibleValues, cardsAppearanceSearchParam.defaultValue);
    
    if (!possibleValues.includes(value)) {
      appRouter.updateUrlParams(cardsAppearanceSearchParam.key, value);
    }
    
    return value;
  }

  getPageContent(): HTMLElement {
    this.setPageTitle('Online Shop');
    const content = document.createElement('div');
    content.innerHTML = ` 
    <h1>Online Shop</h1>
    `;
    const cards = new Cards(possibleCards.products, this.mainPageSettings.cardsAppearance);
    if (!localStorage.getItem('main-current-state')) localStorage.setItem('main-current-state', 'Table'); // table state at first page loading
    
    const mainWrapper = document.createElement('div');
    mainWrapper.classList.add('row');

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('content-wrapper');
    contentWrapper.classList.add('col-9');

    const sortingWrapper = document.createElement('div'); // generate sorting line
    sortingWrapper.classList.add('sorting-wrapper');
    const nameSort = document.createElement('span');
    nameSort.innerText = 'sort by name';
    nameSort.classList.add('sort-item');
    const priceSort = document.createElement('span');
    priceSort.innerText = 'sort by price';
    priceSort.classList.add('sort-item');
    const ratingSort = document.createElement('span');
    ratingSort.innerText = 'sort by rating';
    ratingSort.classList.add('sort-item');
    sortingWrapper.append(nameSort);
    sortingWrapper.append(priceSort);
    sortingWrapper.append(ratingSort);

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
    //cardsWrapper.classList.add('cards-wrapper'); // loading stance from storage
    // if (localStorage.getItem('main-current-state') === 'Table') cardsWrapper.classList.add('cards-wrapper-table');
    // if (localStorage.getItem('main-current-state') === 'Row') cardsWrapper.classList.add('cards-wrapper-row');
    cardsWrapper.className = 'cards-wrapper row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4'
    cards.generateCards(cardsWrapper);

    contentWrapper.append(sortingWrapper);
    contentWrapper.append(cardsWrapper);
    mainWrapper.append(contentWrapper);
    mainWrapper.append(filtersWrapper);
    content.append(mainWrapper);

    return content;
  }
}

// export const mainPage = new MainPage();

// current HTML State: 
/*
              <h1>Online Shop</h1>
                <div class="main-content-wrapper">
                <div class="filters-wrapper">
                  <div class="filters__category">
                    <h3 class="filters__category-title">Category</h3>
                    <div class="filters__category-line">
                      <input type="checkbox" name="categories">
                      <label for="categories">Smartphones</label>
                    </div>
                    <div class="filters__category-line">
                      <input type="checkbox" name="categories">
                      <label for="categories">Laptops</label>
                    </div>
                    <div class="filters__category-line">
                      <input type="checkbox" name="categories">
                      <label for="categories">Fragrances</label>
                    </div>
                  </div>
                  <div class="filters__brand">
                    <h3 class="filters__category-title">Brand</h3>
                    <div class="filters__category-line">
                      <input type="checkbox" name="brands">
                      <label for="brands">Apple</label>
                    </div>
                    <div class="filters__category-line">
                      <input type="checkbox" name="brands">
                      <label for="brands">Samsung</label>
                    </div>
                    <div class="filters__category-line">
                      <input type="checkbox" name="brands">
                      <label for="brands">OPPO</label>
                    </div>
                  </div>
                </div>
                <div class="cards-wrapper">
                  <div class="card" id = "card-temp">
                    <h3 class="card__title">Tovar</h3>
                    <div class="card__description-field">
                      <p class="card__category">category</p>
                      <p class="card__brand">brand</p>
                      <p class="card__price">price</p>
                      <p class="card__discount">discount</p>
                      <p class="card__rating">rating</p>
                      <p class="card__stock">stock</p>
                    </div>
                    <div class="card__buttons-field">
                      <button class="card__btn card__to-cart-btn"></button>
                    </div>
                  </div>
                </div>
                </div>
*/