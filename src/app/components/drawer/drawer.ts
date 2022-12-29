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
    const container = document.createElement('div');
    const title = document.createElement('span');
    title.innerHTML = 'Total: ';
    const item = document.createElement('span');
    item.id = 'cart-summary-products-sum';
    item.innerHTML = `${cartTotalSum}`;
    const icon = this.getCurrencyIcon();
    container.append(title, item, icon);
    return container;
  }

  getCartSummaryTotalSumDiscount(cartTotalSumDiscount: number): HTMLElement {
    const container = document.createElement('div');
    const title = document.createElement('span');
    title.innerHTML = 'Total with discount: ';
    const item = document.createElement('span');
    item.id = 'cart-summary-products-sum-discount';
    item.innerHTML = `${cartTotalSumDiscount}`;
    const icon = this.getCurrencyIcon();
    container.append(title, item, icon);
    return container;
  } 

  getCartSummaryPromoCodeInput(): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control'
    input.placeholder = 'Enter Promo Code';
    return input;
  }

  getCartSummaryPromoCodeInfo(promoCodesNames: string): HTMLElement {
    const info = document.createElement('span');
    info.innerHTML = `Promo for test: ${promoCodesNames}`;
    return info;
  }

  getCartSummaryContainer(): HTMLElement {
    const container = document.createElement('aside');
    container.className = 'col-3';
    return container;
  } 
}

export const appDrawer = new Drawer();

