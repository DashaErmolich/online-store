import { productsFilter } from '../components/filter/filter';
import { UrlParamKey } from '../enums/enums';

export const PAGINATION_LIMIT_DEFAULT = 5;
export const PAGINATION_LIMIT_MIN = 1;
export const PAGINATION_LIMIT_MAX = 10;
export const PAGINATION_LIMIT_STEP = 1;
export const ACTIVE_PAGE_DEFAULT = 1;
export const CURRENCY_ICON_CLASS_NAME = 'bi bi-currency-dollar';
export const PRODUCT_CART_QTY_DEFAULT = 1;
export const FILTERS_VALUES_SEPARATOR = '↕';
export const PRICE_RANGE_DEFAULT = productsFilter.getFilterRange(UrlParamKey.Price);
export const STOCK_RANGE_DEFAULT = productsFilter.getFilterRange(UrlParamKey.Stock);
export const CREDIT_CARD_NUMBER_LENGTH = 16;
export const CREDIT_CARD_EXPIRED_LENGTH = 4;
export const CREDIT_CARD_CVV_LENGTH = 3;
export const CREDIT_CARD_NUMBER_STARTING_VISA = 4;
export const CREDIT_CARD_NUMBER_STARTING_MASTERCARD = 5;
export const CREDIT_CARD_NUMBER_STARTING_JCB = 3;
export const USER_NAME_MAX_LENGTH = 100;
export const USER_TEL_LENGTH = 10;
export const USER_ADDRESS_MAX_LENGTH = 100;
export const USER_EMAIL_MAX_LENGTH = 50;

import CREDIT_CARD_NUMBER_DEFAULT_ICON from '../../assets/icons/credit-card.svg';
import CREDIT_CARD_NUMBER_VISA_ICON from '../../assets/icons/Visa_Inc._logo.svg';
import CREDIT_CARD_NUMBER_MASTERCARD_ICON from '../../assets/icons/icons8-mastercard-logo.svg';
import CREDIT_CARD_NUMBER_JCB_ICON from '../../assets/icons/JCB_logo.svg';
import USER_EMAIL_ICON from '../../assets/icons/envelope-at.svg';
import USER_ADDRESS_ICON from '../../assets/icons/house-door.svg';
import USER_TEL_ICON from '../../assets/icons/telephone.svg';
import USER_NAME_ICON from '../../assets/icons/person.svg';

export { 
  CREDIT_CARD_NUMBER_DEFAULT_ICON, 
  CREDIT_CARD_NUMBER_VISA_ICON, 
  CREDIT_CARD_NUMBER_MASTERCARD_ICON, 
  CREDIT_CARD_NUMBER_JCB_ICON, 
  USER_EMAIL_ICON,
  USER_ADDRESS_ICON,
  USER_TEL_ICON,
  USER_NAME_ICON,
}