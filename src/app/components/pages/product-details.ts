import { AbstractPage } from '../../abstracts/abstracts';
import { PageComponents, SimpleCard } from '../../models/interfaces';
import { appRouter } from '../router/router';
import { possibleCards } from '../../../assets/samples/possible-cards';
import { appDrawer } from '../drawer/drawer';

export class ProductPage extends AbstractPage {
  constructor() {
    super();
    this.setPageTitle('Product Info');
  }
  
  getPageContent(): PageComponents['content'] {
    const content = document.createElement('div');
    const productIndex: number = appRouter.getProductIndex();
    const card: SimpleCard = possibleCards.products[productIndex - 1];
    console.log(card)

    const carouselId = 'product-page-carousel';
    const carousel = appDrawer.getProductDetailsCarousel(carouselId);
    const carouselIndicators = appDrawer.getProductDetailsCarouselIndicators(carouselId, card.images, card.title);
    const carouselInner = appDrawer.getProductDetailsCarouselInner(card.images, card.title);
    const carouselPrevControl = appDrawer.getProductDetailsCarouselControl(carouselId, 'prev', 'Previous');
    const carouselNextControl = appDrawer.getProductDetailsCarouselControl(carouselId, 'next', 'Next');

    carousel.append(carouselInner, carouselPrevControl, carouselNextControl, carouselIndicators);

    content.append(carousel);
    return content;
  }
}

export const productPage = new ProductPage();
