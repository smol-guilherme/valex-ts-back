import { editDate } from "./dataFormatServices.js";
import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.SECRET_KEY);

export function isCardExpired(requestData) {
  if(requestData.expirationDate < editDate()) throw { type: 'card_expired_error' };
}

export function isCVVValid(requestData, card) {
  if(requestData.CVV !== cryptr.decrypt(card.securityCode)) throw { type: 'ownership_not_match_error' };
  return cryptr.encrypt(requestData.password);
}