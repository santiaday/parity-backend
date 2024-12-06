import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clientUserId: { type: String, unique: true, required: true }, // some unique ID to identify the user
  plaidAccessToken: { type: String, default: null },
  plaidItemId: { type: String, default: null }
});

const User = mongoose.model('User', userSchema);
export default User;
