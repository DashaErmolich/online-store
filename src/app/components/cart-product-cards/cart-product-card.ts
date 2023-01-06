import { PRODUCT_CART_QTY_DEFAULT } from '../../constants/constants';
import { SimpleCard, MainPageCardElement } from '../../models/interfaces';
import { appStorage } from '../storage/app-storage';
import { cartPage } from '../router/router';
import { appDrawer } from '../drawer/drawer';

export class ProductCard {

  card: SimpleCard
  index: number

  constructor(card: SimpleCard, index: number) {
    this.card = card;
    this.index = index;
  }
  public getCartCardContent(): HTMLElement {
    const cardContainer = document.createElement('article');
    cardContainer.className = 'card d-flex flex-row align-items-center';

    const cardImg = document.createElement('img');
    cardImg.className = 'w-25 h-100';
    cardImg.src = this.card.thumbnail;
    cardImg.alt = this.card.title;

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body d-flex flex-column justify-content-between';

    const cardHeader = document.createElement('div');
    cardHeader.className = 'card-title d-flex justify-content-between';
    const cardTitle = document.createElement('h5');
    cardTitle.innerHTML = `${this.index} - ${this.card.title}`;
    const cardTrashButton = document.createElement('button');
    cardTrashButton.className = 'bi bi-trash3 page-link fs-4';
    cardTrashButton.addEventListener('click', () => {
      this.listenDeleteProductButton();
    })
    cardHeader.append(cardTitle, cardTrashButton);

    const cardPrice = appDrawer.getProductPrice(this.card.price, 'card-title');

    const cardCategoryAndBrand = document.createElement('p');
    cardCategoryAndBrand.className = 'card-text text-capitalize';
    cardCategoryAndBrand.innerHTML = `${this.card.category} &bull; ${this.card.brand}`;

    const cardDescription = document.createElement('p');
    cardDescription.className = 'card-text';
    cardDescription.innerHTML = this.card.description;

    const cardStockQty = appDrawer.getProductStockQty(this.card.stock)

    const cardInfo = document.createElement('div');
    cardInfo.className = 'd-flex justify-content-between';

    const cardRatingAndDiscount = document.createElement('div');
    cardRatingAndDiscount.className = 'card-text';

    const cardRating = appDrawer.getProductRating(this.card.rating);
    cardRating.classList.add('text-muted');
    cardRating.classList.add('d-inline');
    const separator = appDrawer.getSimpleParagraphElement('&bull;');
    separator.classList.add('text-muted');
    separator.classList.add('d-inline');
    const cardDiscount = appDrawer.getProductDiscount(this.card.discountPercentage);
    cardDiscount.classList.add('text-muted');
    cardDiscount.classList.add('d-inline');
    
    cardRatingAndDiscount.append(cardRating, separator, cardDiscount);

    const cardQtyAndButtons = document.createElement('div');
    cardQtyAndButtons.className = 'd-flex justify-content-between align-items-center';
    const cardRemoveItemButton = document.createElement('button');
    cardRemoveItemButton.className = 'bi bi-dash-circle page-link fs-4 cart-remove-product-button';
    cardRemoveItemButton.addEventListener('click', () => {
      this.listenRemoveProductButton();
    })
    const cardItemQty = document.createElement('span');
    cardItemQty.className = 'd-block m-3 fs-5';
    cardItemQty.innerHTML = `${this.card.qty || PRODUCT_CART_QTY_DEFAULT}`
    const cardAddItemButton = document.createElement('button');
    cardAddItemButton.className = 'bi bi-plus-circle page-link fs-4 cart-add-product-button';
    cardAddItemButton.addEventListener('click', () => {
      this.listenAddProductButton();
    })
    cardQtyAndButtons.append(cardRemoveItemButton, cardItemQty, cardAddItemButton);

    cardInfo.append(cardRatingAndDiscount, cardQtyAndButtons);
    cardBody.append(cardHeader, cardPrice, cardCategoryAndBrand, cardDescription, cardStockQty, cardInfo);
    cardContainer.append(cardImg, cardBody);

    return cardContainer;
  }

  listenAddProductButton() {
    if (!this.card.qty) {
      this.card.qty = 1;
    }
    const stockQty = this.card.stock;
    if (this.card.qty < stockQty) {
      this.card.qty++;
      appStorage.setCartProductQty(this.card, this.card.qty);
    }
    cartPage.updatePage();
  }

  listenRemoveProductButton() {
    if (!this.card.qty || this.card.qty === 1) {
      this.card.qty = 1;
      appStorage.removeProductFromCart(this.card);
    }
    if (this.card.qty >= 2) {
      this.card.qty--;
      appStorage.setCartProductQty(this.card, this.card.qty);
    }
    cartPage.updatePage();
  }

  listenDeleteProductButton() {
    appStorage.removeProductFromCart(this.card);
    cartPage.updatePage();
  }


}

export class MainPageProductCard {
  card: SimpleCard;
  cardElement: MainPageCardElement;

  constructor(card: SimpleCard) {
    this.card = card;

    this.cardElement = {
      image: appDrawer.getProductCardImage(this.card.title, this.card.thumbnail, 'card-img-top card-image_custom'),
      title: appDrawer.getProductCardTitle('h5', this.card.title),
      price: appDrawer.getProductPrice(this.card.price, 'display-6'),
      discount: appDrawer.getProductDiscount(this.card.discountPercentage),
      category: appDrawer.getSimpleElement('p', '', this.card.category),
      brand: appDrawer.getSimpleElement('p', '', this.card.brand),
      description: appDrawer.getProductDetailsDescription(this.card.description),
      rating: appDrawer.getProductRating(this.card.rating, 'text-muted'),
      stock: appDrawer.getProductStockQty(this.card.stock, 'text-muted'),
      addToCartButton: this.getAddProductToCartButton(this.card),
      removeFromCartButton: this.getRemoveProductFromCartButton(this.card),
    }
  }

  public getCardContent(): HTMLElement {
    const container = appDrawer.getSimpleElement('div', 'col');
    const card = appDrawer.getSimpleElement('div', 'card h-100');
    const cardBody = appDrawer.getSimpleElement('div', 'card-body');
    const cardFooter = appDrawer.getSimpleElement('div', 'card-footer d-flex flex-row justify-content-between');
  
    cardBody.append(this.cardElement.price, this.cardElement.title, this.cardElement.stock, this.cardElement.rating);

    if (this.isProductInCart(this.card)) {
      this.cardElement.addToCartButton.classList.add('d-none')
    } else {
      this.cardElement.removeFromCartButton.classList.add('d-none');
    }

    cardFooter.append(this.cardElement.stock, this.cardElement.rating);
    card.append(this.cardElement.image, cardBody, this.cardElement.addToCartButton, this.cardElement.removeFromCartButton, cardFooter);
    container.append(card)
    return container;
  }

  private showButton(): HTMLElement {

    if (this.isProductInCart(this.card)) {
      return this.getRemoveProductFromCartButton(this.card);
    } else {
      return this.getAddProductToCartButton(this.card);
    }
  }

  private getAddProductToCartButton(card: SimpleCard) {
    const button = appDrawer.getSimpleButton('Add to cart', 'btn btn-light text-uppercase rounded-0 bg-transparent add-product-button');

    button.addEventListener('click', () => {
      appStorage.addProductToCart(card);
      cartPage.updateCartState();
      button.classList.toggle('d-none');
      button.parentElement?.querySelector('.remove-product-button')?.classList.toggle('d-none');
    })

    return button;
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

  private getRemoveProductFromCartButton(card: SimpleCard) {
    const button = appDrawer.getSimpleButton('Remove from cart', 'btn btn-light text-uppercase rounded-0 bg-transparent remove-product-button');
    
    button.addEventListener('click', () => {
      appStorage.removeProductFromCart(card);
      cartPage.updateCartState();
      button.classList.toggle('d-none');
      button.parentElement?.querySelector('.add-product-button')?.classList.toggle('d-none');
    })

    return button;
  }
}