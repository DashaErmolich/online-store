import { CURRENCY_ICON_CLASS_NAME } from '../../constants/constants';
import { SimpleCard } from '../../models/interfaces';

export class ProductCard {

  card: SimpleCard
  index: number

  constructor(card: SimpleCard, index: number) {
    this.card = card;
    this.index = index;
  }
  public getCartCardContent(): string {
    return `
      <article class="card d-flex flex-row align-items-center">
        <img class="w-25 h-100" src="${this.card.thumbnail}" alt="${this.card.title}">
        <div class="card-body d-flex flex-column justify-content-between">
          <h5 class="card-title d-flex justify-content-between">
            ${this.index} - ${this.card.title}
            <button class="bi bi-trash3 page-link fs-4"></button>
          </h5>
          <h6 class="card-title">
            ${this.card.price}
            <i class="${CURRENCY_ICON_CLASS_NAME}"></i>
          </h6>
          <p class="card-text text-capitalize">${this.card.category} &bull; ${this.card.brand}</p>
          <p class="card-text">${this.card.description}</p>
          <p>Stock: ${this.card.stock}</p>
          <div class="d-flex justify-content-between">
            <div class="card-text">
              <i class="bi bi-star"></i>
              <span class="text-muted">${this.card.rating} &bull; </span>
              <span class="text-muted">Discount: ${this.card.discountPercentage}%</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <button class="bi bi-dash-circle page-link fs-4 cart-remove-product-button"></button>
              <span class="d-block m-3 fs-5">${this.card.qty || 1}</span>
              <button class="bi bi-plus-circle page-link fs-4 cart-add-product-button"></button>
            </div>
          </div>
        </div>
      </article>`
  }
}