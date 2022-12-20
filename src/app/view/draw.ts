import { RouterPath, QueryString } from '../../models/enums';
import { appRouter } from '../components/router/router';
import { getPageLinkPath } from '../utils/utils';

export function drawPagination(cartProductsQty: number, cartProductsPerPage: number): HTMLElement {
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

  addPaginationPages(paginationList, pagesQty);

  const paginationNextItem = `
  <li class="page-item">
    <a class="page-link" href="#" data-navigo>
      <span>&raquo;</span>
    </a>
  </li>`;
  paginationList.insertAdjacentHTML('beforeend', paginationNextItem)

  paginationNav.append(paginationList);
  appRouter.updatePageLinks();

  return paginationNav;
}

function getPagesQty(cartProductsQty: number, cartProductsPerPage: number): number {
  if (cartProductsQty % cartProductsPerPage === 0) {
    return cartProductsQty / cartProductsPerPage;
  } else {
    return Math.floor(cartProductsQty / cartProductsPerPage) + 1;
  }
}

function addPaginationPages(paginationList: HTMLElement, pagesQty: number): HTMLElement {
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
    paginationList.append(li);
    i++;
  }

  return paginationList;
}

