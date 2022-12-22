import { SimpleCard, AppStorage } from '../../models/interfaces';

export const appStorage: AppStorage = {
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
  
  getCartProductsQty(): number {
    const cartProducts: SimpleCard[] = this.getCartProducts();
    return cartProducts.length;
  },
}

