import { AbstractPage } from "../app/view/page-view";

export interface PageComponents {
  title: string,
  content: string,
}

export interface Routes {
  path: string,
  page: AbstractPage,
}