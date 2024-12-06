"use strict";
// src/plaidClient.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const plaid_1 = require("plaid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const configuration = new plaid_1.Configuration({
    basePath: plaid_1.PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID || '',
            'PLAID-SECRET': process.env.PLAID_SECRET || '',
        },
    },
});
const plaidClient = new plaid_1.PlaidApi(configuration);
exports.default = plaidClient;
