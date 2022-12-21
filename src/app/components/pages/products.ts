import { AbstractPage } from '../../abstracts/abstracts';
import { PageComponents } from '../../models/interfaces';

export class ProductPage extends AbstractPage {
  
  getPageContent(): PageComponents['content'] {
    this.setPageTitle('Product Info');
    const content = document.createElement('div');
    content.innerHTML = 'products'
    return content;
  }
}