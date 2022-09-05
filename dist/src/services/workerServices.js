"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.virtualCardDeletion = exports.setupVirtualCard = exports.checkForExpenses = exports.toggleBlockCard = exports.matchWorkerToCard = void 0;
const cardRepository_js_1 = require("../repositories/cardRepository.js");
const employeeRepository_js_1 = require("../repositories/employeeRepository.js");
const cardServices_js_1 = require("./cardServices.js");
async function matchWorkerToCard(cardData, workerData) {
    const card = await workerValidationRoutine(cardData, workerData);
    await activateCardRoutine(card, cardData);
    return;
}
exports.matchWorkerToCard = matchWorkerToCard;
async function workerValidationRoutine(cardData, workerData) {
    const worker = await findWorker(workerData);
    const card = await (0, cardServices_js_1.isCardValid)(cardData);
    if (worker.id !== card.employeeId)
        throw { type: 'ownership_not_match_error' };
    return card;
}
async function findWorker(workerData) {
    const worker = await (0, employeeRepository_js_1.findById)(workerData.id);
    if (worker === undefined)
        throw { type: 'not_found_error' };
    return worker;
}
async function activateCardRoutine(card, requestData) {
    (0, cardServices_js_1.isCardVirtual)(card);
    (0, cardServices_js_1.isCardExpired)(card);
    const dataToUpdate = { password: (0, cardServices_js_1.checkCVVValidityAndEncryptPassword)(requestData, card) };
    const response = await (0, cardRepository_js_1.update)(requestData.cardId, dataToUpdate);
    if (response?.rowCount === 0)
        throw { type: 'already_exists_error' };
    return;
}
async function toggleBlockCard(workerData, cardData) {
    const card = await workerValidationRoutine(cardData, workerData);
    (0, cardServices_js_1.isPasswordCorrect)(cardData.password, card.password);
    const cardRequest = {
        isBlocked: !card.isBlocked,
    };
    (0, cardRepository_js_1.toggleBlock)(cardData.cardId, cardRequest);
    return;
}
exports.toggleBlockCard = toggleBlockCard;
async function checkForExpenses(cardData) {
    await (0, cardServices_js_1.isCardValid)(cardData);
    const history = await (0, cardRepository_js_1.findCardHistory)(cardData.cardId);
    return history;
}
exports.checkForExpenses = checkForExpenses;
async function setupVirtualCard(cardData, workerData) {
    const card = await workerValidationRoutine(cardData, workerData);
    (0, cardServices_js_1.isPasswordCorrect)(cardData.password, card.password);
    const { CVV, cardId } = await (0, cardServices_js_1.setOnlineCardData)(card);
    return { CVV, cardId };
}
exports.setupVirtualCard = setupVirtualCard;
async function virtualCardDeletion(cardData, workerData) {
    const card = await workerValidationRoutine(cardData, workerData);
    if (!card.isVirtual)
        throw { type: 'type_mismatch_error' };
    (0, cardServices_js_1.isPasswordCorrect)(cardData.password, card.password);
    await (0, cardRepository_js_1.remove)(card.id);
    return;
}
exports.virtualCardDeletion = virtualCardDeletion;
