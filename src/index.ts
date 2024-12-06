
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import plaidRouter from '@routes/plaid';
import "@services/db/mongoose"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/plaid', plaidRouter);

app.get('/', (req, res) => {
  res.send('Parity Backend API');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
