import { AbstractPage } from '../../abstracts/abstracts';
import { PageComponents } from '../../models/interfaces';

export class MainPage extends AbstractPage {

  getPageContent(): PageComponents['content'] {
    this.setPageTitle('Online Shop');
    const content = document.createElement('div');
    content.innerHTML = 'main'
    return content;
  }
}


