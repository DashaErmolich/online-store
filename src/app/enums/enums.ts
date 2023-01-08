export enum RouterPath {
  Main = '/',
  Cart = '/cart',
  Products = '/products/:id',
}

export enum UrlParamKey {
  Page = 'page',
  Limit = 'limit',
  Category = 'category',
  Brand = 'brand',
  Price = 'price',
  Stock = 'stock',
  Appearance = 'appearance',
  Sort = 'sort',
  Search = 'search',
}

export enum CardsAppearance {
  Table = 'table',
  Row = 'row',
}

export enum CardsSortBy {
  TitleAsc = 'title-asc',
  TitleDesc = 'title-desc',
  PriceAsc = 'price-asc',
  PriceDesc = 'price-desc',
  RatingAsc = 'rating-asc',
  RatingDesc = 'rating-desc',
  Initial = 'id',
}
export enum CardsSortPossibleMethods {
  Asc = 'asc',
  Desc = 'desc'
}
export enum CardsSortPossibleFields {
  Title = 'title',
  Initial = 'id',
  Rating = 'rating',
  Price = 'price'
}