import { PageComponents } from '../models/interfaces';

export abstract class AbstractPage {

  protected setPageTitle(title: PageComponents['title']): void {
    document.title = title;
  }

  getPageContent(): PageComponents['content'] {
    const content = document.createElement('div');
    return content;
  }

}