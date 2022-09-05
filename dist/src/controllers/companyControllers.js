"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCard = exports.newCard = void 0;
const companyServices_js_1 = require("../services/companyServices.js");
async function newCard(req, res) {
    const response = await (0, companyServices_js_1.createUserCard)(req.body, req.headers);
    res.status(201).send(response);
    return;
}
exports.newCard = newCard;
async function loadCard(req, res) {
    await (0, companyServices_js_1.loadCardBalance)(req.body, req.headers);
    res.status(200).send();
    return;
}
exports.loadCard = loadCard;
