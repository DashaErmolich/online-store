import Navigo from 'navigo';
import { RouterPath, UrlParamKey } from '../../enums/enums';
import { Routes } from '../../models/interfaces';
import { NotFoundPage } from '../pages/404';
import { PAGINATION_LIMIT_DEFAULT, ACTIVE_PAGE_DEFAULT, FILTERS_SEPARATOR as FILTERS_VALUES_SEPARATOR } from '../../constants/constants';
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

  getNewUrlParamsValue(params: URLSearchParams, key: string, value: string, isChecked: boolean): string {
    const currentValue = params.get(key);
    let newUrlValue = '';

    if (currentValue) {
      const currentValues = currentValue.split(FILTERS_VALUES_SEPARATOR);
      newUrlValue = currentValue;

      if (isChecked && !currentValues.includes(value)) {
        currentValues.push(value);

      } else if (!isChecked && currentValues.includes(value)) {
        const valueIndex = currentValues.indexOf(value);
        currentValues.splice(valueIndex, 1);
      }

      newUrlValue = currentValues.join(FILTERS_VALUES_SEPARATOR);
    }
    
    return newUrlValue;
  }

  updateSingleChoiceUrlParams(params: URLSearchParams, key: UrlParamKey, value: string) {
    if (params.has(key)) {
      params.set(key, value);
    } else {
      params.append(key, value);
    }
  }

  updateMultipleChoiceUrlParams(params: URLSearchParams, key: UrlParamKey, value: string, isChecked: boolean) {
    if (params.has(key)) {
      const newUrlValue = this.getNewUrlParamsValue(params, key, value, isChecked);

      if (newUrlValue) {
        params.set(key, newUrlValue);
      } else {
        params.delete(key);
      }

    } else if (!params.has(key) && isChecked) {
      params.append(key, value);
    }
  }

  updateUrlParams(key: UrlParamKey, value: string, isChecked?: boolean): void {
    const params = this.getUrlParams();

    if (key === UrlParamKey.Page || UrlParamKey.Limit) {
      this.updateSingleChoiceUrlParams(params, key, value);
    }

    if (key === UrlParamKey.Brand || UrlParamKey.Category) {
      if (isChecked !== undefined) {
        this.updateMultipleChoiceUrlParams(params, key, value, isChecked);
      }
    }

    window.history.replaceState({}, '', `${window.location.pathname}?` + params);
  }

  getSingleChoiceUrlParamsValue(filter: UrlParamKey.Limit | UrlParamKey.Page, defaultValue: number): number {
    const params = this.getUrlParams();
    let filterValue: number = defaultValue;

    if (params.has(filter)) {
      const value = Number(params.get(filter));
      if (value) {
        filterValue = value;
      } else {
        this.updateUrlParams(filter, String(filterValue))
      }
    }
    return filterValue;
  }

  getMultipleChoiceUrlParamsValues(filter: UrlParamKey.Brand | UrlParamKey.Category): string[] {
    const params = this.getUrlParams();
    let filterValues: string[] = [];
    
    if (params.has(filter)) {
      const value = params.get(filter);
      if (value) {
        filterValues = value.split(FILTERS_VALUES_SEPARATOR);
      }
    }
    return filterValues;
  }

  getPaginationLimitValue(): number {
    return this.getSingleChoiceUrlParamsValue(UrlParamKey.Limit, PAGINATION_LIMIT_DEFAULT);
  }

  getPageNumber(): number {
    return this.getSingleChoiceUrlParamsValue(UrlParamKey.Page, ACTIVE_PAGE_DEFAULT);
  }

  getProductBrands(): string[] {
    return this.getMultipleChoiceUrlParamsValues(UrlParamKey.Brand);
  }

  getProductCategories(): string[] {
    return this.getMultipleChoiceUrlParamsValues(UrlParamKey.Category);
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


document.querySelector('.add-filter')?.addEventListener('click', () => {
  // appRouter.updateUrlParams(UrlParamKey.Category, 'nnn', true);
  // appRouter.updateUrlParams(UrlParamKey.Category, 'ppp', false);
  appRouter.updateUrlParams(UrlParamKey.Category, 'ggg', true);
  // appRouter.updateUrlParams(UrlParamKey.Brand, 'bbbb', false);
})

console.log(appRouter.getProductCategories())