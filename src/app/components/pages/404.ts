import { AbstractPage } from '../../view/page-view';
import { PageComponents } from '../../../models/interfaces';

export class NotFoundPage extends AbstractPage {

  getPageContent(): PageComponents['content'] {
    this.setPageTitle('404');
    // const content = `
    // <h1>404</h1>
    // `;
    // return content;
    const content = document.createElement('div');
    return content;
  }
}