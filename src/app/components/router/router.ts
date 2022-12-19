import Navigo, { Match } from 'navigo';
import { MainPage } from '../pages/main';
import { RouterPath } from '../../../models/enums';
import { Routes } from '../../../models/interfaces';
import { ProductPage } from '../pages/products';
import { NotFoundPage } from '../pages/404';
import { cartPage } from '../app/app';

class MyNavigo extends Navigo {

  handlePageContent(content: string) {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = content;
    }
  }
}

export const appRouter = new MyNavigo('/');

const routes: Routes[] = [
  { path: RouterPath.Main, page: new MainPage() },
  { path: RouterPath.Cart, page: cartPage},
  { path: RouterPath.Products, page: new ProductPage()},
];

routes.forEach((route): void => {
  appRouter.on(route.path, (routerObject: Match | undefined) => {
    const data = appRouter.getCurrentLocation();
    console.log(data)
    if (routerObject) {
      if (routerObject.queryString === '') {
        appRouter.handlePageContent(route.page.getPageContent());
      } else {
        console.log(routerObject.queryString)
      }
    }
    
  }).resolve();
})

appRouter.notFound((): void => {
  const notFoundPage = new NotFoundPage();
  appRouter.handlePageContent(notFoundPage.getPageContent());
})
