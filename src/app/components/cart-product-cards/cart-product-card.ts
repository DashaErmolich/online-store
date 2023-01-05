import { CURRENCY_ICON_CLASS_NAME, PRODUCT_CART_QTY_DEFAULT } from '../../constants/constants';
import { SimpleCard } from '../../models/interfaces';
import { appStorage } from '../storage/app-storage';
import { cartPage } from '../router/router';

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

    const cardPrice = document.createElement('h6');
    cardPrice.className = 'card-title';
    cardPrice.innerHTML = `${this.card.price}`;
    const priceCurrency = document.createElement('i');
    priceCurrency.className = CURRENCY_ICON_CLASS_NAME;
    cardPrice.append(priceCurrency);

    const cardCategoryAndBrand = document.createElement('p');
    cardCategoryAndBrand.className = 'card-text text-capitalize';
    cardCategoryAndBrand.innerHTML = `${this.card.category} &bull; ${this.card.brand}`;

    const cardDescription = document.createElement('p');
    cardDescription.className = 'card-text';
    cardDescription.innerHTML = this.card.description;

    const cardStockQty = document.createElement('p');
    cardStockQty.innerHTML = `Stock: ${this.card.stock}`;

    const cardInfo = document.createElement('div');
    cardInfo.className = 'd-flex justify-content-between';

    const cardRatingAndDiscount = document.createElement('div');
    cardRatingAndDiscount.className = 'card-text';
    const cardRatingIcon = document.createElement('i');
    cardRatingIcon.className = 'bi bi-star';
    const cardRating = document.createElement('span');
    cardRating.className = 'text-muted';
    cardRating.innerHTML = `${this.card.rating} &bull;`;
    const cardDiscount = document.createElement('span');
    cardDiscount.className = 'text-muted';
    cardDiscount.innerHTML = `Discount: ${this.card.discountPercentage}%`;
    cardRatingAndDiscount.append(cardRatingIcon, cardRating, cardDiscount);

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