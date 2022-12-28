import { AbstractPage } from '../abstracts/abstracts';

export interface PageComponents {
  title: string,
  content: HTMLElement,
}

export interface Routes {
  path: string,
  page: AbstractPage,
}

export interface Cart {
  products: SimpleCard[];
}

export interface SimpleCard {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: Array<string>;
  qty?: number;
}

export interface CartUrlParams {
  limit: string;
  page: string;
}

export interface MainUrlParams {
  category: string;
  brand: string;
  price: string;
  stock: string;
}

export interface UrlParams extends CartUrlParams, MainUrlParams {}

export interface AppStorage {
  getCartProducts(): SimpleCard[],
  addProductToCart(product: SimpleCard): void,
  getCartProductsQty(): number,
  setCartProductQty(product: SimpleCard, qty: number): void,
  getProductIndex(cartProducts: SimpleCard[], product: SimpleCard): number,
  removeProductFromCart(product: SimpleCard): void,
}

export interface CartPageSettings {
  productsQty : number,
  paginationLimit: number,
  activePage: number,
}

export interface PaginationCardIdxRange {
  start: number, 
  end: number
}