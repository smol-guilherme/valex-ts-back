import { Request, Response } from "express";
import { createUserCard } from "../services/companyServices.js";

export function newCard(req: Request, res: Response) {
  createUserCard(req.body, req.params);
  res.status(200).send("Arrived at the end.");
}
