import { AbstractPage } from '../../abstracts/abstracts';
import { PageComponents } from '../../models/interfaces';

export class MainPage extends AbstractPage {

  getPageContent(): PageComponents['content'] {
    this.setPageTitle('Online Shop');
    const content = document.createElement('div');
    content.innerHTML = `
    <h1>Online Shop</h1>
      <div class="main-content-wrapper">
      <div class="filters-wrapper">
        <div class="filters__category">
          <h3 class="filters__category-title">Category</h3>
          <div class="filters__category-line">
            <input type="checkbox" name="categories">
            <label for="categories">Smartphones</label>
          </div>
          <div class="filters__category-line">
            <input type="checkbox" name="categories">
            <label for="categories">Laptops</label>
          </div>
          <div class="filters__category-line">
            <input type="checkbox" name="categories">
            <label for="categories">Fragrances</label>
          </div>
        </div>
        <div class="filters__brand">
          <h3 class="filters__category-title">Brand</h3>
          <div class="filters__category-line">
            <input type="checkbox" name="brands">
            <label for="brands">Apple</label>
          </div>
          <div class="filters__category-line">
            <input type="checkbox" name="brands">
            <label for="brands">Samsung</label>
          </div>
          <div class="filters__category-line">
            <input type="checkbox" name="brands">
            <label for="brands">OPPO</label>
          </div>
        </div>
      </div>
      <div class="cards-wrapper">
      </div>
      </div>
  </div>
  </div>
  <template class="card" id = "card-temp">
  <h3 class="card__title">Tovar</h3>
  <div class="card__description-field">
  <p class="card__category">category</p>
  <p class="card__brand">brand</p>
  <p class="card__price">price</p>
  <p class="card__discount">discount</p>
  <p class="card__rating">rating</p>
  <p class="card__stock">stock</p>
  </div>
  <div class="card__buttons-field">
  <button class="card__btn card__to-cart-btn"></button>
  <button class="card__btn card__details-btn"></button>
  </div>
  </template>
    `;

    const cards = possibleCards.products;
    cards.forEach(e => this.filterAndCreate(e))
    return content;
  }

  filterAndCreate(elem: SimpleCard, category?:string, brand?:string) {
    if (!brand && !category) {
      const $fragment = document.createDocumentFragment();
      const $wrapper = document.querySelector('.cards-wrapper') as HTMLDivElement;
      const $card = document.querySelector('#card-temp') as HTMLTemplateElement;
      const clone = $card.content.cloneNode(true) as HTMLTemplateElement;
      (clone.querySelector('.card__title') as HTMLDivElement).textContent = elem.title;
      (clone.querySelector('.card__category') as HTMLParagraphElement).textContent = elem.category;
      $fragment.append(clone);
      $wrapper.appendChild($fragment);
    }
  }
}

export const mainPage = new MainPage();