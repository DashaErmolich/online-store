import { AbstractPage } from '../../abstracts/abstracts';
import { UrlParamKey } from '../../enums/enums';
import { appStorage } from '../storage/app-storage';
import { appRouter } from '../router/router';
import { CartPageSettings, SimpleCard, PaginationCardIdxRange } from '../../models/interfaces';
import { PAGINATION_LIMIT_MAX, PAGINATION_LIMIT_MIN, PAGINATION_LIMIT_STEP, CURRENCY_ICON_CLASS_NAME, PRODUCT_CART_QTY_DEFAULT } from '../../constants/constants';
import { ProductCard } from './product-card';
import { promoCodes } from '../../../assets/promo-codes/promo-codes';

export class CartPage extends AbstractPage {
  cartSettings: CartPageSettings;

  constructor() {
    super();
    this.setPageTitle('Shop Cart');
    this.cartSettings = {
      productsQty: appStorage.getCartProductsCardsQty(),
      paginationLimit: appRouter.getPageLimitValue(),
      activePage: appRouter.getPageNumber(),
    };
  }

  private listenPaginationButtons(): void {
    appRouter.updateUrlParams(UrlParamKey.Page, String(this.cartSettings.activePage));
    this.handleActiveButton();
    this.drawPaginationPage();
  }

  private listenPaginationInput(): void {
    appRouter.updateUrlParams(UrlParamKey.Limit, String(this.cartSettings.paginationLimit));
    this.updatePagination();
    this.drawPaginationPage();
  }

  private updatePagination(): void {
    const pagesQty: number = this.getPagesQty();
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      this.handlePagination(pageContent, pagesQty);
    }
  }

  public getPageContent(): HTMLElement {
    const pageContentContainer = document.createElement('div');
    const pagesQty: number = this.getPagesQty();

    if (pagesQty > 0) {
      this.handlePagination(pageContentContainer, pagesQty);
      this.validatePaginationLimit();
      this.drawPaginationInput(pageContentContainer, this.cartSettings.paginationLimit);
      const rowContainer = document.createElement('div');
      rowContainer.className = 'row';
      rowContainer.id = 'pagination-container';
      this.drawPaginationPage(rowContainer);
      this.drawCartSummary(rowContainer);
      this.setCartIcon(this.getCartTotalProductQty())
      pageContentContainer.append(rowContainer);
    } else {
      const message = document.createElement('span');
      message.innerText = 'Cart is empty now';
      pageContentContainer.append(message);
    }

    return pageContentContainer;
  }

  private validateActivePage(pagesQty: number) {
    if (this.cartSettings.activePage > pagesQty) {
      this.cartSettings.activePage = pagesQty;
      appRouter.updateUrlParams(UrlParamKey.Page, String(this.cartSettings.activePage));
    }
  }

  private validatePaginationLimit() {
    if (this.cartSettings.paginationLimit > PAGINATION_LIMIT_MAX) {
      this.cartSettings.paginationLimit = PAGINATION_LIMIT_MAX;
      appRouter.updateUrlParams(UrlParamKey.Limit, String(this.cartSettings.paginationLimit));
    }
  }

  private handlePagination(parentElement: HTMLElement, pagesQty: number): void {
    document.getElementById('page-navigation')?.remove();
    this.validateActivePage(pagesQty);
    this.drawPagination(parentElement, pagesQty);
  }

  private getActivePageRange(): PaginationCardIdxRange {
    return {
      start: (this.cartSettings.activePage - 1) * this.cartSettings.paginationLimit,
      end: this.cartSettings.activePage * this.cartSettings.paginationLimit,
    }
  }

  private drawPagination(parentElement: HTMLElement, pagesQty: number): void {
    const paginationNav = document.createElement('nav');
    paginationNav.id = 'page-navigation'
    const paginationList = document.createElement('ul');
    paginationList.className = 'pagination justify-content-center';
    paginationList.id = 'cart-pagination';
  
    let i = 0;
    const buttonsQty = pagesQty + 2;

    while (i < buttonsQty) {
      const li = document.createElement('li');
      li.classList.add('page-item');

      const button = document.createElement('button');
      button.classList.add('page-link');

      if (i === this.cartSettings.activePage) {
        button.classList.add('active');
      }

      if (i === 0) {
        button.classList.add('prev-page-link');
        button.addEventListener('click', () => {
          this.cartSettings.activePage--;
          this.listenPaginationButtons();
        });

        if (this.cartSettings.activePage === 1) {
          button.classList.add('disabled');
        }

        button.innerHTML = '&laquo;';

      } else if (i === buttonsQty - 1) {
        button.classList.add('next-page-link');
        button.addEventListener('click', () => {
          this.cartSettings.activePage++;
          this.listenPaginationButtons();
        });

        if (this.cartSettings.activePage === pagesQty) {
          button.classList.add('disabled');
        }

        button.innerHTML = '&raquo;';

      } else {
        button.classList.add('new-page-link');
        button.innerHTML = String(i);
        button.id = `${i}`;
        button.addEventListener('click', () => {
          this.cartSettings.activePage = Number(button.id);
          this.listenPaginationButtons();
        })
      }

      li.append(button);
      paginationList.append(li);
      i++;
    }
  
    paginationNav.append(paginationList);
    parentElement.prepend(paginationNav);
  }
  
  private getPagesQty(): number {
    return Math.ceil(this.cartSettings.productsQty / this.cartSettings.paginationLimit);
  }

  private drawPaginationInput(parentElement: HTMLElement, inputValue: number): void {
    const paginationInputContainer = document.createElement('section');
    paginationInputContainer.className = 'form-outline d-flex flex-row justify-content-end align-items-center mb-3';
    
    const paginationInputLabel = document.createElement('label');
    paginationInputLabel.htmlFor = 'cart-items-per-page';
    paginationInputLabel.innerHTML = 'Products per page:&nbsp';
    
    const paginationInput = document.createElement('input');
    paginationInput.type = 'number';
    paginationInput.value = String(inputValue);
    paginationInput.id = 'cart-items-per-page';
    paginationInput.className = 'form-control w-auto';
    paginationInput.min = String(PAGINATION_LIMIT_MIN);
    paginationInput.max = String(PAGINATION_LIMIT_MAX);
    paginationInput.step = String(PAGINATION_LIMIT_STEP);
    paginationInput.addEventListener('change', () => {
      this.cartSettings.paginationLimit = Number(paginationInput.value);
      this.listenPaginationInput();
    })

    paginationInputContainer.append(paginationInputLabel, paginationInput)

    parentElement.append(paginationInputContainer);
  }

  public drawPaginationPage(parentElement?: HTMLElement): void {
    const paginationContainer = document.getElementById('pagination-container');
    document.querySelector('.card-columns')?.remove();

    const paginationActivePageRange: PaginationCardIdxRange = this.getActivePageRange();
    const cartProducts: SimpleCard[] = appStorage.getCartProducts()
    const cardDeck = document.createElement('section');
    cardDeck.className = 'card-columns col-9';

    let i = paginationActivePageRange.start;

    while (i < paginationActivePageRange.end) {
      const card: SimpleCard = cartProducts[i];
      if (card) {
        const cartProduct = new ProductCard(card, i + 1);
        cardDeck.append(cartProduct.getCartCardContent())

      }
      i++;
    }
    if (paginationContainer && !parentElement) {
      paginationContainer.prepend(cardDeck);
    }
    
    if (parentElement) {
      parentElement.prepend(cardDeck);
    }
  }

  private handleActiveButton() {
    const pageButtons = document.querySelectorAll('.page-link');
    const pagesQty: number = this.getPagesQty();

    pageButtons.forEach((button) => {

      button.classList.remove('active');
      button.classList.remove('disabled');
      const pageIndex = Number(button.id);

      if (pageIndex === this.cartSettings.activePage) {
        button.classList.add('active');
      }
      
      if (button.classList.contains('prev-page-link') && this.cartSettings.activePage === 1) {
        button.classList.add('disabled');
      }

      if (button.classList.contains('next-page-link') && this.cartSettings.activePage === pagesQty) {
        button.classList.add('disabled');
      }
    })
  }

  private drawCartSummary(parentElement: HTMLElement): void {
    const cartSummaryContainer = document.createElement('aside');
    cartSummaryContainer.className = 'col-3';

    const cartSummaryTitle = document.createElement('h5');
    cartSummaryTitle.innerHTML = 'Order Summary'

    const totalProductsQtyContainer = document.createElement('div');
    const totalProductsQtyTitle = document.createElement('span');
    totalProductsQtyTitle.innerHTML = 'Products: ';
    const totalProductsQty = document.createElement('span');
    totalProductsQty.id = 'cart-summary-products-qty';
    totalProductsQty.innerHTML = `${this.getCartTotalProductQty()}`;
    totalProductsQtyContainer.append(totalProductsQtyTitle, totalProductsQty);

    const totalSumContainer = document.createElement('div');
    const totalSumTitle = document.createElement('span');
    totalSumTitle.innerHTML = 'Total: ';
    const totalSum = document.createElement('span');
    totalSum.id = 'cart-summary-products-sum';
    totalSum.innerHTML = `${this.getCartTotalSum()}`;
    const currencyIcon = document.createElement('i');
    currencyIcon.className = CURRENCY_ICON_CLASS_NAME;
    totalSumContainer.append(totalSumTitle, totalSum, currencyIcon);

    const promoCodeInput = document.createElement('input');
    promoCodeInput.type = 'text';
    promoCodeInput.className = 'form-control'
    promoCodeInput.placeholder = 'Enter Promo Code';
    const promoCode = document.createElement('div');
    promoCodeInput.addEventListener('change', () => {
      this.listenPromoCodeInput(promoCode, promoCodeInput.value);
    });
    const promoCodesInfo = document.createElement('span');
    const promoCodesNames = promoCodes.map((promoCode) => promoCode.name.toUpperCase());
    promoCodesInfo.innerHTML = `Promo for test: ${promoCodesNames.join(', ')}`;

    cartSummaryContainer.append(cartSummaryTitle, totalProductsQtyContainer, totalSumContainer, promoCodeInput,promoCode, promoCodesInfo);
    parentElement.append(cartSummaryContainer);
  }

  private listenPromoCodeInput(parentElement: HTMLElement, value: number | string): void {
    parentElement.innerHTML = '';
    console.log(value);
    const validatedValue = String(value).trim().toLowerCase();
    const promoCodeIndex = this.getPromoCodeIndex(validatedValue);

    if (promoCodeIndex >= 0) {
      const promoCodeContainer = document.createElement('div');
      const promoCodeName = document.createElement('span');
      promoCodeName.innerHTML = `${promoCodes[promoCodeIndex].description} - ${promoCodes[promoCodeIndex].discountPercent}%`;
      
      const promoCodeAddButton = document.createElement('button');
      promoCodeAddButton.innerHTML = 'Add';
      promoCodeAddButton.className = 'btn btn-dark';
      promoCodeAddButton.addEventListener('click', (event) => {
        const target = event.target;
        if (target instanceof HTMLElement) {
          target.classList.add('d-none');
          promoCodeRemoveButton.classList.remove('d-none');
          appStorage.addCartPromoCode(promoCodes[promoCodeIndex])
          this.setCartSummarySum();
        }
      })
      
      const promoCodeRemoveButton = document.createElement('button');
      promoCodeRemoveButton.innerHTML = 'Remove';
      promoCodeRemoveButton.className = 'btn btn-dark d-none';
      
      promoCodeRemoveButton.addEventListener('click', (event) => {
        const target = event.target;
        if (target instanceof HTMLElement) {
          target.classList.add('d-none');
          promoCodeAddButton.classList.remove('d-none');
          appStorage.removeCartPromoCode(promoCodes[promoCodeIndex])
          this.setCartSummarySum();
        }
      })
      promoCodeContainer.append(promoCodeName, promoCodeAddButton, promoCodeRemoveButton);
      parentElement.append(promoCodeContainer);
    }
  }

  private getPromoCodeIndex(validatedValue: string): number {
    const promoCodeIndex = promoCodes.findIndex((promoCode => validatedValue === promoCode.name));
    return promoCodeIndex;
  }

  public setCartSummary(cartProductsQty: number): void {
    this.setCartSummaryQty(cartProductsQty)
    this.setCartSummarySum();
  }

  private setCartSummarySum(): void {
    const productsSum = document.getElementById('cart-summary-products-sum');
    if (productsSum) {
      productsSum.innerHTML = `${this.getCartTotalSum()}`;
    }
  }

  private setCartSummaryQty(cartProductsQty: number): void {
    const productsQty = document.getElementById('cart-summary-products-qty');
    if (productsQty) {
      productsQty.innerHTML = `${cartProductsQty}`;
    }
  }

  private getCartTotalSum(): number {
    const cartProducts: SimpleCard[] = appStorage.getCartProducts();
    const totalSum: number = cartProducts.reduce((acc, product) => acc + product.price * (product.qty || PRODUCT_CART_QTY_DEFAULT), 0);
    const promoCodes = appStorage.getCartPromoCodes();
    let discount = 0;

    if (promoCodes.length) {
      const discounts = promoCodes.map((promoCode) => promoCode.discountPercent);
      discount = discounts.reduce((acc, discount) => acc + discount, 0);
    }
    
    return totalSum * (100 - discount) / 100;
  }

  private getCartTotalProductQty(): number {
    const cartProducts: SimpleCard[] = appStorage.getCartProducts();
    const totalProductQty: number = cartProducts.reduce((acc, product) => acc + (product.qty || PRODUCT_CART_QTY_DEFAULT), 0);
    return totalProductQty;
  }

  public updatePage(): void {
    this.cartSettings.productsQty = appStorage.getCartProductsCardsQty();
    this.updatePagination();
    this.drawPaginationPage();
    const cartProductsQty = this.getCartTotalProductQty();
    this.setCartSummary(cartProductsQty);
    this.setCartIcon(cartProductsQty);
  }

  private setCartIcon(cartProductsQty: number): void {
    const cartIconQty = document.getElementById('cart-total-items');
    if (cartIconQty) {
      cartIconQty.innerHTML = `${cartProductsQty}`;
    }
  }
}