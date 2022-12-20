import { CartPage } from '../pages/cart';
import { MainPage } from '../pages/main';
import { ProductPage } from '../pages/products';
// import { Singleton } from '../../singleton/singleton';

// export const singleton = Singleton.getInstance();

// window.addEventListener('beforeunload', (): void => {
//   localStorage.setItem('page-state', JSON.stringify(singleton.state))
// });

// window.addEventListener('load', () => {
//   // eslint-disable-next-line no-debugger
//   debugger
//   const pageState = localStorage.getItem('page-state');
//   if (pageState) {
//     singleton.state = JSON.parse(pageState);
//   }
// });

export const cartPage = new CartPage();
cartPage.listenPaginationInput();

export const mainPage = new MainPage();
export const productPage = new ProductPage();



