import ApplicationError from "../../error_handler/app.error.js";
import Like from "./like.schema.js";

export default class LikeRepository {
    
    async getLikes(id, type) {
        try {   
            const like = await Like.find({likeable: id, docModel: type}).populate("userId", "name email").populate("likeable");
            return like;
        } catch (error) {
            console.log(error)
            throw new ApplicationError(500, "Something went wrong with db!");
        }
    }
   
    async likeProduct(userId, productId) {
        try {   
            const newLike = new Like({
                userId: userId,
                likeable: productId,
                docModel: 'Product'
            });
            await newLike.save();
        } catch (error) {
            console.log(error)
            throw new ApplicationError(500, "Something went wrong with db!");
        }
    }

    async likeCategory(userId, categoryId) {
        try {   
            const newLike = new Like({
                userId: userId,
                likeable: categoryId,
                docModel: 'Category'
            });
            await newLike.save();
        } catch (error) {
            console.log(error)
            throw new ApplicationError(500, "Something went wrong with db!");
        }
    }
   
}