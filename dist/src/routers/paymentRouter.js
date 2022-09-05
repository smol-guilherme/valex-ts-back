"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentControllers_js_1 = require("../controllers/paymentControllers.js");
const stringStripMiddleware_js_1 = __importDefault(require("../middlewares/stringStripMiddleware.js"));
const validateMiddleware_js_1 = __importDefault(require("../middlewares/validateMiddleware.js"));
const paymentRouter = (0, express_1.Router)();
paymentRouter.get('/payments', (req, res) => res.status(200).send(`ok payments`));
paymentRouter.post('/payments/new', stringStripMiddleware_js_1.default, validateMiddleware_js_1.default, paymentControllers_js_1.newCardExpense);
paymentRouter.post('/payments/online/new', stringStripMiddleware_js_1.default, validateMiddleware_js_1.default, paymentControllers_js_1.newOnlineCardExpense);
exports.default = paymentRouter;
