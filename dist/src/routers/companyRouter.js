import { Router } from "express";
import { loadCard, newCard } from "../controllers/companyControllers.js";
import clearData from "../middlewares/stringStripMiddleware.js";
import validateData from "../middlewares/validateMiddleware.js";
var companyRouter = Router();
companyRouter.get('/company/:id', function (req, res) { return res.status(200).send("ok company ID: ".concat(req.params.id)); });
companyRouter.post('/company/load', clearData, validateData, loadCard);
companyRouter.post('/cards/new', clearData, validateData, newCard);
export default companyRouter;
