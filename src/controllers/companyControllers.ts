import { Request, Response } from "express";
import { createUserCard } from "../services/companyServices.js";

export function finish(req: Request, res: Response) {

    createUserCard();
    res.status(200).send('Arrived at the end.');
}