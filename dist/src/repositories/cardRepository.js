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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { connection } from "../databases/database.js";
import { mapObjectToUpdateQuery } from "../../valex/utils/sqlUtils.js";
export function find() {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.query("SELECT * FROM cards")];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows];
            }
        });
    });
}
export function findById(id) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.query("SELECT * FROM cards WHERE id=$1", [id])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows[0]];
            }
        });
    });
}
export function findByTypeAndEmployeeId(type, employeeId) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.query("SELECT * FROM cards WHERE type=$1 AND \"employeeId\"=$2", [type, employeeId])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows[0]];
            }
        });
    });
}
export function findByCardDetails(number, cardholderName) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.query(" SELECT \n        * \n      FROM cards \n      WHERE number=$1 AND \"cardholderName\"=$2", [number, cardholderName])];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.rows[0]];
            }
        });
    });
}
export function insert(cardData) {
    return __awaiter(this, void 0, void 0, function () {
        var employeeId, number, cardholderName, securityCode, expirationDate, password, isVirtual, originalCardId, isBlocked, type;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    employeeId = cardData.employeeId, number = cardData.number, cardholderName = cardData.cardholderName, securityCode = cardData.securityCode, expirationDate = cardData.expirationDate, password = cardData.password, isVirtual = cardData.isVirtual, originalCardId = cardData.originalCardId, isBlocked = cardData.isBlocked, type = cardData.type;
                    return [4 /*yield*/, connection.query("\n    INSERT INTO \n    cards (\n      \"employeeId\", number, \"cardholderName\",\n       \"securityCode\", \"expirationDate\", password, \n       \"isVirtual\", \"originalCardId\", \"isBlocked\", type\n      )\n    SELECT \n      $1, $2, $3, \n      $4, $5, $6, \n      $7, $8, $9, $10 \n    WHERE \n      NOT EXISTS (\n        SELECT id \n        FROM cards \n        WHERE type=$10 \n        AND \"employeeId\"=$1 \n      ) OR\n      $7=true\n    RETURNING id\n  ;", [
                            employeeId,
                            number,
                            cardholderName,
                            securityCode,
                            expirationDate,
                            password,
                            isVirtual,
                            originalCardId,
                            isBlocked,
                            type,
                        ])];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
export function update(id, cardData) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, cardColumns, cardValues;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = mapObjectToUpdateQuery({
                        object: cardData,
                        offset: 2
                    }), cardColumns = _a.objectColumns, cardValues = _a.objectValues;
                    return [4 /*yield*/, connection.query("\n    UPDATE cards\n      SET ".concat(cardColumns, "\n    WHERE $1=id AND password IS NULL;\n  "), __spreadArray([id], cardValues, true))];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
export function toggleBlock(id, cardData) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, cardColumns, cardValues;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = mapObjectToUpdateQuery({
                        object: cardData,
                        offset: 2
                    }), cardColumns = _a.objectColumns, cardValues = _a.objectValues;
                    return [4 /*yield*/, connection.query("\n    UPDATE cards\n      SET ".concat(cardColumns, "\n    WHERE $1=id;\n  "), __spreadArray([id], cardValues, true))];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
}
export function remove(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            connection.query("DELETE FROM cards WHERE id=$1", [id]);
            return [2 /*return*/];
        });
    });
}
export function findCardHistory(cardId) {
    return __awaiter(this, void 0, void 0, function () {
        var queryParams, queryString, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    queryParams = [cardId];
                    queryString = "\n  SELECT \n    COALESCE(SUM(amount) , 0) balance, \n    ARRAY(\n      SELECT json_build_object\n      (\n        'id', payments.id,\n        'businessId', \"businessId\",\n        'timestamp', timestamp,\n        'amount', amount,\n        'businessName', b.name\n      )\n      FROM payments\n      JOIN businesses b\n      ON b.id=\"businessId\"\n      WHERE payments.\"cardId\"=$1\n      GROUP BY payments.id, b.id\n    ) transactions,\n    ARRAY(\n      SELECT \n      json_build_object\n      (\n        'id', id,\n        'timestamp', timestamp,\n        'amount', amount\n      )\n      FROM recharges\n      WHERE recharges.\"cardId\"=$1\n    ) recharges\n  FROM \n  (\n    SELECT r.\"cardId\", \n    SUM(amount) amount \n    FROM recharges r \n    WHERE r.\"cardId\"=$1 \n    GROUP BY r.\"cardId\" \n    UNION ALL \n    SELECT p.\"cardId\", \n    -SUM(amount) amount \n    FROM payments p \n    WHERE p.\"cardId\"=$1 \n    GROUP BY \n    p.\"cardId\"\n    ) AS result \n    GROUP BY \"cardId\"\n  ;";
                    return [4 /*yield*/, connection.query(queryString, queryParams)];
                case 1:
                    rows = (_a.sent()).rows;
                    return [2 /*return*/, rows];
            }
        });
    });
}
