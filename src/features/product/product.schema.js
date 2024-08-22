import mongoose, { mongo } from 'mongoose';
const { Schema } = mongoose;
export const productSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  price: Number,
  category: String,
  description: String,
  imageUrl: { type: String },
  stock: Number,
  reviews: [{
    type: mongoose.Types.ObjectId,
    ref: 'Review'
  }],
  categories: [{
    type: mongoose.Types.ObjectId,
    ref: 'Category'
  }]
});

export const Product = mongoose.model('Product', productSchema);