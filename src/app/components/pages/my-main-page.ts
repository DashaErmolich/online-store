import { AbstractPage } from '../../abstracts/abstracts';
import { CardsAppearance, UrlParamKey, CardsSortBy } from '../../enums/enums';
import { cardsAppearanceSearchParam, FILTERS_VALUES_SEPARATOR } from '../../constants/constants';
import { appRouter, cartPage } from '../router/router';
import { MainPageProductCard } from '../cart-product-cards/cart-product-card';
import { SimpleCard } from '../../models/interfaces';
import { appDrawer } from '../drawer/drawer';
import { productsFilter } from '../filter/filter';
import { possibleCards2 } from '../../../assets/samples/possible-cards2';
import { appStorage } from '../storage/app-storage';

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
    const value = this.getValidStringValueFromUrl(key, possibleValues, CardsSortBy.Title);
    
    if (!possibleValues.includes(value)) {
      appRouter.updateUrlParams(key, value);
    }

    if (value === CardsSortBy.Price) {
      return CardsSortBy.Price;
    } else if (value === CardsSortBy.Rating) {
      return CardsSortBy.Rating;
    } else {
      return CardsSortBy.Title;
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
    console.log(this.mainPageSettings.productsCards)

    this.setPageTitle('Online Shop');
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

    contentWrapper.append(cardsWrapper);

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
    return appStorage.getMainPageProducts();
  }

  private updateCardsToRender(): void {
    this.mainPageSettings.productsCategories = this.getProductsFilterValues(UrlParamKey.Category);
    this.mainPageSettings.productsBrands = this.getProductsFilterValues(UrlParamKey.Brand);
    this.mainPageSettings.productsCards = [];

    let result: SimpleCard[] = []
    let result2: SimpleCard[] = [];

    if (this.mainPageSettings.productsBrands.length) {
      possibleCards2.products.forEach((card: SimpleCard) => {
        if (this.mainPageSettings.productsBrands.includes(card.brand)) {
          result.push(card);
        }
      })
    } else {
      result = possibleCards2.products;
    }

    if (this.mainPageSettings.productsCategories.length) {
      result.forEach((card: SimpleCard) => {
        if (this.mainPageSettings.productsCategories.includes(card.category)) {
          result2.push(card);
        }
      })
    } else {
      result2 = result;
    }

    this.mainPageSettings.productsCards = result2;
    appStorage.setMainPageProducts(this.mainPageSettings.productsCards)
    //console.log(this.mainPageSettings.productsCards)

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
      })

      parentElement.append(checkbox, label);
      i++;
    }
  }

  private getTotalQty(item: string): number {
    return possibleCards2.products.filter((a: SimpleCard) => Object.values(a).includes(item)).length;
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
}