"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newOnlineCardExpense = exports.newCardExpense = void 0;
const paymentServices_js_1 = require("../services/paymentServices.js");
async function newCardExpense(req, res) {
    const response = await (0, paymentServices_js_1.insertNewExpense)(req.body);
    res.status(201).send(response);
    return;
}
exports.newCardExpense = newCardExpense;
async function newOnlineCardExpense(req, res) {
    const response = await (0, paymentServices_js_1.insertNewOnlineExpense)(req.body);
    res.status(201).send(response);
    return;
}
exports.newOnlineCardExpense = newOnlineCardExpense;
