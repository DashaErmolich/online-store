import { PageState } from '../../models/interfaces';

export class Singleton {
  private static instance: Singleton;
  private state: PageState;

  private constructor() {
    this.state = {} as PageState;
    this.state.cart = {} as PageState['cart'];
    this.state.main = {} as PageState['main'];
  }

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }

    return Singleton.instance;
  }

  public setToLocalStorage(): void {
    localStorage.setItem('page-state', JSON.stringify(this.state))
  }

  public getFromLocalStorage(): PageState {
    let currentState: string | null = localStorage.getItem('page-state');
    if (!currentState) {
      currentState = '';
    }
    return JSON.parse(currentState);
  }

  public setCartPagination(value: number) {
    this.state.cart.productsPerPage = value;
  }
}


