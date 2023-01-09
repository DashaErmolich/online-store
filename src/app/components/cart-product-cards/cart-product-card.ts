import { CURRENCY_ICON_CLASS_NAME, PRODUCT_CART_QTY_DEFAULT } from '../../constants/constants';
import { SimpleCard, MainPageCardElement, ProductCardElement, CartPageCardElementActions } from '../../models/interfaces';
import { appStorage } from '../storage/app-storage';
import { cartPage, productPage } from '../router/router';
import { appDrawer } from '../drawer/drawer';
import { RouterPath, CardsAppearance } from '../../enums/enums';

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

class BasicProductCard {
  card: SimpleCard;
  cardElement: ProductCardElement;

  constructor(card: SimpleCard) {
    this.card = card;

    this.cardElement = {
      image: appDrawer.getProductCardImage(this.card.title, this.card.thumbnail, ''),
      title: appDrawer.getProductCardTitle('h5', this.card.title),
      price: appDrawer.getProductPrice(this.card.price, 'display-6 mb-2'),
      discount: appDrawer.getProductDiscount(this.card.discountPercentage, 'mb-2'),
      category: appDrawer.getSimpleElement('p', '', this.card.category),
      brand: appDrawer.getSimpleElement('p', '', this.card.brand),
      description: appDrawer.getProductDetailsDescription(this.card.description),
      rating: appDrawer.getProductRating(this.card.rating, 'text-muted'),
      stock: appDrawer.getProductStockQty(this.card.stock, 'text-muted'),
    }
  }
}

export class NewCard extends BasicProductCard {
  index: number;
  action: CartPageCardElementActions;

  constructor(card: SimpleCard, index: number) {
    super(card);
    this.index = index;
    this.action = {
      addQtyButton: this.getAddQtyButton(),
      removeQtyButton: this.getRemoveQtyButton(),
    }
  }

  private getAddQtyButton(): HTMLElement {
    const cardAddItemButton = document.createElement('button');
    cardAddItemButton.className = 'bi bi-plus-circle page-link fs-4 cart-add-product-button';
    cardAddItemButton.addEventListener('click', () => {
      this.listenAddProductButton();
    })
    return cardAddItemButton;
  }

  private getRemoveQtyButton(): HTMLElement {
    const cardRemoveItemButton = document.createElement('button');
    cardRemoveItemButton.className = 'bi bi-dash-circle page-link fs-4 cart-remove-product-button';
    cardRemoveItemButton.addEventListener('click', () => {
      this.listenRemoveProductButton();
    })
    return cardRemoveItemButton;
  }

  public getRowCardContent(): HTMLElement {
    const container = appDrawer.getSimpleElement('article', 'col overflow-hidden');
    const card = appDrawer.getSimpleElement('div', 'card h-100');

    const cardContentWrapper = appDrawer.getSimpleElement('div', 'row g-0 card-image-wrapper_custom_cart');

    const stretchedLinkWrap = appDrawer.getSimpleElement('p', 'position-relative h-100 col-4');
    const cardImageWrapper = appDrawer.getSimpleElement('div', 'w-100 h-100');
    cardImageWrapper.append(this.cardElement.image);
    stretchedLinkWrap.append(cardImageWrapper, this.getLinkToProducts(this.card.id));

    const cardBodyWrapper = appDrawer.getSimpleElement('div', 'col-8');
    const cardBody = appDrawer.getSimpleElement('div', 'card-body position-relative');

    this.cardElement.image.className = 'img-fluid rounded-start card-image_custom';
    this.cardElement.stock.className = 'mb-2';

    this.cardElement.title.innerHTML = `${this.index} - ${this.card.title}`;
    this.cardElement.price = appDrawer.getSimpleElement('span', `badge bg-light text-dark ${CURRENCY_ICON_CLASS_NAME} position-absolute top-0 end-0 fs-5 m-1`, `${this.card.price}`);
    this.cardElement.title.append(this.cardElement.price);

    this.cardElement.description = appDrawer.getSimpleElement('div', 'mb-2 two-line-text');
    this.cardElement.description.innerHTML = this.card.description;

    const productFilters = appDrawer.getProductDetailsBreadcrumb('Store', this.card.category, this.card.brand);

    const buttonsGroup = appDrawer.getSimpleElement('ul', 'list-group list-group-horizontal position-absolute bottom-0 end-0 fs-5 m-1');
    const productQtyWrap =  appDrawer.getSimpleElement('li', 'list-group-item flex-fill',);
    const productQty = appDrawer.getSimpleElement('span', '', `${this.card.qty || PRODUCT_CART_QTY_DEFAULT}`);
    productQtyWrap.append(productQty);
    const addBtnWrap = appDrawer.getSimpleElement('li', 'list-group-item text-primary flex-fill');
    addBtnWrap.append(this.action.addQtyButton);
    const removeBtnWrap = appDrawer.getSimpleElement('li', 'list-group-item text-danger flex-fill');
    removeBtnWrap.append(this.action.removeQtyButton);
    buttonsGroup.append(removeBtnWrap, productQtyWrap, addBtnWrap)
  
    cardBody.append(this.cardElement.title, productFilters, this.cardElement.description, this.cardElement.discount, this.cardElement.stock, this.cardElement.rating);
    cardBodyWrapper.append(cardBody);

    cardContentWrapper.append(stretchedLinkWrap, cardBodyWrapper);
    card.append(cardContentWrapper, buttonsGroup);
    container.append(card);

    return container;
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

  private getLinkToProducts(id: number) {
    const path: string[] = RouterPath.Products.split('/');
    path[path.length - 1] = `${id}`;
    const link = appDrawer.getNavigoLink('', path.join('/'));
    link.classList.add('stretched-link');
    link.addEventListener('click', () => {
      productPage.setProductIndex(id);
    })
    return link;
  }
}

export class MainPageProductCard {
  card: SimpleCard;
  cardElement: MainPageCardElement;
  cardsAppearance: string;

  constructor(card: SimpleCard, cardsAppearance: string) {
    this.card = card;
    this.cardsAppearance = cardsAppearance;

    this.cardElement = {
      image: appDrawer.getProductCardImage(this.card.title, this.card.thumbnail, ''),
      title: appDrawer.getProductCardTitle('h5', this.card.title),
      price: appDrawer.getProductPrice(this.card.price, 'mb-1 fs-4 tw-bold'),
      discount: appDrawer.getProductDiscount(this.card.discountPercentage, 'mb-1'),
      category: appDrawer.getSimpleElement('p', 'mb-1 text-capitalize', this.card.category),
      brand: appDrawer.getSimpleElement('p', 'mb-1', this.card.brand),
      description: appDrawer.getProductDetailsDescription(this.card.description),
      rating: appDrawer.getProductRating(this.card.rating, 'text-muted'),
      stock: appDrawer.getProductStockQty(this.card.stock, 'text-muted'),
      addToCartButton: this.getAddProductToCartButton(this.card),
      removeFromCartButton: this.getRemoveProductFromCartButton(this.card),
      linkToProductPage: this.getLinkToProducts(this.card.id),
    }
  }

  public getTableCardContent(): HTMLElement {
    const container = appDrawer.getSimpleElement('article', 'col');
    const card = appDrawer.getSimpleElement('div', 'card h-100');
    const cardBody = appDrawer.getSimpleElement('div', 'card-body position-relative');
    const cardFooter = appDrawer.getSimpleElement('div', 'card-footer d-flex flex-row justify-content-between');
  
    this.cardElement.description = appDrawer.getSimpleElement('div', 'mb-1 two-line-text text-muted');
    this.cardElement.description.innerHTML = this.card.description;
    cardBody.append(this.cardElement.price, this.cardElement.title, this.cardElement.brand, this.cardElement.category, this.cardElement.discount, this.cardElement.description);

    if (this.isProductInCart(this.card)) {
      this.cardElement.addToCartButton.classList.add('d-none')
    } else {
      this.cardElement.removeFromCartButton.classList.add('d-none');
    }

    const stretchedLinkWrap = appDrawer.getSimpleElement('p', 'position-relative h-100');
    const cardImageWrapper = appDrawer.getSimpleElement('div', 'card-image-wrapper_custom w-100');
    this.cardElement.image.className = 'card-img-top card-image_custom';
    cardImageWrapper.append(this.cardElement.image);
    stretchedLinkWrap.append(cardImageWrapper, cardBody, this.cardElement.linkToProductPage);

    cardFooter.append(this.cardElement.stock, this.cardElement.rating);
    card.append(stretchedLinkWrap, this.cardElement.addToCartButton, this.cardElement.removeFromCartButton, cardFooter);
    container.append(card);
    return container;
  }

  public getRowCardContent(): HTMLElement {
    const container = appDrawer.getSimpleElement('article', 'col');
    const card = appDrawer.getSimpleElement('div', 'card h-100');

    const cardContentWrapper = appDrawer.getSimpleElement('div', 'row g-0 card-image-wrapper_custom');

    const stretchedLinkWrap = appDrawer.getSimpleElement('p', 'position-relative h-100 col-4');
    const cardImageWrapper = appDrawer.getSimpleElement('div', 'w-100 h-100');
    cardImageWrapper.append(this.cardElement.image)
    stretchedLinkWrap.append(cardImageWrapper, this.cardElement.linkToProductPage);

    const cardBodyWrapper = appDrawer.getSimpleElement('div', 'col-8');
    const cardBody = appDrawer.getSimpleElement('div', 'card-body position-relative');

    this.cardElement.image.className = 'img-fluid rounded-start card-image_custom';
    this.cardElement.image.className = 'img-fluid rounded-start card-image_custom';

    this.cardElement.stock.className = 'mb-2';

    const productFilters = appDrawer.getProductDetailsBreadcrumbWithoutLink(this.card.category, this.card.brand);
  
    cardBody.append(this.cardElement.price, this.cardElement.title, productFilters, this.cardElement.discount, this.cardElement.stock, this.cardElement.rating, this.cardElement.addToCartButton, this.cardElement.removeFromCartButton);
    //cardBody.append(this.cardElement.price, this.cardElement.title, this.cardElement.discount, this.cardElement.stock, this.cardElement.rating, this.cardElement.addToCartButton, this.cardElement.removeFromCartButton);
    cardBodyWrapper.append(cardBody);

    if (this.isProductInCart(this.card)) {
      this.cardElement.addToCartButton.classList.add('d-none');
    } else {
      this.cardElement.removeFromCartButton.classList.add('d-none');
    }

    cardContentWrapper.append(stretchedLinkWrap, cardBodyWrapper);
    cardContentWrapper.append(stretchedLinkWrap, cardBodyWrapper);
    card.append(cardContentWrapper);
    container.append(card)

    return container;
  }

  private getAddProductToCartButton(card: SimpleCard) {
    let button: HTMLElement;

    if (this.cardsAppearance === CardsAppearance.Row) {
      button = appDrawer.getSimpleButton('', 'btn btn-link bi bi-bag-plus fs-3 position-absolute top-0 end-0 add-product-button');
    } else {
      button = appDrawer.getSimpleButton(' Add to cart', 'btn btn-light bi bi-bag-plus text-primary text-uppercase rounded-0 bg-transparent add-product-button');
      button = appDrawer.getSimpleButton(' Add to cart', 'btn btn-light bi bi-bag-plus text-primary text-uppercase rounded-0 bg-transparent add-product-button');
    }

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
    let button: HTMLElement;

    if (this.cardsAppearance === CardsAppearance.Row) {
      button = appDrawer.getSimpleButton('', 'btn btn-link bi bi bi-bag-x-fill text-danger fs-3 position-absolute top-0 end-0 remove-product-button');
    } else {
      button = appDrawer.getSimpleButton(' Remove from cart', 'btn btn-light bi bi bi-bag-x-fill text-danger text-uppercase rounded-0 bg-transparent remove-product-button');
      button = appDrawer.getSimpleButton(' Remove from cart', 'btn btn-light bi bi bi-bag-x-fill text-danger text-uppercase rounded-0 bg-transparent remove-product-button');
    }
    
    button.addEventListener('click', () => {
      appStorage.removeProductFromCart(card);
      cartPage.updateCartState();
      button.classList.toggle('d-none');
      button.parentElement?.querySelector('.add-product-button')?.classList.toggle('d-none');
    })

    return button;
  }

  private getLinkToProducts(id: number) {
    const path: string[] = RouterPath.Products.split('/');
    path[path.length - 1] = `${id}`;
    const link = appDrawer.getNavigoLink('', path.join('/'));
    link.classList.add('stretched-link');
    link.addEventListener('click', () => {
      productPage.setProductIndex(id);
    })
    return link;
  }
}