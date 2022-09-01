import { CardUpdateData, toggleBlock, update } from "../repositories/cardRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { isCardExpired, isCardValid, isCVVValid } from "./cardServices.js";

export async function matchWorkerToCard(cardData, workerData) {
  const worker = await findWorker(workerData);
  const card = await isCardValid(cardData);
  if(worker.id !== card.employeeId) throw { type: 'ownership_not_match_error' };
  await verifyDataValidity(card, cardData);
  return;
}

async function findWorker(workerData) {
  const worker = await findById(workerData.id);
  if(worker === undefined) throw { type: 'not_found_error' };
  return worker;
}

async function verifyDataValidity(card, requestData) {
  isCardExpired(requestData);
  const encryptedPassword: string = isCVVValid(requestData, card);
  const dataToUpdate = {
    password: encryptedPassword
  }
  const response = await update(requestData.cardId, dataToUpdate);
  if(response?.rowCount === 0) throw { type: 'already_exists_error' };
}

export async function toggleBlockCard(workerData, cardData) {
  const worker = await findWorker(workerData);
  const card = await isCardValid(cardData);
  console.log(card);
  const cardRequest: CardUpdateData = {
    isBlocked: !card.isBlocked,
  }
  toggleBlock(cardData.cardId, cardRequest)
  return;
}