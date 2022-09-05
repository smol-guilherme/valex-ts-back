import { Router } from "express";
import { newCardExpense, newOnlineCardExpense } from "../controllers/paymentControllers.js";
import clearData from "../middlewares/stringStripMiddleware.js";
import validateData from "../middlewares/validateMiddleware.js";
var paymentRouter = Router();
paymentRouter.get('/payments', function (req, res) { return res.status(200).send("ok payments"); });
paymentRouter.post('/payments/new', clearData, validateData, newCardExpense);
paymentRouter.post('/payments/online/new', clearData, validateData, newOnlineCardExpense);
export default paymentRouter;
