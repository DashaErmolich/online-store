import Navigo, { Match } from 'navigo';
import { MainPage } from '../components/main';
import { RouterPath } from '../../models/enums';
import { Routes } from '../../models/interfaces';
import { CartPage } from '../components/cart';
import { ProductPage } from '../components/products';

class MyNavigo extends Navigo {
  listenPageLoad(): void {
    window.addEventListener('load', (): void => {
      const currentLocation: Match = this.getCurrentLocation();
      const currentURL: string = currentLocation.url;
      this.navigate(currentURL);
    })
  }
}

const appRouter = new MyNavigo('/');
appRouter.listenPageLoad();

const routes: Routes[] = [
  { path: RouterPath.Main, page: new MainPage() },
  { path: RouterPath.Cart, page: new CartPage()},
  { path: RouterPath.Products, page: new ProductPage()},
];

routes.forEach((route) => {
  appRouter.on(route.path, () => {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = route.page.getPageContent();
    }
  })
})