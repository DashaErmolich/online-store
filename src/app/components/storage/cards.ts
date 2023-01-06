import { MainFilterProperties, SimpleCard } from "../../models/interfaces";
import { appStorage } from '../storage/app-storage';

export class Cards {
  cards: SimpleCard[];
  categories: string[];
  brands: string[];
  properties: MainFilterProperties;

  constructor (cards: SimpleCard[]) { 
    this.cards = cards;
    this.categories = [];
    this.brands = [];
    cards.forEach(element => {
      if (!this.categories.includes(element.category)) this.categories.push(element.category);
      if (!this.brands.includes(element.brand)) this.brands.push(element.brand);
    });
    //TODO: fill filter properties from query string
    this.properties = {
      sortProperty: '',
      searchProperty: '',
      filterProperty: {
        categoryProperties: [],
        brandProperties: []
      }
    }
  }
  generateFiltersField(wrapper: HTMLDivElement) { // generate appearance + filters
    const appearanceWrapper = document.createElement('div');
    appearanceWrapper.classList.add('filters__window');
    const appearanceTitle = document.createElement('h3');
    appearanceTitle.innerText = 'Appearance:';
    appearanceWrapper.append(appearanceTitle);
    const appearanceCheckers = document.createElement('div');
    appearanceCheckers.classList.add('filters__window-checkers');
    this.generateAppearanceCheckers(appearanceCheckers, 'Row');
    this.generateAppearanceCheckers(appearanceCheckers, 'Table');
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
  generateAppearanceCheckers(wrapper: HTMLDivElement, appearance: 'Table' | 'Row'):void { //generate radio buttons
    const formWrapper = document.createElement('div');
    formWrapper.classList.add('form-check');

    const formInput = document.createElement('input');
    formInput.classList.add('form-check-input');
    formInput.type = 'radio';
    formInput.name = 'appearanceRadio';
    formInput.id = `appearanceRadio${appearance}`;
    if (localStorage.getItem('main-current-state') === appearance) formInput.checked = true;
    formInput.addEventListener('change', () => {
      if (formInput.checked) {
        const cardsWrapper = document.querySelector('.cards-wrapper');
        const singleCards = document.querySelectorAll('.mainCard');
        if (appearance === 'Row') {
          cardsWrapper?.classList.add('cards-wrapper-row');
          cardsWrapper?.classList.remove('cards-wrapper-table');
          singleCards.forEach(singleCardWrapper => {
            singleCardWrapper?.classList.add('mainCard-row');
            singleCardWrapper?.classList.remove('mainCard-table');
          });
          
        }
        else {
          cardsWrapper?.classList.add('cards-wrapper-table');
          cardsWrapper?.classList.remove('cards-wrapper-row');
          singleCards.forEach(singleCardWrapper => {
            singleCardWrapper?.classList.add('mainCard-table');
            singleCardWrapper?.classList.remove('mainCard-row');
          });
        }
        localStorage.setItem('main-current-state', appearance);
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
      formInput.addEventListener('click', () => {
        if (formInput.checked) console.log (formInput.id + ' checked')
        if (!formInput.checked) console.log (formInput.id + ' not checked now')
      })
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
  sortBy(cards: SimpleCard[], property: 'title' | 'price' | 'rating') {
    cards.sort(byField(property));
    function byField (field: 'title' | 'price' | 'rating') {
      return (a: SimpleCard, b:SimpleCard) => a[field] > b[field] ? 1 : -1;
    }
  }
  generateCards (wrapper: HTMLDivElement, properties = this.properties):void { //union of all sort properties
    if (properties.sortProperty) this.sortBy(this.cards, properties.sortProperty);
    this.cards.forEach(e => this.createCard(wrapper, e, properties.searchProperty));
  }   
  createCard (wrapper: HTMLDivElement, elem: SimpleCard, searchProp?: string):void {  
    const card = document.createElement('div');
    card.classList.add('mainCard');
    if (localStorage.getItem('main-current-state') === 'Table') card.classList.add('mainCard-table'); //loading stance from storage
    if (localStorage.getItem('main-current-state') === 'Row') card.classList.add('mainCard-row');

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

    if (searchProp && !cardH3.textContent.startsWith(searchProp)) card.classList.add('d-none');
    else card.classList.remove('d-none');

    card.append(cardBtnField);
    wrapper.append(card);
  }
  removeCards ():void {
    const cardsWrap = document.querySelector('.cards-wrapper');
    while(cardsWrap?.firstChild) {
      cardsWrap.removeChild(cardsWrap.firstChild);
    }
  }
}