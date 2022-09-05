var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import Cryptr from "cryptr";
import { editExpirationDate, editNameToCard, editTodayDate, } from "./dataFormatServices.js";
import { findByCardDetails, findById, insert, } from "../repositories/cardRepository.js";
import { faker } from "@faker-js/faker";
var cryptr = new Cryptr(process.env.SECRET_KEY);
export function isCardExpired(cardData) {
    var _a = splitDateValues(cardData.expirationDate), cardMonth = _a.month, cardYear = _a.year;
    var _b = splitDateValues(editTodayDate()), dateMonth = _b.month, dateYear = _b.year;
    if (cardYear <= dateYear)
        if (cardMonth < dateMonth)
            throw { type: "card_expired_or_disabled_error" };
    return;
}
function splitDateValues(date) {
    var result = date.split("/");
    return { month: result[0], year: result[1] };
}
// verificar a usabilidade dessa função
export function checkCardOwnership(workerId, cardData) {
    if (workerId !== cardData.workerId)
        throw { type: "ownership_not_match_error" };
    return;
}
export function checkCVVValidityAndEncryptPassword(requestData, card) {
    if (requestData.CVV !== cryptr.decrypt(card.securityCode))
        throw { type: "ownership_not_match_error" };
    return cryptr.encrypt(requestData.password);
}
export function isCardValid(cardData) {
    return __awaiter(this, void 0, void 0, function () {
        var card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findById(cardData.cardId)];
                case 1:
                    card = _a.sent();
                    if (card === undefined)
                        throw { type: "not_found_error" };
                    return [2 /*return*/, card];
            }
        });
    });
}
export function isPasswordCorrect(userPassword, cardPassword) {
    isCardActive(userPassword);
    if (userPassword !== cryptr.decrypt(cardPassword))
        throw { type: "ownership_not_match_error" };
    return;
}
export function isCardActive(userPassword) {
    if (userPassword === undefined)
        throw { type: "card_expired_or_disabled_error" };
    return;
}
export function isCardEnabled(cardData) {
    if (cardData.userPassword === undefined)
        throw { type: "card_expired_or_disabled_error" };
    return;
}
export function isOnlineCardValid(cardData) {
    return __awaiter(this, void 0, void 0, function () {
        var card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findByCardDetails(cardData.number, cardData.cardholderName)];
                case 1:
                    card = _a.sent();
                    if (card === undefined)
                        throw { type: "not_found_error" };
                    return [2 /*return*/];
            }
        });
    });
}
export function isCardVirtual(cardData) {
    if (cardData.isVirtual)
        throw { type: 'action_not_necessary_error' };
    return;
}
export function isCardBlocked(cardData) {
    if (cardData.isBlocked)
        throw { type: "card_expired_or_disabled_error" };
    return;
}
export function isTypeValid(cardData, companyData) {
    if (cardData.type !== companyData.type)
        throw { type: "type_mismatch_error" };
    return;
}
export function setOnlineCardData(cardData) {
    return __awaiter(this, void 0, void 0, function () {
        var CVV, originalId, requestData, cardId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    CVV = faker.finance.creditCardCVV();
                    originalId = cardData.id;
                    delete cardData.id;
                    requestData = __assign(__assign({}, cardData), { number: faker.finance.creditCardNumber("mastercard"), expirationDate: editExpirationDate(), isVirtual: true, securityCode: cryptr.encrypt(CVV), originalCardId: originalId });
                    return [4 /*yield*/, dbInsertCallback(requestData)];
                case 1:
                    cardId = _a.sent();
                    return [2 /*return*/, { CVV: CVV, cardId: cardId }];
            }
        });
    });
}
export function setCardData(entry, workerData) {
    return __awaiter(this, void 0, void 0, function () {
        var cardName, CVV, cardData, cardId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cardName = editNameToCard(entry.fullName);
                    CVV = faker.finance.creditCardCVV();
                    cardData = {
                        employeeId: workerData.workerId,
                        number: faker.finance.creditCardNumber("####-####-####-####"),
                        cardholderName: cardName,
                        securityCode: cryptr.encrypt(CVV),
                        expirationDate: editExpirationDate(),
                        isVirtual: false,
                        originalCardId: null,
                        isBlocked: false,
                        type: workerData.type
                    };
                    return [4 /*yield*/, dbInsertCallback(cardData)];
                case 1:
                    cardId = _a.sent();
                    return [2 /*return*/, { CVV: CVV, cardId: cardId }];
            }
        });
    });
}
function dbInsertCallback(data) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, rowCount, rows;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, insert(data)];
                case 1:
                    _a = _b.sent(), rowCount = _a.rowCount, rows = _a.rows;
                    if (rowCount === 0)
                        throw { type: "already_exists_error" };
                    return [2 /*return*/, rows[0].id];
            }
        });
    });
}
