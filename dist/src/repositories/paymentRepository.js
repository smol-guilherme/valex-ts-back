"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insert = exports.findByCardId = void 0;
const database_js_1 = require("../databases/database.js");
async function findByCardId(cardId) {
    const result = await database_js_1.connection.query(`SELECT 
      payments.*,
      businesses.name as "businessName"
     FROM payments 
      JOIN businesses ON businesses.id=payments."businessId"
     WHERE "cardId"=$1
    `, [cardId]);
    return result.rows;
}
exports.findByCardId = findByCardId;
async function insert(paymentData) {
    const { cardId, businessId, amount } = paymentData;
    const { rowCount } = await database_js_1.connection.query(`INSERT INTO 
    payments ("cardId", "businessId", amount) 
    SELECT $1, $2, $3 
    WHERE 
    (
      SELECT 
      COALESCE(SUM(amount) , 0) balance 
      FROM 
      (
        SELECT r."cardId", 
        SUM(amount) amount 
        FROM recharges r 
        WHERE r."cardId"=$1 
        GROUP BY r."cardId" 
        UNION ALL 
        SELECT p."cardId", 
        -SUM(amount) - $3::INTEGER amount 
        FROM payments p 
        WHERE p."cardId"=$1 
        GROUP BY 
        p."cardId"
        ) AS result 
        GROUP BY "cardId"
    ) >= 0
    ;`, [cardId, businessId, amount]);
    return rowCount;
}
exports.insert = insert;
