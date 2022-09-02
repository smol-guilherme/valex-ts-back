import { Request, Response } from "express";
import { insertNewExpense } from "../services/paymentServices.js";

export async function newCardExpense(req: Request, res: Response) {
  const response = await insertNewExpense(req.body);
  res.status(201).send(response);
  return;
}

