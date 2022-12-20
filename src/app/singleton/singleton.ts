import { PageState } from '../../models/interfaces';

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

  public setCartPagination(value: number): void {
    this.state.cart.productsPerPage = value;
  }

  public getCartPagination(): number {
    return this.state.cart.productsPerPage;
  }

  public getState() {
    const pageState = localStorage.getItem('page-state');
    if (pageState) {
      this.state = JSON.parse(pageState);
    }
  }
}

export const singleton = Singleton.getInstance();

window.addEventListener('beforeunload', (): void => {
  localStorage.setItem('page-state', JSON.stringify(singleton.state))
});

window.addEventListener('load', () => {
  singleton.getState();
});

