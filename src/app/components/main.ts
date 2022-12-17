import { AbstractPage } from '../view/page-view';
import { PageComponents } from '../../models/interfaces';

export class MainPage extends AbstractPage {

  constructor() {
    super()
    this.setPageTitle('Online Shop');
  }

  getPageContent(): PageComponents['content'] {
    const content = `
    <h1>Online Shop</h1>
    `;
    return content;
  }
}


