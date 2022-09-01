import { Request, Response, NextFunction } from "express";

export function companyErrors(error, req: Request, res: Response, next: NextFunction) {
    console.log(error);
    
    if(error.type === 'not_found_error') return res.status(404).send();
    if(error.type === 'no_schema_error') return res.status(400).send();

    res.status(500).send('what');
}