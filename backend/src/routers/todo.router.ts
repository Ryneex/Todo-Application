import { z } from "zod";
import Todo from "../db/models/todo.model";
import { t } from "../trpc";
import { ITodo } from "../types/types";
import { todoValidation, updateTodoValidation } from "../validations/todo.validation";
import { isValidObjectId } from "mongoose";

export const todoRouter = t.router({
    create: t.procedure.input(todoValidation).mutation(async ({ ctx, input }) => {
        try {
            const user = await ctx.auth.getUser();
            if (!user) return { error: "User not logged in" };
            return (await Todo.create({ ...input, owner: user._id })) as ITodo;
        } catch (error) {
            return { error: "Something went wrong" };
        }
    }),
    update: t.procedure.input(updateTodoValidation).mutation(async ({ ctx, input }) => {
        try {
            const user = await ctx.auth.getUser();
            if (!user) return { error: "User not logged in" };
            const todo = (await Todo.findOneAndUpdate({ owner: user._id, _id: input._id }, input, { new: true })) as ITodo;
            if (!todo) return { error: "Todo couldn't be found" };
            return todo;
        } catch (error) {
            return { error: "Something went wrong" };
        }
    }),
    delete: t.procedure.input(z.custom((e) => isValidObjectId(e))).mutation(async ({ ctx, input }) => {
        try {
            const user = await ctx.auth.getUser();
            if (!user) return { error: "User not logged in" };
            const todo = await Todo.findOneAndDelete({ owner: user._id, _id: input });
            if (!todo) return { error: "Todo couldn't be found" };
            return todo as ITodo;
        } catch (error) {
            return { error: "Something went wrong" };
        }
    }),
    get: t.procedure.input(z.object({ session_id: z.string().optional(), page: z.number().default(1), filters: z.any() })).query(async ({ ctx, input }) => {
        try {
            const user = await ctx.auth.getUser(input.session_id);
            if (!user) return { error: "User not logged in" };
            const todos: ITodo[] = await Todo.find({ owner: user._id, ...input.filters }, null, { sort: { createdAt: -1 } })
                .skip((input.page - 1) * 10)
                .limit(10);
            const totalTodos = await Todo.countDocuments({ owner: user._id, ...input.filters });
            // sending necessary informations for pagination
            return { todos, currentPage: input.page, totalPages: Math.ceil(totalTodos / 10), user };
        } catch (error) {
            return { error: "Something went wrong" };
        }
    }),
});
