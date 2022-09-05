import { findById } from "../repositories/employeeRepository.js";
import { isCardEnabled, isCardExpired, isCardValid, isCardVirtual, setCardData } from "./cardServices.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import * as business from "../repositories/businessRepository.js";
import * as recharges from "../repositories/rechargeRepository.js";

export async function createUserCard(workerData, companyAuth) {
  await isCompanyValid(companyAuth);
  const entry = await findNameFromDatabase(Number(workerData.workerId));
  if(entry === undefined) throw { type: 'not_found_error' };
  const { CVV, cardId } = await setCardData(entry, workerData)
  return { workerId: workerData.workerId, CVV, cardId };
}

export async function loadCardBalance(loadData, companyAuth) {
  const companyData = await isCompanyValid(companyAuth);
  const card = await isCardValid(loadData);
  isCardVirtual(card);
  isCardExpired(card);
  isCardEnabled(card);
  const insertData: recharges.RechargeInsertData = {
    ...loadData,
    businessId: companyData.id,
  }
  await recharges.insert(insertData);
  return;
}

async function findNameFromDatabase(wId: number) {
  const response = await findById(wId);
  return response;
}

export async function isCompanyValid(companyAuth) {
  const response = await findByApiKey(companyAuth['x-api-key']);
  if(response === undefined) throw { type: 'not_found_error' };
  return response;
}

export async function isCompanyRegistered(companyData) {
  const response = await business.findById(companyData.businessId);
  if(response === undefined) throw { type: 'not_found_error' };
  return response;
}
