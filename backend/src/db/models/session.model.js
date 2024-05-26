"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var user_model_1 = require("./user.model");
var mongoose_1 = require("mongoose");
var uuid_1 = require("uuid");
var scema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: user_model_1.default,
        required: true,
    },
    expiresAt: Date,
});
var Session = mongoose_1.models.Session || (0, mongoose_1.model)('Session', scema);
exports.default = Session;
