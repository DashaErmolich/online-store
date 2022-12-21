import { CartPage } from '../pages/cart';
import { MainPage } from '../pages/main';
import { ProductPage } from '../pages/products';
import { Singleton } from '../singleton/singleton';
import { possibleCards } from '../../../assets/samples/cards';
import { SimpleCard } from '../../models/interfaces';
const cards: SimpleCard[] = possibleCards.products;

export const singleton = Singleton.getInstance();
//any value now!!
let tmp = 8;
singleton.setProductsQty(tmp);
while (tmp) {
  singleton.addCartProduct(cards[tmp]);
  tmp--;
}

window.addEventListener('beforeunload', (): void => {
  localStorage.setItem('page-state', JSON.stringify(singleton.state))
});

window.addEventListener('load', () => {
  singleton.getState();
});

export const cartPage = new CartPage();
cartPage.listenPaginationInput();
cartPage.listenPaginationButtons();

export const mainPage = new MainPage();
export const productPage = new ProductPage();



