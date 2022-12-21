import Navigo from 'navigo';
import { RouterPath, UrlParamKey } from '../../enums/enums';
import { Routes } from '../../models/interfaces';
import { NotFoundPage } from '../pages/404';
import { cartPage, mainPage, productPage } from '../loader/loader';
import { CART_LIMIT_DEFAULT } from '../../constants/constants';

class MyNavigo extends Navigo {

  handlePageContent(content: HTMLElement) {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = '';
      pageContent.append(content);
    }
  }

  getUrlParams(): URLSearchParams {
    const url: Location = window.location;
    const params: URLSearchParams = new URLSearchParams(url.search.slice(1));
    return params;
  }

  updateUrlParams(key: UrlParamKey, value: string): void {
    const params = appRouter.getUrlParams();
    if (params.has(key)) {
      params.set(key, value);
    } else {
      params.append(key, value);
    }
    window.history.replaceState({}, '', `${window.location.pathname}?` + params);
  }

  getPageLimitValue(): number {
    const params = appRouter.getUrlParams();
    if (params.has(UrlParamKey.Limit)) {
      const value = params.get(UrlParamKey.Limit);
      return Number(value);
    } else {
      return CART_LIMIT_DEFAULT;
    }
  }
}

export const appRouter = new MyNavigo('/');

const routes: Routes[] = [
  { path: RouterPath.Main, page: mainPage },
  { path: RouterPath.Cart, page: cartPage},
  { path: RouterPath.Products, page: productPage},
];

routes.forEach((route): void => {
  appRouter.on(route.path, () => {
    appRouter.handlePageContent(route.page.getPageContent());
  }).resolve();
})

appRouter.notFound((): void => {
  const notFoundPage = new NotFoundPage();
  appRouter.handlePageContent(notFoundPage.getPageContent());
}).resolve();