"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findById = void 0;
const database_js_1 = require("../databases/database.js");
async function findById(id) {
    const result = await database_js_1.connection.query("SELECT * FROM businesses WHERE id=$1", [id]);
    return result.rows[0];
}
exports.findById = findById;
