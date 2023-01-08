import { SimpleCard, PromoCode } from '../../models/interfaces';
import { possibleCards2 } from '../../../assets/samples/possible-cards2';

export const appStorage = {
  getCartProducts(): SimpleCard[] {
    const data = localStorage.getItem('cart-products');
    let cartProducts: SimpleCard[];
    if (data) {
      cartProducts = JSON.parse(data);
    } else {
      cartProducts = [];
    }
    return cartProducts;
  },
  
  addProductToCart(product: SimpleCard): void {
    const cartProducts: SimpleCard[] = this.getCartProducts();
    cartProducts.push(product);
    localStorage.setItem('cart-products', JSON.stringify(cartProducts));
  },

  removeProductFromCart(product: SimpleCard): void {
    const cartProducts: SimpleCard[] = this.getCartProducts();
    const productIndex = this.getProductIndex(cartProducts, product);
    cartProducts.splice(productIndex, 1);
    localStorage.setItem('cart-products', JSON.stringify(cartProducts));
  },
  
  getCartProductsCardsQty(): number {
    const cartProducts: SimpleCard[] = this.getCartProducts();
    return cartProducts.length;
  },

  setCartProductQty(product: SimpleCard, qty: number): void {
    const cartProducts: SimpleCard[] = this.getCartProducts();
    const productIndex = this.getProductIndex(cartProducts, product);
    cartProducts[productIndex].qty = qty;
    localStorage.setItem('cart-products', JSON.stringify(cartProducts));
  },

  getProductIndex(cartProducts: SimpleCard[], product: SimpleCard): number {
    const productIndex = cartProducts.findIndex((item => item.id === product.id));
    return productIndex;
  },

  getCartPromoCodes(): PromoCode[] {
    const data = localStorage.getItem('promo-codes');
    let promoCodes: PromoCode[];
    if (data) {
      promoCodes = JSON.parse(data);
    } else {
      promoCodes = [];
    }
    return promoCodes;
  },

  addCartPromoCode(promoCode: PromoCode): void {
    const promoCodes: PromoCode[] = this.getCartPromoCodes();
    promoCodes.push(promoCode);
    localStorage.setItem('promo-codes', JSON.stringify(promoCodes));
  },

  getPromoCodeIndex(promoCodes: PromoCode[], promoCode: PromoCode): number {
    const promoCodeIndex = promoCodes.findIndex((item => item.id === promoCode.id));
    return promoCodeIndex;
  },

  removeCartPromoCode(promoCode: PromoCode): void {
    const promoCodes: PromoCode[] = this.getCartPromoCodes();
    const promoCodeIndex = this.getPromoCodeIndex(promoCodes, promoCode);
    promoCodes.splice(promoCodeIndex, 1);
    localStorage.setItem('promo-codes', JSON.stringify(promoCodes));
  },

  emptyCart(): void {
    localStorage.removeItem('cart-products');
    localStorage.removeItem('promo-codes');
  },

  getMainPageProducts(): SimpleCard[] {
    const data = localStorage.getItem('main-products');
    let cartProducts: SimpleCard[];
    if (data) {
      cartProducts = JSON.parse(data);
    } else {
      cartProducts = possibleCards2.products;
    }
    return cartProducts;
  },

  setMainPageProducts(data: SimpleCard[]): void {
    if (data.length) {
      localStorage.setItem('main-products', JSON.stringify(data));
    } else {
      localStorage.setItem('main-products', JSON.stringify(possibleCards2.products));
    }

  },
}

