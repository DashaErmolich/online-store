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

  getPurchaseModalFormGroupContainer(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'form-group';
    return container;
  }

  getPurchaseModalFormGroupPersonName(): HTMLElement {
    const container = this.getPurchaseModalFormGroupContainer();
    const nameLabel = document.createElement('label');
    nameLabel.innerHTML = 'Name and surname'
    nameLabel.htmlFor = 'person-name';
    const nameInput = document.createElement('input');
    nameInput.required = true;
    nameInput.id = 'person-name';
    nameInput.type = 'text';
    nameInput.pattern = '^\\W*(?:\\w{3,}\\b\\W*){2,}$';
    nameInput.placeholder = 'Enter name and surname';
    container.append(nameLabel, nameInput);
    return container;
  }

  getPurchaseModalFormGroupPersonTel(): HTMLElement {
    const container = this.getPurchaseModalFormGroupContainer();
    const telLabel = document.createElement('label');
    telLabel.innerHTML = 'Phone number'
    telLabel.htmlFor = 'person-phone';
    const telInput = document.createElement('input');
    telInput.required = true;
    telInput.id = 'person-phone';
    telInput.type = 'tel';
    telInput.pattern = '[+][0-9]{9,}';
    telInput.placeholder = 'Enter phone number';
    container.append(telLabel, telInput);
    return container;
  }

  getPurchaseModalFormGroupPersonAddress(): HTMLElement {
    const container = this.getPurchaseModalFormGroupContainer();
    const addressLabel = document.createElement('label');
    addressLabel.innerHTML = 'Delivery address'
    addressLabel.htmlFor = 'person-address';
    const addressInput = document.createElement('input');
    addressInput.required = true;
    addressInput.id = 'person-address';
    addressInput.type = 'text';
    addressInput.placeholder = 'Enter delivery address';
    container.append(addressLabel, addressInput);
    return container;
  }

  getPurchaseModalFormGroupPersonEmail(): HTMLElement {
    const container = this.getPurchaseModalFormGroupContainer();
    const emailLabel = document.createElement('label');
    emailLabel.innerHTML = 'E-mail'
    emailLabel.htmlFor = 'person-email';
    const emailInput = document.createElement('input');
    emailInput.required = true;
    emailInput.id = 'person-email';
    emailInput.type = 'email';
    emailInput.placeholder = 'Enter e-mail';
    container.append(emailLabel, emailInput);
    return container;
  }
}

export const appDrawer = new Drawer();

