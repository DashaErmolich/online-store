import { AbstractPage } from '../view/page-view';
import { PageComponents } from '../../models/interfaces';

export class CartPage extends AbstractPage {

  constructor() {
    super()
    this.setPageTitle('Shop Cart');
  }

  getPageContent(): PageComponents['content'] {
    const content = `
    <h1>Shop Cart</h1>
    `;
    return content;
  }
}