"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findByApiKey = void 0;
const database_js_1 = require("../databases/database.js");
async function findByApiKey(apiKey) {
    const result = await database_js_1.connection.query(`SELECT * FROM companies WHERE "apiKey"=$1`, [apiKey]);
    return result.rows[0];
}
exports.findByApiKey = findByApiKey;
