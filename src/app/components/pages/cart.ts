import { AbstractPage } from '../../view/page-view';
import { PageComponents } from '../../../models/interfaces';
import { drawPagination } from '../../view/draw';
import { RouterPath } from '../../../models/enums';
import { CART_PAGINATION_DEFAULT } from '../../../models/constants';

export class CartPage extends AbstractPage {

  private cartPaginationValue: number;

  constructor() {
    super();
    this.cartPaginationValue = CART_PAGINATION_DEFAULT;
  }

  handleCartPagination(cardsPerPage: number): void {
    const cartProductsQty: number = document.getElementsByClassName('cart-product').length;
    if (cardsPerPage <= cartProductsQty) {
      document.querySelectorAll('.new-page-link').forEach((link): void => {
        link.remove();
      })
      const pagesQty: number = Math.floor(cartProductsQty / cardsPerPage);
      drawPagination(pagesQty);
    }

  }

  listenPaginationInput() {
    document.addEventListener('change', (event: Event): void => {
      if (event.target instanceof HTMLInputElement && event.target.id === 'cart-items-per-page') {
        const cardsPerPage = Number(event.target.value);
        this.handleCartPagination(cardsPerPage);
        this.cartPaginationValue = cardsPerPage;
      }
    })
  }

  getCartPaginationValue() {
    return this.cartPaginationValue;
  }

  getPageContent(): PageComponents['content'] {
    this.setPageTitle('Shop Cart');
    
    const content = /*html*/`
      <h1>Cart</h1> 
      <div class="form-outline d-flex flex-row justify-content-end align-items-center">
        <label class="" for="cart-items-per-page">Products per page:&nbsp</label>
        <input value="5" type="number" id="cart-items-per-page" class="form-control w-auto" min="1" max="10" step="1">
      </div>
      <div class="cart-product"></div>
      <div class="cart-product"></div>
      <div class="cart-product"></div>
      <div class="cart-product"></div>
      <div class="cart-product"></div>
      <div class="cart-product"></div>
      <div class="cart-product"></div>
      <div class="cart-product"></div>
      <nav>
      <ul class="pagination justify-content-center" id="cart-pagination">
        <li class="page-item">
          <a class="page-link" href="#" data-navigo>
            <span aria-hidden="true">&laquo;</span>
            <span class="sr-only"></span>
          </a>
        </li>
        <li class="page-item active"><a class="page-link" href="${RouterPath.Cart}?page=${1}" data-navigo>1</a></li>
        <li class="page-item">
          <a class="page-link" href="#" data-navigo>
            <span aria-hidden="true">&raquo;</span>
            <span class="sr-only"></span>
          </a>
        </li>
      </ul>
    </nav>
    `;
    return content;
  }
}