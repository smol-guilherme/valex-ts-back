import Cryptr from "cryptr";
import { editExpirationDate, editTodayDate } from "./dataFormatServices.js";
import { findByCardDetails, findById } from "../repositories/cardRepository.js";

const cryptr = new Cryptr(process.env.SECRET_KEY);

export function isCardExpired(cardData) {
  const { month: cardMonth, year: cardYear } = splitDateValues(cardData.expirationDate);
  const { month: dateMonth, year: dateYear } = splitDateValues(editTodayDate());
  if(cardYear <= dateYear)
    if(cardMonth < dateMonth) throw { type: 'card_expired_error' };
  return;
}

function splitDateValues(date: string) {
  const result: string[] = date.split("/");
  return { month: result[0], year: result[1] }
}

// verificar a usabilidade dessa função
export function checkCardOwnership(workerId, cardData) {
  if(workerId !== cardData.workerId) throw { type: 'ownership_not_match_error' };
  return;
}

export function checkCVVValidityAndEncryptPassword(requestData, card) {
  if(requestData.CVV !== cryptr.decrypt(card.securityCode)) throw { type: 'ownership_not_match_error' };
  return cryptr.encrypt(requestData.password);
}

export async function isCardValid(cardData) {
  const card = await findById(cardData.cardId);
  if(card === undefined) throw { type: 'not_found_error' };
  return card;
}

export function isPasswordCorrect(userPassword: string, cardPassword: string) {
  isCardActive(userPassword)
  if(userPassword !== cryptr.decrypt(cardPassword)) throw { type: 'ownership_not_match_error' };
  return;
}

function isCardActive(userPassword) {
  if(userPassword === undefined) throw { type: 'card_expired_error' };
  return;
}

export async function isOnlineCardValid(cardData) {
  const card = await findByCardDetails(cardData.number, cardData.cardholderName, cardData.expirationDate);
  if(card === undefined) throw { type: 'not_found_error' };
  return;
}

export function isCardBlocked(cardData) {
  if(cardData.isBlocked) throw { type: 'card_expired_error' };
  return;
}

export function isTypeValid(cardData, companyData) {
  if(cardData.type !== companyData.type) throw { type: 'type_mismatch_error' };
  return;
}