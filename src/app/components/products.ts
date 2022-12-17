import { AbstractPage } from '../view/page-view';
import { PageComponents } from '../../models/interfaces';

export class ProductPage extends AbstractPage {

  constructor() {
    super()
    this.setPageTitle('Product Info');
  }

  getPageContent(): PageComponents['content'] {
    const content = `
    <h1>Product Info</h1>
    `;
    return content;
  }
}