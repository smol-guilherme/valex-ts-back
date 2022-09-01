import { Request, Response } from "express";
import { matchWorkerToCard, toggleBlockCard } from "../services/workerServices.js";

export async function activateCard(req: Request, res: Response) {
  await matchWorkerToCard(req.body, req.params);
  res.status(200).send();
  return;
}

export async function blockCard(req: Request, res: Response) {
  await toggleBlockCard(req.params, req.body)
  res.status(200).send();
  return;
}