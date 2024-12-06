"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLinkToken = createLinkToken;
exports.exchangePublicToken = exchangePublicToken;
exports.fetchTransactions = fetchTransactions;
const plaidClient_1 = __importDefault(require("@clients/plaid/plaidClient"));
const plaid_1 = require("plaid");
const User_1 = __importDefault(require("@models/user/User"));
const CURRENT_USER_ID = 'test-user-123';
// In a real app, get this from req.user after authentication.
async function createLinkToken() {
    // Ensure user in DB
    let user = await User_1.default.findOne({ clientUserId: CURRENT_USER_ID });
    if (!user) {
        user = new User_1.default({ clientUserId: CURRENT_USER_ID });
        await user.save();
    }
    const response = await plaidClient_1.default.linkTokenCreate({
        user: {
            client_user_id: CURRENT_USER_ID,
        },
        client_name: 'Parity App',
        products: [plaid_1.Products.Transactions],
        country_codes: [plaid_1.CountryCode.Us],
        language: 'en',
        redirect_uri: "https://parity-redirect.vercel.app/plaid-redirect"
    });
    return response.data.link_token;
}
async function exchangePublicToken(publicToken) {
    const tokenResponse = await plaidClient_1.default.itemPublicTokenExchange({
        public_token: publicToken,
    });
    const access_token = tokenResponse.data.access_token;
    const item_id = tokenResponse.data.item_id;
    await User_1.default.findOneAndUpdate({ clientUserId: CURRENT_USER_ID }, { plaidAccessToken: access_token, plaidItemId: item_id }, { new: true, upsert: true });
    return { access_token, item_id };
}
async function fetchTransactions(start_date, end_date) {
    const user = await User_1.default.findOne({ clientUserId: CURRENT_USER_ID });
    if (!user || !user.plaidAccessToken) {
        throw new Error('User does not have a linked account');
    }
    const transactionsResponse = await plaidClient_1.default.transactionsGet({
        access_token: user.plaidAccessToken,
        start_date,
        end_date,
    });
    return transactionsResponse.data;
}
