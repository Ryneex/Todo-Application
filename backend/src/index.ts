import express, { Express, Response } from "express";
import dotenv from "dotenv";
import chalk from "chalk";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { AppRouter, createContext } from "./routers";
import cors from "cors";
import dbconnect from "./db/dbconnect";
import cookieParser from "cookie-parser";
const app: Express = express();
dotenv.config();

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(cookieParser());
// creates express middleware for trpc
const TrpcExpressMiddleware = createExpressMiddleware({
    router: AppRouter,
    createContext,
});

app.use("/trpc", TrpcExpressMiddleware);

app.get("/", (_, res: Response) => {
    res.send("Todo Backend");
});

dbconnect().then((e) => {
    console.log(e.success);
    app.listen(3001, () => {
        console.log(`Server is running on ${chalk.greenBright(`http://localhost:${3001}`)}`);
    });
});
