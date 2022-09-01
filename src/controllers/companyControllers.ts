import { Request, Response } from "express";
import { createUserCard } from "../services/companyServices.js";

export async function newCard(req: Request, res: Response) {
  const response = await createUserCard(req.body, req.params);
  res.status(201).send(response);
  return;
}
