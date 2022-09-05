import { Router } from "express";
import { activateCard, blockCard, deleteVirtualCard, getCardHistory, newVirtualCard } from "../controllers/workerControllers.js";
import clearData from "../middlewares/stringStripMiddleware.js";
import validateData from "../middlewares/validateMiddleware.js";
var workerRouter = Router();
workerRouter.get('/workers/:id', function (req, res) { return res.status(200).send("ok worker ID: ".concat(req.params.id)); });
workerRouter.post('/workers/:id/enable', clearData, validateData, activateCard);
workerRouter.post('/workers/:id/security', clearData, validateData, blockCard);
workerRouter.post('/workers/:id/virtual', clearData, validateData, newVirtualCard);
workerRouter["delete"]('/workers/:id/virtual', clearData, validateData, deleteVirtualCard);
workerRouter.get('/workers/:id/history', clearData, validateData, getCardHistory);
export default workerRouter;
