import { PageState, SimpleCard } from '../../models/interfaces';

export class Singleton {
  private static instance: Singleton;
  state: PageState;

  private constructor() {
    this.state = {} as PageState;
    this.state.cart = {} as PageState['cart'];
    this.getState();
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }

    return Singleton.instance;
  }
  
  public setProductsQty(value: number): void {
    this.state.cart.productsQty = value;
  }

  public getProductsQty(): number {
    return this.state.cart.productsQty;
  }

  public getState() {
    const pageState = localStorage.getItem('page-state');
    if (pageState) {
      this.state = JSON.parse(pageState);
    }
  }

  public addCartProduct(product: SimpleCard): void {
    if (!this.state.cart.products) {
      this.state.cart.products = []
    }

    this.state.cart.products.push(product);
  }

}

