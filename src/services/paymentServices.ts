import * as payments from "../repositories/paymentRepository.js";
import { isCardExpired, isCardValid, isPasswordCorrect, isTypeValid } from "./cardServices.js";
import { isCompanyRegistered } from "./companyServices.js";

export async function insertNewExpense(transactionData) {
  const company = await isCompanyRegistered(transactionData);
  const card = await isCardValid(transactionData);
  isTypeValid(card, company);
  isPasswordCorrect(transactionData.password, card.password);
  isCardExpired(card);
  delete transactionData.password;
  const paymentData: payments.PaymentInsertData = {
    ...transactionData
  }
  const isSet = await payments.insert(paymentData);
  if(isSet === 0) throw { type: 'insuficient_funds_error' };
  return;
}