import { productsFilter } from '../components/filter/filter';
import { UrlParamKey } from '../enums/enums';
import CREDIT_CARD_NUMBER_DEFAULT_ICON from '../../assets/icons/credit-card.svg';
import CREDIT_CARD_NUMBER_VISA_ICON from '../../assets/icons/Visa_Inc._logo.svg';
import CREDIT_CARD_NUMBER_MASTERCARD_ICON from '../../assets/icons/icons8-mastercard-logo.svg';
import CREDIT_CARD_NUMBER_JCB_ICON from '../../assets/icons/JCB_logo.svg';
import USER_EMAIL_ICON from '../../assets/icons/envelope-at.svg';
import USER_ADDRESS_ICON from '../../assets/icons/house-door.svg';
import USER_TEL_ICON from '../../assets/icons/telephone.svg';
import USER_NAME_ICON from '../../assets/icons/person.svg';
import CREDIT_CARD_EXPIRED_ICON from '../../assets/icons/calendar-check.svg';
import CREDIT_CARD_CVV_ICON from '../../assets/icons/icons8-card-verification-value-32.png';
import { FormInput } from '../models/interfaces';


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
export const CREDIT_CARD_NUMBER_STARTING_VISA = 4;
export const CREDIT_CARD_NUMBER_STARTING_MASTERCARD = 5;
export const CREDIT_CARD_NUMBER_STARTING_JCB = 3;

export { 
  CREDIT_CARD_NUMBER_DEFAULT_ICON, 
  CREDIT_CARD_NUMBER_VISA_ICON, 
  CREDIT_CARD_NUMBER_MASTERCARD_ICON, 
  CREDIT_CARD_NUMBER_JCB_ICON, 
  USER_EMAIL_ICON,
  USER_ADDRESS_ICON,
  USER_TEL_ICON,
  USER_NAME_ICON,
  CREDIT_CARD_EXPIRED_ICON,
  CREDIT_CARD_CVV_ICON,
}

export const formUserAddressModel: FormInput = {
  id: 'user-address',
  placeholder: 'Delivery address',
  inputType: 'text',
  validation: {
    pattern: '^\\W*(?:\\w{5,}\\b\\W*){3,}$',
    maxLength: 100,
  }
}

export const formUserTelModel: FormInput = {
  id: 'user-tel',
  placeholder: '+123456789',
  inputType: 'tel',
  validation: {
    pattern: '^[+][0-9]{9,}',
    minLength: 10,
    maxLength: 20,
  }
}

export const formUserNameModel: FormInput = {
  id: 'user-name',
  placeholder: 'Name Surname',
  inputType: 'text',
  validation: {
    pattern: '^\\W*(?:\\w{3,}\\b\\W*){2,}$',
    maxLength: 100,
  }
}

export const formUserEmailModel: FormInput = {
  id: 'user-email',
  placeholder: 'username@example.com',
  inputType: 'email',
  validation: {
    pattern: '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$',
    maxLength: 50,
  }
}

export const formCardNumberModel: FormInput = {
  id: 'credit-card-number',
  placeholder: '1234 1234 1234 1234',
  inputType: 'text',
  validation: {
    minLength: 16,
    maxLength: 16,
  }
}

export const formCardExpirationModel: FormInput = {
  id: 'credit-card-expiration',
  placeholder: 'MM/YY',
  inputType: 'text',
  validation: {
    pattern: '^(0[1-9]|1[0-2])\\/?([0-9]{2}|[0-9]{2})$',
    minLength: 5,
    maxLength: 5,
  }
}

export const formCardCVVModel: FormInput = {
  id: 'credit-card-cvv',
  placeholder: '123',
  inputType: 'text',
  validation: {
    minLength: 3,
    maxLength: 3,
  }
}