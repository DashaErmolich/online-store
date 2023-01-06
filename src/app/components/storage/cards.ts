import { SimpleCard } from '../../models/interfaces';
import { appRouter } from '../router/router';
import { UrlParamKey, CardsAppearance } from '../../enums/enums';
import { MainPageProductCard } from '../cart-product-cards/cart-product-card';

export class Cards {
  cards: SimpleCard[];
  categories: string[];
  brands: string[];
  cardsAppearance: string;

  constructor (cards: SimpleCard[], cardsAppearance: string) { 
    this.cards = cards;
    this.categories = [];
    this.brands = [];
    this.cardsAppearance = cardsAppearance;
    
    cards.forEach(element => {
      if (!this.categories.includes(element.category)) this.categories.push(element.category);
      if (!this.brands.includes(element.brand)) this.brands.push(element.brand);
    });
  }
  generateFiltersField(wrapper: HTMLDivElement) { // generate appearance + filters
    const appearanceWrapper = document.createElement('div');
    appearanceWrapper.classList.add('filters__window');
    const appearanceTitle = document.createElement('h3');
    appearanceTitle.innerText = 'Appearance:';
    appearanceWrapper.append(appearanceTitle);
    const appearanceCheckers = document.createElement('div');
    appearanceCheckers.classList.add('filters__window-checkers');
    
    const cardsAppearances: CardsAppearance[] = Object.values(CardsAppearance);
    cardsAppearances.forEach((appearance) => {
      this.generateAppearanceCheckers(appearanceCheckers, appearance);
    })

    appearanceWrapper.append(appearanceCheckers);

    const filtersWrapper = document.createElement('div');
    filtersWrapper.classList.add('filters__filters');
    const filtersTitle = document.createElement('h3');
    filtersTitle.innerText = 'Filters:';
    filtersWrapper.append(filtersTitle);

    this.generateFiltersAndCategories(filtersWrapper, 'category', this.categories);
    this.generateFiltersAndCategories(filtersWrapper, 'brand', this.brands);

    wrapper.append(appearanceWrapper);
    wrapper.append(filtersWrapper);

  }
  generateAppearanceCheckers(wrapper: HTMLDivElement, appearance: CardsAppearance): void { //generate radio buttons
    const formWrapper = document.createElement('div');
    formWrapper.classList.add('form-check');

    const formInput = document.createElement('input');
    formInput.classList.add('form-check-input');
    formInput.type = 'radio';
    formInput.name = 'appearanceRadio';
    formInput.id = `appearanceRadio${appearance}`;

    if (this.cardsAppearance === appearance) {
      formInput.checked = true;
    }
    
    formInput.addEventListener('change', () => {
      if (formInput.checked) {
        const cardsWrapper = document.querySelector('.cards-wrapper');
        const singleCards = document.querySelectorAll('.mainCard');
        if (appearance === CardsAppearance.Row) {
          // cardsWrapper?.classList.add('cards-wrapper-row');
          // cardsWrapper?.classList.remove('cards-wrapper-table');
          if (cardsWrapper) {
            cardsWrapper.className = 'cards-wrapper cards-wrapper-row';
          }
          singleCards.forEach(singleCardWrapper => {
            singleCardWrapper?.classList.add('mainCard-row');
            singleCardWrapper?.classList.remove('mainCard-table');
          });
          
        }
        else {
          // cardsWrapper?.classList.add('cards-wrapper-table');
          // cardsWrapper?.classList.remove('cards-wrapper-row');
          if (cardsWrapper) {
            cardsWrapper.className = 'cards-wrapper row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4';
          }
          singleCards.forEach(singleCardWrapper => {
            singleCardWrapper?.classList.add('mainCard-table');
            singleCardWrapper?.classList.remove('mainCard-row');
          });
        }
        appRouter.updateUrlParams(UrlParamKey.Appearance, appearance);
      }
    })
    formWrapper.append(formInput);

    const formLabel = document.createElement('label');
    formLabel.classList.add('form-check-label');
    formLabel.setAttribute('for', `appearanceRadio${appearance}`);
    formLabel.innerText = appearance;
    formWrapper.append(formLabel);
    wrapper.append(formWrapper);
  }
  generateFiltersAndCategories(wrapper: HTMLDivElement, type: 'category' | 'brand', content: string[]):void { //generate checkboxes
    const filterUnit = document.createElement('div');
    filterUnit.classList.add(`filters__${type}`);

    const unitTitle = document.createElement('h6');
    unitTitle.classList.add('filters__category-title');
    unitTitle.innerText = type.charAt(0).toUpperCase() + type.slice(1);
    filterUnit.append(unitTitle);

    content.forEach(element => {
      const formUnit = document.createElement('div');
      formUnit.classList.add('form-check');

      const formInput = document.createElement('input');
      formInput.classList.add('form-check-input');
      formInput.type = 'checkbox';
      formInput.id = `${element.replace(/ /g,'')}`;
      formUnit.append(formInput);

      const formLabel = document.createElement('label');
      formLabel.classList.add('form-check-label');
      formLabel.setAttribute('for', `${element.replace(/ /g,'')}`);
      formLabel.innerText = element;
      formUnit.append(formLabel);

      filterUnit.append(formUnit);
    });
    wrapper.append(filterUnit);
  }

  generateCards (wrapper: HTMLDivElement): void {
    this.cards.forEach((e) => this.createCard(wrapper, e));
  }
  // createCard (wrapper: HTMLDivElement, elem: SimpleCard):void {  
  //   const card = document.createElement('div');
  //   card.classList.add('mainCard');

  //   const cardsAppearances: CardsAppearance[] = Object.values(CardsAppearance);
  //   cardsAppearances.forEach((appearance) => {
  //     if (this.cardsAppearance === appearance) {
  //       card.classList.add(`mainCard-${appearance}`)
  //     }
  //   })

  //   const cardH3 = document.createElement('h3');
  //   card.classList.add('card__title');
  //   cardH3.textContent = elem.title;
  //   card.append(cardH3);

  //   const cardDescrField = document.createElement('div');
  //   cardDescrField.classList.add('card__description-field');

  //   const cardCategory = document.createElement('p');
  //   cardCategory.textContent = elem.category;
  //   cardCategory.classList.add('card__category');
  //   cardDescrField.append(cardCategory);

  //   const cardBrand = document.createElement('p');
  //   cardBrand.textContent = elem.brand;
  //   cardBrand.classList.add('card__brand');
  //   cardDescrField.append(cardBrand);

  //   const cardPrice = document.createElement('p');
  //   cardPrice.textContent = elem.price + ' $';
  //   cardPrice.classList.add('card__price');
  //   cardDescrField.append(cardPrice);

  //   const cardDiscount = document.createElement('p');
  //   cardDiscount.textContent = elem.discountPercentage + ' $';
  //   cardDiscount.classList.add('card__discount');
  //   cardDescrField.append(cardDiscount);

  //   const cardRating = document.createElement('p');
  //   cardRating.textContent = elem.rating + ' $';
  //   cardRating.classList.add('card__rating');
  //   cardDescrField.append(cardRating);

  //   const cardStock = document.createElement('p');
  //   cardStock.textContent = elem.stock + '';
  //   cardStock.classList.add('card__Stock');
  //   cardDescrField.append(cardStock);

  //   card.append(cardDescrField);

  //   const cardBtnField = document.createElement ('div');
  //   cardBtnField.classList.add('card__buttons-field');

  //   const toCardBtn = document.createElement ('button');
  //   toCardBtn.classList.add('card__btn');
  //   toCardBtn.classList.add('card__to-cart-btn'); 
  //   toCardBtn.textContent = 'Add to cart';
  //   toCardBtn.addEventListener('click', e => {
  //     e.stopPropagation();
  //     const target = e.target as HTMLElement;
  //     if (target) {
  //       appStorage.addProductToCart(elem);
  //     }
  //   })

  //   cardBtnField.append(toCardBtn);
  //   card.append(cardBtnField);

  //   wrapper.append(card);
  // }

  createCard (wrapper: HTMLDivElement, elem: SimpleCard): void {
    const productCard = new MainPageProductCard(elem);
    wrapper.append(productCard.getCardContent());
  }
}