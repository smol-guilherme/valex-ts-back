import { Router } from "express";
import clearData from "../middlewares/stringStripMiddleware.js";

const companyRouter = Router();

companyRouter.get('/company/:id', (req, res) => res.status(200).send(`ok company ID: ${req.params.id}`));
companyRouter.post('/cards/:id/new', clearData, )

// now = new Date()
// Date Tue Aug 30 2022 08:48:55 GMT-0300 (Brasilia Standard Time)
// now.setUTCFullYear(now.getUTCFullYear()+5)
// Date Mon Aug 30 2027 08:48:55 GMT-0300 (Brasilia Standard Time)

export default companyRouter;