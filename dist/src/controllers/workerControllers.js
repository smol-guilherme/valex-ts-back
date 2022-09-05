"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVirtualCard = exports.newVirtualCard = exports.getCardHistory = exports.blockCard = exports.activateCard = void 0;
const workerServices_js_1 = require("../services/workerServices.js");
async function activateCard(req, res) {
    await (0, workerServices_js_1.matchWorkerToCard)(req.body, req.params);
    res.status(200).send();
    return;
}
exports.activateCard = activateCard;
async function blockCard(req, res) {
    await (0, workerServices_js_1.toggleBlockCard)(req.params, req.body);
    res.status(200).send();
    return;
}
exports.blockCard = blockCard;
async function getCardHistory(req, res) {
    const response = await (0, workerServices_js_1.checkForExpenses)(req.body);
    res.status(200).send(response);
    return;
}
exports.getCardHistory = getCardHistory;
async function newVirtualCard(req, res) {
    const response = await (0, workerServices_js_1.setupVirtualCard)(req.body, req.params);
    res.status(201).send(response);
    return;
}
exports.newVirtualCard = newVirtualCard;
async function deleteVirtualCard(req, res) {
    await (0, workerServices_js_1.virtualCardDeletion)(req.body, req.params);
    res.status(200).send();
    return;
}
exports.deleteVirtualCard = deleteVirtualCard;
