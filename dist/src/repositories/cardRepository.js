"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCardHistory = exports.remove = exports.toggleBlock = exports.update = exports.insert = exports.findByCardDetails = exports.findByTypeAndEmployeeId = exports.findById = exports.find = void 0;
const database_js_1 = require("../databases/database.js");
const sqlUtils_js_1 = require("../../valex/utils/sqlUtils.js");
async function find() {
    const result = await database_js_1.connection.query("SELECT * FROM cards");
    return result.rows;
}
exports.find = find;
async function findById(id) {
    const result = await database_js_1.connection.query("SELECT * FROM cards WHERE id=$1", [id]);
    return result.rows[0];
}
exports.findById = findById;
async function findByTypeAndEmployeeId(type, employeeId) {
    const result = await database_js_1.connection.query(`SELECT * FROM cards WHERE type=$1 AND "employeeId"=$2`, [type, employeeId]);
    return result.rows[0];
}
exports.findByTypeAndEmployeeId = findByTypeAndEmployeeId;
async function findByCardDetails(number, cardholderName) {
    const result = await database_js_1.connection.query(` SELECT 
        * 
      FROM cards 
      WHERE number=$1 AND "cardholderName"=$2`, [number, cardholderName]);
    return result.rows[0];
}
exports.findByCardDetails = findByCardDetails;
async function insert(cardData) {
    const { employeeId, number, cardholderName, securityCode, expirationDate, password, isVirtual, originalCardId, isBlocked, type, } = cardData;
    return await database_js_1.connection.query(`
    INSERT INTO 
    cards (
      "employeeId", number, "cardholderName",
       "securityCode", "expirationDate", password, 
       "isVirtual", "originalCardId", "isBlocked", type
      )
    SELECT 
      $1, $2, $3, 
      $4, $5, $6, 
      $7, $8, $9, $10 
    WHERE 
      NOT EXISTS (
        SELECT id 
        FROM cards 
        WHERE type=$10 
        AND "employeeId"=$1 
      ) OR
      $7=true
    RETURNING id
  ;`, [
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
    ]);
}
exports.insert = insert;
async function update(id, cardData) {
    const { objectColumns: cardColumns, objectValues: cardValues } = (0, sqlUtils_js_1.mapObjectToUpdateQuery)({
        object: cardData,
        offset: 2,
    });
    return await database_js_1.connection.query(`
    UPDATE cards
      SET ${cardColumns}
    WHERE $1=id AND password IS NULL;
  `, [id, ...cardValues]);
}
exports.update = update;
async function toggleBlock(id, cardData) {
    const { objectColumns: cardColumns, objectValues: cardValues } = (0, sqlUtils_js_1.mapObjectToUpdateQuery)({
        object: cardData,
        offset: 2,
    });
    return await database_js_1.connection.query(`
    UPDATE cards
      SET ${cardColumns}
    WHERE $1=id;
  `, [id, ...cardValues]);
}
exports.toggleBlock = toggleBlock;
async function remove(id) {
    database_js_1.connection.query("DELETE FROM cards WHERE id=$1", [id]);
}
exports.remove = remove;
async function findCardHistory(cardId) {
    const queryParams = [cardId];
    const queryString = `
  SELECT 
    COALESCE(SUM(amount) , 0) balance, 
    ARRAY(
      SELECT json_build_object
      (
        'id', payments.id,
        'businessId', "businessId",
        'timestamp', timestamp,
        'amount', amount,
        'businessName', b.name
      )
      FROM payments
      JOIN businesses b
      ON b.id="businessId"
      WHERE payments."cardId"=$1
      GROUP BY payments.id, b.id
    ) transactions,
    ARRAY(
      SELECT 
      json_build_object
      (
        'id', id,
        'timestamp', timestamp,
        'amount', amount
      )
      FROM recharges
      WHERE recharges."cardId"=$1
    ) recharges
  FROM 
  (
    SELECT r."cardId", 
    SUM(amount) amount 
    FROM recharges r 
    WHERE r."cardId"=$1 
    GROUP BY r."cardId" 
    UNION ALL 
    SELECT p."cardId", 
    -SUM(amount) amount 
    FROM payments p 
    WHERE p."cardId"=$1 
    GROUP BY 
    p."cardId"
    ) AS result 
    GROUP BY "cardId"
  ;`;
    const { rows } = await database_js_1.connection.query(queryString, queryParams);
    return rows;
}
exports.findCardHistory = findCardHistory;
