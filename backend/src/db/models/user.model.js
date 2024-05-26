"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.default.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
    },
    password: {
        required: true,
        type: String,
    },
}, { timestamps: true });
var User = mongoose_1.default.models.User || mongoose_1.default.model('User', schema);
exports.default = User;
