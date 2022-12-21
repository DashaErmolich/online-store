export function drawPagination(parentElement: HTMLElement, cartProductsQty: number, cartProductsPerPage: number): void {
  const pagesQty: number = getPagesQty(cartProductsQty, cartProductsPerPage);

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

  drawPaginationPages(paginationList, pagesQty);

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

    const button = document.createElement('button');
    button.classList.add('page-link');
    button.classList.add('new-page-link');

    button.textContent = String(i);
    button.id = `${i}`
      
    li.append(button);
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