"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const plaidController_1 = require("@controllers/plaid/plaidController");
const router = express_1.default.Router();
router.post('/create_link_token', plaidController_1.createLinkTokenController);
router.post('/get_access_token', plaidController_1.exchangePublicTokenController);
router.post('/transactions', plaidController_1.fetchTransactionsController);
exports.default = router;
