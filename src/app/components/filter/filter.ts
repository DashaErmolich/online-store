import { SimpleCard, NumberRange } from '../../models/interfaces';
import { UrlParamKey } from '../../enums/enums';
import { possibleCards2 } from '../../../assets/samples/possible-cards2';

export const productsFilter = {

  getFilterValuesList(filter: UrlParamKey.Brand | UrlParamKey.Category): string[] {
    const valuesList = possibleCards2.products.map((product: SimpleCard) => product[filter]);
    const uniqueValues = new Set(valuesList);
    return Array.from(uniqueValues).sort();
  },

  getFilterRange(filter: UrlParamKey.Price | UrlParamKey.Stock): NumberRange {
    const values: number[] = possibleCards2.products.map((product: SimpleCard) => product[filter]);
    return {
      min: Math.min(...values),
      max: Math.max(...values),
    }
  },

  isValidFilterValue(filter: UrlParamKey.Brand | UrlParamKey.Category, value: string): boolean {
    const valuesList = this.getFilterValuesList(filter);
    if (valuesList.includes(value)) {
      return true;
    } else {
      return false;
    }
  },

  isValidFilterRange(filter: UrlParamKey.Price | UrlParamKey.Stock, value: NumberRange): boolean {
    const range: NumberRange = this.getFilterRange(filter);
    if (range.min <= value.min && range.max >= value.max && value.min <= value.max) {
      return true;
    } else {
      return false;
    }
  },

  getIndex(cards: SimpleCard[], itemId: number): number {
    const index = cards.findIndex((card => itemId === card.id));
    return index;
  }
}