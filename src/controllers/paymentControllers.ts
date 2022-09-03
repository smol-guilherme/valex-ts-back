import { Request, Response } from "express";
import { insertNewExpense, insertNewOnlineExpense } from "../services/paymentServices.js";

export async function newCardExpense(req: Request, res: Response) {
  const response = await insertNewExpense(req.body);
  res.status(201).send(response);
  return;
}

export async function newOnlineCardExpense(req: Request, res: Response) {
  const response = await insertNewOnlineExpense(req.body);
  res.status(201).send(response);
  return;
}
