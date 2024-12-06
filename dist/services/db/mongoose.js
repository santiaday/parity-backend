"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/parity';
mongoose_1.default.connect(mongoUri, {}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error', err);
});
exports.default = mongoose_1.default;
