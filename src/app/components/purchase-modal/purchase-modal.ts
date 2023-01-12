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
      this.validateForm(event, form, modal);
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
        userTelInput.value = userTelInput.value.split('+').join('');
        this.validateNumberInput(userTelInput)
        this.validateNumberInputFinal(userTelInput);
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
      creditCardNumberInput.value = creditCardNumberInput.value.split(' ').join('');
      this.validateNumberInput(creditCardNumberInput);
      this.setCreditCardIcon(creditCardNumberInput);
      this.validateCardNumberInput(creditCardNumberInput);
    })
    
    return creditCardNumberInput;
  }

  private getFormInputCardExpiration(): HTMLInputElement {
    const creditCardExpirationInput = appDrawer.getPurchaseModalInput(formCardExpirationModel);
    
    creditCardExpirationInput.addEventListener('input', () => {
      creditCardExpirationInput.value = creditCardExpirationInput.value.split('/').join('');
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

      if (!input.value.match(numberPattern)) {
        const valueArr = input.value.split('');
        const itemIndex = valueArr.findIndex((item) => !item.match(numberPattern));
        valueArr.splice(itemIndex, 1);
        input.value = valueArr.join('');
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
    if (input.value.length) {
      const current = input.value.split('');
      const myInput: string[] = [];
      current.forEach((item, idx) => {
        if (idx === 2) {
          myInput.push('/');
          myInput.push(item);
        } else {
          myInput.push(item);
        }
      })
      input.value = myInput.join('');
    }
  }

  private validateCardNumberInput(input: HTMLInputElement): void {

    if (input.value.length) {
      const current = input.value.split('');
      const myInput: string[] = [];
      current.forEach((item, idx) => {
        if (idx === 4 || idx === 8 || idx === 12) {
          myInput.push(' ');
          myInput.push(item);
        } else {
          myInput.push(item);
        }
      })
      input.value = myInput.join('');
    }
  }

  private validateNumberInputFinal(input: HTMLInputElement): void {
    if (input.value.length) {
      const current = input.value.split('');
      const myInput: string[] = [];
      current.forEach((item, idx) => {
        if (idx === 0) {
          myInput.push('+');
          myInput.push(item);
        } else {
          myInput.push(item);
        }
      })
      input.value = myInput.join('');
    }
  
  }

  private validateForm(event: Event, form: HTMLFormElement, modal: HTMLElement): void {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this.finishOrder(modal);
      setTimeout(() => {
        this.closeModal();
        appRouter.navigate(RouterPath.Main);
      }, 3000)
    }
    form.classList.add('was-validated');
  }

  private finishOrder(modal: HTMLElement): void {
    const modalBody = modal.querySelector('.modal-body');
    const modalFooter = modal.querySelector('.modal-footer');
    if (modalFooter) {
      modalFooter.innerHTML = '';
    }
    if (modalBody) {
      modalBody.innerHTML = '';
      const orderMessageText = 'Thank you for the order. You will be redirected to the main page';
      const orderMessage = appDrawer.getPurchaseModalOrderMessage(orderMessageText);
      modalBody.append(orderMessage);
      appStorage.emptyCart();
      cartPage.updateCartState();
    }

  }

  private closeModal(): void {
    const closeBtn = document.getElementById('purchase-modal-close-button');
    if (closeBtn && closeBtn instanceof HTMLElement) {
      closeBtn.click();
    }
  }
}