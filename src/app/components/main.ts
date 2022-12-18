import { AbstractPage } from '../view/page-view';
import { PageComponents } from '../../models/interfaces';

export class MainPage extends AbstractPage {

  getPageContent(): PageComponents['content'] {
    this.setPageTitle('Online Shop');
    const content = `
    <h1>Online Shop</h1>
    `;
    return content;
  }
}


