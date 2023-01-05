import { AbstractPage } from '../../abstracts/abstracts';
import { PageComponents, SimpleCard } from '../../models/interfaces';
import { appRouter, cartPage } from '../router/router';
import { possibleCards } from '../../../assets/samples/possible-cards';
import { appDrawer } from '../drawer/drawer';
import { appStorage } from '../storage/app-storage';
import { RouterPath } from '../../enums/enums';

export class ProductPage extends AbstractPage {
  constructor() {
    super();
    this.setPageTitle('Product Info');
  }
  
  getPageContent(): PageComponents['content'] {
    const content = document.createElement('div');
    content.className = 'row';

    const cardContainer = document.createElement('section');
    cardContainer.className = 'col-9';

    const priceContainer = document.createElement('aside');
    priceContainer.className = 'col-3';

    const productIndex: number = appRouter.getProductIndex();
    const card: SimpleCard = possibleCards.products[productIndex - 1];
    console.log(card)

    const productTitle = appDrawer.getProductDetailsTitle(card.title);
    const productFilters = appDrawer.getProductDetailsSubtitle(card.category, card.brand, card.title);
    const productDescription = appDrawer.getProductDetailsDescription(card.description);

    this.drawProductSummary(priceContainer, card);

    const carouselId = 'product-page-carousel';
    const carousel = appDrawer.getProductDetailsCarousel(carouselId);
    const carouselIndicators = appDrawer.getProductDetailsCarouselIndicators(carouselId, card.images, card.title);
    const carouselInner = appDrawer.getProductDetailsCarouselInner(card.images, card.title);
    const carouselPrevControl = appDrawer.getProductDetailsCarouselControl(carouselId, 'prev', 'Previous');
    const carouselNextControl = appDrawer.getProductDetailsCarouselControl(carouselId, 'next', 'Next');

    carousel.append(carouselInner, carouselPrevControl, carouselNextControl, carouselIndicators);

    cardContainer.append(carousel, productDescription);
    content.append(productFilters, productTitle, cardContainer, priceContainer);
    return content;
  }

  private drawProductSummary(parentElement: HTMLElement, card: SimpleCard): void {
    const productSummaryId = 'product-details-summary';
    document.getElementById(productSummaryId)?.remove();

    const productPrice = appDrawer.getProductDetailsPrice(card);
    productPrice.id = productSummaryId;

    if (this.isProductInCart(card)) {
      const removeProductFromCartButton = this.removeProductFromCartButton(parentElement, card);
      productPrice.append(removeProductFromCartButton);
    } else {
      const addProductToCartButton = this.getAddProductToCartButton(parentElement, card);
      productPrice.append(addProductToCartButton);
    }

    const buyProductNowButton = this.getBuyProductNowButton(card);
    productPrice.append(buyProductNowButton);
    parentElement.append(productPrice);
  }

  private isProductInCart(card: SimpleCard): boolean {
    const productsInCart: SimpleCard[] = appStorage.getCartProducts();
    const productIndex = this.getProductIndex(productsInCart, card.id);
    return productIndex >= 0 ? true : false;
  }

  private getProductIndex(cards: SimpleCard[], itemId: number): number {
    const index = cards.findIndex((card => itemId === card.id));
    return index;
  }

  private getAddProductToCartButton(parentElement: HTMLElement, card: SimpleCard): HTMLElement {
    const button = appDrawer.getSimpleButton('Add to cart', 'btn btn-primary');

    button.addEventListener('click', () => {
      appStorage.addProductToCart(card);
      cartPage.setCartState();
      this.drawProductSummary(parentElement, card);
    })

    return button;
  }

  private removeProductFromCartButton(parentElement: HTMLElement, card: SimpleCard): HTMLElement {
    const button = appDrawer.getSimpleButton('Remove from cart', 'btn btn-primary b-block text-uppercase');
    
    button.addEventListener('click', () => {
      appStorage.removeProductFromCart(card);
      cartPage.setCartState();
      this.drawProductSummary(parentElement, card);
    })

    return button;
  }

  private getBuyProductNowButton(card: SimpleCard): HTMLElement {
    const button = appDrawer.getSimpleButton('BuyNow', 'btn btn-success d-block text-uppercase');

    button.addEventListener('click', () => {
      this.placeOrder(card);
    })

    return button;
  }

  private placeOrder(card: SimpleCard): void {
    if (!this.isProductInCart(card)) {
      appStorage.addProductToCart(card);
      cartPage.updatePage();
    }

    appRouter.navigate(RouterPath.Cart);
    this.openPurchaseModal();
  }

  private openPurchaseModal(): void {
    const openBtn = document.getElementById('purchase-modal-open-button');
    if (openBtn && openBtn instanceof HTMLElement) {
      openBtn.click();
    }
  }
}

export const productPage = new ProductPage();
