import Cryptr from "cryptr";
import { findById } from "../repositories/employeeRepository.js";
import * as cardsDatabase from "../repositories/cardRepository.js";
import { editDate } from "./dataFormatServices.js";

const cryptr = new Cryptr(process.env.SECRET_KEY);

export async function matchWorkerToCard(cardData, workerData) {
  const worker = await findById(workerData.id);
  const card = await cardsDatabase.findById(cardData.cardId);
  if(worker === undefined) throw { type: 'not_found_error' };
  if(card === undefined) throw { type: 'not_found_error' };
  if(worker.id !== card.employeeId) throw { type: 'ownership_not_match_error' };
  await verifyDataValidity(card, cardData);
  return;
}

async function verifyDataValidity(card, requestData) {
  if(requestData.expirationDate < editDate()) throw { type: 'card_expired_error' };
  if(requestData.CVV !== cryptr.decrypt(card.securityCode)) throw { type: 'ownership_not_match_error' };
  const dataToUpdate = {
    password: cryptr.encrypt(requestData.password)
  }
  const response = await cardsDatabase.update(requestData.cardId, dataToUpdate);
  if(response?.rowCount === 0) throw { type: 'already_exists_error' };
}