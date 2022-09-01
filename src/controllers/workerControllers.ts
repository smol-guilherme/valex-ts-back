import { Request, Response } from "express";
import { matchWorkerToCard } from "../services/workerServices.js";

export async function activateCard(req: Request, res: Response) {
  await matchWorkerToCard(req.body, req.params);
  res.status(200).send();
  return;
}
