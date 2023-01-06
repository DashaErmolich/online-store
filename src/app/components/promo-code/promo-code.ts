import { appDrawer } from '../drawer/drawer';
import { PromoCode } from '../../models/interfaces';
import { cartPage } from '../router/router';

export class CartSummaryPromoCode {
  promoCode: PromoCode;

  constructor(promoCode: PromoCode) {
    this.promoCode = promoCode;
  }

  getPromoCodeName(): HTMLElement {
    const promoCodeContainer: HTMLElement = document.createElement('div');
    const promoCodeTitle: HTMLElement = appDrawer.getPromoCodeTitle(this.promoCode.description, this.promoCode.discountPercent);
    promoCodeContainer.append(promoCodeTitle);
    return promoCodeContainer;
  }

  getNewPromoCodeContent(): HTMLElement {
    const promoCodeBase = this.getPromoCodeName();

    const promoCodeAddButton: HTMLElement = appDrawer.getSimpleButton('Add', 'btn-btn-dark');
    promoCodeAddButton.addEventListener('click', () => {
      this.listenPromoCodeAddButton();
    })

    promoCodeBase.append(promoCodeAddButton);
    return promoCodeBase;
  }

  getAppliedPromoCodeContent(): HTMLElement {
    const promoCodeBase = this.getPromoCodeName();
    
    const promoCodeRemoveButton: HTMLElement = appDrawer.getSimpleButton('Remove', 'btn-btn-dark');
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