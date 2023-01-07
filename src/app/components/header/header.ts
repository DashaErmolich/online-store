import { cartPage, mainPage, appRouter } from '../router/router';
import { RouterPath } from '../../enums/enums';

const cartPageLink = document.getElementById('cart-page-link');
if (cartPageLink) {
  cartPageLink.addEventListener('click', () => {
    appRouter.navigate(RouterPath.Cart);
    appRouter.handlePageContent(cartPage.getPageContent());
  })
}

const mainPageLink = document.getElementById('main-page-link');
if (mainPageLink) {
  mainPageLink.addEventListener('click', () => {
    appRouter.navigate(RouterPath.Main);
    appRouter.handlePageContent(mainPage.getPageContent());
  })
}