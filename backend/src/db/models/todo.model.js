"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var user_model_1 = require("./user.model");
var schema = new mongoose_1.default.Schema({
    title: String,
    owner: {
        type: mongoose_1.default.Types.ObjectId,
        ref: user_model_1.default,
        required: true,
    },
    description: String,
    completed: Boolean,
}, { timestamps: true });
var Todo = mongoose_1.default.models.Todo || mongoose_1.default.model("Todo", schema);
exports.default = Todo;
