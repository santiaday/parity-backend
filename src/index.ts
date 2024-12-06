import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import plaidRouter from '@routes/plaid';
import accountRouter from '@routes/accounts';
import transactionRouter from '@routes/transactions';
import "@services/db/mongoose";
import userRouter from '@routes/user';



dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use('/plaid', plaidRouter);
app.use('/accounts', accountRouter);
app.use('/transactions', transactionRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.send('Parity Backend API');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  

export default app;
