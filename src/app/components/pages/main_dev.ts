import { AbstractPage } from '../../abstracts/abstracts';
import { CardsAppearance, UrlParamKey, CardsSortBy } from '../../enums/enums';
import { cardsAppearanceSearchParam, FILTERS_VALUES_SEPARATOR } from '../../constants/constants';
import { appRouter, cartPage } from '../router/router';
import { MainPageProductCard } from '../cart-product-cards/cart-product-card';
import { SimpleCard, NumberRange } from '../../models/interfaces';
import { appDrawer } from '../drawer/drawer';
import { productsFilter } from '../filter/filter';
import { DualHRangeBar } from 'dual-range-bar'
import { possibleCards } from '../../../assets/samples/possible-cards';

export class MyMain extends AbstractPage {

  mainPageSettings;

  constructor() {
    super();
    this.setPageTitle('Online Shop');
    this.mainPageSettings = {
      productsCards: this.getCards(),
      cardsAppearance: this.getCardsAppearance(),
      productsCategories: this.getProductsFilterValues(UrlParamKey.Category),
      productsBrands: this.getProductsFilterValues(UrlParamKey.Brand),
      searchProperty: this.getProductsSearchValue(UrlParamKey.Search),
      sortProperty: this.getProductsSortValue(UrlParamKey.Sort),
      priceRange: this.getValidNumberRangeValueFromUrl(UrlParamKey.Price),
      stockRange: this.getValidNumberRangeValueFromUrl(UrlParamKey.Stock),
    };
  }

  private getCardsAppearance(): string {
    const possibleValues: string[] = Object.values(CardsAppearance);
    const value = this.getValidStringValueFromUrl(cardsAppearanceSearchParam.key, possibleValues, cardsAppearanceSearchParam.defaultValue);
    
    if (!possibleValues.includes(value)) {
      appRouter.updateUrlParams(cardsAppearanceSearchParam.key, value);
    }
    
    return value;
  }

  private getProductsSortValue(key: UrlParamKey): CardsSortBy {
    const possibleValues: string[] = Object.values(CardsSortBy);
    const value = this.getValidStringValueFromUrl(key, possibleValues, CardsSortBy.TitleAsc);
    
    if (!possibleValues.includes(value)) {
      appRouter.updateUrlParams(key, value);
    }

    if (value === CardsSortBy.PriceAsc) {
      return CardsSortBy.PriceAsc;
    } else if (value === CardsSortBy.RatingAsc) {
      return CardsSortBy.RatingAsc;
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

  private getProductsFilterValues(key: UrlParamKey.Category | UrlParamKey.Brand): string[] {
    const categoryProperties = appRouter.getUrlParamsValue(key);
    if (categoryProperties) {
      return categoryProperties.split(FILTERS_VALUES_SEPARATOR);
    } else {
      return [];
    }
  }

  public getPageContent(): HTMLElement {
    cartPage.updateCartState();
    this.updateCardsToRender();

    const content = document.createElement('div');
    content.className = 'row';

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('content-wrapper');
    contentWrapper.classList.add('col-9');

    const filtersWrapper = document.createElement('div');
    filtersWrapper.id = 'main-filters-wrapper';
    filtersWrapper.classList.add('col'); 

    const cardsWrapper = document.createElement('div');
    cardsWrapper.id = 'main-cards-wrapper';

    if (this.mainPageSettings.cardsAppearance === CardsAppearance.Table) {
      cardsWrapper.className = 'row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4';
    }
    if (this.mainPageSettings.cardsAppearance === CardsAppearance.Row) {
      cardsWrapper.className = 'row row-cols-1 g-4';
    }

    const totalQty = appDrawer.getSimpleElement('p', 'mb-3');
    totalQty.id = 'find-products-qty';
    totalQty.innerHTML = `Products quantity: ${this.mainPageSettings.productsCards.length}`;

    contentWrapper.append(totalQty);
    
    const mainRangesWrapper = document.createElement('div');
    mainRangesWrapper.id = 'main-ranges-wrapper';

    contentWrapper.append(mainRangesWrapper)
    contentWrapper.append(cardsWrapper);

    this.drawRanges(mainRangesWrapper);
    this.drawCards(cardsWrapper);
    this.drawFilters(filtersWrapper);

    content.append(contentWrapper, filtersWrapper);
    return content;
  }

  private drawCards(parentElement: HTMLElement): void {
    let i = 0;
    const productsQty = this.mainPageSettings.productsCards.length;
    while (i < productsQty) {
      const card = new MainPageProductCard(this.mainPageSettings.productsCards[i], this.mainPageSettings.cardsAppearance);
      if (card) {
        parentElement.append(card.getTableCardContent());
        i++;
      }
    }
  }

  private getCards(): SimpleCard[] {
    return possibleCards.products;
  }

  private updateCardsToRender(): void {
    this.mainPageSettings.productsCategories = this.getProductsFilterValues(UrlParamKey.Category);
    this.mainPageSettings.productsBrands = this.getProductsFilterValues(UrlParamKey.Brand);
    this.mainPageSettings.priceRange = this.getValidNumberRangeValueFromUrl(UrlParamKey.Price),
    this.mainPageSettings.stockRange = this.getValidNumberRangeValueFromUrl(UrlParamKey.Stock),
    this.mainPageSettings.productsCards = [];

    let brandsResult: SimpleCard[] = []
    let categoryResult: SimpleCard[] = [];
    let priceResult: SimpleCard[] = [];
    let stockResult: SimpleCard[] = [];

    if (this.mainPageSettings.productsBrands.length) {
      possibleCards.products.forEach((card: SimpleCard) => {
        if (this.mainPageSettings.productsBrands.includes(card.brand)) {
          brandsResult.push(card);
        }
      })
    } else {
      brandsResult = possibleCards.products;
    }

    if (this.mainPageSettings.productsCategories.length) {
      brandsResult.forEach((card: SimpleCard) => {
        if (this.mainPageSettings.productsCategories.includes(card.category)) {
          categoryResult.push(card);
        }
      })
    } else {
      categoryResult = brandsResult;
    }

    if (this.mainPageSettings.priceRange === null) {
      this.mainPageSettings.priceRange = this.getCurrentNumberRange(UrlParamKey.Price, categoryResult);
    }

    if (this.mainPageSettings.priceRange) {
      categoryResult.forEach((card: SimpleCard) => {
        if (this.mainPageSettings.priceRange) {
          if (this.mainPageSettings.priceRange.min <= card.price && this.mainPageSettings.priceRange.max >= card.price) {
            priceResult.push(card);
          }
        }
      })
    } else {
      priceResult = categoryResult;
    }

    if (this.mainPageSettings.stockRange === null) {
      this.mainPageSettings.stockRange = this.getCurrentNumberRange(UrlParamKey.Stock, priceResult)
    }

    if (this.mainPageSettings.stockRange) {
      priceResult.forEach((card: SimpleCard) => {
        if (this.mainPageSettings.stockRange) {
          if (this.mainPageSettings.stockRange.min <= card.stock && this.mainPageSettings.stockRange.max >= card.stock) {
            stockResult.push(card);
          }
        }
      })
    } else {
      stockResult = priceResult;
    }

    this.mainPageSettings.productsCards = stockResult;
    //appStorage.setMainPageProducts(this.mainPageSettings.productsCards)

  }

  private drawFilters(parentElement: HTMLElement): void {
    const categoriesWrapper = appDrawer.getSimpleElement('div', 'mb-3');
    const brandsWrapper = appDrawer.getSimpleElement('div', 'mb-3');

    const allCategories = productsFilter.getFilterValuesList(UrlParamKey.Category);
    const allBrands = productsFilter.getFilterValuesList(UrlParamKey.Brand);

    this.drawCheckBoxes(categoriesWrapper, allCategories, this.mainPageSettings.productsCategories, UrlParamKey.Category);
    this.drawCheckBoxes(brandsWrapper, allBrands, this.mainPageSettings.productsBrands, UrlParamKey.Brand)
    
    parentElement.append(categoriesWrapper, brandsWrapper)
  }

  private drawCheckBoxes(parentElement: HTMLElement, allValues: string[], activeValues: string[], category: UrlParamKey.Brand | UrlParamKey.Category): void {
    let i = 0;

    while (i < allValues.length) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      const currentId = `${allValues[i]}`;
      checkbox.id = currentId;
      checkbox.name = category;
      const label = document.createElement('label');
      label.className = 'd-block';
      const totalProducts = this.getTotalQty(allValues[i]);
      const productsOnPageQty = this.getActiveQty(allValues[i]);
      label.innerHTML = `${allValues[i]} ${productsOnPageQty}/${totalProducts}`;
      label.htmlFor = currentId;

      activeValues.includes(allValues[i]) ? checkbox.checked = true : false;

      checkbox.addEventListener('change', () => {
        if (checkbox.name === UrlParamKey.Brand) {
          appRouter.updateUrlParams(UrlParamKey.Brand, checkbox.id, checkbox.checked);
        } else {
          appRouter.updateUrlParams(UrlParamKey.Category, checkbox.id, checkbox.checked);
        }

        this.renderNewCards();
        this.renderNewFilters();
        this.setProductsQty();
        this.renderNewRanges();
      })

      parentElement.append(checkbox, label);
      i++;
    }
  }

  private setProductsQty(): void {
    const totalQty = document.getElementById('find-products-qty');
    if (totalQty) {
      totalQty.innerHTML = `Products quantity: ${this.mainPageSettings.productsCards.length}`;
    }
  }

  private getTotalQty(item: string): number {
    return possibleCards.products.filter((a: SimpleCard) => Object.values(a).includes(item)).length;
  }

  private getActiveQty(item: string): number {
    return this.mainPageSettings.productsCards.filter((a: SimpleCard) => Object.values(a).includes(item)).length;
  }

  private renderNewCards() {
    this.updateCardsToRender();
    const wrapper = document.getElementById('main-cards-wrapper');
    if (wrapper) {
      wrapper.innerHTML = '';
      this.drawCards(wrapper);
    }
  }

  private renderNewFilters() {
    this.updateCardsToRender();
    const wrapper = document.getElementById('main-filters-wrapper');
    if (wrapper) {
      wrapper.innerHTML = '';
      this.drawFilters(wrapper);
    }
  }


  private drawRanges(parentElement: HTMLElement): void {
    const rangePriceWrap = document.createElement('ul');
    rangePriceWrap.className = 'position-relative w-100 my-3 list-group';
    rangePriceWrap.append(appDrawer.getSimpleElement('p', 'list-group-item', 'Price range'))

    const rangeStockWrap = document.createElement('ul');
    rangeStockWrap.className = 'position-relative w-100 my-3 list-group';
    rangeStockWrap.append(appDrawer.getSimpleElement('p', 'list-group-item', 'Stock range'))

    let priceRange;

    if (this.mainPageSettings.priceRange) {
      priceRange = this.getRange(rangePriceWrap, 'price-range', UrlParamKey.Price, this.mainPageSettings.priceRange);
    }

    let stockRange;

    if (this.mainPageSettings.stockRange) {
      stockRange = this.getRange(rangeStockWrap, 'stock-range', UrlParamKey.Stock, this.mainPageSettings.stockRange);
    }

    if (priceRange && stockRange) {
      parentElement.append(priceRange, stockRange);
    }
  }

  private getRange(parentElement: HTMLElement, id: string, filter: UrlParamKey.Price | UrlParamKey.Stock, activeRange: NumberRange): HTMLElement {
    const container = document.createElement('div');
    container.className = 'drbar-container list-group-item';
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
    });
    const values = appDrawer.getSimpleElement('div', 'list-group-item')

    const minVal = appDrawer.getSimpleElement('p', '', `${dualRange.lower}`);
    minVal.id = `${filter}-range-min`;
    const maxVal = appDrawer.getSimpleElement('p', '', `${dualRange.upper}`);
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

      appRouter.updateUrlParams(filter, {min: Math.round(dualRange.lower), max: Math.round(dualRange.upper)});
      this.renderNewCards();
      this.renderNewFilters();
      this.setProductsQty();

    })

    values.append(minVal, maxVal);

    parentElement.append(container, values);
    return parentElement;
  }

  private renderNewRanges(): void {
    this.updateCardsToRender();
    const wrapper = document.getElementById('main-ranges-wrapper');
    if (wrapper) {
      wrapper.innerHTML = '';
      this.drawRanges(wrapper);
    }
  }

  private getCurrentNumberRange(key: UrlParamKey.Price | UrlParamKey.Stock, arr: SimpleCard[]): NumberRange {
    return productsFilter.getFilterRange(key, arr);
  }
}
