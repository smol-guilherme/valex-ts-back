import { Router, Request, Response } from "express";
import clearData from "../middlewares/stringStripMiddleware.js";
import validateData from "../middlewares/validateMiddleware.js";
// import { finish } from "../controllers/companyControllers.js";

const companyRouter = Router();

companyRouter.get('/company/:id', (req: Request, res: Response) => res.status(200).send(`ok company ID: ${req.params.id}`));
companyRouter.post('/cards/:id/new', clearData, validateData);

// now = new Date()
// Date Tue Aug 30 2022 08:48:55 GMT-0300 (Brasilia Standard Time)
// now.setUTCFullYear(now.getUTCFullYear()+5)
// Date Mon Aug 30 2027 08:48:55 GMT-0300 (Brasilia Standard Time)

export default companyRouter;