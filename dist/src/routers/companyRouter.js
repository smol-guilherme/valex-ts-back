"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyControllers_js_1 = require("../controllers/companyControllers.js");
const stringStripMiddleware_js_1 = __importDefault(require("../middlewares/stringStripMiddleware.js"));
const validateMiddleware_js_1 = __importDefault(require("../middlewares/validateMiddleware.js"));
const companyRouter = (0, express_1.Router)();
companyRouter.get('/company/:id', (req, res) => res.status(200).send(`ok company ID: ${req.params.id}`));
companyRouter.post('/company/load', stringStripMiddleware_js_1.default, validateMiddleware_js_1.default, companyControllers_js_1.loadCard);
companyRouter.post('/cards/new', stringStripMiddleware_js_1.default, validateMiddleware_js_1.default, companyControllers_js_1.newCard);
exports.default = companyRouter;
