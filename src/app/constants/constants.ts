import { productsFilter } from '../components/filter/filter';
import { UrlParamKey, CardsAppearance } from '../enums/enums';
import { FormInput, CreditCard, MyUrlSearchParam } from '../models/interfaces';
import CREDIT_CARD_NUMBER_DEFAULT_ICON from 'appIcons/credit-card-logo.svg';
import CREDIT_CARD_NUMBER_VISA_ICON from 'appIcons/visa-logo.svg';
import CREDIT_CARD_NUMBER_MASTERCARD_ICON from 'appIcons/mc-logo.svg';
import CREDIT_CARD_NUMBER_JCB_ICON from 'appIcons/JCB-logo.svg';

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

export const formUserNameModel: FormInput = {
  id: 'user-name',
  placeholder: 'Name Surname',
  inputType: 'text',
  validationParameters: {
    pattern: '^\\W*(?:\\w{3,}\\b\\W*){2,}$',
    maxLength: 100,
  },
  validationErrorMessage: 'Please enter at least 2 words with at least 3 letters each',
  label: 'Name and surname:',
  iconClassName: 'bi bi-person',
}

export const formUserTelModel: FormInput = {
  id: 'user-tel',
  placeholder: '+123456789',
  inputType: 'tel',
  validationParameters: {
    pattern: '^[+][0-9]{9,}',
    minLength: 10,
    maxLength: 20,
  },
  validationErrorMessage: 'Please enter at least 9 digits after `+`',
  label: 'Phone number:',
  iconClassName: 'bi bi-phone',
}

export const formUserAddressModel: FormInput = {
  id: 'user-address',
  placeholder: 'Delivery address',
  inputType: 'text',
  validationParameters: {
    pattern: '^\\W*(?:\\w{5,}\\b\\W*){3,}$',
    maxLength: 100,
  },
  validationErrorMessage: 'Please enter at least 3 words with at least 5 letters each',
  label: 'Delivery address:',
  iconClassName: 'bi bi-house',
}

export const formUserEmailModel: FormInput = {
  id: 'user-email',
  placeholder: 'username@example.com',
  inputType: 'email',
  validationParameters: {
    pattern: '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$',
    maxLength: 50,
  },
  validationErrorMessage: 'Please enter a valid e-mail address',
  label: 'E-mail address:',
  iconClassName: 'bi bi-envelope-at',
}

export const formCardNumberModel: FormInput = {
  id: 'credit-card-number',
  placeholder: '1234 1234 1234 1234',
  inputType: 'text',
  validationParameters: {
    minLength: 19,
    maxLength: 19,
  },
  validationErrorMessage: 'Please enter 16 digit card number',
  label: 'Credit card number:',
  icon: CREDIT_CARD_NUMBER_DEFAULT_ICON,
}

export const formCardExpirationModel: FormInput = {
  id: 'credit-card-expiration',
  placeholder: 'MM/YY',
  inputType: 'text',
  validationParameters: {
    pattern: '^(0[1-9]|1[0-2])\\/?([0-9]{2}|[0-9]{2})$',
    minLength: 5,
    maxLength: 5,
  },
  validationErrorMessage: 'Please enter 4 digit month (from 01 to 12) and year',
  label: 'Expiration:',
}

export const formCardCVVModel: FormInput = {
  id: 'credit-card-cvv',
  placeholder: '123',
  inputType: 'text',
  validationParameters: {
    minLength: 3,
    maxLength: 3,
  },
  validationErrorMessage: 'Please enter 3 digit CVV code',
  label: 'CVV:',
}

export const creditCardVisa: CreditCard = {
  firstDigit: 4,
  icon: CREDIT_CARD_NUMBER_VISA_ICON,
}

export const creditCardMastercard: CreditCard = {
  firstDigit: 5,
  icon: CREDIT_CARD_NUMBER_MASTERCARD_ICON,
}

export const creditCardJCB: CreditCard = {
  firstDigit: 3,
  icon: CREDIT_CARD_NUMBER_JCB_ICON,
}

export const creditCardDefault: CreditCard = {
  firstDigit: Number('/^[0-9]{1}/'),
  icon: CREDIT_CARD_NUMBER_DEFAULT_ICON,
}

export const cardsAppearanceSearchParam: MyUrlSearchParam = {
  key: UrlParamKey.Appearance,
  defaultValue: CardsAppearance.Table,
  isMultiple: false, 
}

export const paginationLimitSearchParam: MyUrlSearchParam = {
  key: UrlParamKey.Limit,
  defaultValue: PAGINATION_LIMIT_DEFAULT,
  isMultiple: false, 
}

export const activePageSearchParam: MyUrlSearchParam = {
  key: UrlParamKey.Page,
  defaultValue: ACTIVE_PAGE_DEFAULT,
  isMultiple: false, 
}