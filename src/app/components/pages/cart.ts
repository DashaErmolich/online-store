import { AbstractPage } from '../../abstracts/abstracts';
import { UrlParamKey } from '../../enums/enums';
import { appStorage } from '../storage/app-storage';
import { appRouter } from '../router/router';
import { CartPageSettings } from '../../models/interfaces';

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
        if (event.target instanceof HTMLElement && event.target.classList.contains('new-page-link')) {
          appRouter.updateUrlParams(UrlParamKey.Page, event.target.id);
          this.cartSettings.activePage = Number(event.target.id)
          this.handleActivePaginationButton();
          this.setActivePage(pageContent);
        }
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
          this.handleCartPagination();
          this.setActivePage(pageContent);
        }
      })
    }
  }

  public getPageContent(): HTMLElement {
    const pageContentContainer = document.createElement('div');
    const pagesQty: number = this.getPagesQty(this.cartSettings.productsQty, this.cartSettings.paginationLimit);

    this.drawPaginationInput(pageContentContainer, this.cartSettings.paginationLimit);

    if (pagesQty > 0) {
      this.drawCartProducts(pageContentContainer);
      this.drawPagination(pageContentContainer, pagesQty);
      this.setActivePage(pageContentContainer);
    } else {
      const message = document.createElement('span');
      message.innerText = 'Cart is empty now';
      pageContentContainer.append(message);
    }

    return pageContentContainer;
  }

  private handleCartPagination(): void {
    const pagesQty: number = this.getPagesQty(this.cartSettings.productsQty, this.cartSettings.paginationLimit);

    document.getElementById('page-navigation')?.remove();
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      this.drawPagination(pageContent, pagesQty);
      this.setActivePage(pageContent);
    }
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
  
    const paginationPrevItem = `
    <li class="page-item">
      <button class="page-link">
        <span>&laquo;</span>
      </button>
    </li>`;
    
    paginationList.insertAdjacentHTML('beforeend', paginationPrevItem);
  
    let i = 1;

    while (i < pagesQty + 1) {
      const li = document.createElement('li');
      li.classList.add('page-item');

      const button = document.createElement('button');
      button.classList.add('page-link');
      if (i === this.cartSettings.activePage) {
        button.classList.add('active');
      }
      button.classList.add('new-page-link');

      button.textContent = String(i);
      button.id = `${i}`
        
      li.append(button);
      paginationList.append(li);
      i++;
    }

    const paginationNextItem = `
    <li class="page-item">
      <button class="page-link">
        <span>&raquo;</span>
      </button>
    </li>`;
    paginationList.insertAdjacentHTML('beforeend', paginationNextItem)
  
    paginationNav.append(paginationList);
    parentElement.append(paginationNav);
  }
  
  private getPagesQty(cartProductsQty: number, cartProductsPerPage: number): number {
    return Math.ceil(cartProductsQty / cartProductsPerPage);
  }

  private drawPaginationInput(parentElement: HTMLElement, inputValue: number): void {
    const paginationInputWrapper = `
    <div class="form-outline d-flex flex-row justify-content-end align-items-center">
      <label class="" for="cart-items-per-page">Products per page:&nbsp</label>
      <input type="number" value="${inputValue}" id="cart-items-per-page" class="form-control w-auto" min="1" max="10" step="1">
    </div>`;
  
    parentElement.insertAdjacentHTML('beforeend', paginationInputWrapper);
  }
  
  private drawCartProducts(parentElement: HTMLElement): void {
    let i = this.cartSettings.productsQty;
  
    const cardDeck = document.createElement('div');
    cardDeck.className = 'card-deck';
  
    while (i) {
      const product = `
      <div class="card">
      <img class="card-img-top" src="" alt="Card image cap">
        <div class="card-body">
          <h5 class="card-title">Card title</h5>
          <p class="card-text">This is a longer card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
          <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
        </div>
      </div>`
      cardDeck.insertAdjacentHTML('beforeend', product);
      i--;
    }
    parentElement.append(cardDeck);
  }

  private handleActivePaginationButton() {
    const pageButtons = document.querySelectorAll('.page-link');
    pageButtons.forEach((button) => {
      button.classList.remove('active');
      const pageIndex = Number(button.id);
      if (pageIndex === this.cartSettings.activePage) {
        button.classList.add('active');
      }
    })
  }
}