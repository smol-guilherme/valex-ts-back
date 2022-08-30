import companyRouter from "./src/routers/companyRouter.js";
import express, { json } from "express";
import cors from "cors";
import "dotenv/config"

const app = express();

app.use(json());
app.use(cors());
app.use(companyRouter);

app.listen(process.env.PORT, () => console.log(`Server up and running on PORT ${process.env.PORT}@${Date()}`));