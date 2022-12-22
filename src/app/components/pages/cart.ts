import { AbstractPage } from '../../abstracts/abstracts';
import { UrlParamKey } from '../../enums/enums';
import { appStorage } from '../storage/app-storage';
import { appRouter } from '../router/router';
import { CartPageSettings, SimpleCard } from '../../models/interfaces';
import { PAGINATION_LIMIT_MAX, PAGINATION_LIMIT_MIN, PAGINATION_LIMIT_STEP } from '../../constants/constants';

export class CartPage extends AbstractPage {
  cartSettings: CartPageSettings;

  constructor() {
    super();
    this.setPageTitle('Shop Cart');
    this.cartSettings = {
      productsQty: appStorage.getCartProductsQty(),
      paginationLimit: appRouter.getPageLimitValue(),
      activePage: appRouter.getPageNumber(),
    };
  }

  public listenPaginationButtons(): void {
    const pageContent = document.getElementById('page-content');

    if (pageContent) {
      pageContent.addEventListener('click', (event: Event): void => {

        let activePage: number = this.cartSettings.activePage;
        if (event.target instanceof HTMLElement) {

          if (event.target.classList.contains('new-page-link')) {
            activePage = Number(event.target.id);
          }

          if (event.target.classList.contains('prev-page-link')) {
            activePage = this.cartSettings.activePage - 1;
          }

          if (event.target.classList.contains('next-page-link')) {
            activePage = this.cartSettings.activePage + 1;
          }
        }

        appRouter.updateUrlParams(UrlParamKey.Page, String(activePage));
        this.cartSettings.activePage = activePage;
        this.handleActiveButton();
        this.setActivePage(pageContent);
      })
    }
  }

  public listenPaginationInput(): void {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.addEventListener('change', (event: Event): void => {
        if (event.target instanceof HTMLInputElement && event.target.id === 'cart-items-per-page') {
          appRouter.updateUrlParams(UrlParamKey.Limit, event.target.value);
          this.cartSettings.paginationLimit =  Number(event.target.value);
          const pagesQty: number = this.getPagesQty();
          this.handlePagination(pageContent, pagesQty);
          this.setActivePage(pageContent);
        }
      })
    }
  }

  public getPageContent(): HTMLElement {
    const pageContentContainer = document.createElement('div');
    const pagesQty: number = this.getPagesQty();

    if (pagesQty > 0) {
      this.handlePagination(pageContentContainer, pagesQty);
      
      this.validatePaginationLimit();
      this.drawPaginationInput(pageContentContainer, this.cartSettings.paginationLimit);

      this.drawCartProducts(pageContentContainer);
      this.setActivePage(pageContentContainer);
    } else {
      const message = document.createElement('span');
      message.innerText = 'Cart is empty now';
      pageContentContainer.append(message);
    }

    return pageContentContainer;
  }

  private validateActivePage(pagesQty: number) {
    if (this.cartSettings.activePage > pagesQty) {
      this.cartSettings.activePage = pagesQty;
      appRouter.updateUrlParams(UrlParamKey.Page, String(this.cartSettings.activePage));
    }
  }

  private validatePaginationLimit() {
    if (this.cartSettings.paginationLimit > PAGINATION_LIMIT_MAX) {
      this.cartSettings.paginationLimit = PAGINATION_LIMIT_MAX;
      appRouter.updateUrlParams(UrlParamKey.Limit, String(this.cartSettings.paginationLimit));
    }
  }

  private handlePagination(parentElement: HTMLElement, pagesQty: number): void {
    document.getElementById('page-navigation')?.remove();

    this.validateActivePage(pagesQty);
    this.drawPagination(parentElement, pagesQty);
  }

  private setActivePage(parentElement: HTMLElement): void {
    const prevRange: number = (this.cartSettings.activePage - 1) * this.cartSettings.paginationLimit;
    const currentRange: number = this.cartSettings.activePage * this.cartSettings.paginationLimit;

    const cartProductsCards = parentElement.querySelectorAll('.card');

    cartProductsCards.forEach((card, index) => {
      card.classList.add('d-none');
      if (index >= prevRange && index < currentRange) {
        card.classList.remove('d-none');
      }
    })
  }

  private drawPagination(parentElement: HTMLElement, pagesQty: number): void {
    const paginationNav = document.createElement('nav');
    paginationNav.id = 'page-navigation'
    const paginationList = document.createElement('ul');
    paginationList.className = 'pagination justify-content-center';
    paginationList.id = 'cart-pagination';
  
    let i = 0;
    const buttonsQty = pagesQty + 2;

    while (i < buttonsQty) {
      const li = document.createElement('li');
      li.classList.add('page-item');

      const button = document.createElement('button');
      button.classList.add('page-link');

      if (i === this.cartSettings.activePage) {
        button.classList.add('active');
      }

      if (i === 0) {
        button.classList.add('prev-page-link');

        if (this.cartSettings.activePage === 1) {
          button.classList.add('disabled');
        }

        button.innerHTML = '&laquo;';

      } else if (i === buttonsQty - 1) {
        button.classList.add('next-page-link');

        if (this.cartSettings.activePage === pagesQty) {
          button.classList.add('disabled');
        }

        button.innerHTML = '&raquo;';

      } else {
        button.classList.add('new-page-link');
        button.innerHTML = String(i);
        button.id = `${i}`
      }

      li.append(button);
      paginationList.append(li);
      i++;
    }
  
    paginationNav.append(paginationList);
    parentElement.prepend(paginationNav);
  }
  
  private getPagesQty(): number {
    return Math.ceil(this.cartSettings.productsQty / this.cartSettings.paginationLimit);
  }

  private drawPaginationInput(parentElement: HTMLElement, inputValue: number): void {
    const paginationInputWrapper = `
    <div class="form-outline d-flex flex-row justify-content-end align-items-center mb-3">
      <label class="" for="cart-items-per-page">Products per page:&nbsp</label>
      <input type="number" value="${inputValue}" id="cart-items-per-page" class="form-control w-auto" min="${PAGINATION_LIMIT_MIN}" max="${PAGINATION_LIMIT_MAX}" step="${PAGINATION_LIMIT_STEP}">
    </div>`;
  
    parentElement.insertAdjacentHTML('beforeend', paginationInputWrapper);
  }
  
  private drawCartProducts(parentElement: HTMLElement): void {
    const cartProducts: SimpleCard[] = appStorage.getCartProducts()
    const cardDeck = document.createElement('div');
    cardDeck.className = 'card-columns';

    let i = 0;

    while (i < this.cartSettings.productsQty) {
      const card: SimpleCard = cartProducts[i];

      const product = `
      <div class="card d-flex flex-row align-items-center">
      <img class="w-25 h-100" src="${card.thumbnail}" alt="${card.title}">
        <div class="card-body d-flex flex-column justify-content-between">
          <h4 class="card-title d-flex justify-content-between">
            ${card.title}
            <button class="bi bi-trash3 page-link fs-4"></button>
          </h4>
          <h5 class="card-title">
            ${card.price}
            <i class="bi bi-currency-dollar"></i>
          </h5>
          <p class="card-text text-capitalize">${card.category} &bull; ${card.brand}</p>
          <p class="card-text">${card.description}</p>
          <p>Stock: ${card.stock}</p>
          <div class="d-flex justify-content-between">
            <div class="card-text">
              <i class="bi bi-star"></i>
              <span class="text-muted">${card.rating} &bull; </span>
              <span class="text-muted">Discount: ${card.discountPercentage}%</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <button class="bi bi-dash-circle page-link fs-4"></button>
              <span class="d-block m-3 fs-5">1</span>
              <button class="bi bi-plus-circle page-link fs-4"></button>
            </div>
          </div>
        </div>
      </div>`
      cardDeck.insertAdjacentHTML('beforeend', product);
      i++;
    }
    parentElement.append(cardDeck);
  }

  private handleActiveButton() {
    const pageButtons = document.querySelectorAll('.page-link');
    const pagesQty: number = this.getPagesQty();

    pageButtons.forEach((button) => {

      button.classList.remove('active');
      button.classList.remove('disabled');
      const pageIndex = Number(button.id);

      if (pageIndex === this.cartSettings.activePage) {
        button.classList.add('active');
      }
      
      if (button.classList.contains('prev-page-link') && this.cartSettings.activePage === 1) {
        button.classList.add('disabled');
      }

      if (button.classList.contains('next-page-link') && this.cartSettings.activePage === pagesQty) {
        button.classList.add('disabled');
      }
    })
  }
}