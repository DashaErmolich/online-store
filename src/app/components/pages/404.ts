import { AbstractPage } from '../../abstracts/abstracts';
import { PageComponents } from '../../models/interfaces';

export class NotFoundPage extends AbstractPage {

  getPageContent(): PageComponents['content'] {
    this.setPageTitle('404');
    const content = document.createElement('div');
    content.innerHTML = '404'
    return content;
  }
}