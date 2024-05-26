import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { validate } from "uuid";
import Session from "../db/models/session.model";
import { isValidObjectId } from "mongoose";
import { IUser } from "../types/types";

export class Auth {
    private req;
    private res;
    constructor({ req, res }: CreateExpressContextOptions) {
        this.req = req;
        this.res = res;
    }

    async createSession({ userId, expiresIn }: { userId: string; expiresIn: number }) {
        if (!isValidObjectId(userId)) return { error: "Invalid user ID" };
        try {
            const session = await Session.create({ user: userId, expiresAt: Date.now() + expiresIn });
            this.res.cookie("session_id", session._id, {
                httpOnly: true,
                expires: new Date(Date.now() + expiresIn),
                secure: process.env.NODE_ENV === "production",
            });
            return { success: "Session created successfully", data: session };
        } catch (error) {
            return { error: "Couldn't create Session" };
        }
    }

    async getUser(input?: string): Promise<IUser | null> {
        const session_id = input || this.req.cookies.session_id;
        if (!session_id || !validate(session_id)) return null;
        try {
            const session = await Session.findById(session_id, { __v: false }).populate("user", {
                password: false,
                __v: false,
            });
            if (!session) return null;
            if (session.expiresAt <= new Date() || !session.user) {
                await session.deleteOne();
                return null;
            }
            return session.user as IUser;
        } catch (error) {
            return null;
        }
    }
}
