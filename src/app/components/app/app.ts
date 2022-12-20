import { CartPage } from '../pages/cart';
import { MainPage } from '../pages/main';
import { ProductPage } from '../pages/products';
import { Singleton } from '../../singleton/singleton';

export const singleton = Singleton.getInstance();
//any value now!!
singleton.setProductsQty(8);

window.addEventListener('beforeunload', (): void => {
  localStorage.setItem('page-state', JSON.stringify(singleton.state))
});

window.addEventListener('load', () => {
  singleton.getState();
});

export const cartPage = new CartPage();
cartPage.listenPaginationInput();

export const mainPage = new MainPage();
export const productPage = new ProductPage();



