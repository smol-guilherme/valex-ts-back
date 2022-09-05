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
exports.isCompanyRegistered = exports.isCompanyValid = exports.loadCardBalance = exports.createUserCard = void 0;
const employeeRepository_js_1 = require("../repositories/employeeRepository.js");
const cardServices_js_1 = require("./cardServices.js");
const companyRepository_js_1 = require("../repositories/companyRepository.js");
const business = __importStar(require("../repositories/businessRepository.js"));
const recharges = __importStar(require("../repositories/rechargeRepository.js"));
async function createUserCard(workerData, companyAuth) {
    await isCompanyValid(companyAuth);
    const entry = await findNameFromDatabase(Number(workerData.workerId));
    if (entry === undefined)
        throw { type: 'not_found_error' };
    const { CVV, cardId } = await (0, cardServices_js_1.setCardData)(entry, workerData);
    return { workerId: workerData.workerId, CVV, cardId };
}
exports.createUserCard = createUserCard;
async function loadCardBalance(loadData, companyAuth) {
    const companyData = await isCompanyValid(companyAuth);
    const card = await (0, cardServices_js_1.isCardValid)(loadData);
    (0, cardServices_js_1.isCardVirtual)(card);
    (0, cardServices_js_1.isCardExpired)(card);
    (0, cardServices_js_1.isCardEnabled)(card);
    const insertData = {
        ...loadData,
        businessId: companyData.id,
    };
    await recharges.insert(insertData);
    return;
}
exports.loadCardBalance = loadCardBalance;
async function findNameFromDatabase(wId) {
    const response = await (0, employeeRepository_js_1.findById)(wId);
    return response;
}
async function isCompanyValid(companyAuth) {
    const response = await (0, companyRepository_js_1.findByApiKey)(companyAuth['x-api-key']);
    if (response === undefined)
        throw { type: 'not_found_error' };
    return response;
}
exports.isCompanyValid = isCompanyValid;
async function isCompanyRegistered(companyData) {
    const response = await business.findById(companyData.businessId);
    if (response === undefined)
        throw { type: 'not_found_error' };
    return response;
}
exports.isCompanyRegistered = isCompanyRegistered;
