import { AbstractPage } from '../../abstracts/abstracts';
import { UrlParamKey } from '../../enums/enums';
import { appRouter } from '../router/router';
import { appStorage } from '../storage/app-storage';
export class CartPage extends AbstractPage {

  constructor() {
    super();
    this.setPageTitle('Shop Cart');
  }

  public listenPaginationButtons() {
    document.addEventListener('click', (event: Event): void => {
      if (event.target instanceof HTMLElement && event.target.classList.contains('new-page-link')) {
        appRouter.updateUrlParams(UrlParamKey.Page, event.target.id);
      }
    })
  }

  public listenPaginationInput(): void {
    document.addEventListener('change', (event: Event): void => {
      if (event.target instanceof HTMLInputElement && event.target.id === 'cart-items-per-page') {
        const cartProductsPerPage = Number(event.target.value);
        this.handleCartPagination(cartProductsPerPage);
        appRouter.updateUrlParams(UrlParamKey.Limit, event.target.value);
      }
    })
  }

  public getPageContent(): HTMLElement {
    const pageContentContainer = document.createElement('div');
    const cartPageLimitValue: number = appRouter.getPageLimitValue();
    this.drawPaginationInput(pageContentContainer, cartPageLimitValue);
    const cartProductsQty: number = appStorage.getCartProductsQty();
    if (cartProductsQty > 0) {
      this.drawCartProducts(pageContentContainer, cartProductsQty);
      this.drawPagination(pageContentContainer, cartProductsQty, cartPageLimitValue);
    } else {
      const message = document.createElement('span');
      message.innerText = 'Cart is empty now';
      pageContentContainer.append(message);
    }
    return pageContentContainer;
  }

  private handleCartPagination(cartProductsPerPage: number): void {
    const cartProductsQty: number = appStorage.getCartProductsQty();
    document.getElementById('page-navigation')?.remove();
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      this.drawPagination(pageContent, cartProductsQty, cartProductsPerPage);
    }
  }

  private drawPagination(parentElement: HTMLElement, cartProductsQty: number, cartProductsPerPage: number): void {
    const pagesQty: number = this.getPagesQty(cartProductsQty, cartProductsPerPage);
  
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
    if (cartProductsQty % cartProductsPerPage === 0) {
      return cartProductsQty / cartProductsPerPage;
    } else {
      return Math.floor(cartProductsQty / cartProductsPerPage) + 1;
    }
  }

  private drawPaginationInput(parentElement: HTMLElement, inputValue: number): void {
    const paginationInputWrapper = `
    <div class="form-outline d-flex flex-row justify-content-end align-items-center">
      <label class="" for="cart-items-per-page">Products per page:&nbsp</label>
      <input type="number" value="${inputValue}" id="cart-items-per-page" class="form-control w-auto" min="1" max="10" step="1">
    </div>`;
  
    parentElement.insertAdjacentHTML('beforeend', paginationInputWrapper);
  }
  
  private drawCartProducts(parentElement: HTMLElement, cartProductsQty: number): void {
    let i = cartProductsQty;
  
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
}

export const cartPage = new CartPage();
cartPage.listenPaginationInput();
cartPage.listenPaginationButtons();