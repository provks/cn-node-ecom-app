import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String },
    products: [{
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    }]
});

const Category = mongoose.model('Category', categorySchema);

export default Category;