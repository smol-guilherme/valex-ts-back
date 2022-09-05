"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const workerControllers_js_1 = require("../controllers/workerControllers.js");
const stringStripMiddleware_js_1 = __importDefault(require("../middlewares/stringStripMiddleware.js"));
const validateMiddleware_js_1 = __importDefault(require("../middlewares/validateMiddleware.js"));
const workerRouter = (0, express_1.Router)();
workerRouter.get('/workers/:id', (req, res) => res.status(200).send(`ok worker ID: ${req.params.id}`));
workerRouter.post('/workers/:id/enable', stringStripMiddleware_js_1.default, validateMiddleware_js_1.default, workerControllers_js_1.activateCard);
workerRouter.post('/workers/:id/security', stringStripMiddleware_js_1.default, validateMiddleware_js_1.default, workerControllers_js_1.blockCard);
workerRouter.post('/workers/:id/virtual', stringStripMiddleware_js_1.default, validateMiddleware_js_1.default, workerControllers_js_1.newVirtualCard);
workerRouter.delete('/workers/:id/virtual', stringStripMiddleware_js_1.default, validateMiddleware_js_1.default, workerControllers_js_1.deleteVirtualCard);
workerRouter.get('/workers/:id/history', stringStripMiddleware_js_1.default, validateMiddleware_js_1.default, workerControllers_js_1.getCardHistory);
exports.default = workerRouter;
