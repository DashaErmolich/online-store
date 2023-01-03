import { appDrawer } from '../drawer/drawer';
import { CREDIT_CARD_EXPIRED_ICON, CREDIT_CARD_CVV_ICON, CREDIT_CARD_NUMBER_STARTING_VISA, CREDIT_CARD_NUMBER_VISA_ICON, CREDIT_CARD_NUMBER_STARTING_MASTERCARD, CREDIT_CARD_NUMBER_STARTING_JCB, CREDIT_CARD_NUMBER_MASTERCARD_ICON, CREDIT_CARD_NUMBER_JCB_ICON, CREDIT_CARD_NUMBER_DEFAULT_ICON, USER_NAME_ICON, USER_TEL_ICON, USER_ADDRESS_ICON, USER_EMAIL_ICON, formUserNameModel, formUserTelModel, formUserAddressModel, formUserEmailModel, formCardNumberModel, formCardExpirationModel, formCardCVVModel } from '../../constants/constants';
import { appRouter, cartPage } from '../router/router';
import { RouterPath } from '../../enums/enums';
import { appStorage } from '../storage/app-storage';

export class PurchaseModal {

  public getPurchaseModalContent(): HTMLElement {
    const form = document.createElement('form');
    const validationInputsStates: HTMLInputElement[] = [];

    const billingAddressContainer = document.createElement('div');
    const billingAddressTitle = appDrawer.getPurchaseModalFormTitle('Billing address');

    const userNameInput = this.getPurchaseModalFormGroupPersonName();
    validationInputsStates.push(userNameInput);
    const userNameInputLabel = appDrawer.getPurchaseModalInputLabel('Name and surname:', userNameInput.id);
    const userNameInputContainer = appDrawer.getPurchaseModalInputWrapper(userNameInput, USER_NAME_ICON);

    const userTelInput = this.getPurchaseModalFormGroupPersonTel();
    validationInputsStates.push(userTelInput);
    const userTelInputLabel = appDrawer.getPurchaseModalInputLabel('Telephone:', userTelInput.id);
    const userTelInputContainer = appDrawer.getPurchaseModalInputWrapper(userTelInput, USER_TEL_ICON);

    const userAddressInput = this.getPurchaseModalFormGroupPersonAddress();
    validationInputsStates.push(userAddressInput);
    const userAddressInputLabel = appDrawer.getPurchaseModalInputLabel('Delivery address:', userAddressInput.id);
    const userAddressInputContainer = appDrawer.getPurchaseModalInputWrapper(userAddressInput, USER_ADDRESS_ICON);

    const userEmailInput = this.getPurchaseModalFormGroupPersonEmail();
    validationInputsStates.push(userEmailInput);
    const userEmailInputLabel = appDrawer.getPurchaseModalInputLabel('E-mail address:', userEmailInput.id);
    const userEmailInputContainer = appDrawer.getPurchaseModalInputWrapper(userEmailInput, USER_EMAIL_ICON);

    billingAddressContainer.append(billingAddressTitle, userNameInputLabel, userNameInputContainer, userTelInputLabel, userTelInputContainer, userAddressInputLabel, userAddressInputContainer, userEmailInputLabel, userEmailInputContainer,)

    const creditCardContainer = document.createElement('div');

    const creditCardContainerTitle = appDrawer.getPurchaseModalFormTitle('Payment');
    creditCardContainer.append(creditCardContainerTitle);

    const creditCardNumberInput = this.getValidatedCardNumberInput();
    validationInputsStates.push(creditCardNumberInput);
    const creditCardNumberInputLabel = appDrawer.getPurchaseModalInputLabel('Credit card number:', creditCardNumberInput.id);
    const creditCardNumberInputWrapper = appDrawer.getPurchaseModalInputWrapper(creditCardNumberInput, CREDIT_CARD_NUMBER_DEFAULT_ICON);

    const creditCardExpiredInput = this.getValidatedCardExpirationInput();
    validationInputsStates.push(creditCardExpiredInput);
    const creditCardExpiredInputLabel = appDrawer.getPurchaseModalInputLabel('Expiration:', creditCardExpiredInput.id);
    const creditCardExpiredInputWrapper = appDrawer.getPurchaseModalInputWrapper(creditCardExpiredInput, CREDIT_CARD_EXPIRED_ICON);

    const creditCardCVVInput = this.getValidatedCardCvvInput();
    validationInputsStates.push(creditCardCVVInput);
    const creditCardCVVInputLabel = appDrawer.getPurchaseModalInputLabel('CVV:', creditCardCVVInput.id);
    const creditCardCVVInputWrapper = appDrawer.getPurchaseModalInputWrapper(creditCardCVVInput, CREDIT_CARD_CVV_ICON);

    const creditCardExpiredAndCVVWrapper = document.createElement('div');
    creditCardExpiredAndCVVWrapper.className = 'row';
    const creditCardExpiredWrapper = document.createElement('div');
    creditCardExpiredWrapper.className = 'col';
    creditCardExpiredWrapper.append(creditCardExpiredInputLabel, creditCardExpiredInputWrapper);
    const creditCardCVVWrapper = document.createElement('div');
    creditCardCVVWrapper.className = 'col';
    creditCardCVVWrapper.append(creditCardCVVInputLabel, creditCardCVVInputWrapper);
    creditCardExpiredAndCVVWrapper.append(creditCardExpiredWrapper, creditCardCVVWrapper);

    creditCardContainer.append(creditCardNumberInputLabel, creditCardNumberInputWrapper, creditCardExpiredAndCVVWrapper)

    const submitButton = this.getFormSubmitButton();

    submitButton.addEventListener('click', () => {
      this.validateForm(form, validationInputsStates);
    })

    form.append(billingAddressContainer, creditCardContainer);

    const modal = appDrawer.getPurchaseModal(form, submitButton);
    return modal;
  }

  private getPurchaseModalFormGroupPersonName(): HTMLInputElement {
    const userNameInput = appDrawer.getPurchaseModalInput(formUserNameModel);
    return userNameInput;
  }

  private getPurchaseModalFormGroupPersonTel(): HTMLInputElement {
    const userTelInput = appDrawer.getPurchaseModalInput(formUserTelModel);
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

  private getPurchaseModalFormGroupPersonAddress(): HTMLInputElement {
    const userAddressInput = appDrawer.getPurchaseModalInput(formUserAddressModel);
    return userAddressInput;
  }

  private getPurchaseModalFormGroupPersonEmail(): HTMLInputElement {
    const userEmailInput = appDrawer.getPurchaseModalInput(formUserEmailModel);
    return userEmailInput;
  }

  private getValidatedCardNumberInput(): HTMLInputElement {
    const creditCardNumberInput = appDrawer.getPurchaseModalInput(formCardNumberModel);
    
    creditCardNumberInput.addEventListener('input', () => {
      this.listenOnlyNumberInput(creditCardNumberInput);
      this.setCardIcon(creditCardNumberInput);
    })
    
    return creditCardNumberInput;
  }

  private getValidatedCardExpirationInput(): HTMLInputElement {
    const creditCardExpirationInput = appDrawer.getPurchaseModalInput(formCardExpirationModel);
    
    creditCardExpirationInput.addEventListener('input', () => {
      this.listenOnlyNumberInput(creditCardExpirationInput);
      this.listenCreditCardExpiredInput(creditCardExpirationInput);
    })
    
    return creditCardExpirationInput;
  }

  private getValidatedCardCvvInput(): HTMLInputElement {
    const creditCardCVVInput = appDrawer.getPurchaseModalInput(formCardCVVModel);
    
    creditCardCVVInput.addEventListener('input', () => {
      this.listenOnlyNumberInput(creditCardCVVInput);
    })

    return creditCardCVVInput;
  }

  private getFormSubmitButton(): HTMLInputElement {
    const submitButton = appDrawer.getPurchaseModalSubmitButton();
    
    submitButton.addEventListener('click', (event: Event) => {
      event.preventDefault();
    })
    
    return submitButton;
  }

  private listenOnlyNumberInput(input: HTMLInputElement): void {
    if (input.value.length) {
      const numberPattern = new RegExp(/^[0-9]*$/);

      if (!input.value[input.value.length - 1].match(numberPattern)) {
        input.value = input.value.slice(0, -1);
      }
    }
  }

  private setCardIcon(input: HTMLInputElement): void {
    const cardFirstDigit = input.value[0];
    switch (cardFirstDigit) {

      case String(CREDIT_CARD_NUMBER_STARTING_VISA):
        this.setCreditCardIcon(input, CREDIT_CARD_NUMBER_VISA_ICON);
        break;

      case String(CREDIT_CARD_NUMBER_STARTING_MASTERCARD):
        this.setCreditCardIcon(input, String(CREDIT_CARD_NUMBER_MASTERCARD_ICON));
        break;

      case String(CREDIT_CARD_NUMBER_STARTING_JCB):
        this.setCreditCardIcon(input, String(CREDIT_CARD_NUMBER_JCB_ICON));
        break;

      case undefined:
        this.setCreditCardIcon(input, String(CREDIT_CARD_NUMBER_DEFAULT_ICON));
        break;

      default:
        this.setCreditCardIcon(input, String(CREDIT_CARD_NUMBER_DEFAULT_ICON));
        break;
    }
  }

  private setCreditCardIcon(input: HTMLInputElement, iconSrc: string) {
    const parent = input.parentElement;

    if (parent) {
      const icon = parent.querySelector('.form-input-icon');
      if (icon instanceof HTMLImageElement) {
        icon.src = iconSrc;
      }
    }
  }

  private listenPlusInput(input: HTMLInputElement): void {
    if (input.value !== '+') {
      input.value = input.value.slice(0, -1);
    }
  }

  private listenCreditCardExpiredInput(input: HTMLInputElement): void {
    if (input.value.length === 3) {
      input.value = `${input.value[0]}${input.value[1]}/${input.value[2]}`;
    }
  }

  private listenCreditCardNumberInput(input: HTMLInputElement): void {
    if (input.value.length === 3) {
      input.value = `${input.value[0]}${input.value[1]}/${input.value[2]}`;
    }
  }
  

  private validateForm(form: HTMLFormElement, validationInputs: HTMLInputElement[]): void {
    const inputValidity: boolean[] = [];
    validationInputs.forEach((input) => {
      if (!input.validity.valid) {
        inputValidity.push(false);
        const parent = input.parentElement;
        if (parent) {
          const errorMessage = parent.querySelector('.form-input-error');
          if (errorMessage instanceof HTMLElement) {
            this.showFormError(input, errorMessage);
          }}
      } else {
        inputValidity.push(true);
      }
    })

    if (inputValidity.every((isValidInput) => isValidInput === true)) {
      this.finishOrder(form);
      setTimeout(() => {
        appRouter.navigate(RouterPath.Main);
      }, 3000)
    }
  }

  private showFormError(input: HTMLInputElement, errorMessage: HTMLElement): void {
    if (input.validity.valueMissing) {
      errorMessage.innerHTML = 'This field can not be empty';
    } else {
      errorMessage.innerHTML = 'Enter correct data';
    }
  }

  private finishOrder(form: HTMLFormElement): void {
    form.innerHTML = '';
    const orderMessageText = 'Thank you for the order. You will be redirected to the main page';
    const orderMessage = appDrawer.getPurchaseModalOrderMessage(orderMessageText);
    form.append(orderMessage);
    appStorage.emptyCart();
    cartPage.setCartState();
  }

}