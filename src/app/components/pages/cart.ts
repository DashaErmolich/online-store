import { AbstractPage } from '../../view/page-view';
import { PageComponents } from '../../../models/interfaces';
import { drawPagination } from '../../view/draw';
// import { RouterPath } from '../../../models/enums';
import { CART_PAGINATION_DEFAULT } from '../../../models/constants';
import { singleton } from '../../singleton/singleton';

export class CartPage extends AbstractPage {

  cartPaginationValue: number;

  constructor() {
    super();
    this.cartPaginationValue = CART_PAGINATION_DEFAULT;
  }

  handleCartPagination(cartProductsPerPage: number): void {
    const cartProductsQty: number = document.getElementsByClassName('cart-product').length;
    if (cartProductsPerPage <= cartProductsQty) {
      document.getElementById('page-navigation')?.remove();
      const pagination = drawPagination(cartProductsQty, cartProductsPerPage);
      document.getElementById('page-content')?.append(pagination);
    }

  }

  listenPaginationInput() {
    document.addEventListener('change', (event: Event): void => {
      if (event.target instanceof HTMLInputElement && event.target.id === 'cart-items-per-page') {
        const cartProductsPerPage = Number(event.target.value);
        this.handleCartPagination(cartProductsPerPage);
        this.cartPaginationValue = cartProductsPerPage;
        singleton.setCartPagination(cartProductsPerPage);
      }
    })
  }

  getCartPaginationValue() {
    return this.cartPaginationValue;
  }

  getPageContent(): PageComponents['content'] {
    this.setPageTitle('Shop Cart');

    //any value now!!!
    singleton.setProductsQty(8);

    const contentWrapper = document.createElement('div');

    const header = document.createElement('h1');
    header.textContent = 'Cart';

    const paginationInputWrapper = document.createElement('div');
    paginationInputWrapper.className = 'form-outline d-flex flex-row justify-content-end align-items-center';
    const paginationInputLabel = document.createElement('label');
    paginationInputLabel.setAttribute('for', 'cart-items-per-page');
    paginationInputLabel.innerText = 'Products per page:';
    const paginationInput = document.createElement('input');
    paginationInput.className = 'form-control w-auto';
    paginationInput.type = 'number';
    paginationInput.value = String(singleton.getCartPagination());
    paginationInput.id = 'cart-items-per-page';
    paginationInput.min = '1';
    paginationInput.max = '10';
    paginationInput.step = '1';
    paginationInputWrapper.append(paginationInputLabel, paginationInput);

    contentWrapper.append(header, paginationInputWrapper);

    let i = singleton.getProductsQty();
    while (i) {
      const prod = document.createElement('div');
      prod.className = 'cart-product';
      contentWrapper.append(prod);
      i--;
    }

    const pagination = drawPagination(singleton.getProductsQty(), singleton.getCartPagination());

    contentWrapper.append(pagination);

    return contentWrapper;

    //   const content = /*html*/`
    //   <h1>Cart</h1> 
    //   <div class="form-outline d-flex flex-row justify-content-end align-items-center">
    //     <label class="" for="cart-items-per-page">Products per page:&nbsp</label>
    //     <input type="number" value="${singleton.getCartPagination()}" id="cart-items-per-page" class="form-control w-auto" min="1" max="10" step="1">
    //   </div>
    //   <div class="cart-product"></div>
    //   <div class="cart-product"></div>
    //   <div class="cart-product"></div>
    //   <div class="cart-product"></div>
    //   <div class="cart-product"></div>
    //   <div class="cart-product"></div>
    //   <div class="cart-product"></div>
    //   <div class="cart-product"></div>
    //   <nav>
    //   <ul class="pagination justify-content-center" id="cart-pagination">
    // <li class="page-item">
    //   <a class="page-link" href="#" data-navigo>
    //     <span aria-hidden="true">&laquo;</span>
    //     <span class="sr-only"></span>
    //   </a>
    // </li>
    //     <li class="page-item active"><a class="page-link" href="${RouterPath.Cart}?page=${1}" data-navigo>1</a></li>
    // <li class="page-item">
    //   <a class="page-link" href="#" data-navigo>
    //     <span aria-hidden="true">&raquo;</span>
    //     <span class="sr-only"></span>
    //   </a>
    // </li>
    //   </ul>
    // </nav>
    // `;
    //   return contentWrapper;

  }
}