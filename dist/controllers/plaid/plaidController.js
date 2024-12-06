"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLinkTokenController = createLinkTokenController;
exports.exchangePublicTokenController = exchangePublicTokenController;
exports.fetchTransactionsController = fetchTransactionsController;
const plaidService_1 = require("../../services/plaid/plaidService");
async function createLinkTokenController(req, res) {
    try {
        const linkToken = await (0, plaidService_1.createLinkToken)();
        res.json({ link_token: linkToken });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating link token' });
        return;
    }
}
async function exchangePublicTokenController(req, res) {
    try {
        const { public_token } = req.body;
        const { access_token, item_id } = await (0, plaidService_1.exchangePublicToken)(public_token);
        res.json({ access_token, item_id });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error exchanging public token' });
        return;
    }
}
async function fetchTransactionsController(req, res) {
    try {
        const { start_date, end_date } = req.body;
        const transactionsData = await (0, plaidService_1.fetchTransactions)(start_date, end_date);
        res.json(transactionsData);
        return;
    }
    catch (error) {
        console.error(error);
        if (error.message === 'User does not have a linked account') {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(500).json({ error: 'Error fetching transactions' });
        return;
    }
}
