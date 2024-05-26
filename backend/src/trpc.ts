import { initTRPC } from "@trpc/server";
import { type createContext } from "./routers";

export const t = initTRPC.context<createContext>().create();