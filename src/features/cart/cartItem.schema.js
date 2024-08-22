import mongoose, { Schema } from 'mongoose';
// const { Schema } = mongoose;

export const cartItemSchema = new mongoose.Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  productId:  { type: Schema.Types.ObjectId, ref: 'products' },
  quantity: Number,
});