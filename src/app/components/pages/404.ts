import { AbstractPage } from '../../abstracts/abstracts';
import { PageComponents } from '../../models/interfaces';
import { appRouter, cartPage } from '../router/router';
import { RouterPath } from '../../enums/enums';

export class NotFoundPage extends AbstractPage {

  constructor() {
    super();
    this.setPageTitle('404');
  }

  getPageContent(): PageComponents['content'] {
    cartPage.updateCartState();
    const container = document.createElement('div');
    container.className = 'd-flex align-items-center justify-content-center';
    
    const content = document.createElement('div');
    content.className = 'text-center';

    const title = document.createElement('h1');
    title.className = 'display-1 fw-bold';
    title.innerHTML = '404';

    const contentFirstLine = document.createElement('p');
    contentFirstLine.className = 'fs-3';
    const contentFirstLineOops = document.createElement('span');
    contentFirstLineOops.className = 'text-danger';
    contentFirstLineOops.innerHTML = 'Oops!';
    const contentFirstLineMessage = document.createElement('span');
    contentFirstLineMessage.innerHTML = ' Page not found.';
    contentFirstLine.append(contentFirstLineOops, contentFirstLineMessage);

    const contentSecondLine = document.createElement('p');
    contentSecondLine.className = 'lead';
    contentSecondLine.innerHTML = `The page you're looking for doesn't exist.`;

    const goHomeButton = document.createElement('button');
    goHomeButton.className = 'btn btn-primary';
    goHomeButton.innerHTML = 'Go Home';
    goHomeButton.addEventListener('click', () => {
      appRouter.navigate(RouterPath.Main);
    })

    content.append(title, contentFirstLine, contentSecondLine, goHomeButton)

    container.append(content)
    return container;
  }

}