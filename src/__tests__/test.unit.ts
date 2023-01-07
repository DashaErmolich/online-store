import { UrlParamKey } from '../app/enums/enums';
import { ProductsFilter } from '../app/components/filter/filter';
import { testProductsCards } from '../assets/test/test-products-cards/test-products-cards';

describe('Filter correct handle products data', () => {
  test('Check is an object in instance of filter class', () => {
    const filter = new ProductsFilter(testProductsCards.products);
    expect(filter).toBeInstanceOf(ProductsFilter);
  });

  test('Check is a function correctly filter data', () => {
    const expected = ['Apple'];
    const filter = new ProductsFilter(testProductsCards.products);
    expect(filter.getFilterValuesList(UrlParamKey.Brand)).toEqual(expect.arrayContaining(expected));
  });

  test('Check is correct number range', () => {
    const expected = false;
    const filter = new ProductsFilter(testProductsCards.products);
    expect(filter.isValidFilterRange(UrlParamKey.Price, {min: 100, max: 90})).toBe(expected);
  })
})
