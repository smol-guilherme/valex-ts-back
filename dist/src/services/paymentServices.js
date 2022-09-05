"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertNewOnlineExpense = exports.insertNewExpense = void 0;
const payments = __importStar(require("../repositories/paymentRepository.js"));
const cardServices_js_1 = require("./cardServices.js");
const companyServices_js_1 = require("./companyServices.js");
async function insertNewExpense(transactionData) {
    const { card, company } = await transactionDataFetch(transactionData);
    (0, cardServices_js_1.isCardVirtual)(card);
    cardValidationRoutine(card, company, transactionData);
    await executeTransaction(transactionData, card.id);
    return;
}
exports.insertNewExpense = insertNewExpense;
async function insertNewOnlineExpense(transactionData) {
    const { card, company } = await transactionDataFetch(transactionData);
    if (Object.keys(transactionData).includes('cardholderName'))
        await (0, cardServices_js_1.isOnlineCardValid)(transactionData);
    cardValidationRoutine(card, company, transactionData);
    await executeTransaction(transactionData, card.originalCardId);
    return;
}
exports.insertNewOnlineExpense = insertNewOnlineExpense;
function cardValidationRoutine(card, company, transactionData) {
    (0, cardServices_js_1.isTypeValid)(card, company);
    (0, cardServices_js_1.isCardBlocked)(card);
    (0, cardServices_js_1.isCardExpired)(card);
    (0, cardServices_js_1.isPasswordCorrect)(transactionData.password, card.password);
    return;
}
async function transactionDataFetch(transactionData) {
    const company = await (0, companyServices_js_1.isCompanyRegistered)(transactionData);
    const card = await (0, cardServices_js_1.isCardValid)(transactionData);
    return { card, company };
}
async function executeTransaction(transactionData, cardId) {
    delete transactionData.password;
    const paymentData = {
        ...transactionData,
        cardId
    };
    const isSet = await payments.insert(paymentData);
    if (isSet === 0)
        throw { type: 'insuficient_funds_error' };
    return;
}
