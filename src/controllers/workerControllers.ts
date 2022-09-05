import { Request, Response } from "express";
import { matchWorkerToCard, toggleBlockCard, checkForExpenses, setupVirtualCard, virtualCardDeletion } from "../services/workerServices.js";

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

export async function getCardHistory(req: Request, res: Response) {
  const response = await checkForExpenses(req.body)
  res.status(200).send(response);
  return;
}

export async function newVirtualCard(req: Request, res: Response) {
  const response = await setupVirtualCard(req.body, req.params);
  res.status(201).send(response);
  return;
}

export async function deleteVirtualCard(req: Request, res: Response) {
  await virtualCardDeletion(req.body, req.params);
  res.status(200).send();
  return;
}