import { AbstractPage } from "../app/view/page-view";

export interface PageComponents {
  title: string,
  content: string,
}

export interface Routes {
  path: string,
  page: AbstractPage,
}

export interface SimpleCard {
   id: number;
   title: string;
   description: string;
   price: number;
   discountPercentage: number;
   rating: number;
   stock: number;
   brand: string;
   category: string;
   thumbnail: string;
   images: Array<string>;
}