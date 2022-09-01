import { Request, Response } from "express";
import { createUserCard, loadCardBalance } from "../services/companyServices.js";

export async function newCard(req: Request, res: Response) {
  const response = await createUserCard(req.body, req.headers);
  res.status(201).send(response);
  return;
}

export async function loadCard(req: Request, res: Response) {
  await loadCardBalance(req.body, req.headers)
  res.status(200).send();
  return;
}