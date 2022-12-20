import { CartPage } from '../pages/cart';
import { MainPage } from '../pages/main';
import { ProductPage } from '../pages/products';
import { Singleton } from '../../singleton/singleton';


export const cartPage = new CartPage();
export const mainPage = new MainPage();
export const productPage = new ProductPage();

export const singleton = Singleton.getInstance();

cartPage.listenPaginationInput();
singleton.setCartPagination(cartPage.getCartPaginationValue());

window.addEventListener('beforeunload', singleton.setToLocalStorage)
window.addEventListener('load', singleton.getFromLocalStorage)

