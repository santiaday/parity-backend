"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    clientUserId: { type: String, unique: true, required: true }, // some unique ID to identify the user
    plaidAccessToken: { type: String, default: null },
    plaidItemId: { type: String, default: null }
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
