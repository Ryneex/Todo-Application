import { validate } from "uuid";
import User from "../db/models/user.model";
import { t } from "../trpc";
import loginValidation from "../validations/login.validation";
import signupValidation from "../validations/signup.validation";
import argon from "argon2";
import { z } from "zod";
import Todo from "../db/models/todo.model";

export const userRouter = t.router({
    login: t.procedure.input(loginValidation).mutation(async ({ input, ctx }) => {
        try {
            const user = await User.findOne({ email: input.email });
            if (!user) return { error: "Incorrect email or password" };
            const doesPassMatch = await argon.verify(user.password, input.password);
            if (!doesPassMatch) return { error: "Incorrect email or password" };
            const res = await ctx.auth.createSession({ userId: user._id.toString(), expiresIn: 1000 * 60 * 60 * 24 * 30 });
            if (res.error) return { error: res.error };
            return { success: "Successfully logged in" };
        } catch (error) {
            return { error: "Something went wrong" };
        }
    }),
    signup: t.procedure.input(signupValidation).mutation(async ({ input, ctx }) => {
        try {
            const hash = await argon.hash(input.password);
            const user = await User.create({ ...input, password: hash });
            const res = await ctx.auth.createSession({ userId: user._id.toString(), expiresIn: 1000 * 60 * 60 * 24 * 30 });
            if (res.error) return { error: res.error };
            return { success: "User has been created" };
        } catch (error: any) {
            if (error.code === 11000) return { error: "Email already in use" };
            return { error: "Couldn't Signup" };
        }
    }),
    logout: t.procedure.mutation(async ({ ctx }) => {
        const res = await ctx.auth.deleteSession();
        if (res.error) return res;
        ctx.res.cookie("session_id", undefined);
        return { success: "Logged out successfully" };
    }),
    delete: t.procedure.mutation(async ({ ctx }) => {
        const user = await ctx.auth.getUser();
        if (!user) return { error: "User isn't logged in" };
        try {
            await ctx.auth.deleteAllSessions(user._id);
            await Todo.deleteMany({ owner: user._id });
            await User.deleteOne({ _id: user._id });
            ctx.res.cookie("session_id", undefined);
            return { success: "Account Deleted Successfully" };
        } catch (error) {
            return { error: "Something went wrong" };
        }
    }),
    get: t.procedure.input(z.string().optional()).query(async ({ ctx, input }) => {
        return ctx.auth.getUser(input);
    }),
});
