import { SimpleCard, MainFilterProperties, FilterProperties, ProductFilterRange, NumberRange } from '../../models/interfaces';
import { appRouter, mainPage } from '../router/router';
import { UrlParamKey, CardsAppearance, CardsSortBy, CardsSortPossibleFields } from '../../enums/enums';
import { MainPageProductCard } from '../cart-product-cards/cart-product-card';
import { FILTERS_VALUES_SEPARATOR } from '../../constants/constants';
import { appDrawer } from '../drawer/drawer';
import { productsFilter } from '../filter/filter';
import { DualHRangeBar } from 'dual-range-bar';
import mainBgImage from 'appIcons/confused-travolta.svg';

export class Cards {
  cards: SimpleCard[];
  cardsOnScreen: SimpleCard[];
  categories: string[];
  brands: string[];
  cardsAppearance: string;
  filterRange: ProductFilterRange;
  properties: MainFilterProperties;

  constructor (cards: SimpleCard[], cardsAppearance: string, filterRange: ProductFilterRange) { 
    this.cards = cards;
    this.cardsOnScreen = [];
    this.categories = [];
    this.brands = [];
    this.cardsAppearance = cardsAppearance;
    this.filterRange = filterRange;
    
    cards.forEach(element => {
      if (!this.categories.includes(element.category)) this.categories.push(element.category);
      if (!this.brands.includes(element.brand)) this.brands.push(element.brand);
    });

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
    
    if (!possibleValues.includes(value)) {
      appRouter.updateUrlParams(key, value);
    }

    switch (value) {
      case CardsSortBy.PriceAsc:
        return CardsSortBy.PriceAsc;
      case CardsSortBy.PriceDesc:
        return CardsSortBy.PriceDesc;
      case CardsSortBy.TitleAsc:
        return CardsSortBy.TitleAsc;
      case CardsSortBy.TitleDesc:
        return CardsSortBy.TitleDesc; 
      case CardsSortBy.RatingAsc:
        return CardsSortBy.RatingAsc;
      case CardsSortBy.RatingDesc:
        return CardsSortBy.RatingDesc;
      default:
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
    this.removeCards();
  }

  generateFiltersField(wrapper: HTMLElement) { // generate appearance + filters
    const appearanceWrapper = document.createElement('div');
    appearanceWrapper.className = 'filters__window mb-3 p-3';
    const appearanceCheckers = document.createElement('div');
    appearanceCheckers.classList.add('filters__window-checkers');
    
    const cardsAppearances: CardsAppearance[] = Object.values(CardsAppearance);
    cardsAppearances.forEach((appearance) => {
      this.generateAppearanceCheckers(appearanceCheckers, appearance);
    })

    appearanceWrapper.append(appearanceCheckers);

    const productsOnPageQty = appDrawer.getSimpleElement('span', 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger');
    productsOnPageQty.innerHTML = `${this.cardsOnScreen.length}`;
    productsOnPageQty.id = 'main-products-qty';

    const filtersWrapper = document.createElement('div');
    filtersWrapper.id = 'main-products-filters'
    filtersWrapper.className = 'filters__filters p-3 mb-3';
    const filtersTitle = document.createElement('h3');
    filtersTitle.className = 'position-relative';
    filtersTitle.innerText = 'Filters: ';
    filtersTitle.append(productsOnPageQty)
    filtersWrapper.append(filtersTitle);

    this.generateFiltersAndCategories(filtersWrapper, 'category', this.categories);
    this.generateFiltersAndCategories(filtersWrapper, 'brand', this.brands);

    this.drawFilterRanges(filtersWrapper);

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
    formLabel.id = `radio-label-${appearance}`;
    formWrapper.append(formLabel);
    wrapper.append(formWrapper);
  }
  
  generateFiltersAndCategories(wrapper: HTMLDivElement, type: 'category' | 'brand', content: string[]):void { //generate checkboxes
    const filterWrapper = appDrawer.getSimpleElement('div', 'mb-4');

    const filterUnit = document.createElement('div');
    filterUnit.className = `filters__${type} overflow-scroll filter-category`;

    const unitTitle = document.createElement('h6');
    unitTitle.classList.add('filters__category-title');
    unitTitle.innerText = type.charAt(0).toUpperCase() + type.slice(1);
    filterWrapper.append(unitTitle);

    content.forEach(element => {
      const formUnit = document.createElement('div');
      formUnit.className = 'form-check form-check-filters d-flex justify-content-between';

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


          if (formInput.parentElement?.parentElement?.classList.contains('filters__category')) {
            appRouter.updateUrlParams(UrlParamKey.Category, formInput.id, true);

            this.properties.filterProperty.categoryProperties.push(element);
            this.removeCards();
            this.generateCards(cardsW);
            this.drawNewFilterRanges();
          } else {
            appRouter.updateUrlParams(UrlParamKey.Brand, formInput.id, true);

            this.properties.filterProperty.brandProperties.push(element);
            this.removeCards();
            this.generateCards(cardsW);
            this.drawNewFilterRanges();
          }
        }

        if (!formInput.checked) {

          if (formInput.parentElement?.parentElement?.classList.contains('filters__category')) {

            appRouter.updateUrlParams(UrlParamKey.Category, formInput.id, false);

            this.properties.filterProperty.categoryProperties.splice(this.properties.filterProperty.categoryProperties.indexOf(element), 1);
            this.removeCards();
            this.generateCards(cardsW);
            this.drawNewFilterRanges();
          } else {
            appRouter.updateUrlParams(UrlParamKey.Brand, formInput.id, false);

            this.properties.filterProperty.brandProperties.splice(this.properties.filterProperty.brandProperties.indexOf(element), 1);
            this.removeCards();
            this.generateCards(cardsW);
            this.drawNewFilterRanges();
          }
        }
      })

      formUnit.append(formInput);

      const formLabel = document.createElement('label');
      formLabel.className = 'form-check-label flex-grow-1 ps-1 one-line-text';
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

    filterWrapper.append(filterUnit)
    wrapper.append(filterWrapper);
  }

  sortBy(cards: SimpleCard[], property: CardsSortBy) {

    const sortingField = property === CardsSortBy.Initial ? 'id' : property.split('-')[0];
    const sortingMethod = property === CardsSortBy.Initial ? 'asc' : property.split('-')[1];

    if (sortingField === CardsSortPossibleFields.Initial ||
    sortingField === CardsSortPossibleFields.Price ||
    sortingField === CardsSortPossibleFields.Rating ||
    sortingField === CardsSortPossibleFields.Title) {
      cards.sort(byField(sortingField, sortingMethod))
    }
    
    function byField (field: CardsSortPossibleFields, method: string) {
      if (method === 'asc') return (a: SimpleCard, b:SimpleCard) => a[field] >= b[field] ? 1 : -1;
      if (method === 'desc') return (a: SimpleCard, b:SimpleCard) => a[field] <= b[field] ? 1 : -1;
    }
  }

  private renderCards(parentElement: HTMLElement): void {
    if (this.cardsOnScreen.length) {
      this.cardsOnScreen.forEach((card: SimpleCard) => {
        const productCard = new MainPageProductCard(card, this.cardsAppearance);
        
        let myCard: HTMLElement;
    
        if (this.cardsAppearance === CardsAppearance.Row) {
          myCard = productCard.getRowCardContent()
        } else {
          myCard = productCard.getTableCardContent();
        }
        parentElement.append(myCard);
      })
    } else {
      const message = this.getNoProductCards();
      parentElement.append(message);
    }

  }

  public getNoProductCards(): HTMLElement {
    const wrapper = appDrawer.getSimpleElement('div', 'd-flex flex-column align-items-center m-auto mt-5 w-100');
    const message = appDrawer.getSimpleElement('h2', 'mb-4')
    message.innerText = 'Nothing was found.';
    const img = appDrawer.getProductCardImage('img', mainBgImage, 'w-25 mb-4');
    wrapper.append(img, message);
    return wrapper;
  }

  generateCards(wrapper: HTMLDivElement, properties = this.properties):void { //union of all sort properties
    properties.sortProperty ? this.sortBy(this.cards, properties.sortProperty) : this.sortBy(this.cards, CardsSortBy.Initial)
    properties.sortProperty ? this.sortBy(this.cards, properties.sortProperty) : this.sortBy(this.cards, CardsSortBy.Initial)
    this.cards.forEach(e => this.createCard(wrapper, e, properties.searchProperty, properties.filterProperty));
    this.filterCardsByRanges();
    this.renderCards(wrapper);

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
    this.updateProductsQty();
    this.updateFilerRanges();
  }

  private filterCardsByRanges(): void {
    const currentCards: SimpleCard[] = this.cardsOnScreen;
    let priceFilterCards: SimpleCard[] = [];
    let stockFilterCards: SimpleCard[] = [];

    this.filterRange.price = mainPage.getValidNumberRangeValueFromUrl(UrlParamKey.Price);
    this.filterRange.stock = mainPage.getValidNumberRangeValueFromUrl(UrlParamKey.Stock);
    
    if (this.filterRange.price === null) {
      this.filterRange.price = productsFilter.getFilterRange(UrlParamKey.Price, currentCards);
    } else {
      if (this.filterRange.price.min < 0 || !Number(this.filterRange.price.min)) {
        this.filterRange.price.min = productsFilter.getFilterRange(UrlParamKey.Price, currentCards).min;
      }
  
      if (this.filterRange.price.max < 0 || !Number(this.filterRange.price.max)) {
        this.filterRange.price.max = productsFilter.getFilterRange(UrlParamKey.Price, currentCards).max;
      }
      appRouter.updateUrlParams(UrlParamKey.Price, this.filterRange.price);
    }





    if (this.filterRange.price) {
      currentCards.forEach((card: SimpleCard) => {
        if (this.filterRange.price) {
          if (this.filterRange.price.min <= card.price && this.filterRange.price.max >= card.price) {
            priceFilterCards.push(card);
          }
        }
      })
    } else {
      priceFilterCards = currentCards;
    }

    if (this.filterRange.stock === null) {
      this.filterRange.stock = productsFilter.getFilterRange(UrlParamKey.Stock, priceFilterCards);
    } else {
      if (this.filterRange.stock.min < 0 || !Number(this.filterRange.stock.min)) {
        this.filterRange.stock.min = productsFilter.getFilterRange(UrlParamKey.Stock, priceFilterCards).min;
      }
  
      if (this.filterRange.stock.max < 0 || !Number(this.filterRange.stock.max)) {
        this.filterRange.stock.max = productsFilter.getFilterRange(UrlParamKey.Stock, priceFilterCards).max;
      }
      appRouter.updateUrlParams(UrlParamKey.Stock, this.filterRange.stock)
    }





    if (this.filterRange.stock) {
      priceFilterCards.forEach((card: SimpleCard) => {
        if (this.filterRange.stock) {
          if (this.filterRange.stock.min <= card.stock && this.filterRange.stock.max >= card.stock) {
            stockFilterCards.push(card);
          }
        }
      })
    } else {
      stockFilterCards = priceFilterCards;
    }

    this.cardsOnScreen = stockFilterCards;
  }

  public updateProductsQty(): void {
    const productsQty = document.getElementById('main-products-qty');
    if (productsQty) {
      productsQty.innerHTML = `${this.cardsOnScreen.length}`;
    }
  }
  

  createCard (wrapper: HTMLDivElement, elem: SimpleCard, searchProp: string, filterProp: FilterProperties):void {  
    const productCard = new MainPageProductCard(elem, this.cardsAppearance);
    let card: HTMLElement;

    if (this.cardsAppearance === CardsAppearance.Row) {
      card = productCard.getRowCardContent()
    } else {
      card = productCard.getTableCardContent();
    }

    if (searchProp && !productCard.card.title.toLowerCase().startsWith(searchProp.toLowerCase()) 
    && !productCard.card.brand.toLowerCase().startsWith(searchProp.toLowerCase()) 
    && !productCard.card.category.toLowerCase().startsWith(searchProp.toLowerCase())
    && !productCard.card.price.toString().startsWith(searchProp.toLowerCase())
    && !productCard.card.stock.toString().startsWith(searchProp.toLowerCase())
    && !productCard.card.rating.toString().startsWith(searchProp.toLowerCase())
    && !productCard.card.discountPercentage.toString().startsWith(searchProp.toLowerCase())
    && !productCard.card.description.toLowerCase().startsWith(searchProp.toLowerCase())) {
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

    // if (this.filterRange.price !== null && !card.classList.contains('filtered')) {
    //   this.filterRange.price.min <= elem.price && this.filterRange.price.max >= elem.price ? card.classList.remove('filtered') : card.classList.add('filtered');
    // }

    // if (this.filterRange.stock !== null && !card.classList.contains('filtered')) {
    //   this.filterRange.stock.min <= elem.stock && this.filterRange.stock.max >= elem.stock ? card.classList.remove('filtered') : card.classList.add('filtered');
    // } 

    if (!card.classList.contains('filtered') && !card.classList.contains('d-none')) this.cardsOnScreen.push(elem);

    //wrapper.append(card);
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

  private generateFiltersRange(parentElement: HTMLElement, id: string, filter: UrlParamKey.Price | UrlParamKey.Stock, range: NumberRange): void {
    document.getElementById(`filters__${id}`)?.remove();

    const rangeWrap = document.createElement('div');
    rangeWrap.className = 'mb-4';
    rangeWrap.id = `filters__${id}`
    rangeWrap.append(appDrawer.getSimpleElement('h6', 'filters__category-title text-capitalize mb-3', id.split('-')[0]))

    const filterRangeElement = this.getRange(rangeWrap, id, filter, range);

    parentElement.append(filterRangeElement);
  }

  private getRange(parentElement: HTMLElement, id: string, filter: UrlParamKey.Price | UrlParamKey.Stock, activeRange: NumberRange): HTMLElement {
    const rangeWrap = appDrawer.getSimpleElement('div', 'mb-3')
    const container = document.createElement('div');
    container.className = 'drbar-container position-relative';
    container.id = id;

    const leftSide = Math.round(productsFilter.getFilterRange(filter).min);
    const rightSide = Math.round(productsFilter.getFilterRange(filter).max);
    const currentMin = Math.round(activeRange.min);
    const currentMax = Math.round(activeRange.max);

    const dualRange = new DualHRangeBar(container, {
      lowerBound: leftSide,
      lower: currentMin,
      upperBound: rightSide,
      upper: currentMax,
      minSpan: 1,
      rangeColor: '#0D6EFD',
      rangeActiveColor: '#0056E0',
      bgColor: '#fff',
      sliderColor: '#0040C3',
      sliderActiveColor: '#002AA7',
    });

    const values = appDrawer.getSimpleElement('div', 'row row-cols-3 text-center')

    const minVal = appDrawer.getSimpleElement('span', 'col p-1', `${Math.round(dualRange.lower)}`);
    minVal.id = `${filter}-range-min`;
    const separator = appDrawer.getSimpleElement('span', 'col p-1', `${FILTERS_VALUES_SEPARATOR}`);
    separator.classList.add('rotate-90-deg')
    const maxVal = appDrawer.getSimpleElement('span', 'col p-1', `${Math.round(dualRange.upper)}`);
    maxVal.id = `${filter}-range-max`;

    dualRange.addEventListener('update', () => {
      const min = document.querySelector(`#${filter}-range-min`);
      if (min) {
        min.innerHTML = `${Math.round(dualRange.lower)}`;
      }

      const max = document.querySelector(`#${filter}-range-max`);
      if (max) {
        max.innerHTML = `${Math.round(dualRange.upper)}`;
      }

      const newRange = {
        min: Math.round(dualRange.lower),
        max: Math.round(dualRange.upper),
      }

      appRouter.updateUrlParams(filter, newRange);
      //this.setFilterRangeValue(filter, newRange);

      const cardsWrapper = document.querySelector('.cards-wrapper');
      if (cardsWrapper instanceof HTMLDivElement) {
        this.removeCards();
        this.generateCards(cardsWrapper);
      }
    })

    values.append(minVal, separator, maxVal);
    rangeWrap.append(container)
    parentElement.append(rangeWrap, values);
    return parentElement;
  }


  private drawFilterRanges(parentElement: HTMLElement): void {
    if (this.filterRange.price !== null) {
      this.generateFiltersRange(parentElement, 'price-range', UrlParamKey.Price, this.filterRange.price);
    }

    if (this.filterRange.stock !== null) {
      this.generateFiltersRange(parentElement, 'stock-range', UrlParamKey.Stock, this.filterRange.stock);
    }

  }


  public drawNewFilterRanges(): void {
    const filters = document.getElementById('main-products-filters');
    if (filters) {
      this.drawFilterRanges(filters);
    }
  }

  private updateFilerRanges(): void {
    this.filterRange.price = mainPage.getValidNumberRangeValueFromUrl(UrlParamKey.Price);
    
    if (this.filterRange.price === null) {
      this.filterRange.price = productsFilter.getFilterRange(UrlParamKey.Price, this.cardsOnScreen);
    }

    this.filterRange.stock = mainPage.getValidNumberRangeValueFromUrl(UrlParamKey.Stock);
    
    if (this.filterRange.stock === null) {
      this.filterRange.stock = productsFilter.getFilterRange(UrlParamKey.Stock, this.cardsOnScreen);
    }
  }
}