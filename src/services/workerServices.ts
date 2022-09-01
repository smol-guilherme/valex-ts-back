import * as cardsDatabase from "../repositories/cardRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { isCardExpired, isCVVValid } from "./cardServices.js";

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
  isCardExpired(requestData);
  const encryptedPassword: string = isCVVValid(requestData, card);
  const dataToUpdate = {
    password: encryptedPassword
  }
  const response = await cardsDatabase.update(requestData.cardId, dataToUpdate);
  if(response?.rowCount === 0) throw { type: 'already_exists_error' };
}