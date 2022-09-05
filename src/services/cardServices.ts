import Cryptr from "cryptr";
import {
  editExpirationDate,
  editNameToCard,
  editTodayDate,
} from "./dataFormatServices.js";
import {
  CardInsertData,
  findByCardDetails,
  findById,
  insert,
} from "../repositories/cardRepository.js";
import { faker } from "@faker-js/faker";

const cryptr = new Cryptr(process.env.SECRET_KEY);

export function isCardExpired(cardData) {
  const { month: cardMonth, year: cardYear } = splitDateValues(
    cardData.expirationDate
  );
  const { month: dateMonth, year: dateYear } = splitDateValues(editTodayDate());
  if (cardYear <= dateYear)
    if (cardMonth < dateMonth) throw { type: "card_expired_or_disabled_error" };
  return;
}

function splitDateValues(date: string) {
  const result: string[] = date.split("/");
  return { month: result[0], year: result[1] };
}

// verificar a usabilidade dessa função
export function checkCardOwnership(workerId, cardData) {
  if (workerId !== cardData.workerId) throw { type: "ownership_not_match_error" };
  return;
}

export function checkCVVValidityAndEncryptPassword(requestData, card) {
  if (requestData.CVV !== cryptr.decrypt(card.securityCode))
    throw { type: "ownership_not_match_error" };
  return cryptr.encrypt(requestData.password);
}

export async function isCardValid(cardData) {
  const card = await findById(cardData.cardId);
  if (card === undefined) throw { type: "not_found_error" };
  return card;
}

export function isPasswordCorrect(userPassword: string, cardPassword: string) {
  isCardActive(userPassword);
  if (userPassword !== cryptr.decrypt(cardPassword))
    throw { type: "ownership_not_match_error" };
  return;
}

export function isCardActive(userPassword) {
  if (userPassword === undefined) throw { type: "card_expired_or_disabled_error" };
  return;
}

export function isCardEnabled(cardData) {
  if (cardData.userPassword === undefined) throw { type: "card_expired_or_disabled_error" };
  return;
}

export async function isOnlineCardValid(cardData) {
  const card = await findByCardDetails(
    cardData.number,
    cardData.cardholderName
  );
  if (card === undefined) throw { type: "not_found_error" };
  return;
}

export function isCardVirtual(cardData) {
  if(cardData.isVirtual) throw { type: 'action_not_necessary_error' };
  return;
}

export function isCardBlocked(cardData) {
  if (cardData.isBlocked) throw { type: "card_expired_or_disabled_error" };
  return;
}

export function isTypeValid(cardData, companyData) {
  if (cardData.type !== companyData.type) throw { type: "type_mismatch_error" };
  return;
}

export async function setOnlineCardData(cardData) {
  const CVV = faker.finance.creditCardCVV();
  const originalId = cardData.id;
  delete cardData.id;
  const requestData: CardInsertData = {
    ...cardData,
    number: faker.finance.creditCardNumber("mastercard"),
    expirationDate: editExpirationDate(),
    isVirtual: true,
    securityCode: cryptr.encrypt(CVV),
    originalCardId: originalId,
  };
  const cardId = await dbInsertCallback(requestData);
  return { CVV, cardId };
}

export async function setCardData(entry, workerData) {
  const cardName: string = editNameToCard(entry.fullName);
  const CVV = faker.finance.creditCardCVV();
  const cardData: CardInsertData = {
    employeeId: workerData.workerId,
    number: faker.finance.creditCardNumber(`####-####-####-####`),
    cardholderName: cardName,
    securityCode: cryptr.encrypt(CVV),
    expirationDate: editExpirationDate(),
    isVirtual: false,
    originalCardId: null,
    isBlocked: false,
    type: workerData.type,
  };
  const cardId = await dbInsertCallback(cardData);
  return { CVV, cardId };
}

async function dbInsertCallback(data) {
  const { rowCount, rows } = await insert(data);
  if (rowCount === 0) throw { type: "already_exists_error" };
  return rows[0].id;
}
