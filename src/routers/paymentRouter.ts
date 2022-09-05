import { Router, Request, Response } from "express";
import { newCardExpense, newOnlineCardExpense } from "../controllers/paymentControllers.js";
import clearData from "../middlewares/stringStripMiddleware.js";
import validateData from "../middlewares/validateMiddleware.js";

const paymentRouter = Router();

paymentRouter.get('/payments', (req: Request, res: Response) => res.status(200).send(`ok payments`));
paymentRouter.post('/payments/new', clearData, validateData, newCardExpense);
paymentRouter.post('/payments/online/new', clearData, validateData, newOnlineCardExpense);

export default paymentRouter;