import { Router, Request, Response } from "express";
import { newCard } from "../controllers/companyControllers.js";
import clearData from "../middlewares/stringStripMiddleware.js";
import validateData from "../middlewares/validateMiddleware.js";

const companyRouter = Router();

companyRouter.get('/company/:id', (req: Request, res: Response) => res.status(200).send(`ok company ID: ${req.params.id}`));
companyRouter.post('/cards/:id/new', clearData, validateData, newCard);

export default companyRouter;