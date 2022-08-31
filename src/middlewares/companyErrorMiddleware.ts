import { Request, Response, NextFunction } from "express";
import "express-async-errors";

export function companyErrors(error, req: Request, res: Response, next: NextFunction) {
    if(error.type !== 0) return res.status(500).send();
}