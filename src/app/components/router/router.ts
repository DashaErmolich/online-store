import Navigo, { Match } from 'navigo';
import { MainPage } from '../pages/main';
import { RouterPath } from '../../../models/enums';
import { Routes } from '../../../models/interfaces';
import { CartPage } from '../pages/cart';
import { ProductPage } from '../pages/products';
import { NotFoundPage } from '../pages/404';

class MyNavigo extends Navigo {
  listenPageLoad(): void {
    window.addEventListener('load', (): void => {
      const currentLocation: Match = this.getCurrentLocation();
      const currentURL: string = currentLocation.url;
      this.navigate(currentURL);
    })
  }

  handlePageContent(content: string) {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = content;
    }
  }
}

const appRouter = new MyNavigo('/');
appRouter.listenPageLoad();

const routes: Routes[] = [
  { path: RouterPath.Main, page: new MainPage() },
  { path: RouterPath.Cart, page: new CartPage()},
  { path: RouterPath.Products, page: new ProductPage()},
];

routes.forEach((route): void => {
  appRouter.on(route.path, (): void => {
    appRouter.handlePageContent(route.page.getPageContent())
  })
})

appRouter.notFound((): void => {
  const notFoundPage = new NotFoundPage();
  appRouter.handlePageContent(notFoundPage.getPageContent())
})

