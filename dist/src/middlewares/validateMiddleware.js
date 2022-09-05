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
const schemas = __importStar(require("./schemas/dataSchemas.js"));
async function validateData(req, res, next) {
    const validationData = [req.params, req.body];
    for (const index in validationData) {
        if (Object.keys(validationData[index]).length === 0)
            continue;
        const schema = schemas[setSchema(validationData[index])];
        await schema.validateAsync(validationData[index], {
            abortEarly: false,
        });
    }
    next();
}
exports.default = validateData;
function setSchema(objectData) {
    const keys = Object.keys(objectData);
    for (let i = 0; i < keys.length; i++) {
        switch (keys[i]) {
            case "number":
                return "onlinePayments";
            case "cardId":
                if (keys.length !== 1)
                    break;
                return "cardHistory";
            case "type":
                return "cardType";
            case "id":
                return "companyId";
            case "CVV":
                return "workerCard";
            case "password":
                if (keys.includes("businessId"))
                    return "payments";
                if (keys.includes("amount"))
                    return "cardLoad";
                return "cardBlock";
            case "amount":
                return "cardLoad";
            default:
                break;
        }
    }
    throw { type: "no_schema_error" };
}
