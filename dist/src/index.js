"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const companyRouter_js_1 = __importDefault(require("./routers/companyRouter.js"));
const workerRouter_js_1 = __importDefault(require("./routers/workerRouter.js"));
const paymentRouter_js_1 = __importDefault(require("./routers/paymentRouter.js"));
const errorHandler_js_1 = require("./middlewares/errorHandler.js");
const app = (0, express_1.default)();
app.use((0, express_1.json)());
app.use((0, cors_1.default)());
app.use(companyRouter_js_1.default);
app.use(workerRouter_js_1.default);
app.use(paymentRouter_js_1.default);
app.use(errorHandler_js_1.handleError);
app.listen(process.env.PORT, () => console.log(`Server up and running on PORT ${process.env.PORT}@${Date()}`));
