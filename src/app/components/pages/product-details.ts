import { AbstractPage } from '../../abstracts/abstracts';
import { PageComponents, SimpleCard } from '../../models/interfaces';
import { appRouter } from '../router/router';
import { possibleCards } from '../../../assets/samples/possible-cards';

export class ProductPage extends AbstractPage {
  constructor() {
    super();
    this.setPageTitle('Product Info');
  }
  
  getPageContent(): PageComponents['content'] {
    const content = document.createElement('div');
    content.innerHTML = 'products'
    const productIndex: number = appRouter.getProductIndex();
    const card: SimpleCard = possibleCards.products[productIndex - 1];
    console.log(card)
    return content;
  }
}

export const productPage = new ProductPage();
