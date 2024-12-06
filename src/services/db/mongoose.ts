import mongoose from 'mongoose';

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/parity';

mongoose.connect(mongoUri, {
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error', err);
});

export default mongoose;
