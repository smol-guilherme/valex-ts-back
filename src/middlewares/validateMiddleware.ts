import { Request, Response, NextFunction } from "express";
import * as schemas from "./schemas/dataSchemas.js";
  
  export default async function validateData(req: Request, res: Response, next: NextFunction) {
    const validationData = [req.params, req.body];
    
    for (const index in validationData) {
      try {
        const schema = schemas[setSchema(validationData[index])];
        const response = await schema.validateAsync(validationData[index], {
          abortEarly: false,
        });
        res.locals.dbData = Object.entries(response);
      } catch (err) {
        // const errMessage = err.details.map((res) =>
        //   res.message
        //     .replaceAll('"', "")
        //     .replace(
        //       "confirmPassword must be [ref:password]",
        //       "password does not match"
        //     )
        // );
        // ISSO VAI VIRAR PRESUNTO
        // res.status(422).send(errMessage);
        res.status(422).send();
        return;
      }
    }
    next();
  }

  function setSchema(objectData: Object): string {
    const keys = Object.keys(objectData);
    for (let i = 0; i < keys.length; i++) {
      switch (keys[i]) {
        case "confirmPassword":
          return "signup";
        case "id":
          return "id";
        case "url":
          return "urls";
        case "shortUrl":
          return "shortUrl";
        default:
          break;
      }
    }
    return "signin";
  }