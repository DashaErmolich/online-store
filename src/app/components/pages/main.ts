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
    }
    this.cards = new Cards(possibleCards.products, this.mainPageSettings.cardsAppearance);
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

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('content-wrapper');
    contentWrapper.classList.add('col-9');

    const filtersWrapper = document.createElement('div');
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
    this.drawPageStateButtons(sortingWrapper);
    sortingWrapper.className = 'sorting-wrapper btn-group btn-group-sm mb-3 w-100';
    sortingWrapper.setAttribute('role', 'group')
    const nameSort = document.createElement('button');
    nameSort.innerText = 'Sort by Name';
    nameSort.className = 'sort-item btn btn-outline-secondary';
    nameSort.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.Title);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.Title;
      this.cards.generateCards(cardsWrapper);
      //appRouter.updateUrlParams(UrlParamKey.)
    })
    const priceSort = document.createElement('button');
    priceSort.innerText = 'Sort by Price';
    priceSort.className = 'sort-item btn btn-outline-secondary';
    priceSort.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.Price);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.Price;
      this.cards.generateCards(cardsWrapper);
    })
    const ratingSort = document.createElement('button');
    ratingSort.innerText = 'Sort by Rating';
    ratingSort.className = 'sort-item btn btn-outline-secondary';
    ratingSort.addEventListener('click', () => {
      appRouter.updateUrlParams(UrlParamKey.Sort, CardsSortBy.Rating);
      this.cards.removeCards();
      this.cards.properties.sortProperty = CardsSortBy.Rating;
      this.cards.generateCards(cardsWrapper);
    })
    sortingWrapper.append(nameSort);
    sortingWrapper.append(priceSort);
    sortingWrapper.append(ratingSort);

    this.cards.generateFiltersField(filtersWrapper);

    contentWrapper.append(sortingWrapper);
    contentWrapper.append(cardsWrapper);
    mainWrapper.append(contentWrapper);
    mainWrapper.append(filtersWrapper);
    content.append(mainWrapper);
    appRouter.updatePageLinks();
    const searchBtn = document.querySelector('.btn-outline-secondary');
    const searchField = document.querySelector('.form-control') as HTMLInputElement;
    searchBtn?.addEventListener('click', () => {
      this.cards.removeCards();
      this.cards.properties.searchProperty = searchField.value;
      this.cards.generateCards(cardsWrapper);
    })
    return content;
  }

  private drawPageStateButtons(parentElement: HTMLElement): void {
    const resetSearchParamsButton = this.getResetFiltersButton();
    const copySearchParamsButton = this.getCopyFiltersButton();
    parentElement.append(resetSearchParamsButton, copySearchParamsButton);
  }

  private getResetFiltersButton(): HTMLElement {
    const resetBtn = appDrawer.getSimpleButton('Reset filters', 'btn btn-outline-secondary');

    resetBtn.addEventListener('click', () => {
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
          copyBtn.innerHTML = 'Copy filters';
        }, 2000)
      } catch (error) {
        console.error(error);
      }
    })

    return copyBtn;
  }
}