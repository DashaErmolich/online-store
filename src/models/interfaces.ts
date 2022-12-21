import { AbstractPage } from "../app/view/page-view";

export interface PageComponents {
  title: string,
  content: HTMLElement,
}

export interface Routes {
  path: string,
  page: AbstractPage,
}

interface CartPageState {
  productsQty: number;
  productsPerPage: number,
  products: SimpleCard[];
}

interface MainPageState {
  filter: string,
}

export interface PageState {
  cart: CartPageState,
  main: MainPageState,
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