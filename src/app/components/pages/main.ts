import { possibleCards } from '../../../assets/samples/possible-cards';
import { AbstractPage } from '../../abstracts/abstracts';
import { SimpleCard } from '../../models/interfaces';
import { appStorage } from '../storage/app-storage';

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
    const mainWrapper = document.createElement('div');
    mainWrapper.classList.add('main-content-wrapper');
    const filtersWrapper = document.createElement('div');
    filtersWrapper.classList.add('filters-wrapper'); 
    filtersWrapper.innerHTML = `
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
    `
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

    const cardsWrapper = document.createElement('div');
    cardsWrapper.classList.add('cards-wrapper');
    this.generateCards(cardsWrapper);

    mainWrapper.append(filtersWrapper);
    mainWrapper.append(cardsWrapper);
    content.append(mainWrapper);

    return content;
  }
  filterAndCreate(elem: SimpleCard, category?:string, brand?:string) { 
    if (!brand && !category) {
      const fragment = document.createDocumentFragment();
      const wrapper = document.querySelector('.cards-wrapper') as HTMLDivElement;
      const card = document.querySelector('#card-temp') as HTMLTemplateElement;
      console.log(card)
      const clone = card.content.cloneNode(true) as HTMLTemplateElement;
      (clone.querySelector('.card__title') as HTMLDivElement).textContent = elem.title;
      (clone.querySelector('.card__category') as HTMLParagraphElement).textContent = elem.category;
      fragment.append(clone);
      wrapper.appendChild(fragment);
    }
  }
  generateCards (wrapper: HTMLDivElement):void {
    const cards = possibleCards.products;
    cards.forEach(e => this.createCard(wrapper, e));
  }
  createCard (wrapper: HTMLDivElement, elem: SimpleCard):void {  
    const card = document.createElement('div');
    card.classList.add('card');

    const cardH3 = document.createElement('h3');
    card.classList.add('card__title');
    cardH3.textContent = elem.title;
    card.append(cardH3);

    const cardDescrField = document.createElement('div');
    cardDescrField.classList.add('card__description-field');

    const cardCategory = document.createElement('p');
    cardCategory.textContent = elem.category;
    cardCategory.classList.add('card__category');
    cardDescrField.append(cardCategory);

    const cardBrand = document.createElement('p');
    cardBrand.textContent = elem.brand;
    cardBrand.classList.add('card__brand');
    cardDescrField.append(cardBrand);

    const cardPrice = document.createElement('p');
    cardPrice.textContent = elem.price + ' $';
    cardPrice.classList.add('card__price');
    cardDescrField.append(cardPrice);

    const cardDiscount = document.createElement('p');
    cardDiscount.textContent = elem.discountPercentage + ' $';
    cardDiscount.classList.add('card__discount');
    cardDescrField.append(cardDiscount);

    const cardRating = document.createElement('p');
    cardRating.textContent = elem.rating + ' $';
    cardRating.classList.add('card__rating');
    cardDescrField.append(cardRating);

    const cardStock = document.createElement('p');
    cardStock.textContent = elem.stock + '';
    cardStock.classList.add('card__Stock');
    cardDescrField.append(cardStock);

    card.append(cardDescrField);

    const cardBtnField = document.createElement ('div');
    cardBtnField.classList.add('card__buttons-field');

    const toCardBtn = document.createElement ('button');
    toCardBtn.classList.add('card__btn');
    toCardBtn.classList.add('card__to-cart-btn'); 
    toCardBtn.textContent = 'Add to cart';
    toCardBtn.addEventListener('click', e => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      if (target) {
        appStorage.addProductToCart(elem);
      }
    })

    cardBtnField.append(toCardBtn);
    card.append(cardBtnField);

    wrapper.append(card);
  }
}

export const mainPage = new MainPage();