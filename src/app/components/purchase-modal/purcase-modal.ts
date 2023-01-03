import { appDrawer } from '../drawer/drawer';
import { CREDIT_CARD_NUMBER_LENGTH, CREDIT_CARD_EXPIRED_LENGTH, CREDIT_CARD_CVV_LENGTH, CREDIT_CARD_NUMBER_STARTING_VISA, CREDIT_CARD_NUMBER_STARTING_MASTERCARD, CREDIT_CARD_NUMBER_STARTING_JCB, USER_NAME_ICON, USER_TEL_ICON, USER_ADDRESS_ICON, USER_EMAIL_ICON, CREDIT_CARD_NUMBER_DEFAULT_ICON, CREDIT_CARD_NUMBER_VISA_ICON, CREDIT_CARD_NUMBER_MASTERCARD_ICON, CREDIT_CARD_NUMBER_JCB_ICON, USER_NAME_MAX_LENGTH, USER_TEL_LENGTH, USER_ADDRESS_MAX_LENGTH, USER_EMAIL_MAX_LENGTH } from '../../constants/constants';

export class PurchaseModal {
  userNamePattern = '^\\W*(?:\\w{3,}\\b\\W*){2,}$';
  userTelPattern = '^[+][0-9]{9,}';
  userAddressPattern = '^\\W*(?:\\w{5,}\\b\\W*){3,}$';
  userEmailPattern = '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$';
  creditCardExpiredPattern = '^(0[1-9]|1[0-2])\\/?([0-9]{2}|[0-9]{2})$';

  creditCardNumberVisaPattern = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
  creditCardNumberMasterCardPattern = /^(?:5[1-5][0-9]{14})$/;
  creditCardNumberJCBPattern = /^(?:(?:2131|1800|35\d{3})\d{11})$/;

  getPurchaseModalContent(): HTMLElement {
    const form = document.createElement('form');

    const userNameInput = this.getPurchaseModalFormGroupPersonName();
    const userNameInputContainer = appDrawer.getPurchaseModalInputWrapper(userNameInput, USER_NAME_ICON);

    const userTelInput = this.getPurchaseModalFormGroupPersonTel();
    const userTelInputContainer = appDrawer.getPurchaseModalInputWrapper(userTelInput, USER_TEL_ICON);

    const userAddressInput = this.getPurchaseModalFormGroupPersonAddress();
    const userAddressInputContainer = appDrawer.getPurchaseModalInputWrapper(userAddressInput, USER_ADDRESS_ICON);

    const userEmailInput = this.getPurchaseModalFormGroupPersonEmail();
    const userEmailInputContainer = appDrawer.getPurchaseModalInputWrapper(userEmailInput, USER_EMAIL_ICON);

    const creditCardContainer = document.createElement('article');

    const creditCardNumberInput = this.getPurchaseModalCreditCardNumber();
    const creditCardNumberInputWrapper = appDrawer.getPurchaseModalInputWrapper(creditCardNumberInput, CREDIT_CARD_NUMBER_DEFAULT_ICON);

    const creditCardExpiredInput = this.getPurchaseModalCreditCardExpired();

    const creditCardCVVInput = this.getPurchaseModalCreditCardCVV();

    creditCardContainer.append(creditCardNumberInputWrapper, creditCardExpiredInput, creditCardCVVInput)

    const submitButton = this.getPurchaseModalSubmitButton();

    submitButton.addEventListener('click', () => {
      this.validateForm(creditCardNumberInput.value, creditCardExpiredInput.value, creditCardCVVInput.value);
    })

    form.append(userNameInputContainer, userTelInputContainer, userAddressInputContainer, userEmailInputContainer, creditCardContainer, submitButton);

    return form;
  }

  getPurchaseModalFormGroupPersonName(): HTMLInputElement {
    const userNameInputId = 'user-name';
    const userNameInputPlaceholder = 'Name Surname';
    const userNameInputType = 'text';
    
    const userNameInput = appDrawer.getPurchaseModalInput(userNameInputType, userNameInputPlaceholder, userNameInputId, this.userNamePattern);
    
    userNameInput.maxLength = USER_NAME_MAX_LENGTH;
    
    return userNameInput;
  }

  getPurchaseModalFormGroupPersonTel(): HTMLInputElement {
    const userTelInputId = 'user-tel';
    const userTelInputPlaceholder = '+123456789';
    const userTelInputType = 'tel';
    
    const userTelInput = appDrawer.getPurchaseModalInput(userTelInputType, userTelInputPlaceholder, userTelInputId, this.userTelPattern);
    
    userTelInput.minLength = USER_TEL_LENGTH;
    userTelInput.maxLength = USER_TEL_LENGTH;

    userTelInput.addEventListener('input', () => {

      if (userTelInput.value.length === 1) {
        this.listenPlusInput(userTelInput)
      }

      if (userTelInput.value.length >= 2) {
        this.listenOnlyNumberInput(userTelInput)
      }
    })

    return userTelInput;
  }

  getPurchaseModalFormGroupPersonAddress(): HTMLInputElement {
    const userAddressInputId = 'user-address';
    const userAddressInputPlaceholder = 'Delivery address';
    const userAddressInputType = 'text';
    
    const userAddressInput = appDrawer.getPurchaseModalInput(userAddressInputType, userAddressInputPlaceholder, userAddressInputId, this.userAddressPattern);
    
    userAddressInput.maxLength = USER_ADDRESS_MAX_LENGTH;
    
    return userAddressInput;
  }

  getPurchaseModalFormGroupPersonEmail(): HTMLInputElement {
    const userEmailInputId = 'user-email';
    const userEmailInputPlaceholder = 'username@example.com';
    const userEmailInputType = 'email';
    
    const userEmailInput = appDrawer.getPurchaseModalInput(userEmailInputType, userEmailInputPlaceholder, userEmailInputId, this.userEmailPattern);
    
    userEmailInput.maxLength = USER_EMAIL_MAX_LENGTH;
    
    return userEmailInput;
  }

  getPurchaseModalCreditCardNumber(): HTMLInputElement {
    const creditCardNumberInputId = 'credit-card-number';
    const creditCardNumberInputPlaceholder = 'Card number (16 digits)';
    const creditCardNumberInputType = 'text';

    const creditCardNumberInput = appDrawer.getPurchaseModalInput(creditCardNumberInputType, creditCardNumberInputPlaceholder, creditCardNumberInputId);
    
    creditCardNumberInput.minLength = CREDIT_CARD_NUMBER_LENGTH;
    creditCardNumberInput.maxLength = CREDIT_CARD_NUMBER_LENGTH;

    creditCardNumberInput.addEventListener('input', () => {
      this.listenOnlyNumberInput(creditCardNumberInput);
      this.listenCreditCardNumber(creditCardNumberInput);
    })
    
    return creditCardNumberInput;
  }

  getPurchaseModalCreditCardExpired(): HTMLInputElement {
    
    const creditCardExpiredInput = appDrawer.getPurchaseModalInput('text', 'MM/YY', 'credit-card-expired', this.creditCardExpiredPattern);
    
    creditCardExpiredInput.minLength = CREDIT_CARD_EXPIRED_LENGTH + 1;
    creditCardExpiredInput.maxLength = creditCardExpiredInput.minLength;
    
    creditCardExpiredInput.addEventListener('input', () => {
      this.listenOnlyNumberInput(creditCardExpiredInput);
      this.listenCreditCardExpiredInput(creditCardExpiredInput);
    })
    
    return creditCardExpiredInput;
  }

  getPurchaseModalCreditCardCVV(): HTMLInputElement {
    const creditCardCVVInput = appDrawer.getPurchaseModalInput('text', 'CVV', 'credit-card-cvv');
    
    creditCardCVVInput.minLength = CREDIT_CARD_CVV_LENGTH;
    creditCardCVVInput.maxLength = CREDIT_CARD_CVV_LENGTH;
    
    creditCardCVVInput.addEventListener('input', () => {
      this.listenOnlyNumberInput(creditCardCVVInput);
    })
    return creditCardCVVInput;
  }

  getPurchaseModalSubmitButton(): HTMLInputElement {
    const submitButton = appDrawer.getPurchaseModalSubmitButton();
    
    submitButton.addEventListener('click', (event: Event) => {
      event.preventDefault();
    })
    
    return submitButton;
  }

  listenOnlyNumberInput(input: HTMLInputElement): void {
    if (input.value.length) {
      const numberPattern = new RegExp(/^[0-9]*$/);
      if (!input.value[input.value.length - 1].match(numberPattern)) {
        input.value = input.value.slice(0, -1);
      }
    }
  }

  listenCreditCardNumber(input: HTMLInputElement): void {
    switch (input.value[0]) {

      case String(CREDIT_CARD_NUMBER_STARTING_VISA):
        this.setCreditCardIcon(input, CREDIT_CARD_NUMBER_VISA_ICON);
        break;

      case String(CREDIT_CARD_NUMBER_STARTING_MASTERCARD):
        this.setCreditCardIcon(input, CREDIT_CARD_NUMBER_MASTERCARD_ICON);
        break;

      case String(CREDIT_CARD_NUMBER_STARTING_JCB):
        this.setCreditCardIcon(input, CREDIT_CARD_NUMBER_JCB_ICON);
        break;

      case undefined:
        this.setCreditCardIcon(input, CREDIT_CARD_NUMBER_DEFAULT_ICON);
        break;

      default:
        this.setCreditCardIcon(input, CREDIT_CARD_NUMBER_DEFAULT_ICON);
        break;
    }
  }

  setCreditCardIcon(input: HTMLInputElement, iconSrc: string) {
    const parent = input.parentElement;
    
    if (parent) {
      const icon = parent.querySelector('.form-input-icon');
      if (icon instanceof HTMLImageElement) {
        icon.src = iconSrc;
      }
    }
  }

  listenPlusInput(input: HTMLInputElement): void {
    if (input.value !== '+') {
      input.value = input.value.slice(0, -1);
    }
  }

  listenCreditCardExpiredInput(input: HTMLInputElement): void {
    if (input.value.length === 3) {
      input.value = `${input.value[0]}${input.value[1]}/${input.value[2]}`;
    }
  }

  listenCreditCardNumberInput(input: HTMLInputElement): void {
    if (input.value.length === 3) {
      input.value = `${input.value[0]}${input.value[1]}/${input.value[2]}`;
    }
  }
  

  validateForm(creditCardNumber: string, creditCardExpired: string, creditCardCVV: string): void {
    if (creditCardNumber.match(this.creditCardNumberVisaPattern)) {
      console.log('visa')
    } else if (creditCardNumber.match(this.creditCardNumberMasterCardPattern)) {
      console.log('master card')
    } else if (creditCardNumber.match(this.creditCardNumberJCBPattern)) {
      console.log('JCB')
    } else {
      console.log('else')
    }
    console.log(creditCardExpired, creditCardCVV)
  }

}