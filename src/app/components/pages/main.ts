import { possibleCards } from '../../../assets/samples/possible-cards';
import { AbstractPage } from '../../abstracts/abstracts';
import { Cards } from '../storage/cards';
import { MainPageSettings } from '../../models/interfaces';
import { cardsAppearanceSearchParam } from '../../constants/constants';
import { CardsAppearance, UrlParamKey, CardsSortBy, RouterPath } from '../../enums/enums';
import { appRouter, cartPage } from '../router/router';
import { appDrawer } from '../drawer/drawer';


export class MainPage extends AbstractPage {
  mainPageSettings: MainPageSettings;
  cards: Cards;

  constructor() {
    super();
    this.setPageTitle('Shop Cart');
    this.mainPageSettings = {
      cardsAppearance: this.getCardsAppearance(),
      filterRange: {
        price: this.getValidNumberRangeValueFromUrl(UrlParamKey.Price),
        stock: this.getValidNumberRangeValueFromUrl(UrlParamKey.Stock),
      }
    }
    this.cards = new Cards(possibleCards.products, this.mainPageSettings.cardsAppearance, this.mainPageSettings.filterRange);
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
    cartPage.updateCartState();
    this.cards.updateProductsFilters();

    this.setPageTitle('Online Shop');
    const content = document.createElement('div');
    if (!localStorage.getItem('main-current-state')) localStorage.setItem('main-current-state', 'Table'); // table state at first page loading
    
    const mainWrapper = document.createElement('div');
    mainWrapper.classList.add('row');

    const contentWrapper = document.createElement('section');
    contentWrapper.classList.add('content-wrapper');
    contentWrapper.classList.add('col-9');

    const filtersWrapper = document.createElement('aside');
    filtersWrapper.classList.add('filters-wrapper');
    filtersWrapper.classList.add('col'); 

    const cardsWrapper = document.createElement('div');

    if (this.mainPageSettings.cardsAppearance === CardsAppearance.Table) {
      cardsWrapper.className = 'cards-wrapper row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4';
    }
    if (this.mainPageSettings.cardsAppearance === CardsAppearance.Row) {
      cardsWrapper.className = 'cards-wrapper row row-cols-1 g-4';
    }
    this.cards.generateCards(cardsWrapper);

    const sortingWrapper = document.createElement('div'); // generate sorting line
    sortingWrapper.classList.add('sorting-wrapper');

    const titleSort = document.createElement('span');
    titleSort.innerText = 'Sort by:';
    titleSort.classList.add('sort-item-title');

    const nameSortWrapper = document.createElement('div');
    nameSortWrapper.classList.add('inline-b');
    nameSortWrapper.classList.add('sorting-inner-wrapper');
    const nameSort = document.createElement('span');
    nameSort.innerText = 'name';
    nameSort.classList.add('sort-item');
    nameSortWrapper.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.TitleAsc);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.TitleAsc;
      this.cards.generateCards(cardsWrapper);
      //appRouter.updateUrlParams(UrlParamKey.)
    })

    const nameSortWrapperDesc = document.createElement('div');
    nameSortWrapperDesc.classList.add('inline-b');
    nameSortWrapperDesc.classList.add('sorting-inner-wrapper');
    const nameSortDesc = document.createElement('span');
    nameSortDesc.innerText = 'name';
    nameSortDesc.classList.add('sort-item');
    nameSortWrapperDesc.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.TitleDesc);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.TitleDesc;
      this.cards.generateCards(cardsWrapper);
    })

    const priceSortWrapper = document.createElement('div');
    priceSortWrapper.classList.add('inline-b');
    nameSortWrapper.classList.add('sorting-inner-wrapper');
    const priceSort = document.createElement('span');
    priceSort.innerText = 'price';
    priceSort.classList.add('sort-item');
    priceSortWrapper.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.PriceAsc);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.PriceAsc;
      this.cards.generateCards(cardsWrapper);
    })
    const priceSortWrapperDesc = document.createElement('div');
    priceSortWrapperDesc.classList.add('inline-b');
    nameSortWrapperDesc.classList.add('sorting-inner-wrapper');
    const priceSortDesc = document.createElement('span');
    priceSortDesc.innerText = 'price';
    priceSortDesc.classList.add('sort-item');
    priceSortWrapperDesc.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.PriceDesc);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.PriceDesc;
      this.cards.generateCards(cardsWrapper);
    })

    const ratingSortWrapper = document.createElement('div');
    ratingSortWrapper.classList.add('inline-b');
    nameSortWrapper.classList.add('sorting-inner-wrapper');
    const ratingSort = document.createElement('span');
    ratingSort.innerText = 'rating';
    ratingSort.classList.add('sort-item');
    ratingSortWrapper.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.RatingAsc);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.RatingAsc;
      this.cards.generateCards(cardsWrapper);
    })
    const ratingSortWrapperDesc = document.createElement('div');
    ratingSortWrapperDesc.classList.add('inline-b');
    nameSortWrapperDesc.classList.add('sorting-inner-wrapper');
    const ratingSortDesc = document.createElement('span');
    ratingSortDesc.innerText = 'rating';
    ratingSortDesc.classList.add('sort-item');
    ratingSortWrapperDesc.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.RatingDesc);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.RatingDesc;
      this.cards.generateCards(cardsWrapper);
    })

    sortingWrapper.append(titleSort);
    nameSortWrapper.append(nameSort);
    nameSortWrapper.append(this.getSVGAsc('name'));
    nameSortWrapperDesc.append(nameSortDesc);
    nameSortWrapperDesc.append(this.getSVGDesc('name'));
    sortingWrapper.append(nameSortWrapper);
    sortingWrapper.append(nameSortWrapperDesc);

    priceSortWrapper.append(priceSort);
    priceSortWrapper.append(this.getSVGAsc('price'))
    priceSortWrapperDesc.append(priceSortDesc);
    priceSortWrapperDesc.append(this.getSVGDesc('price'));
    sortingWrapper.append(priceSortWrapper);
    sortingWrapper.append(priceSortWrapperDesc);

    ratingSortWrapper.append(ratingSort);
    ratingSortWrapper.append(this.getSVGAsc('rating'))
    ratingSortWrapperDesc.append(ratingSortDesc);
    ratingSortWrapperDesc.append(this.getSVGDesc('rating'));
    sortingWrapper.append(ratingSortWrapper);
    sortingWrapper.append(ratingSortWrapperDesc);

    this.drawPageStateButtons(sortingWrapper);
    this.cards.generateFiltersField(filtersWrapper);

    contentWrapper.append(sortingWrapper);
    contentWrapper.append(cardsWrapper);
    mainWrapper.append(contentWrapper);
    mainWrapper.append(filtersWrapper);
    content.append(mainWrapper);
    appRouter.updatePageLinks();
    const searchBtn = document.querySelector('.btn-outline-secondary');
    const searchField = document.querySelector('.form-control') as HTMLInputElement;
    searchField.addEventListener('input', () => {
      doSearch(this.cards);
    })
    searchBtn?.addEventListener('click', () => {
      doSearch(this.cards);
    })
    function doSearch(obj: Cards) {
      appRouter.updateUrlParams(UrlParamKey.Search, searchField.value);
      obj.removeCards();
      obj.properties.searchProperty = searchField.value;
      obj.generateCards(cardsWrapper);
    }
    return content;
  }

  private drawPageStateButtons(parentElement: HTMLElement): void {
    const drawWrapper = document.createElement('div');
    drawWrapper.classList.add('inline-b');
    const resetSearchParamsButton = this.getResetFiltersButton();
    const copySearchParamsButton = this.getCopyFiltersButton();
    drawWrapper.append(resetSearchParamsButton, copySearchParamsButton);
    parentElement.append(drawWrapper);
  }

  private getResetFiltersButton(): HTMLElement {
    const resetBtn = appDrawer.getSimpleButton('Reset filters', 'btn btn-outline-secondary');

    resetBtn.addEventListener('click', () => {
      this.cards.removeCards();
      appRouter.navigate(RouterPath.Main);
      appRouter.handlePageContent(this.getPageContent());
    })

    return resetBtn;
  }

  private getCopyFiltersButton(): HTMLElement {
    const copyBtn = appDrawer.getSimpleButton('Copy link', 'btn btn-outline-primary');

    copyBtn.addEventListener('click', async () => {
      try {
        const location = window.location.href;
        await navigator.clipboard.writeText(location);
        copyBtn.innerHTML = 'Copied';
        window.setTimeout(() => {
          copyBtn.innerHTML = 'Copy filters';
        }, 2000)
      } catch (error) {
        console.error(error);
      }
    })

    return copyBtn;
  }
  private getSVGAsc(sortField: string) {
    const svgWrapper = document.createElement('span');
    svgWrapper.classList.add(`svg-wrap-${sortField}`);
    
    const svgAsc = document.createElement('span');
    svgAsc.classList.add(`svg-asc-${sortField}`);
    svgAsc.classList.add('inline-b');
    svgAsc.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 3H3V4H3.5V3ZM12.5 4C12.7761 4 13 3.77614 13 3.5C13 3.22386 12.7761 3 12.5 3V4ZM3.5 7H3V8H3.5V7ZM9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7V8ZM3.5 11H3V12H3.5V11ZM6.5 12C6.77614 12 7 11.7761 7 11.5C7 11.2239 6.77614 11 6.5 11V12ZM3.5 4H12.5V3H3.5V4ZM3.5 8H9.5V7H3.5V8ZM3.5 12H6.5V11H3.5V12Z" fill="#151528"></path></svg>
    `
    svgAsc.style.transform = 'rotate(0.5turn) translateY(-3px)';
    return svgAsc;
    
  }
  private getSVGDesc(sortField: string) {
    const svgDsc = document.createElement('span');
    svgDsc.classList.add(`svg-asc-${sortField}`);
    svgDsc.classList.add('inline-b');
    svgDsc.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 3H3V4H3.5V3ZM12.5 4C12.7761 4 13 3.77614 13 3.5C13 3.22386 12.7761 3 12.5 3V4ZM3.5 7H3V8H3.5V7ZM9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7V8ZM3.5 11H3V12H3.5V11ZM6.5 12C6.77614 12 7 11.7761 7 11.5C7 11.2239 6.77614 11 6.5 11V12ZM3.5 4H12.5V3H3.5V4ZM3.5 8H9.5V7H3.5V8ZM3.5 12H6.5V11H3.5V12Z" fill="#151528"></path></svg>
    `
    return svgDsc;
  }
}

// private generateSortingSVGs(sortField: string) {   <------ union of two prev functions
//   const svgWrapper = document.createElement('span');
//   svgWrapper.classList.add(`svg-wrap-${sortField}`);

//   const svgAsc = document.createElement('span');
//   svgAsc.classList.add(`svg-asc-${sortField}`);
//   svgAsc.classList.add('inline-b');
//   svgAsc.innerHTML = `
//     <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 3H3V4H3.5V3ZM12.5 4C12.7761 4 13 3.77614 13 3.5C13 3.22386 12.7761 3 12.5 3V4ZM3.5 7H3V8H3.5V7ZM9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7V8ZM3.5 11H3V12H3.5V11ZM6.5 12C6.77614 12 7 11.7761 7 11.5C7 11.2239 6.77614 11 6.5 11V12ZM3.5 4H12.5V3H3.5V4ZM3.5 8H9.5V7H3.5V8ZM3.5 12H6.5V11H3.5V12Z" fill="#151528"></path></svg>
//   `
//   svgAsc.style.transform = 'rotate(0.5turn) translateY(-3px)';
//   const svgDsc = document.createElement('span');
//   svgDsc.classList.add(`svg-asc-${sortField}`);
//   svgDsc.classList.add('inline-b');
//   svgDsc.classList.add('d-none');
//   svgDsc.innerHTML = `
//   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 3H3V4H3.5V3ZM12.5 4C12.7761 4 13 3.77614 13 3.5C13 3.22386 12.7761 3 12.5 3V4ZM3.5 7H3V8H3.5V7ZM9.5 8C9.77614 8 10 7.77614 10 7.5C10 7.22386 9.77614 7 9.5 7V8ZM3.5 11H3V12H3.5V11ZM6.5 12C6.77614 12 7 11.7761 7 11.5C7 11.2239 6.77614 11 6.5 11V12ZM3.5 4H12.5V3H3.5V4ZM3.5 8H9.5V7H3.5V8ZM3.5 12H6.5V11H3.5V12Z" fill="#151528"></path></svg>
//   `
//   svgWrapper.append(svgAsc);
//   svgWrapper.append(svgDsc);
//   return svgWrapper; }