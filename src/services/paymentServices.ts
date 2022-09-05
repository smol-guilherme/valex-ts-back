import * as payments from "../repositories/paymentRepository.js";
import { isCardBlocked, isCardExpired, isCardValid, isCardVirtual, isOnlineCardValid, isPasswordCorrect, isTypeValid } from "./cardServices.js";
import { isCompanyRegistered } from "./companyServices.js";

export async function insertNewExpense(transactionData) {
  const { card, company } = await transactionDataFetch(transactionData);
  isCardVirtual(card);
  cardValidationRoutine(card, company, transactionData)
  await executeTransaction(transactionData, card.id);
  return;
}

export async function insertNewOnlineExpense(transactionData) {
  const { card, company } = await transactionDataFetch(transactionData);
  if(Object.keys(transactionData).includes('cardholderName')) await isOnlineCardValid(transactionData);
  cardValidationRoutine(card, company, transactionData)
  await executeTransaction(transactionData, card.originalCardId);
  return;
}

function cardValidationRoutine(card, company, transactionData) {
  isTypeValid(card, company);
  isCardBlocked(card);
  isCardExpired(card);
  isPasswordCorrect(transactionData.password, card.password);
  return;
}

async function transactionDataFetch(transactionData) {
  const company = await isCompanyRegistered(transactionData);
  const card = await isCardValid(transactionData);
  return { card, company };
}

async function executeTransaction(transactionData, cardId) {
  delete transactionData.password;
  const paymentData: payments.PaymentInsertData = {
    ...transactionData,
    cardId
  }
  const isSet = await payments.insert(paymentData);
  if(isSet === 0) throw { type: 'insuficient_funds_error' };
  return;
}