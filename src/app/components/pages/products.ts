import { AbstractPage } from '../../view/page-view';
import { PageComponents } from '../../../models/interfaces';

export class ProductPage extends AbstractPage {
  
  getPageContent(): PageComponents['content'] {
    this.setPageTitle('Product Info');
    const content = `
    <h1>Product Info</h1>
    `;
    return content;
  }
}