import express, { json } from "express";
import "express-async-errors";
import cors from "cors";
import "dotenv/config"
import companyRouter from "./routers/companyRouter.js";
import workerRouter from "./routers/workerRouter.js";
import paymentRouter from "./routers/paymentRouter.js";
import { handleError } from "./middlewares/errorHandler.js";

const app = express();

app.use(json());
app.use(cors());
app.use(companyRouter);
app.use(workerRouter);
app.use(paymentRouter)
app.use(handleError);

app.listen(process.env.PORT, () => console.log(`Server up and running on PORT ${process.env.PORT}@${Date()}`) ) 