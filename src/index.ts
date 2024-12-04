
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Parity Backend API');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
