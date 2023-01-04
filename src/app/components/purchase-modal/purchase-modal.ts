import { appDrawer } from '../drawer/drawer';
import { formUserNameModel, formUserTelModel, formUserAddressModel, formUserEmailModel, formCardNumberModel, formCardExpirationModel, formCardCVVModel, creditCardVisa, creditCardMastercard, creditCardJCB, creditCardDefault } from '../../constants/constants';
import { appStorage } from '../storage/app-storage';
import { cartPage, appRouter } from '../router/router';
import { RouterPath } from '../../enums/enums';
import { CreditCard, FormInput } from '../../models/interfaces';

export class PurchaseModal {

  public getPurchaseModalContent(): HTMLElement {
    const form = appDrawer.getPurchaseModalForm();

    const billingAddressContainer = appDrawer.getPurchaseModalContainer('Billing address', 'form-billing-address');
    const creditCardContainer = appDrawer.getPurchaseModalContainer('Payment', 'form-payment row');

    const formFieldUserName = this.getFormField(this.getFormInputUserName, formUserNameModel);
    const formFieldUserTel = this.getFormField(this.getFormInputUserTel, formUserTelModel);
    const formFieldUserAddress = this.getFormField(this.getFormInputUserAddress, formUserAddressModel);
    const formFieldUserEmail = this.getFormField(this.getFormInputUserEmail, formUserEmailModel);
    const formFieldCardNumber = this.getFormField(this.getFormInputCardNumber, formCardNumberModel);
    const formFieldCardExpiration = this.getFormField(this.getFormInputCardExpiration, formCardExpirationModel);
    const formFieldCardCVV = this.getFormField(this.getFormInputCardCVV, formCardCVVModel);
    
    formFieldCardExpiration.classList.add('col');
    formFieldCardCVV.classList.add('col');

    billingAddressContainer.append(formFieldUserName, formFieldUserTel, formFieldUserAddress, formFieldUserEmail);
    creditCardContainer.append(formFieldCardNumber, formFieldCardExpiration, formFieldCardCVV)

    const submitButton = appDrawer.getPurchaseModalSubmitButton();
    submitButton.addEventListener('click', (event) => {
      this.validateForm(event, form);
    })

    form.append(billingAddressContainer, creditCardContainer);

    const modal = appDrawer.getPurchaseModal(form, submitButton);
    return modal;
  }

  private getFormField(cb: () => HTMLInputElement, inputTemplate: FormInput): HTMLElement {
    const input = cb.bind(this)();
    const inputGroup = appDrawer.getPurchaseModalInputGroup(input, inputTemplate);
    return inputGroup;
  }

  private getFormInputUserName(): HTMLInputElement {
    const userNameInput = appDrawer.getPurchaseModalInput(formUserNameModel);
    return userNameInput;
  }

  private getFormInputUserTel(): HTMLInputElement {
    const userTelInput = appDrawer.getPurchaseModalInput(formUserTelModel);
    userTelInput.addEventListener('input', () => {

      if (userTelInput.value.length === 1) {
        this.validateUserTelInput(userTelInput)
      }

      if (userTelInput.value.length >= 2) {
        this.validateNumberInput(userTelInput)
      }
    })

    return userTelInput;
  }

  private getFormInputUserAddress(): HTMLInputElement {
    const userAddressInput = appDrawer.getPurchaseModalInput(formUserAddressModel);
    return userAddressInput;
  }

  private getFormInputUserEmail(): HTMLInputElement {
    const userEmailInput = appDrawer.getPurchaseModalInput(formUserEmailModel);
    return userEmailInput;
  }

  private getFormInputCardNumber(): HTMLInputElement {
    const creditCardNumberInput = appDrawer.getPurchaseModalInput(formCardNumberModel);
    
    creditCardNumberInput.addEventListener('input', () => {
      this.validateNumberInput(creditCardNumberInput);
      if (creditCardNumberInput.value.length <= 1) {
        this.setCreditCardIcon(creditCardNumberInput);
      }
      this.validateCardNumberInput(creditCardNumberInput);
    })
    
    return creditCardNumberInput;
  }

  private getFormInputCardExpiration(): HTMLInputElement {
    const creditCardExpirationInput = appDrawer.getPurchaseModalInput(formCardExpirationModel);
    
    creditCardExpirationInput.addEventListener('input', () => {
      this.validateNumberInput(creditCardExpirationInput);
      this.validateCardExpirationInput(creditCardExpirationInput);
    })
    
    return creditCardExpirationInput;
  }

  private getFormInputCardCVV(): HTMLInputElement {
    const creditCardCVVInput = appDrawer.getPurchaseModalInput(formCardCVVModel);
    
    creditCardCVVInput.addEventListener('input', () => {
      this.validateNumberInput(creditCardCVVInput);
    })

    return creditCardCVVInput;
  }

  private validateNumberInput(input: HTMLInputElement): void {
    if (input.value.length) {
      const numberPattern = new RegExp(/^[0-9]*$/);

      if (!input.value[input.value.length - 1].match(numberPattern)) {
        input.value = input.value.slice(0, -1);
      }
    }
  }

  private setCreditCardIcon(input: HTMLInputElement): void {
    const cardNumberFirstDigit = Number(input.value[0]);
    let creditCard: CreditCard;

    if (cardNumberFirstDigit === creditCardVisa.firstDigit) {
      creditCard = creditCardVisa;
    } else if (cardNumberFirstDigit === creditCardMastercard.firstDigit) {
      creditCard = creditCardMastercard;
    } else if (cardNumberFirstDigit === creditCardJCB.firstDigit) {
      creditCard = creditCardJCB;
    } else {
      creditCard = creditCardDefault;
    }

    this.changeCreditCarIcon(creditCard.icon);
  }

  private changeCreditCarIcon(icon: string) {
    const svgObject = document.getElementById('credit-card-icon');
    if (svgObject instanceof HTMLObjectElement && svgObject.data !== icon) {
      svgObject.data = icon;
    }
  }

  private validateUserTelInput(input: HTMLInputElement): void {
    if (input.value !== '+') {
      input.value = input.value.slice(0, -1);
    }
  }

  private validateCardExpirationInput(input: HTMLInputElement): void {
    if (input.value.length === 3) {
      input.value = `${input.value[0]}${input.value[1]}/${input.value[2]}`;
    }
  }

  private validateCardNumberInput(input: HTMLInputElement): void {
    const separateDigitGroupLength = 4;

    if (input.value.length && input.value.length % (separateDigitGroupLength + 1) === 0) {
      const separateDigitGroupLastDigitIndex = input.value.length - 1;
      const newInputValue: string[] = input.value.split('');
      newInputValue.splice(separateDigitGroupLastDigitIndex, 0, ' ');
      input.value = newInputValue.join('');
    }
  }

  private validateForm(event: Event, form: HTMLFormElement): void {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.finishOrder(form);
      setTimeout(() => {
        this.closeModal();
        appRouter.navigate(RouterPath.Main);
      }, 3000)
    }
    form.classList.add('was-validated');
  }

  private finishOrder(form: HTMLFormElement): void {
    form.innerHTML = '';
    const orderMessageText = 'Thank you for the order. You will be redirected to the main page';
    const orderMessage = appDrawer.getPurchaseModalOrderMessage(orderMessageText);
    form.append(orderMessage);
    appStorage.emptyCart();
    cartPage.setCartState();
  }

  private closeModal(): void {
    const closeBtn = document.getElementById('purchase-modal-close-button');
    if (closeBtn && closeBtn instanceof HTMLElement) {
      closeBtn.click();
    }
  }
}