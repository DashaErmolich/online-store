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
    cartPage.updateCartState();

    const contentContainer = appDrawer.getSimpleElement('div', 'row');

    const productDescriptionContainer = appDrawer.getSimpleElement('section', 'col-md-9');
    const productSummaryContainer = appDrawer.getSimpleElement('aside', 'col-md-3');

    const productIndex: number = appRouter.getProductIndex();
    const card: SimpleCard = possibleCards.products[productIndex - 1];

    if (card) {
      this.drawBreadcrumb(contentContainer, card);
      this.drawProductTile(contentContainer, card.title);
      this.drawProductCarousel(productDescriptionContainer, card);
      this.drawProductDescription(productDescriptionContainer, card.description);
      this.drawProductSummary(productSummaryContainer, card);
  
      contentContainer.append(productDescriptionContainer, productSummaryContainer);
    } else {
      this.showNotFoundMessage(contentContainer, productIndex);
    }

    return contentContainer;
  }

  private showNotFoundMessage(parentElement: HTMLElement, productIndex: number): void {
    const notFoundContainer = appDrawer.getSimpleElement('div', 'text-center');
    const notFoundMessage = appDrawer.getOopsErrorMessage(` Product number ${productIndex} not found.`);
    const goHomeButton = appDrawer.getGoHomeButton();
    goHomeButton.addEventListener('click', () => {
      appRouter.navigate(RouterPath.Main);
    })
    notFoundContainer.append(notFoundMessage, goHomeButton)
    parentElement.append(notFoundContainer);
  }

  private drawBreadcrumb(parentElement: HTMLElement, card: SimpleCard): void {
    const productFilters = appDrawer.getProductDetailsBreadcrumb('Store', card.category, card.brand, card.title);
    parentElement.append(productFilters);
    appRouter.updatePageLinks();
  }

  private drawProductTile(parentElement: HTMLElement, title: string): void {
    const productTitle = appDrawer.getProductDetailsTitle(title);
    parentElement.append(productTitle)
  }

  private drawProductSummary(parentElement: HTMLElement, card: SimpleCard): void {
    const productSummaryId = 'product-details-summary';
    document.getElementById(productSummaryId)?.remove();

    const productSummary = appDrawer.getProductDetailsSummary(card);
    productSummary.id = productSummaryId;
    parentElement.append(productSummary);

    const buyProductNowButton =  this.getBuyProductNowButton(card);

    if (this.isProductInCart(card)) {
      this.getRemoveProductFromCartButton(parentElement, card, buyProductNowButton);
    } else {
      this.getAddProductToCartButton(parentElement, card, buyProductNowButton);
    }

    parentElement.append(buyProductNowButton);

  }

  private drawProductDescription(parentElement: HTMLElement, description: string): void {
    const productDescription = appDrawer.getProductDetailsDescription(description);
    parentElement.append(productDescription);
  }

  private drawProductCarousel(parentElement: HTMLElement, card: SimpleCard): void {
    const carouselId = 'product-page-carousel';
    const carousel = appDrawer.getProductDetailsCarousel(carouselId);
    const carouselIndicators = appDrawer.getProductDetailsCarouselIndicators(carouselId, card.images, card.title);
    const carouselInner = appDrawer.getProductDetailsCarouselInner(card.images, card.title);
    const carouselPrevControl = appDrawer.getProductDetailsCarouselControl(carouselId, 'prev', 'Previous');
    const carouselNextControl = appDrawer.getProductDetailsCarouselControl(carouselId, 'next', 'Next');

    carousel.append(carouselInner, carouselPrevControl, carouselNextControl);
    parentElement.append(carousel, carouselIndicators);
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

  private getAddProductToCartButton(parentElement: HTMLElement, card: SimpleCard, buyProductNowButton: HTMLElement) {
    const button = appDrawer.getSimpleButton('Add to cart', 'btn btn-primary text-uppercase w-100 mb-3');

    button.addEventListener('click', () => {
      appStorage.addProductToCart(card);
      cartPage.updateCartState();
      this.drawProductSummary(parentElement, card);
      button.remove();
      buyProductNowButton.remove();
    })

    parentElement.append(button);
  }

  private getRemoveProductFromCartButton(parentElement: HTMLElement, card: SimpleCard, buyProductNowButton: HTMLElement) {
    const button = appDrawer.getSimpleButton('Remove from cart', 'btn btn-primary text-uppercase w-100 mb-3');
    
    button.addEventListener('click', () => {
      appStorage.removeProductFromCart(card);
      cartPage.updateCartState();
      this.drawProductSummary(parentElement, card);
      button.remove();
      buyProductNowButton.remove();
    })

    parentElement.append(button);
  }

  private getBuyProductNowButton(card: SimpleCard): HTMLElement {
    const button = appDrawer.getSimpleButton('Buy Now', 'btn btn-success text-uppercase w-100 mb-3');

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
