import { AbstractPage } from '../../view/page-view';
import { drawPagination, drawPageTitle, drawCartProducts, drawPaginationInput } from '../../view/draw';
import { singleton } from '../app/app';
import { UrlParamKey } from '../../../models/enums';
import { updateUrlParams, getPageLimitValue } from '../router/router';

export class CartPage extends AbstractPage {

  constructor() {
    super();
    this.setPageTitle('Shop Cart');
  }

  listenPaginationButtons() {
    document.addEventListener('click', (event: Event): void => {
      if (event.target instanceof HTMLElement && event.target.classList.contains('new-page-link')) {
        updateUrlParams(UrlParamKey.Page, event.target.id);
      }
    })
  }

  private handleCartPagination(cartProductsPerPage: number): void {
    const cartProductsQty: number = singleton.getProductsQty();
    document.getElementById('page-navigation')?.remove();
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      drawPagination(pageContent, cartProductsQty, cartProductsPerPage);
    }
  }

  public listenPaginationInput(): void {
    document.addEventListener('change', (event: Event): void => {
      if (event.target instanceof HTMLInputElement && event.target.id === 'cart-items-per-page') {
        const cartProductsPerPage = Number(event.target.value);
        this.handleCartPagination(cartProductsPerPage);
        updateUrlParams(UrlParamKey.Limit, event.target.value);
      }
    })
  }

  getPageContent(): HTMLElement {
    const pageContentContainer = document.createElement('div');
    drawPageTitle(pageContentContainer, 'Cart');
    drawPaginationInput(pageContentContainer, getPageLimitValue());
    drawCartProducts(pageContentContainer, singleton.getProductsQty());
    drawPagination(pageContentContainer, singleton.getProductsQty(), singleton.getCartPagination());
    return pageContentContainer;
  }
}