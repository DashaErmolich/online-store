import { AbstractPage } from '../view/page-view';
import { PageComponents } from '../../models/interfaces';

export class CartPage extends AbstractPage {

  getPageContent(): PageComponents['content'] {
    this.setPageTitle('Shop Cart');
    const content = `
    <h1>Shop Cart</h1>
    `;
    return content;
  }
}