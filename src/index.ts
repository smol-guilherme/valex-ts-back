import express, { json } from "express";
import cors from "cors";
import "dotenv/config"
import companyRouter from "./routers/companyRouter.js";
import { companyErrors } from "./middlewares/companyErrorMiddleware.js";

const app = express();

app.use(json());
app.use(cors());
app.use(companyRouter);
app.use(companyErrors);

app.listen(process.env.PORT, () => console.log(`Server up and running on PORT ${process.env.PORT}@${Date()}`) ) 