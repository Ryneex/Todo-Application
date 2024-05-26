import mongoose, { Model } from "mongoose";
import { ITodo } from "../../types/types";
import User from "./user.model";

const schema = new mongoose.Schema(
    {
        title: String,
        owner: {
            type: mongoose.Types.ObjectId,
            ref: User,
            required: true,
        },
        description: String,
        completed: Boolean,
    } as { [key: string]: mongoose.SchemaDefinitionProperty },
    { timestamps: true }
);

const Todo: Model<ITodo> = mongoose.models.Todo || mongoose.model("Todo", schema);

export default Todo;
