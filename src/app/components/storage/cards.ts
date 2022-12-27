import { SimpleCard } from "../../models/interfaces";

export class Card {
  // id: number;
  // title: string;
  // description: string;
  // price: number;
  // discountPercentage: number;
  // rating: number;
  // stock: number;
  // brand: string;
  // category: string;
  // thumbnail: string;
  // images: string[];
  card: SimpleCard;
  static totalCards = 0;

  constructor (card: SimpleCard) {
    // this.id = takenCard.id;
    // this.title = takenCard.title;
    // this.description = takenCard.description;
    // this.price = takenCard.price;
    // this.discountPercentage = takenCard.discountPercentage;
    // this.rating = takenCard.rating;
    // this.stock = takenCard.stock;
    // this.brand = takenCard.brand;
    // this.category = takenCard.category;
    // this.thumbnail = takenCard.thumbnail;
    // this.images = takenCard.images;
    this.card = card;
    Card.totalCards++;
  }
  
}