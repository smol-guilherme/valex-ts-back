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
import { findCardHistory, remove, toggleBlock, update } from "../repositories/cardRepository.js";
import { findById } from "../repositories/employeeRepository.js";
import { isCardExpired, isCardValid, checkCVVValidityAndEncryptPassword, isPasswordCorrect, setOnlineCardData, isCardVirtual } from "./cardServices.js";
export function matchWorkerToCard(cardData, workerData) {
    return __awaiter(this, void 0, void 0, function () {
        var card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, workerValidationRoutine(cardData, workerData)];
                case 1:
                    card = _a.sent();
                    return [4 /*yield*/, activateCardRoutine(card, cardData)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function workerValidationRoutine(cardData, workerData) {
    return __awaiter(this, void 0, void 0, function () {
        var worker, card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findWorker(workerData)];
                case 1:
                    worker = _a.sent();
                    return [4 /*yield*/, isCardValid(cardData)];
                case 2:
                    card = _a.sent();
                    if (worker.id !== card.employeeId)
                        throw { type: 'ownership_not_match_error' };
                    return [2 /*return*/, card];
            }
        });
    });
}
function findWorker(workerData) {
    return __awaiter(this, void 0, void 0, function () {
        var worker;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, findById(workerData.id)];
                case 1:
                    worker = _a.sent();
                    if (worker === undefined)
                        throw { type: 'not_found_error' };
                    return [2 /*return*/, worker];
            }
        });
    });
}
function activateCardRoutine(card, requestData) {
    return __awaiter(this, void 0, void 0, function () {
        var dataToUpdate, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isCardVirtual(card);
                    isCardExpired(card);
                    dataToUpdate = { password: checkCVVValidityAndEncryptPassword(requestData, card) };
                    return [4 /*yield*/, update(requestData.cardId, dataToUpdate)];
                case 1:
                    response = _a.sent();
                    if ((response === null || response === void 0 ? void 0 : response.rowCount) === 0)
                        throw { type: 'already_exists_error' };
                    return [2 /*return*/];
            }
        });
    });
}
export function toggleBlockCard(workerData, cardData) {
    return __awaiter(this, void 0, void 0, function () {
        var card, cardRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, workerValidationRoutine(cardData, workerData)];
                case 1:
                    card = _a.sent();
                    isPasswordCorrect(cardData.password, card.password);
                    cardRequest = {
                        isBlocked: !card.isBlocked
                    };
                    toggleBlock(cardData.cardId, cardRequest);
                    return [2 /*return*/];
            }
        });
    });
}
export function checkForExpenses(cardData) {
    return __awaiter(this, void 0, void 0, function () {
        var history;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, isCardValid(cardData)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, findCardHistory(cardData.cardId)];
                case 2:
                    history = _a.sent();
                    return [2 /*return*/, history];
            }
        });
    });
}
export function setupVirtualCard(cardData, workerData) {
    return __awaiter(this, void 0, void 0, function () {
        var card, _a, CVV, cardId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, workerValidationRoutine(cardData, workerData)];
                case 1:
                    card = _b.sent();
                    isPasswordCorrect(cardData.password, card.password);
                    return [4 /*yield*/, setOnlineCardData(card)];
                case 2:
                    _a = _b.sent(), CVV = _a.CVV, cardId = _a.cardId;
                    return [2 /*return*/, { CVV: CVV, cardId: cardId }];
            }
        });
    });
}
export function virtualCardDeletion(cardData, workerData) {
    return __awaiter(this, void 0, void 0, function () {
        var card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, workerValidationRoutine(cardData, workerData)];
                case 1:
                    card = _a.sent();
                    if (!card.isVirtual)
                        throw { type: 'type_mismatch_error' };
                    isPasswordCorrect(cardData.password, card.password);
                    return [4 /*yield*/, remove(card.id)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
