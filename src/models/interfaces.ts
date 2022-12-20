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
}

interface MainPageState {
  filter: string,
}

export interface PageState {
  cart: CartPageState,
  main: MainPageState,
}