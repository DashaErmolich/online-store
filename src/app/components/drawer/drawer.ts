import { CURRENCY_ICON_CLASS_NAME } from '../../constants/constants';
class Drawer {
  getCartSummaryTitle(): HTMLElement {
    const cartSummaryTitle = document.createElement('h5');
    cartSummaryTitle.innerHTML = 'Order Summary';
    return cartSummaryTitle;
  }

  getCartSummaryProductsQty(productsQty: number): HTMLElement {
    const totalProductsQtyContainer = document.createElement('div');
    const totalProductsQtyTitle = document.createElement('span');
    totalProductsQtyTitle.innerHTML = 'Products: ';
    const totalProductsQty = document.createElement('span');
    totalProductsQty.id = 'cart-summary-products-qty';
    totalProductsQty.innerHTML = `${productsQty}`;
    totalProductsQtyContainer.append(totalProductsQtyTitle, totalProductsQty);
    return totalProductsQtyContainer;
  }

  getCurrencyIcon(): HTMLElement {
    const currencyIcon = document.createElement('i');
    currencyIcon.className = CURRENCY_ICON_CLASS_NAME;
    return currencyIcon;
  }

  getCartSummaryTotalSum(cartTotalSum: number): HTMLElement {
    const cartSummaryTotalSumContainer = document.createElement('div');
    const cartSummaryTotalSumTitle = document.createElement('span');
    cartSummaryTotalSumTitle.innerHTML = 'Total: ';
    const cartSummaryTotalSum = document.createElement('span');
    cartSummaryTotalSum.id = 'cart-summary-products-sum';
    cartSummaryTotalSum.innerHTML = `${cartTotalSum}`;
    const icon = this.getCurrencyIcon();
    cartSummaryTotalSumContainer.append(cartSummaryTotalSumTitle, cartSummaryTotalSum, icon);
    return cartSummaryTotalSumContainer;
  }

  getCartSummaryTotalSumDiscount(cartTotalSumDiscount: number): HTMLElement {
    const cartSummaryTotalSumDiscountContainer = document.createElement('div');
    const cartSummaryTotalSumDiscountTitle = document.createElement('span');
    cartSummaryTotalSumDiscountTitle.innerHTML = 'Total with discount: ';
    const cartSummaryTotalSumDiscount = document.createElement('span');
    cartSummaryTotalSumDiscount.id = 'cart-summary-products-sum-discount';
    cartSummaryTotalSumDiscount.innerHTML = `${cartTotalSumDiscount}`;
    const icon = this.getCurrencyIcon();
    cartSummaryTotalSumDiscountContainer.append(cartSummaryTotalSumDiscountTitle, cartSummaryTotalSumDiscount, icon);
    return cartSummaryTotalSumDiscountContainer;
  } 

  getCartSummaryPromoCodeInput(): HTMLInputElement {
    const cartSummaryPromoCodeInput = document.createElement('input');
    cartSummaryPromoCodeInput.id = 'promo-code-input'
    cartSummaryPromoCodeInput.type = 'text';
    cartSummaryPromoCodeInput.className = 'form-control'
    cartSummaryPromoCodeInput.placeholder = 'Enter Promo Code';
    return cartSummaryPromoCodeInput;
  }

  getCartSummaryPromoCodeInfo(promoCodesNames: string): HTMLElement {
    const cartSummaryPromoCodeInfo = document.createElement('div');
    cartSummaryPromoCodeInfo.innerHTML = `Promo for test: ${promoCodesNames}`;
    cartSummaryPromoCodeInfo.className = 'text-muted';
    return cartSummaryPromoCodeInfo;
  }

  getCartSummaryContainer(): HTMLElement {
    const cartSummaryContainer = document.createElement('aside');
    cartSummaryContainer.id = 'cart-summary-container';
    cartSummaryContainer.className = 'col-3';
    return cartSummaryContainer;
  }

  getPromoCodeButton(value: string): HTMLElement {
    const promoCodeButton = document.createElement('button');
    promoCodeButton.innerHTML = value;
    promoCodeButton.className = 'btn btn-dark';
    return promoCodeButton;
  }

  getPromoCodeTitle(promoCodeDescription: string, promoCodeDiscount: number): HTMLElement {
    const promoCodeName = document.createElement('h6');
    promoCodeName.innerHTML = `${promoCodeDescription} - ${promoCodeDiscount}%`;
    return promoCodeName;
  }

  getMatchPromoCodeCartSummaryContainer(): HTMLElement {
    const possiblePromoCodeContainer = document.createElement('div');
    possiblePromoCodeContainer.id = 'match-promo-code';
    return possiblePromoCodeContainer;
  }

  getAppliedPromoCodesContainer(): HTMLElement {
    const appliedPromoCodesContainer = document.createElement('div');
    appliedPromoCodesContainer.innerHTML = 'Applied promo codes:'
    appliedPromoCodesContainer.id = 'applied-promo-codes';
    return appliedPromoCodesContainer;
  }

  getOrderCheckoutButton(): HTMLElement {
    const orderButton = document.createElement('button');
    orderButton.innerHTML = 'BUY NOW';
    orderButton.className = 'btn btn-primary';
    return orderButton;
  }
}

export const appDrawer = new Drawer();

