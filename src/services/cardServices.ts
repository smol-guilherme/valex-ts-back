import Cryptr from "cryptr";
import { editDate } from "./dataFormatServices.js";
import { findById } from "../repositories/cardRepository.js";

const cryptr = new Cryptr(process.env.SECRET_KEY);

export function isCardExpired(cardData) {
  if(cardData.expirationDate < editDate()) throw { type: 'card_expired_error' };
}

export function isCVVValid(requestData, card) {
  if(requestData.CVV !== cryptr.decrypt(card.securityCode)) throw { type: 'ownership_not_match_error' };
  return cryptr.encrypt(requestData.password);
}

export async function isCardValid(cardData) {
  const card = await findById(cardData.cardId);
  if(card === undefined) throw { type: 'not_found_error' };
  isPasswordCorrect(cardData.password, card.password);
  return card;
}

function isPasswordCorrect(userPassword: string, cardPassword: string) {
  if(userPassword !== cryptr.decrypt(cardPassword)) throw { type: 'ownership_not_match_error' };
  return;
}