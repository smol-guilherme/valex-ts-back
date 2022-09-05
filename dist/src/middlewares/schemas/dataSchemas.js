"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onlinePayments = exports.payments = exports.cardBlock = exports.cardLoad = exports.workerCard = exports.cardHistory = exports.companyId = exports.cardType = void 0;
const joi_1 = __importDefault(require("joi"));
exports.cardType = joi_1.default.object({
    workerId: joi_1.default.number().required(),
    type: joi_1.default.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required()
});
exports.companyId = joi_1.default.object({
    id: joi_1.default.number().required()
});
exports.cardHistory = joi_1.default.object({
    cardId: joi_1.default.number().required()
});
exports.workerCard = joi_1.default.object({
    cardId: joi_1.default.number().required(),
    CVV: joi_1.default.string().pattern(/[0-9]{3}/).required(),
    password: joi_1.default.string().pattern(/[0-9]{4}/).required(),
    repeatPassword: joi_1.default.ref('password')
});
exports.cardLoad = joi_1.default.object({
    cardId: joi_1.default.number().required(),
    amount: joi_1.default.number().min(1),
});
exports.cardBlock = joi_1.default.object({
    cardId: joi_1.default.number().required(),
    password: joi_1.default.string().pattern(/[0-9]{4}/).required(),
});
exports.payments = joi_1.default.object({
    cardId: joi_1.default.number().required(),
    password: joi_1.default.string().pattern(/[0-9]{4}/).required(),
    businessId: joi_1.default.number().required(),
    amount: joi_1.default.number().min(1)
});
exports.onlinePayments = joi_1.default.object({
    cardId: joi_1.default.number().required(),
    cardholderName: joi_1.default.string().pattern(/[A-Z]{1,}\W[A-Z]+\W[A-Z]{1,}/).required(),
    number: joi_1.default.string().pattern(/[0-9]{4}-{1}[0-9]{4}-{1}[0-9]{4}-{1}[0-9]{4}/).required(),
    CVV: joi_1.default.string().pattern(/[0-9]{3}/).required(),
    password: joi_1.default.string().pattern(/[0-9]{4}/).required(),
    businessId: joi_1.default.number().required(),
    amount: joi_1.default.number().min(1)
});
