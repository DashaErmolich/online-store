import { appDrawer } from '../drawer/drawer';
import { PromoCode } from '../../models/interfaces';
import { cartPage } from '../router/router';

export class CartSummaryPromoCode {
  promoCode: PromoCode;

  constructor(promoCode: PromoCode) {
    this.promoCode = promoCode;
  }

  getPromoCodeName(): HTMLElement {
    const promoCodeContainer = appDrawer.getSimpleElement('li', 'list-group-item d-flex justify-content-between lh-sm align-items-start');
    const promoCodeTitle: HTMLElement = appDrawer.getPromoCodeTitle(this.promoCode.description, this.promoCode.discountPercent);
    promoCodeContainer.append(promoCodeTitle);
    return promoCodeContainer;
  }

  getNewPromoCodeContent(): HTMLElement {
    const promoCodeBase = this.getPromoCodeName();

    const promoCodeAddButton: HTMLElement = appDrawer.getSimpleButton('', 'btn btn-link text-success fs-4 bi bi-plus-circle p-0');
    promoCodeAddButton.addEventListener('click', () => {
      this.listenPromoCodeAddButton();
    })

    promoCodeBase.append(promoCodeAddButton);
    return promoCodeBase;
  }

  getAppliedPromoCodeContent(): HTMLElement {
    const promoCodeBase = this.getPromoCodeName();
    
    const promoCodeRemoveButton: HTMLElement = appDrawer.getSimpleButton('', 'btn btn-link text-danger fs-4 bi bi-x-circle p-0');
    promoCodeRemoveButton.addEventListener('click', () => {
      this.listenPromoCodeRemoveButton();
    })

    promoCodeBase.append(promoCodeRemoveButton);
    return promoCodeBase;
  }

  listenPromoCodeAddButton() {
    cartPage.applyPromoCodeToCartSummary(this.promoCode);
  }

  listenPromoCodeRemoveButton() {
    cartPage.removePromoCodeFromCartSummary(this.promoCode);
  }
}