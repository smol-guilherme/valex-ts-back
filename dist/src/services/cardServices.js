"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCardData = exports.setOnlineCardData = exports.isTypeValid = exports.isCardBlocked = exports.isCardVirtual = exports.isOnlineCardValid = exports.isCardEnabled = exports.isCardActive = exports.isPasswordCorrect = exports.isCardValid = exports.checkCVVValidityAndEncryptPassword = exports.checkCardOwnership = exports.isCardExpired = void 0;
const cryptr_1 = __importDefault(require("cryptr"));
const dataFormatServices_js_1 = require("./dataFormatServices.js");
const cardRepository_js_1 = require("../repositories/cardRepository.js");
const faker_1 = require("@faker-js/faker");
const cryptr = new cryptr_1.default(process.env.SECRET_KEY);
function isCardExpired(cardData) {
    const { month: cardMonth, year: cardYear } = splitDateValues(cardData.expirationDate);
    const { month: dateMonth, year: dateYear } = splitDateValues((0, dataFormatServices_js_1.editTodayDate)());
    if (cardYear <= dateYear)
        if (cardMonth < dateMonth)
            throw { type: "card_expired_or_disabled_error" };
    return;
}
exports.isCardExpired = isCardExpired;
function splitDateValues(date) {
    const result = date.split("/");
    return { month: result[0], year: result[1] };
}
// verificar a usabilidade dessa função
function checkCardOwnership(workerId, cardData) {
    if (workerId !== cardData.workerId)
        throw { type: "ownership_not_match_error" };
    return;
}
exports.checkCardOwnership = checkCardOwnership;
function checkCVVValidityAndEncryptPassword(requestData, card) {
    if (requestData.CVV !== cryptr.decrypt(card.securityCode))
        throw { type: "ownership_not_match_error" };
    return cryptr.encrypt(requestData.password);
}
exports.checkCVVValidityAndEncryptPassword = checkCVVValidityAndEncryptPassword;
async function isCardValid(cardData) {
    const card = await (0, cardRepository_js_1.findById)(cardData.cardId);
    if (card === undefined)
        throw { type: "not_found_error" };
    return card;
}
exports.isCardValid = isCardValid;
function isPasswordCorrect(userPassword, cardPassword) {
    isCardActive(userPassword);
    if (userPassword !== cryptr.decrypt(cardPassword))
        throw { type: "ownership_not_match_error" };
    return;
}
exports.isPasswordCorrect = isPasswordCorrect;
function isCardActive(userPassword) {
    if (userPassword === undefined)
        throw { type: "card_expired_or_disabled_error" };
    return;
}
exports.isCardActive = isCardActive;
function isCardEnabled(cardData) {
    if (cardData.userPassword === undefined)
        throw { type: "card_expired_or_disabled_error" };
    return;
}
exports.isCardEnabled = isCardEnabled;
async function isOnlineCardValid(cardData) {
    const card = await (0, cardRepository_js_1.findByCardDetails)(cardData.number, cardData.cardholderName);
    if (card === undefined)
        throw { type: "not_found_error" };
    return;
}
exports.isOnlineCardValid = isOnlineCardValid;
function isCardVirtual(cardData) {
    if (cardData.isVirtual)
        throw { type: 'action_not_necessary_error' };
    return;
}
exports.isCardVirtual = isCardVirtual;
function isCardBlocked(cardData) {
    if (cardData.isBlocked)
        throw { type: "card_expired_or_disabled_error" };
    return;
}
exports.isCardBlocked = isCardBlocked;
function isTypeValid(cardData, companyData) {
    if (cardData.type !== companyData.type)
        throw { type: "type_mismatch_error" };
    return;
}
exports.isTypeValid = isTypeValid;
async function setOnlineCardData(cardData) {
    const CVV = faker_1.faker.finance.creditCardCVV();
    const originalId = cardData.id;
    delete cardData.id;
    const requestData = {
        ...cardData,
        number: faker_1.faker.finance.creditCardNumber("mastercard"),
        expirationDate: (0, dataFormatServices_js_1.editExpirationDate)(),
        isVirtual: true,
        securityCode: cryptr.encrypt(CVV),
        originalCardId: originalId,
    };
    const cardId = await dbInsertCallback(requestData);
    return { CVV, cardId };
}
exports.setOnlineCardData = setOnlineCardData;
async function setCardData(entry, workerData) {
    const cardName = (0, dataFormatServices_js_1.editNameToCard)(entry.fullName);
    const CVV = faker_1.faker.finance.creditCardCVV();
    const cardData = {
        employeeId: workerData.workerId,
        number: faker_1.faker.finance.creditCardNumber(`####-####-####-####`),
        cardholderName: cardName,
        securityCode: cryptr.encrypt(CVV),
        expirationDate: (0, dataFormatServices_js_1.editExpirationDate)(),
        isVirtual: false,
        originalCardId: null,
        isBlocked: false,
        type: workerData.type,
    };
    const cardId = await dbInsertCallback(cardData);
    return { CVV, cardId };
}
exports.setCardData = setCardData;
async function dbInsertCallback(data) {
    const { rowCount, rows } = await (0, cardRepository_js_1.insert)(data);
    if (rowCount === 0)
        throw { type: "already_exists_error" };
    return rows[0].id;
}
