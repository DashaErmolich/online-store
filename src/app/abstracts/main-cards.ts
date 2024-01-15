export class DepricatedCard {
  private id: number;
  private title: string;
  private description: string;
  private price: number;
  private discountPercentage: number;
  private rating: number;
  private stock: number;
  private brand: string;
  private category: string;
  private thumbnail: string;
  private images: Array<string>;

  constructor (id: number, title:string, description: string, price: number, discountPercentage: number,
    rating: number, stock: number, brand: string, category: string, thumbnail: string, images: Array<string>) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.discountPercentage = discountPercentage;
    this.rating = rating;
    this.stock = stock;
    this.brand = brand;
    this.category = category;
    this.thumbnail = thumbnail;
    this.images = images;
  }
}