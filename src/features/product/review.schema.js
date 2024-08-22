import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'Product'
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    rating: { type: Number, required: true }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;