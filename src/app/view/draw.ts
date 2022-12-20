import { RouterPath, QueryString } from '../../models/enums';
import { appRouter } from '../components/router/router';
import { getPageLinkPath } from '../utils/utils';

export function drawPagination(parentElement: HTMLElement, cartProductsQty: number, cartProductsPerPage: number): void {
  const pagesQty: number = getPagesQty(cartProductsQty, cartProductsPerPage);

  const paginationNav = document.createElement('nav');
  paginationNav.id = 'page-navigation'
  const paginationList = document.createElement('ul');
  paginationList.className = 'pagination justify-content-center';
  paginationList.id = 'cart-pagination';

  const paginationPrevItem = `
  <li class="page-item">
    <a class="page-link" href="#" data-navigo>
      <span>&laquo;</span>
    </a>
  </li>`;
  
  paginationList.insertAdjacentHTML('beforeend', paginationPrevItem);

  drawPaginationPages(paginationList, pagesQty);

  const paginationNextItem = `
  <li class="page-item">
    <a class="page-link" href="#" data-navigo>
      <span>&raquo;</span>
    </a>
  </li>`;
  paginationList.insertAdjacentHTML('beforeend', paginationNextItem)

  paginationNav.append(paginationList);
  parentElement.append(paginationNav);
  appRouter.updatePageLinks();
}

function getPagesQty(cartProductsQty: number, cartProductsPerPage: number): number {
  if (cartProductsQty % cartProductsPerPage === 0) {
    return cartProductsQty / cartProductsPerPage;
  } else {
    return Math.floor(cartProductsQty / cartProductsPerPage) + 1;
  }
}

function drawPaginationPages(parentElement: HTMLElement, pagesQty: number): HTMLElement {
  let i = 1;

  while (i < pagesQty + 1) {
    const li = document.createElement('li');
    li.classList.add('page-item');

    const a = document.createElement('a');
    a.classList.add('page-link');
    a.classList.add('new-page-link');

    const queryStringValue = String(i)
    a.href = getPageLinkPath(RouterPath.Cart, QueryString.Page, queryStringValue);
    a.textContent = queryStringValue;
    a.setAttribute('data-navigo', '');
      
    li.append(a);
    parentElement.append(li);
    i++;
  }

  return parentElement;
}

export function drawPageTitle(parentElement: HTMLElement, title: string): void {
  const pageTitle = document.createElement('h1');
  pageTitle.innerText = title;
  parentElement.append(pageTitle);
}

export function drawPaginationInput(parentElement: HTMLElement, inputValue: number): void {
  const paginationInputWrapper = `
  <div class="form-outline d-flex flex-row justify-content-end align-items-center">
    <label class="" for="cart-items-per-page">Products per page:&nbsp</label>
    <input type="number" value="${inputValue}" id="cart-items-per-page" class="form-control w-auto" min="1" max="10" step="1">
  </div>`;

  parentElement.insertAdjacentHTML('beforeend', paginationInputWrapper);
}

export function drawCartProducts(parentElement: HTMLElement, cartProductsQty: number): void {
  let i = cartProductsQty;

  while (i) {
    const product = document.createElement('div');
    product.className = 'cart-product';
    parentElement.append(product);
    i--;
  }
}