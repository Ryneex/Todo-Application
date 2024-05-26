import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { t } from "../trpc";
import { userRouter } from "./user.router";
import { Auth } from "../auth";
import { todoRouter } from "./todo.router";

// Adding session informaion with the request so that it can be accessed from trpc routes
export async function createContext(opts: CreateExpressContextOptions) {
    return { ...opts, auth: new Auth(opts) };
}

// Merge post and user router
export const AppRouter = t.router({
    user: userRouter,
    todo: todoRouter,
});

export type createContext = Awaited<ReturnType<typeof createContext>>;
export type AppRouter = typeof AppRouter;
