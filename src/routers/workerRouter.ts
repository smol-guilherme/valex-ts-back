import { Router, Request, Response } from "express";
import { activateCard } from "../controllers/workerControllers.js";
import clearData from "../middlewares/stringStripMiddleware.js";
import validateData from "../middlewares/validateMiddleware.js";

const workerRouter = Router();

workerRouter.get('/workers/:id', (req: Request, res: Response) => res.status(200).send(`ok worker ID: ${req.params.id}`));
workerRouter.post('/workers/:id/enable', clearData, validateData, activateCard);

export default workerRouter;