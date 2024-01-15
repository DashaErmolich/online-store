

import { productsFilter } from './../app/components/filter/filter';
import { UrlParamKey } from '../app/enums/enums';
import { testProductsCards } from '../assets/test/test-products-cards/test-products-cards';
import { NumberRange } from '../app/models/interfaces';

describe('Filter correct handles products data', () => {

  test('Filter returns correct data of specific category', () => {
    const expected = ['Apple'];
    expect(productsFilter.getFilterValuesList(UrlParamKey.Brand)).toEqual(expect.arrayContaining(expected));
  });

  test('Filter check number range by min and max value', () => {
    expect(productsFilter.isValidFilterRange(UrlParamKey.Price, {min: 100, max: 90})).toBeFalsy();
  })

  test('Filter returns -1 if no item in array', () => {
    const expected = -1;
    expect(productsFilter.getIndex(testProductsCards.products, 90)).toBe(expected);
  });

  test('Filter returns range with min value less then max', () => {
    expect(productsFilter.getFilterRange(UrlParamKey.Price).min).toBeLessThan(productsFilter.getFilterRange(UrlParamKey.Price).max);
  });

  test('Filter correctly works with object properties', () => {
    const expected = 'smartphones';
    expect(productsFilter.getFilterValuesList(UrlParamKey.Category)).toContain(expected);
  });

  test('Filter correctly works with object properties', () => {
    const expected = new RegExp('fragrances');
    expect(productsFilter.getFilterValuesList(UrlParamKey.Category)[0]).toMatch(expected);
  });

  test('Filter returns correct data of specific category', () => {
    const expected = ['Foo'];
    expect(productsFilter.getFilterValuesList(UrlParamKey.Category)).toEqual(expect.not.arrayContaining(expected));
  });

  test('Filter returns range with correct properties', () => {
    const expected = {'foo': 'bar'};
    expect(productsFilter.getFilterRange(UrlParamKey.Price)).toEqual(expect.not.objectContaining(expected));
  });

  test('Filter returns correct value', () => {
    const expected: NumberRange = {min: 7, max: 146};
    const getRange = jest.fn(productsFilter.getFilterRange);
    getRange(UrlParamKey.Price);
    getRange(UrlParamKey.Stock);
    expect(getRange).toHaveLastReturnedWith(expected);
  });

  test('Filter returns unique values by specific category', () => {
    const expected = 27;
    expect(productsFilter.getFilterValuesList(UrlParamKey.Brand)).toHaveLength(expected);
  });
})