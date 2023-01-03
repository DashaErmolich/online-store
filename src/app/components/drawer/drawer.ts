import { CURRENCY_ICON_CLASS_NAME } from '../../constants/constants';
import { FormInput } from '../../models/interfaces';
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
    container.className = 'input-group mb-4';
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
    addressInput.pattern = '^\\W*(?:\\w{5,}\\b\\W*){3,}$';
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

  getPurchaseModalInputIcon(iconPath: string): HTMLImageElement {
    const purchaseModalInputIcon = document.createElement('img');
    purchaseModalInputIcon.src = iconPath;
    purchaseModalInputIcon.className = 'form-input-icon input-group-text';
    return purchaseModalInputIcon;
  }

  getPurchaseModalInput(inputModel: FormInput): HTMLInputElement {
    const purchaseModalInput = document.createElement('input');
    purchaseModalInput.className = 'form-control';
    purchaseModalInput.type = inputModel.inputType;
    purchaseModalInput.required = true;
    purchaseModalInput.placeholder = inputModel.placeholder;
    purchaseModalInput.id = inputModel.id;

    if (inputModel.validation.pattern) {
      purchaseModalInput.pattern = inputModel.validation['pattern'];
    }

    if (inputModel.validation.minLength) {
      purchaseModalInput.minLength = inputModel.validation['minLength'];
    }

    if (inputModel.validation.maxLength) {
      purchaseModalInput.maxLength = inputModel.validation['maxLength'];
    }
    
    return purchaseModalInput;
  }

  getPurchaseModalSubmitButton(): HTMLInputElement {
    const submitButton = document.createElement('input');
    submitButton.type = 'submit';
    submitButton.value = 'Submit';
    submitButton.className = 'btn btn-success'
    return submitButton;
  }

  getPurchaseModalInputLabel(text: string, id: string): HTMLElement {
    const inputLabel = document.createElement('label');
    inputLabel.className = 'form-label';
    inputLabel.innerHTML = text;
    inputLabel.htmlFor = id;
    return inputLabel;
  }

  getPurchaseModalInputError(): HTMLElement {
    const errorMessage = document.createElement('span');
    errorMessage.setAttribute('aria-live', 'polite');
    errorMessage.className = 'form-input-error';
    return errorMessage;
  }

  getPurchaseModalInputWrapper(input: HTMLInputElement, iconSrc: string): HTMLElement {
    const container = this.getPurchaseModalFormGroupContainer();
    const icon = this.getPurchaseModalInputIcon(iconSrc);
    const error = this.getPurchaseModalInputError();
    container.append(icon, input, error);
    return container;
  }

  getPurchaseModalOrderMessage(text: string): HTMLElement {
    const message = document.createElement('span');
    message.innerHTML = text;
    return message;
  }

  getPurchaseModal(form: HTMLElement, submitButton: HTMLElement): HTMLElement {
    const modal = document.createElement('section');
    modal.id = 'purchase-modal'
    modal.className = 'modal fade';
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('aria-labelladby', 'modal-title');
    modal.setAttribute('aria-hidden', 'true');
  
    const modalDialog = document.createElement('article');
    modalDialog.className = 'modal-dialog';
  
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';

    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.id = 'modal-title';

    const modalCloseButton = document.createElement('button');
    modalCloseButton.className = 'btn-close';
    modalCloseButton.type = 'button';
    modalCloseButton.setAttribute('data-bs-dismiss', 'modal');
    modalCloseButton.setAttribute('aria-label', 'Close');

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';

    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';

    modalHeader.append(modalTitle);
    modalHeader.append(modalCloseButton);

    modalBody.append(form);

    modalFooter.append(submitButton);

    modalContent.append(modalHeader);
    modalContent.append(modalBody);
    modalContent.append(modalFooter);

    modalDialog.append(modalContent);

    modal.append(modalDialog);
    return modal;
  }

  getPurchaseModalFormTitle(text: string): HTMLElement {
    const formBillingAddressTitle = document.createElement('h5');
    formBillingAddressTitle.className = 'mb-3'
    formBillingAddressTitle.innerHTML = text;
    return formBillingAddressTitle;
  }
}

export const appDrawer = new Drawer();

