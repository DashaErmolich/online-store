import { possibleCards } from '../../../assets/samples/cards';
import { SimpleCard, NumberRange } from '../../models/interfaces';
import { UrlParamKey } from '../../enums/enums';

export const productsFilter = {

  getBrandsOrCategoriesList(filter: UrlParamKey.Brand | UrlParamKey.Category): string[] {
    const valuesList = possibleCards.products.map((product: SimpleCard) => product[filter]);
    const uniqueValues = new Set(valuesList);
    return Array.from(uniqueValues).sort();
  },

  getPriceRange(): NumberRange {
    const prices: number[] = possibleCards.products.map((product: SimpleCard) => product.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    }
  },

  getStockRange(): NumberRange {
    const stockList: number[] = possibleCards.products.map((product: SimpleCard) => product.stock);
    return {
      min: Math.min(...stockList),
      max: Math.max(...stockList),
    }
  },
}