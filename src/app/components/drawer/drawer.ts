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
    container.className = 'input-group mb-4 has-validation';
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

  getPurchaseModalSvgObject(icon: string): HTMLElement {
    const object = document.createElement('object');
    object.id = 'credit-card-icon';
    object.data = icon;
    object.width = '16';
    object.height = '16';
    return object;
  }

  getPurchaseModalInputIcon(inputTemplate: FormInput): HTMLElement {
    const purchaseModalInputIcon = document.createElement('span');
    if (inputTemplate.iconClassName) {
      purchaseModalInputIcon.className = `input-group-text ${inputTemplate.iconClassName}`;
    }
    if (inputTemplate.icon) {
      purchaseModalInputIcon.className = 'input-group-text';
      const object = this.getPurchaseModalSvgObject(inputTemplate.icon);
      purchaseModalInputIcon.append(object);
    }
    return purchaseModalInputIcon;
  }

  getPurchaseModalInput(inputModel: FormInput): HTMLInputElement {
    const purchaseModalInput = document.createElement('input');
    purchaseModalInput.className = 'form-control';
    purchaseModalInput.type = inputModel.inputType;
    purchaseModalInput.required = true;
    purchaseModalInput.placeholder = inputModel.placeholder;
    purchaseModalInput.id = inputModel.id;

    if (inputModel.validationParameters.pattern) {
      purchaseModalInput.pattern = inputModel.validationParameters['pattern'];
    }

    if (inputModel.validationParameters.minLength) {
      purchaseModalInput.minLength = inputModel.validationParameters['minLength'];
    }

    if (inputModel.validationParameters.maxLength) {
      purchaseModalInput.maxLength = inputModel.validationParameters['maxLength'];
    }
    
    return purchaseModalInput;
  }

  getPurchaseModalSubmitButton(): HTMLElement {
    const submitButton = document.createElement('button');
    submitButton.className = 'btn btn-primary';
    submitButton.type = 'submit';
    submitButton.innerHTML = 'Submit';
    return submitButton;
  }

  getPurchaseModalInputLabel(text: string, id: string): HTMLElement {
    const inputLabel = document.createElement('label');
    inputLabel.className = 'form-label';
    inputLabel.innerText = text;
    inputLabel.htmlFor = id;
    return inputLabel;
  }

  getPurchaseModalInputError(errorMessage: string): HTMLElement {
    const error = document.createElement('div');
    error.className = 'invalid-feedback';
    error.innerHTML = errorMessage;
    return error;
  }

  getPurchaseModalInputGroup(input: HTMLInputElement, inputTemplate: FormInput): HTMLElement {
    const container = document.createElement('div');
    container.className = 'form-field'
    const label = this.getPurchaseModalInputLabel(inputTemplate.label, inputTemplate.id);
    container.append(label);
    
    const inputGroup = this.getPurchaseModalFormGroupContainer();

    if (inputTemplate.iconClassName || inputTemplate.icon) {
      const icon: HTMLElement = this.getPurchaseModalInputIcon(inputTemplate);
      inputGroup.append(icon);
    }

    const errorMessage = this.getPurchaseModalInputError(inputTemplate.validationErrorMessage);
    inputGroup.append(input, errorMessage);
    container.append(inputGroup);
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
    modalCloseButton.id = 'purchase-modal-close-button';
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

  getPurchaseModalForm(): HTMLFormElement {
    const form = document.createElement('form');
    form.className = 'needs-validation';
    form.setAttribute('novalidate', '');
    return form;
  }

  getPurchaseModalContainer(title: string, className: string): HTMLElement {
    const formContainer = document.createElement('div');
    const formContainerTitle = this.getPurchaseModalFormTitle(title);
    formContainer.className = className;
    formContainer.append(formContainerTitle);
    return formContainer;
  }

  getProductDetailsCardHorizontalWrapper(): HTMLElement {
    const cardContainer = document.createElement('div');
    cardContainer.className = 'card mb-3';
    const card = document.createElement('div');
    card.className = 'row g-0';
    cardContainer.append(card);
    return cardContainer;
  }

  getProductDetailsCarousel(carouselId: string): HTMLElement {
    const carousel = document.createElement('div');
    carousel.className = 'carousel slide';
    carousel.id = carouselId;
    return carousel;
  }

  getProductDetailsCarouselIndicators(carouselId: string, images: string[], title: string): HTMLElement {
    const carouselIndicators = document.createElement('div');
    carouselIndicators.className = 'carousel-indicators';

    let i = 0;

    while (i < images.length) {
      const src = images[i];
      const alt = `${title} (${i + 1})`;
      const button = this.getProductDetailsCarouselIndicatorsButton(carouselId, i);
      if (i === 0) {
        button.classList.add('active');
      }
      const image = this.getProductDetailsCarouselImage(src, alt);
      button.append(image);
      carouselIndicators.append(button);
      i++;
    }
    return carouselIndicators;
  }

  getProductDetailsCarouselInner(images: string[], title: string): HTMLElement {
    const carouselInner = document.createElement('div');
    carouselInner.className = 'carousel-inner';

    let i = 0;

    while (i < images.length) {
      const src = images[i];
      const alt = `${title} (${i + 1})`;
      const wrapper = document.createElement('div');
      wrapper.className = 'carousel-item';
      if (i === 0) {
        wrapper.classList.add('active');
      }
      const image = this.getProductDetailsCarouselImage(src, alt);
      wrapper.append(image);
      carouselInner.append(wrapper);
      i++;
    }
    return carouselInner;
  }

  getProductDetailsCarouselControl(carouselId: string, direction: string, text: string): HTMLElement {
    const button = document.createElement('button');
    button.className = `carousel-control-${direction}`;
    button.type = 'button';
    button.setAttribute('data-bs-target', `#${carouselId}`);
    button.setAttribute('data-bs-slide', direction);
    const icon = document.createElement('span');
    icon.className = `carousel-control-${direction}-icon`;
    icon.setAttribute('aria-hidden', 'true');
    const title = document.createElement('span');
    title.className = 'visually-hidden';
    title.innerHTML = text;
    button.append(icon, title)
    return button;
  }

  getProductDetailsCarouselIndicatorsButton(carouselId: string, slideIdx: number): HTMLElement {
    const button = document.createElement('button');
    button.setAttribute('data-bs-target', `#${carouselId}`);
    button.setAttribute('data-bs-slide-to', `${slideIdx}`);
    button.setAttribute('aria-current', 'true');
    button.setAttribute('aria-label', `Slide ${slideIdx + 1}`);
    return button;
  }

  getProductDetailsCarouselImage(imageSrc: string, imageAlt: string): HTMLElement {
    const image = document.createElement('img');
    image.className = 'd-block w-100';
    image.src = imageSrc;
    image.alt = imageAlt;
    return image;
  }
}

export const appDrawer = new Drawer();


