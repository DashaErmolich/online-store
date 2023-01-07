import { SimpleCard, MainFilterProperties, FilterProperties } from '../../models/interfaces';
import { appRouter } from '../router/router';
import { UrlParamKey, CardsAppearance, CardsSortBy } from '../../enums/enums';
import { MainPageProductCard } from '../cart-product-cards/cart-product-card';
import { FILTERS_VALUES_SEPARATOR } from '../../constants/constants';

export class Cards {
  cards: SimpleCard[];
  cardsOnScreen: SimpleCard[];
  categories: string[];
  brands: string[];
  cardsAppearance: string;
  properties: MainFilterProperties;

  constructor (cards: SimpleCard[], cardsAppearance: string) { 
    this.cards = cards;
    this.cardsOnScreen = [];
    this.categories = [];
    this.brands = [];
    this.cardsAppearance = cardsAppearance;
    
    cards.forEach(element => {
      if (!this.categories.includes(element.category)) this.categories.push(element.category);
      if (!this.brands.includes(element.brand)) this.brands.push(element.brand);
    });
    //TODO: fill filter properties from query string
    this.properties = {
      sortProperty: this.getProductsSortValue(UrlParamKey.Sort),
      searchProperty: this.getProductsSearchValue(UrlParamKey.Search),
      filterProperty: {
        categoryProperties: this.getProductsFilterValues(UrlParamKey.Category),
        brandProperties: this.getProductsFilterValues(UrlParamKey.Brand),
      }
    }
  }

  private getProductsSortValue(key: UrlParamKey): CardsSortBy {
    const possibleValues: string[] = Object.values(CardsSortBy);
    const value = this.getValidStringValueFromUrl(key, possibleValues, CardsSortBy.Initial);
    console.log(value);
    
    if (!possibleValues.includes(value)) {
      appRouter.updateUrlParams(key, value);
    }

    if (value === CardsSortBy.Price) {
      return CardsSortBy.Price;
    } else if (value === CardsSortBy.Rating) {
      return CardsSortBy.Rating;
    } else if (value === CardsSortBy.Title) {
      return CardsSortBy.Title;
    } else {
      return CardsSortBy.Initial;
    }

  }

  private getProductsSearchValue(key: UrlParamKey): string {
    const value = appRouter.getUrlParamsValue(key);
    if (value) {
      return value
    } else {
      return '';
    }
  }

  private getValidStringValueFromUrl(urlParamsKey: UrlParamKey, possibleValues: string[], defaultValue: string): string {
    const value: string | undefined = appRouter.getUrlParamsValue(urlParamsKey);
    let myValue: string = defaultValue;
    
    if (value && !Number(value) && possibleValues.includes(value)) {
      myValue = value;
    }

    return myValue;
  }

  private getProductsFilterValues(key: UrlParamKey): string[] {
    const categoryProperties = appRouter.getUrlParamsValue(key);
    if (categoryProperties) {
      return categoryProperties.split(FILTERS_VALUES_SEPARATOR);
    } else {
      return [];
    }
  }

  public updateProductsFilters(): void {
    this.properties.filterProperty.brandProperties = this.getProductsFilterValues(UrlParamKey.Brand);
    this.properties.filterProperty.categoryProperties = this.getProductsFilterValues(UrlParamKey.Category);
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
      this.listenCardsAppearanceCheckBoxes(formInput, appearance);
        
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
      formUnit.classList.add('form-check-filters');

      const formInput = document.createElement('input');
      formInput.classList.add('form-check-input');
      formInput.type = 'checkbox';
      formInput.id = `${element.replace(/ /g,'')}`;

      if (this.properties.filterProperty.categoryProperties.includes(formInput.id) || this.properties.filterProperty.brandProperties.includes(formInput.id)) {
        formInput.checked = true;
      } else {
        formInput.checked = false;
      }

      formInput.addEventListener('click', () => { // fiters logic here
        const cardsW = document.querySelector('.cards-wrapper') as HTMLDivElement;
        
        if (formInput.checked) {

          console.log (element + ' checked');

          if (formInput.parentElement?.parentElement?.classList.contains('filters__category')) {
            appRouter.updateUrlParams(UrlParamKey.Category, formInput.id, true);

            this.properties.filterProperty.categoryProperties.push(element);
            this.removeCards();
            this.generateCards(cardsW);
          } else {
            appRouter.updateUrlParams(UrlParamKey.Brand, formInput.id, true);

            this.properties.filterProperty.brandProperties.push(element);
            this.removeCards();
            this.generateCards(cardsW);
          }
        }

        if (!formInput.checked) {
          console.log (element + ' not checked now');

          if (formInput.parentElement?.parentElement?.classList.contains('filters__category')) {

            appRouter.updateUrlParams(UrlParamKey.Category, formInput.id, false);

            this.properties.filterProperty.categoryProperties.splice(this.properties.filterProperty.categoryProperties.indexOf(element), 1);
            this.removeCards();
            this.generateCards(cardsW);
          } else {
            appRouter.updateUrlParams(UrlParamKey.Brand, formInput.id, false);

            this.properties.filterProperty.brandProperties.splice(this.properties.filterProperty.brandProperties.indexOf(element), 1);
            this.removeCards();
            this.generateCards(cardsW);
          }
        }
      })

      formUnit.append(formInput);

      const formLabel = document.createElement('label');
      formLabel.classList.add('form-check-label');
      formLabel.setAttribute('for', `${element.replace(/ /g,'')}`);
      formLabel.innerText = element;
      formUnit.append(formLabel);

      const formCounters = document.createElement('p'); //  counters initialisation here
      formCounters.classList.add('form-check-counter');
      formCounters.innerText = `(${countPages(this.cardsOnScreen)}/${countPages(this.cards)})`;
      formUnit.append(formCounters);

      filterUnit.append(formUnit);

      function countPages (arr: SimpleCard[]):number {
        let count = 0;
        arr.forEach(el => {
          if (el[type] === element) count += 1;
        });
        return count;
      }
    });
    wrapper.append(filterUnit);
  }

  sortBy(cards: SimpleCard[], property: CardsSortBy) {
    cards.sort(byField(property));
    function byField (field: CardsSortBy.Price | CardsSortBy.Rating | CardsSortBy.Title | CardsSortBy.Initial) {
      return (a: SimpleCard, b:SimpleCard) => a[field] >= b[field] ? 1 : -1;
    }
  }

  generateCards(wrapper: HTMLDivElement, properties = this.properties):void { //union of all sort properties
    properties.sortProperty ? this.sortBy(this.cards, properties.sortProperty) : this.sortBy(this.cards, CardsSortBy.Initial)
    this.cards.forEach(e => this.createCard(wrapper, e, properties.searchProperty, properties.filterProperty));

    // REALLY, REALLY BAD counters logic. Must make optimized one
    const filtersOnScreen = document.querySelectorAll('.form-check-filters') as NodeListOf<HTMLDivElement>;
    filtersOnScreen.forEach(filt => {
      let currCards = 0;
      this.cardsOnScreen.forEach(card => {
        if (card.category === (filt.firstElementChild?.nextElementSibling as HTMLLabelElement).innerText ||
        card.brand === (filt.firstElementChild?.nextElementSibling as HTMLLabelElement).innerText) currCards += 1;
      });
      (filt.lastElementChild as HTMLParagraphElement).innerText = '(' + currCards + (filt.lastElementChild as HTMLParagraphElement).innerText.slice(2);
    });
  }

  createCard (wrapper: HTMLDivElement, elem: SimpleCard, searchProp: string, filterProp: FilterProperties):void {  
    const productCard = new MainPageProductCard(elem, this.cardsAppearance);
    let card: HTMLElement;

    if (this.cardsAppearance === CardsAppearance.Row) {
      card = productCard.getRowCardContent()
    } else {
      card = productCard.getTableCardContent();
    }

    if (searchProp && !productCard.card.title.toLowerCase().startsWith(searchProp.toLowerCase())) {
      card.classList.add('d-none');
    } else {
      card.classList.remove('d-none');
    }

    //filter
    if (filterProp.categoryProperties.length > 0) {
      filterProp.categoryProperties.includes(elem.category) ? card.classList.remove('filtered') : card.classList.add('filtered');
    }
    if (filterProp.brandProperties.length > 0) {
      filterProp.brandProperties.includes(elem.brand) ? card.classList.remove('filtered') : card.classList.add('filtered');
    }
    if (filterProp.brandProperties.length > 0 && filterProp.categoryProperties.length > 0) {
      filterProp.brandProperties.includes(elem.brand) && filterProp.categoryProperties.includes(elem.category) ? card.classList.remove('filtered') : card.classList.add('filtered');
    }

    if (!card.classList.contains('filtered') && !card.classList.contains('d-none')) this.cardsOnScreen.push(elem);

    wrapper.append(card);
  }
  
  removeCards():void {
    this.cardsOnScreen = [];
    const cardsWrap = document.querySelector('.cards-wrapper');
    while(cardsWrap?.firstChild) {
      cardsWrap.removeChild(cardsWrap.firstChild);
    }
  }
  
  private listenCardsAppearanceCheckBoxes(formInput: HTMLInputElement, appearance: CardsAppearance): void {
    if (formInput.checked) {
      const cardsWrapper = document.querySelector('.cards-wrapper');

      if (cardsWrapper instanceof HTMLDivElement) {

        if (appearance === CardsAppearance.Row) {
          this.cardsAppearance = appearance;
          cardsWrapper.className = 'cards-wrapper row row-cols-1 g-4';   
        } else {
          this.cardsAppearance = appearance;
          cardsWrapper.className = 'cards-wrapper row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4';
        }

        this.removeCards();
        this.generateCards(cardsWrapper);
        appRouter.updateUrlParams(UrlParamKey.Appearance, appearance);
      }
    }
  }
}