import Navigo from 'navigo';
import { RouterPath, UrlParamKey } from '../../enums/enums';
import { Routes, NumberRange } from '../../models/interfaces';
import { NotFoundPage } from '../pages/404';
import { FILTERS_VALUES_SEPARATOR } from '../../constants/constants';
import { MainPage } from '../pages/main';
import { CartPage } from '../pages/cart';
import { productPage } from '../pages/product-details';

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

    if (key === UrlParamKey.Page || UrlParamKey.Limit || UrlParamKey.Appearance) {
      if (typeof(value) === 'string') {
        this.updateSingleChoiceUrlParams(params, key, value);
      }
    }

    if (key === UrlParamKey.Brand || UrlParamKey.Category) {
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

  // public getPaginationLimitValue(): number {
  //   return this.getSingleChoiceUrlParamsValue(UrlParamKey.Limit, PAGINATION_LIMIT_DEFAULT);
  // }

  // public getPageNumber(): number {
  //   return this.getSingleChoiceUrlParamsValue(UrlParamKey.Page, ACTIVE_PAGE_DEFAULT);
  // }

  // public getProductBrands(): string[] {
  //   return this.getMultipleChoiceUrlParamsValues(UrlParamKey.Brand);
  // }

  // public getProductCategories(): string[] {
  //   return this.getMultipleChoiceUrlParamsValues(UrlParamKey.Category);
  // }

  // public getPriceRange(): NumberRange {
  //   return this.getRangeUrlParamsValue(UrlParamKey.Price, PRICE_RANGE_DEFAULT);
  // }

  // public getStockRange(): NumberRange {
  //   return this.getRangeUrlParamsValue(UrlParamKey.Stock, STOCK_RANGE_DEFAULT);
  // }

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

  // private getSingleChoiceUrlParamsValue(filter: UrlParamKey.Limit | UrlParamKey.Page, defaultValue: number): number {
  //   const params = this.getUrlParams();
  //   let filterValue: number = defaultValue;

  //   if (params.has(filter)) {
  //     const value = Number(params.get(filter));
  //     if (value) {
  //       filterValue = value;
  //     } else {
  //       this.updateUrlParams(filter, String(filterValue))
  //     }
  //   }
  //   return filterValue;
  // }

  // private getRangeUrlParamsValue(filter: UrlParamKey.Price | UrlParamKey.Stock, defaultRange: NumberRange): NumberRange {
  //   const params = this.getUrlParams();
  //   let filterValue: NumberRange = defaultRange;

  //   if (params.has(filter)) {
  //     const value = params.get(filter);
  //     if (value) {
  //       filterValue = {
  //         min: Number(value.split(FILTERS_VALUES_SEPARATOR)[0]),
  //         max: Number(value.split(FILTERS_VALUES_SEPARATOR)[1]),
  //       }

  //     } else {
  //       this.updateUrlParams(filter, defaultRange);
  //     }
  //   }
  //   return filterValue;
  // }

  // private getMultipleChoiceUrlParamsValues(filter: UrlParamKey.Brand | UrlParamKey.Category): string[] {
  //   const params = this.getUrlParams();
  //   let filterValues: string[] = [];
    
  //   if (params.has(filter)) {
  //     const value = params.get(filter);
  //     if (value) {
  //       filterValues = value.split(FILTERS_VALUES_SEPARATOR);
  //     }
  //   }
  //   return filterValues;
  // }

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