import { AbstractPage } from '../../view/page-view';
import { drawPagination, drawPageTitle, drawPaginationInput, drawCartProducts } from '../../view/draw';
import { singleton } from '../app/app';

export class CartPage extends AbstractPage {

  constructor() {
    super();
    this.setPageTitle('Shop Cart');
  }

  private handleCartPagination(cartProductsPerPage: number): void {
    const cartProductsQty: number = document.getElementsByClassName('cart-product').length;
    document.getElementById('page-navigation')?.remove();
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      drawPagination(pageContent, cartProductsQty, cartProductsPerPage);
    }

  }

  public listenPaginationInput() {
    document.addEventListener('change', (event: Event): void => {
      if (event.target instanceof HTMLInputElement && event.target.id === 'cart-items-per-page') {
        const cartProductsPerPage = Number(event.target.value);
        this.handleCartPagination(cartProductsPerPage);
        singleton.setCartPagination(cartProductsPerPage);
      }
    })
  }

  getPageContent(): HTMLElement {
    const pageContentContainer = document.createElement('div');
    drawPageTitle(pageContentContainer, 'Cart');
    drawPaginationInput(pageContentContainer, singleton.getCartPagination());
    drawCartProducts(pageContentContainer, singleton.getProductsQty());
    drawPagination(pageContentContainer, singleton.getProductsQty(), singleton.getCartPagination());
    return pageContentContainer;
  }
}