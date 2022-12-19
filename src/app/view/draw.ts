import { RouterPath, QueryString } from '../../models/enums';
import { appRouter } from '../components/router/router';
import { getPageLinkPath } from '../utils/utils';

export function drawPagination(pagesQty: number): void {
  const nav = document.getElementById('cart-pagination');
  const navNextBtn = document.getElementById('cart-pagination')?.lastElementChild;

  if (nav && navNextBtn) {
    let i = 2;

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
      nav.insertBefore(li, navNextBtn);
      i++;
    }
    
    appRouter.updatePageLinks();
  }
}