import { SimpleCard } from "../../models/interfaces";

export class Card {
  card: SimpleCard;
  static totalCards = 0;

  constructor (card: SimpleCard) {
    this.card = card;
    Card.totalCards++;
  }
  
}