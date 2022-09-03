import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import { findById } from "../repositories/employeeRepository.js";
import { insert, CardInsertData } from "../repositories/cardRepository.js";
import { editExpirationDate, editNameToCard } from "./dataFormatServices.js";
import { isCardExpired, isCardValid } from "./cardServices.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import * as business from "../repositories/businessRepository.js";
import * as recharges from "../repositories/rechargeRepository.js";

const cryptr = new Cryptr(process.env.SECRET_KEY);

export async function createUserCard(workerData, companyAuth) {
  await isCompanyValid(companyAuth);
  const entry = await findNameFromDatabase(Number(workerData.workerId));
  if(entry === undefined) throw { type: 'not_found_error' };
  const cardName: string = editNameToCard(entry.fullName);
  const CVV = faker.finance.creditCardCVV()
  const cardData: CardInsertData = {
  	employeeId: workerData.workerId,
    number: faker.finance.creditCardNumber(`####-####-####-####`),
    cardholderName: cardName,
  	securityCode: cryptr.encrypt(CVV),
  	expirationDate: editExpirationDate(),
  	isVirtual: false,
  	originalCardId: null,
  	isBlocked: false,
  	type: workerData.type
  };
  const dbCallback = await insert(cardData);
  if(dbCallback?.rowCount === 0) throw { type: 'already_exists_error' };
  return { workerId: workerData.workerId, CVV };
}

export async function loadCardBalance(loadData, companyAuth) {
  const companyData = await isCompanyValid(companyAuth);
  const card = await isCardValid(loadData);
  isCardExpired(card);
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
