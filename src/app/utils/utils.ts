// import { QueryString } from '../../models/interfaces';
// import { CART_PAGINATION_DEFAULT } from '../../models/constants';
// import { getQueryStringParameters, appRouter } from '../components/router/router';

// export function getPageLinkPath(key: string, value: number): string {
//   const params: QueryString = getQueryStringParameters();
//   console.log(params)
//   const pathname: string = (appRouter.getCurrentLocation()).url;
//   const search: string = (appRouter.getCurrentLocation()).queryString;
//   const pair = `${key} = ${value}`;
//   if (search.length) {
//     return `${pathname}?${search}&${pair}`
//   } else {
//     return `${pathname}?${pair}`
//   }
// }



// export function getCartPageLimit(): number {
//   const queryStringParams: QueryString = getQueryStringParameters();
//   if (queryStringParams.limit) {
//     return queryStringParams.limit;
//   } else {
//     return CART_PAGINATION_DEFAULT;
//   }
// }

// export function setCartPageLimit(value: number): void {
//   const queryStringParams: QueryString = getQueryStringParameters();
//   queryStringParams.limit = value;
// }
