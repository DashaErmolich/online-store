import Navigo from 'navigo';
import { RouterPath, UrlParamKey } from '../../enums/enums';
import { Routes, NumberRange } from '../../models/interfaces';
import { NotFoundPage } from '../pages/404';
import { FILTERS_VALUES_SEPARATOR } from '../../constants/constants';
import { MainPage } from '../pages/main';
import { CartPage } from '../pages/cart';
import { ProductPage } from '../pages/product-details';

class MyNavigo extends Navigo {

  public handlePageContent(content: HTMLElement): void {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
      pageContent.innerHTML = '';
      pageContent.append(content);
    }
  }

  public updateUrlParams(key: UrlParamKey, value: string | NumberRange, isChecked?: boolean): void {
    const params = this.getUrlParams();

    if (key === UrlParamKey.Page || key === UrlParamKey.Limit || key === UrlParamKey.Appearance || key === UrlParamKey.Sort) {
      if (typeof(value) === 'string') {
        this.updateSingleChoiceUrlParams(params, key, value);
      }
    }

    if (key === UrlParamKey.Brand || key === UrlParamKey.Category) {
      if (isChecked !== undefined && typeof(value) === 'string') {
        this.updateMultipleChoiceUrlParams(params, key, value, isChecked);
      }
    }

    if (key === UrlParamKey.Price || key === UrlParamKey.Stock) {
      if (typeof(value) !== 'string') {
        const rangeValue = `${value.min}${FILTERS_VALUES_SEPARATOR}${value.max}`
        this.updateSingleChoiceUrlParams(params, key, rangeValue);
      }
    }

    window.history.replaceState({}, '', `${window.location.pathname}?` + params);
  }

  private getUrlParams(): URLSearchParams {
    const url: Location = window.location;
    const params: URLSearchParams = new URLSearchParams(url.search.slice(1));
    return params;
  }

  private getNewUrlParamsValue(params: URLSearchParams, key: string, value: string, isChecked: boolean): string {
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

  private updateSingleChoiceUrlParams(params: URLSearchParams, key: UrlParamKey, value: string): void {
    if (params.has(key)) {
      params.set(key, value);
    } else {
      params.append(key, value);
    }
  }

  private updateMultipleChoiceUrlParams(params: URLSearchParams, key: UrlParamKey, value: string, isChecked: boolean): void {
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

  public getUrlParamsValue(key: UrlParamKey): string | undefined {
    const params = this.getUrlParams();
    if (params.has(key)) {
      const value = params.get(key);
      if (value) {
        return value;
      }
    }
  }

  public getProductIndex(): number {
    const url: Location = window.location;
    const pathName = url.pathname;
    const productIndex = pathName.split('/').pop();
    return Number(productIndex)
  }

}

export const appRouter = new MyNavigo('/');
export const mainPage = new MainPage();
export const cartPage = new CartPage();
export const productPage = new ProductPage();

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