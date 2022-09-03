import { CardUpdateData, findCardHistory, toggleBlock, update } from "../repositories/cardRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { isCardExpired, isCardValid, checkCVVValidityAndEncryptPassword, isPasswordCorrect, checkCardOwnership } from "./cardServices.js";

export async function matchWorkerToCard(cardData, workerData) {
  const { worker, card } = await workerValidationRoutine(cardData, workerData);
  if(worker.id !== card.employeeId) throw { type: 'ownership_not_match_error' };
  await activateCardRoutine(card, cardData);
  return;
}

async function workerValidationRoutine(cardData, workerData) {
  const worker = await findWorker(workerData);
  const card = await isCardValid(cardData);
  return { worker, card };
}

async function findWorker(workerData) {
  const worker = await findById(workerData.id);
  if(worker === undefined) throw { type: 'not_found_error' };
  return worker;
}

async function activateCardRoutine(card, requestData) {
  isCardExpired(requestData);
  const dataToUpdate = { password: checkCVVValidityAndEncryptPassword(requestData, card) }
  const response = await update(requestData.cardId, dataToUpdate);
  if(response?.rowCount === 0) throw { type: 'already_exists_error' };
  return;
}

export async function toggleBlockCard(workerData, cardData) {
  const { worker, card } = await workerValidationRoutine(cardData, workerData);
  isPasswordCorrect(cardData.password, card.password);
  const cardRequest: CardUpdateData = {
    isBlocked: !card.isBlocked,
  }
  toggleBlock(cardData.cardId, cardRequest)
  return;
}

export async function checkForExpenses(cardData) {
  await isCardValid(cardData);
  const history = await findCardHistory(cardData.cardId);
  return history;
}