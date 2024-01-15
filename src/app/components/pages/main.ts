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
    this.mainPageSettings.cardsAppearance =  this.getCardsAppearance();
    this.cards.cardsAppearance =  this.getCardsAppearance();
    this.setSearchInputValue();
    //this.cards.properties.sortProperty = CardsSortBy.Initial;
    document.getElementById('header-search-input')?.classList.remove('d-none');

    this.setPageTitle('Online Shop');
    const content = document.createElement('div');
    if (!localStorage.getItem('main-current-state')) localStorage.setItem('main-current-state', 'Table'); // table state at first page loading
    
    const mainWrapper = document.createElement('div');
    mainWrapper.classList.add('row');

    const contentWrapper = document.createElement('section');
    contentWrapper.className = 'content-wrapper col-lg-9 order-2';

    const filtersCollapseBtnWrapper = appDrawer.getSimpleElement('div', 'container');
    const filtersCollapseBtn = appDrawer.getSimpleElement('button', 'btn btn-outline-secondary mb-3 w-100', 'Show filters');
    filtersCollapseBtn.id = 'filters-collapse-button';
    filtersCollapseBtn.setAttribute('data-bs-toggle', 'collapse');
    filtersCollapseBtn.setAttribute('data-bs-target', '#filters-collapse');
    filtersCollapseBtn.setAttribute('aria-expanded', 'false');
    filtersCollapseBtnWrapper.append(filtersCollapseBtn)


    filtersCollapseBtn.addEventListener('click', () => {
      if (filtersCollapseBtn.innerHTML === 'Show filters') {
        filtersCollapseBtn.innerHTML = 'Hide filters';
      } else if (filtersCollapseBtn.innerHTML === 'Hide filters') {
        filtersCollapseBtn.innerHTML = 'Show filters';
      }
    })

    const filtersWrapper = document.createElement('aside');
    filtersWrapper.className = 'filters-wrapper col order-1';
    filtersWrapper.id = 'filters-collapse';

    if (window.innerWidth <= 992) {
      filtersCollapseBtn.classList.remove('d-none');
      filtersWrapper.classList.add('collapse');
    } else {
      filtersCollapseBtn.classList.add('d-none')
      filtersCollapseBtn.classList.remove('collapse')
    }

    const cardsWrapper = document.createElement('div');

    if (this.mainPageSettings.cardsAppearance === CardsAppearance.Table) {
      cardsWrapper.className = 'cards-wrapper row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4';
    }
    if (this.mainPageSettings.cardsAppearance === CardsAppearance.Row) {
      cardsWrapper.className = 'cards-wrapper row row-cols-1 g-4';
    }
    this.cards.generateCards(cardsWrapper);

    const sortingWrapper = document.createElement('div'); // generate sorting line
    sortingWrapper.className = 'btn-group w-100 mb-3 d-flex flex-wrap';
    sortingWrapper.setAttribute('role', 'group')

    const nameSortWrapperLabel = appDrawer.getSortLabel('name-down', 'Name', 'btn btn-outline-secondary bi bi-sort-alpha-down');
    const nameSortWrapper = appDrawer.getSortButton('name-down');
    if (this.cards.properties.sortProperty === CardsSortBy.TitleAsc) {
      nameSortWrapper.checked = true;
    }
    nameSortWrapper.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.TitleAsc);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.TitleAsc;
      this.cards.generateCards(cardsWrapper);
    })

    const nameSortWrapperDescLabel = appDrawer.getSortLabel('name-up', 'Name', 'btn btn-outline-secondary bi bi-sort-alpha-up');
    const nameSortWrapperDesc = appDrawer.getSortButton('name-up');
    if (this.cards.properties.sortProperty === CardsSortBy.TitleDesc) {
      nameSortWrapperDesc.checked = true;
    }
    nameSortWrapperDesc.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.TitleDesc);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.TitleDesc;
      this.cards.generateCards(cardsWrapper);
    })

    const priceSortWrapperLabel = appDrawer.getSortLabel('price-up', 'Price', 'btn btn-outline-secondary bi bi-sort-up');
    const priceSortWrapper = appDrawer.getSortButton('price-up');
    if (this.cards.properties.sortProperty === CardsSortBy.PriceAsc) {
      priceSortWrapper.checked = true;
    }
    priceSortWrapper.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.PriceAsc);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.PriceAsc;
      this.cards.generateCards(cardsWrapper);
    })

    const priceSortWrapperDescLabel = appDrawer.getSortLabel('price-down', 'Price', 'btn btn-outline-secondary bi bi-sort-down');
    const priceSortWrapperDesc = appDrawer.getSortButton('price-down');
    if (this.cards.properties.sortProperty === CardsSortBy.PriceDesc) {
      priceSortWrapperDesc.checked = true;
    }
    priceSortWrapperDesc.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.PriceDesc);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.PriceDesc;
      this.cards.generateCards(cardsWrapper);
    })

    const ratingSortWrapperLabel = appDrawer.getSortLabel('rating-up', 'Rating', 'btn btn-outline-secondary bi bi-sort-up');
    const ratingSortWrapper = appDrawer.getSortButton('rating-up');
    if (this.cards.properties.sortProperty === CardsSortBy.RatingAsc) {
      ratingSortWrapper.checked = true;
    }
    ratingSortWrapper.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.RatingAsc);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.RatingAsc;
      this.cards.generateCards(cardsWrapper);
    })

    const ratingSortWrapperDescLabel = appDrawer.getSortLabel('rating-down', 'Rating', 'btn btn-outline-secondary bi bi-sort-down');
    const ratingSortWrapperDesc = appDrawer.getSortButton('rating-down');
    if (this.cards.properties.sortProperty === CardsSortBy.RatingDesc) {
      ratingSortWrapperDesc.checked = true;
    }
    ratingSortWrapperDesc.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.RatingDesc);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.RatingDesc;
      this.cards.generateCards(cardsWrapper);
    })

    sortingWrapper.append(nameSortWrapper, nameSortWrapperLabel);
    sortingWrapper.append(nameSortWrapperDesc, nameSortWrapperDescLabel);

    sortingWrapper.append(priceSortWrapper, priceSortWrapperLabel);
    sortingWrapper.append(priceSortWrapperDesc, priceSortWrapperDescLabel);

    sortingWrapper.append(ratingSortWrapper, ratingSortWrapperLabel);
    sortingWrapper.append(ratingSortWrapperDesc, ratingSortWrapperDescLabel);

    this.drawPageStateButtons(filtersWrapper);
    this.cards.generateFiltersField(filtersWrapper);

    contentWrapper.append(sortingWrapper);

    contentWrapper.append(cardsWrapper);
    mainWrapper.append(contentWrapper);
    mainWrapper.append(filtersCollapseBtnWrapper, filtersWrapper);
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
      obj.drawNewFilterRanges();
    }
    this.listenResizeForCollapse();
    return content;
  }

  private drawPageStateButtons(parentElement: HTMLElement): void {
    const drawWrapper = document.createElement('div');
    drawWrapper.className = 'btn-group w-100 mb-3';
    drawWrapper.setAttribute('role', 'group')
    const resetSearchParamsButton = this.getResetFiltersButton();
    const copySearchParamsButton = this.getCopyFiltersButton();
    drawWrapper.append(resetSearchParamsButton, copySearchParamsButton);
    parentElement.append(drawWrapper);
  }

  private getResetFiltersButton(): HTMLElement {
    const resetBtn = appDrawer.getSimpleButton('Reset filters', 'btn btn-outline-secondary');

    resetBtn.addEventListener('click', () => {
      this.clearSearchInput();
      this.cards.properties.sortProperty = CardsSortBy.Initial;
      this.cards.removeCards();
      appRouter.navigate(RouterPath.Main);
      appRouter.handlePageContent(this.getPageContent());
    })

    return resetBtn;
  }

  private getCopyFiltersButton(): HTMLElement {
    const copyBtn = appDrawer.getSimpleButton('Copy link', 'btn btn-outline-secondary');

    copyBtn.addEventListener('click', async () => {
      try {
        const location = window.location.href;
        await navigator.clipboard.writeText(location);
        copyBtn.innerHTML = 'Copied';
        window.setTimeout(() => {
          copyBtn.innerHTML = 'Copy link';
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

  private listenResizeForCollapse(): void {
    const collapseFilters = '(max-width: 992px)';
    const mediaQueryList = window.matchMedia(collapseFilters);

    mediaQueryList.addEventListener('change', (event) => {
      if (event.matches) {
        document.getElementById('filters-collapse')?.classList.toggle('collapse');
        document.getElementById('filters-collapse-button')?.classList.toggle('d-none');
      } else {
        document.getElementById('filters-collapse')?.classList.toggle('collapse');
        document.getElementById('filters-collapse-button')?.classList.toggle('d-none');
      }
    })
  }

  private clearSearchInput(): void {
    const searchInput = document.getElementById('products-search-input');
    if (searchInput instanceof HTMLInputElement) {
      searchInput.value = '';
      this.cards.properties.searchProperty = searchInput.value;
    }
  }

  private setSearchInputValue(): void {
    const searchInput = document.getElementById('products-search-input');
    const value = appRouter.getUrlParamsValue(UrlParamKey.Search);
    let myValue;
    if (!value) {
      myValue = '';
    } else {
      myValue = value;
    }
    if (searchInput instanceof HTMLInputElement) {
      searchInput.value = myValue;
      this.cards.properties.searchProperty = myValue;
    }
  }
}