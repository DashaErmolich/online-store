import { AbstractPage } from '../view/page-view';
import { PageComponents } from '../../models/interfaces';

export class NotFoundPage extends AbstractPage {

  constructor() {
    super()
    this.setPageTitle('404');
  }

  getPageContent(): PageComponents['content'] {
    const content = `
    <h1>404</h1>
    `;
    return content;
  }
}