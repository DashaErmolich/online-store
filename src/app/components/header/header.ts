import { cartPage } from '../router/router';

const cartPageLink = document.getElementById('cart-page-link');
if (cartPageLink) {
  cartPageLink.addEventListener('click', () => {
    cartPage.updateCartState();
  })
}