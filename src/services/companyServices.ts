import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import { findById } from "../repositories/employeeRepository.js";
import { insert, CardInsertData } from "../repositories/cardRepository.js";

const cryptr = new Cryptr(process.env.SECRET_KEY);

export async function createUserCard(workerData, companyData) {
  const now: Date = new Date();
  const entry = await findNameFromDatabase(Number(workerData.workerId));
  // if(entry === undefined) throw { type: 'not_found_error' };
  const cardName: string = editNameToCard(entry.fullName);
  const cardData: CardInsertData = {
  	employeeId: workerData.workerId,
    number: faker.finance.creditCardNumber(`####-####-####-####`),
    cardholderName: cardName,
  	securityCode: cryptr.encrypt(faker.finance.creditCardCVV()),
  	expirationDate: editDate(now),
  	isVirtual: false,
  	originalCardId: null,
  	isBlocked: false,
  	type: workerData.type
  };
  const dbCallback = await insert(cardData);
  // if(dbCallback?.rows.length === 0) throw { type: 'already_exists_error' };
  return dbCallback;
}

function editDate(date: Date): string {
  const month: string = String(date.getUTCMonth())
  const year: string = String(date.getUTCFullYear() + 5).substring(2);
  if(month.length === 1) return `0${month}/${year}`;
  return `${month}/${year}`;
}

async function findNameFromDatabase(wId: number) {
  const response = await findById(wId);
  return response;
}

function editNameToCard(fullName: string): string {
  const cardString = fullName
    .replaceAll(/\b(da?o?s?)\W/g, "")
    .trim()
    .toUpperCase()
    .split(" ");
  if (cardString.length >= 3)
    cardString.splice(1, cardString.length - 2, cardString[1].substring(0, 1));
  return cardString.join(" ");
}
