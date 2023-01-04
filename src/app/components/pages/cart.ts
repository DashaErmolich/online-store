import { AbstractPage } from '../../abstracts/abstracts';
import { UrlParamKey } from '../../enums/enums';
import { appStorage } from '../storage/app-storage';
import { appRouter } from '../router/router';
import { CartPageSettings, SimpleCard, PaginationCardIdxRange, PromoCode } from '../../models/interfaces';
import { PAGINATION_LIMIT_MAX, PAGINATION_LIMIT_MIN, PAGINATION_LIMIT_STEP, PRODUCT_CART_QTY_DEFAULT } from '../../constants/constants';
import { ProductCard } from '../cart-product-cards/cart-product-card';
import { promoCodes } from '../../../assets/promo-codes/promo-codes';
import { appDrawer } from '../drawer/drawer';
import { CartSummaryPromoCode } from '../promo-code/promo-code';
import { PurchaseModal } from '../purchase-modal/purchase-modal';

export class CartPage extends AbstractPage {
  cartSettings: CartPageSettings;

  constructor() {
    super();
    this.setPageTitle('Shop Cart');
    this.cartSettings = {
      productsQty: appStorage.getCartProductsCardsQty(),
      paginationLimit: appRouter.getPaginationLimitValue(),
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
    const cartSummaryContainer: HTMLElement = appDrawer.getCartSummaryContainer();
    const cartSummaryTitle: HTMLElement = appDrawer.getCartSummaryTitle();
    const cartSummaryTotalProductsQty: HTMLElement = appDrawer.getCartSummaryProductsQty(this.getCartTotalProductQty());
    const cartSummaryTotalSum: HTMLElement = appDrawer.getCartSummaryTotalSum(this.getCartTotalSum());
    cartSummaryContainer.append(cartSummaryTitle, cartSummaryTotalProductsQty, cartSummaryTotalSum);

    let appliedPromoCodesContainer: HTMLElement;

    if (this.isAppliedPromoCodes()) {
      cartSummaryTotalSum.classList.add('text-decoration-line-through');
      const cartSummaryTotalSumDiscount: HTMLElement = appDrawer.getCartSummaryTotalSumDiscount(this.getCartTotalSumDiscount());
      appliedPromoCodesContainer = appDrawer.getAppliedPromoCodesContainer();
      this.drawAppliedPromoCodes(appliedPromoCodesContainer);
      cartSummaryContainer.append(cartSummaryTotalSumDiscount, appliedPromoCodesContainer);
    }

    const cartSummaryPromoCodeInput: HTMLInputElement = appDrawer.getCartSummaryPromoCodeInput();
    cartSummaryPromoCodeInput.addEventListener('input', () => {
      this.listenPromoCodeInput(cartSummaryContainer, cartSummaryPurchaseButton, cartSummaryPromoCodeInput.value);
    });

    const cartSummaryPromoCodeNames: string = this.getAllPromoCodesNames();
    const cartSummaryPromoCodeInfo: HTMLElement = appDrawer.getCartSummaryPromoCodeInfo(cartSummaryPromoCodeNames);

    const cartSummaryPurchaseButton = appDrawer.getOrderCheckoutButton();

    cartSummaryPurchaseButton.setAttribute('data-bs-toggle', 'modal');
    cartSummaryPurchaseButton.setAttribute('data-bs-target', '#purchase-modal');

    const modal = new PurchaseModal();
    cartSummaryContainer.append(modal.getPurchaseModalContent());
    
    cartSummaryContainer.append(cartSummaryPromoCodeInput, cartSummaryPromoCodeInfo, cartSummaryPurchaseButton);
    this.setHeaderCartTotalSum();
    parentElement.append(cartSummaryContainer);
  }

  private getAllPromoCodesNames(): string {
    return promoCodes.map((promoCode) => promoCode.name.toUpperCase()).join(', ');
  }

  private removeMatchPromoCodeCartSummaryContainer() {
    const matchPromoCodeCartSummaryContainer = document.getElementById('match-promo-code');
    if (matchPromoCodeCartSummaryContainer) {
      matchPromoCodeCartSummaryContainer.remove();
    }
  }

  private listenPromoCodeInput(cartSummaryContainer: HTMLElement, cartSummaryOrderCheckoutButton: HTMLElement, value: string): void {
    const validatedValue = String(value).trim().toLowerCase();
    const promoCodeIndex = this.getPromoCodeIndex(promoCodes, validatedValue);

    this.removeMatchPromoCodeCartSummaryContainer();
    const matchPromoCodeCartSummaryContainer = appDrawer.getMatchPromoCodeCartSummaryContainer();

    if (promoCodeIndex >= 0) {
      const promoCode = new CartSummaryPromoCode(promoCodes[promoCodeIndex]);

      if (this.isPromoCodeApplied(promoCodes[promoCodeIndex])) {
        matchPromoCodeCartSummaryContainer.append(promoCode.getPromoCodeName());
      } else {
        matchPromoCodeCartSummaryContainer.append(promoCode.getNewPromoCodeContent());
      }
      cartSummaryContainer.insertBefore(matchPromoCodeCartSummaryContainer, cartSummaryOrderCheckoutButton);
    }
  }

  private drawAppliedPromoCodes(parentElement: HTMLElement): void {
    const appliedPromoCodes = appStorage.getCartPromoCodes();

    if (appliedPromoCodes.length) {

      let i = 0;
      while(i < appliedPromoCodes.length) {
        const promoCode = new CartSummaryPromoCode(appliedPromoCodes[i]);
        parentElement.append(promoCode.getAppliedPromoCodeContent());
        i++
      }
    }
  }

  public isPromoCodeApplied(promoCode: PromoCode): boolean {
    const appliedPromoCodes = appStorage.getCartPromoCodes();
    const appliedPromoCodeIndex = this.getPromoCodeIndex(appliedPromoCodes, promoCode.name);
    if (appliedPromoCodeIndex >= 0) {
      return true;
    } else {
      return false;
    }
  }

  private isAppliedPromoCodes(): boolean {
    const appliedPromoCodesEmpty = appStorage.getCartPromoCodes();
    if (appliedPromoCodesEmpty.length) {
      return true;
    } else {
      return false;
    }
  }

  private updateCartSummary() {
    const cartSummary = document.getElementById('cart-summary-container');
    if (cartSummary) {
      const cartSummaryParent = cartSummary.parentElement;
      if (cartSummaryParent) {
        cartSummary.remove()
        this.drawCartSummary(cartSummaryParent);
      }
    }
  }

  public applyPromoCodeToCartSummary(promoCode: PromoCode) {
    appStorage.addCartPromoCode(promoCode);
    this.updateCartSummary();
  }

  public removePromoCodeFromCartSummary(promoCode: PromoCode) {
    appStorage.removeCartPromoCode(promoCode);
    this.updateCartSummary();
  }

  private getPromoCodeIndex(promoCodes: PromoCode[], validatedValue: string): number {
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

    const productsSumDiscount = document.getElementById('cart-summary-products-sum-discount');
    if (productsSumDiscount) {
      productsSumDiscount.innerHTML = `${this.getCartTotalSumDiscount()}`;
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
    return totalSum;
  }

  private getCartTotalSumDiscount(): number {
    const totalSum: number = this.getCartTotalSum();
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
    this.setHeaderCartTotalSum();
  }

  private setCartIcon(cartProductsQty: number): void {
    const cartIconQty = document.getElementById('cart-total-items');
    if (cartIconQty) {
      cartIconQty.innerHTML = cartProductsQty ? `${cartProductsQty}` : '';
    }
  }

  private setHeaderCartTotalSum(): void {
    const headerCartTotalSum = document.getElementById('cart-total-money');
    if (headerCartTotalSum) {
      headerCartTotalSum.innerHTML = `${this.getCartTotalSumDiscount()}`;
    }
  }

  private setCartSettings(): void {
    this.cartSettings.productsQty = appStorage.getCartProductsCardsQty();
    this.cartSettings.paginationLimit = appRouter.getPaginationLimitValue();
    this.cartSettings.activePage = appRouter.getPageNumber();
  }

  public setCartState(): void {
    this.setCartSettings();
    this.setCartIcon(this.getCartTotalProductQty());
    this.setHeaderCartTotalSum();
  }
}