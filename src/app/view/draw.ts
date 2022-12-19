import { RouterPath } from '../../models/enums';

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
      a.href = `${RouterPath.Cart}?page=${i}`;
      a.textContent = String(i);
      li.append(a);
      nav.insertBefore(li, navNextBtn);
      i++;
    }
  }
}