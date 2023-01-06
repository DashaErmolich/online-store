import { PageComponents, NumberRange } from '../models/interfaces';
import { appRouter } from '../components/router/router';
import { UrlParamKey } from '../enums/enums';
import { FILTERS_VALUES_SEPARATOR } from '../constants/constants';

export class AbstractPage {

  protected setPageTitle(title: PageComponents['title']): void {
    document.title = title;
  }

  getPageContent(): PageComponents['content'] {
    const content = document.createElement('div');
    return content;
  }

  getValidNumberValueFromUrl(urlParamsKey: UrlParamKey, defaultValue: number): number {
    const value: string | undefined = appRouter.getUrlParamsValue(urlParamsKey);
    let myValue: number = defaultValue;
    
    if (value && Number(value)) {
      myValue = Number(value);
    }

    return myValue;
  }

  getValidStringValueFromUrl(urlParamsKey: UrlParamKey, possibleValues: string[], defaultValue: string): string {
    const value: string | undefined = appRouter.getUrlParamsValue(urlParamsKey);
    let myValue: string = defaultValue;
    
    if (value && !Number(value) && possibleValues.includes(value)) {
      myValue = value;
    }

    return myValue;
  }

  getValidNumberRangeValueFromUrl(urlParamsKey: UrlParamKey, defaultValue: NumberRange): NumberRange {
    const value: string | undefined = appRouter.getUrlParamsValue(urlParamsKey);
    let myValue: NumberRange = defaultValue;

    if (value) {
      let minValue = Number(value.split(FILTERS_VALUES_SEPARATOR)[0]);
      let maxValue = Number(value.split(FILTERS_VALUES_SEPARATOR)[1]);

      if (!minValue) {
        minValue = defaultValue.min;
      }
      if (!maxValue) {
        maxValue = defaultValue.max;
      }

      myValue = {
        min: minValue,
        max: maxValue,
      }
    }
    return myValue;
  }

}