import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import { findById } from "../repositories/employeeRepository.js";
import { insert, CardInsertData } from "../repositories/cardRepository.js";
import { editDate, editNameToCard } from "./dataFormatServices.js";

const cryptr = new Cryptr(process.env.SECRET_KEY);

export async function createUserCard(workerData, companyData) {
  const entry = await findNameFromDatabase(Number(workerData.workerId));
  if(entry === undefined) throw { type: 'not_found_error' };
  const cardName: string = editNameToCard(entry.fullName);
  const CVV = faker.finance.creditCardCVV()
  const cardData: CardInsertData = {
  	employeeId: workerData.workerId,
    number: faker.finance.creditCardNumber(`####-####-####-####`),
    cardholderName: cardName,
  	securityCode: cryptr.encrypt(CVV),
  	expirationDate: editDate(),
  	isVirtual: false,
  	originalCardId: null,
  	isBlocked: false,
  	type: workerData.type
  };
  const dbCallback = await insert(cardData);
  if(dbCallback?.rowCount === 0) throw { type: 'already_exists_error' };
  return { workerId: workerData.workerId, CVV };
}

async function findNameFromDatabase(wId: number) {
  const response = await findById(wId);
  return response;
}
