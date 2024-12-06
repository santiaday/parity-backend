"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const plaid_1 = __importDefault(require("./routes/plaid"));
const accounts_1 = __importDefault(require("./routes/accounts"));
const transactions_1 = __importDefault(require("./routes/transactions"));
require("./services/db/mongoose");
const user_1 = __importDefault(require("./routes/user"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/plaid', plaid_1.default);
app.use('/accounts', accounts_1.default);
app.use('/transactions', transactions_1.default);
app.use('/user', user_1.default);
app.get('/', (req, res) => {
    res.send('Parity Backend API');
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
exports.default = app;
