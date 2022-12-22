import Navigo from 'navigo';
import { RouterPath, UrlParamKey } from '../../enums/enums';
import { Routes } from '../../models/interfaces';
import { NotFoundPage } from '../pages/404';
import { PAGINATION_LIMIT_DEFAULT, ACTIVE_PAGE_DEFAULT } from '../../constants/constants';
import { mainPage } from '../pages/main';
import { CartPage } from '../pages/cart';
import { productPage } from '../pages/products';

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
    const params = this.getUrlParams();
    if (params.has(key)) {
      params.set(key, value);
    } else {
      params.append(key, value);
    }
    window.history.replaceState({}, '', `${window.location.pathname}?` + params);
  }

  getPageLimitValue(): number {
    const params = this.getUrlParams();
    let paginationLimit: number = PAGINATION_LIMIT_DEFAULT;

    if (params.has(UrlParamKey.Limit)) {
      const value = Number(params.get(UrlParamKey.Limit));
      if (value) {
        paginationLimit = value;
      } else {
        this.updateUrlParams(UrlParamKey.Limit, String(paginationLimit))
      }
    }
    return paginationLimit;
  }

  getPageNumber(): number {
    const params = this.getUrlParams();
    let activePage: number = ACTIVE_PAGE_DEFAULT;
    
    if (params.has(UrlParamKey.Page)) {
      const value = Number(params.get(UrlParamKey.Page));
      if (value) {
        activePage = value;
      } else {
        this.updateUrlParams(UrlParamKey.Page, String(activePage))
      }
    }
    return activePage;
  }
}

export const appRouter = new MyNavigo('/');
const cartPage = new CartPage();
cartPage.listenPaginationInput();
cartPage.listenPaginationButtons();

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