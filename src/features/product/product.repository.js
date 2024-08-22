import { ObjectId } from "mongodb";
import { getDatabase } from "../../config/mongodb.config.js";
import ApplicationError from "../../error_handler/app.error.js";
import { Product } from "./product.schema.js";
import Review from "./review.schema.js";
import Category from "./category.schema.js";

export default class ProductRepository {
    async addProduct(product) {
        try {   
            // 1. add product to db
            console.log("product ===> ", product)
            const newProduct = new Product(product);
            const productDoc = await newProduct.save();
            
            // 2. update the categories doc
            await Category.updateMany(
                { _id: {$in: product.categories} },
                {$push: { products: productDoc._id }}
            );
            return productDoc;
        } catch (error) {
            console.log(error)
            throw new ApplicationError(500, "Something went wrong!");
        }
    }

    async getAllProducts() {
        try {
            // 1. get the ecommerce db
            const db = getDatabase();
            // 2. get the products collection
            const collection = db.collection('products');
            // 3. get all prodcuts
            const products = await collection.find({}).toArray();
            console.log("products", products);
            return products;
        } catch (error) {
            console.log(error)
            throw new ApplicationError(500, "Something went wrong!");
        }
    }
   
    async getProductBydId(id) {
        try {
            // 1. get the ecommerce db
            const db = getDatabase();
            // 2. get the products collection
            const collection = db.collection('products');
            // 3. get all prodcuts
            console.log("id", id);
            console.log("id type", typeof id);
            const products = await collection.findOne({_id: ObjectId.createFromHexString(id)});
            console.log("products", products);
            return products;
        } catch (error) {
            console.log(error)
            throw new ApplicationError(500, "Something went wrong!");
        }
    }
   
    async filter(minPrice, maxPrice, category) {
        try {
            // 1. get the ecommerce db
            const db = getDatabase();
            // 2. get the products collection
            const collection = db.collection('products');
            // 3. filter the products
            let filters = {};
            if (minPrice) {
                filters.price = { $gte: parseFloat(minPrice) } 
            }
            // if (maxPrice) {
            //     filters.price = { ...filters.price, $lte: parseFloat(maxPrice) }
            // }
            console.log("typeof category", typeof category)
            if (category) {
                // filters.category = category
                // $in operator
                // filters.category = { $in: JSON.parse(category) }
                // $or
                // filters.category = {$or: [{ $in: JSON.parse(category) }, filters]}
                filters = {$or: [{category: { $in: JSON.parse(category) }}, filters]}
            }
            console.log("filters ==> ", filters);
            const products = await collection.find(filters).project({name: 1, category: 1, price: 1, 
                // "ratings.userId": 1
                ratings: {$slice: 2}
                }).toArray();
            console.log("products", products);
            return products;
        } catch (error) {
            console.log(error)
            throw new ApplicationError(500, "Something went wrong");
        }
    }

    // async rate(rating, userId, productId) {
    //     try {
    //         // 1. get the ecommerce db
    //         const db = getDatabase();
    //         // 2. get the products collection
    //         const collection = db.collection('products');
    //         // 3. rate product
               // #### Issue, same user can add duplicate rating ####
    //         // collection.updateOne({_id: ObjectId.createFromHexString(productId)}, 
    //         // { 
    //         //     $push: { ratings: {rating: rating, userId: ObjectId.createFromHexString(userId)} } 
    //         // });
    //         // 3.1 check if product exist
    //         // const productFound = await collection.findOne({_id: ObjectId.createFromHexString(productId)});
    //         // if (!productFound) {
    //         //     throw new ApplicationError(404, "Product not found");
    //         // }
    //         // // 3.2 check if ratings exist against userId
    //         // const userRating = productFound.ratings?.find(ratingObj => ratingObj.userId == userId);
    //         // if (userRating) {
    //         //     // update existing user rating
    //         //     collection.updateOne({ _id: ObjectId.createFromHexString(productId), "ratings.userId": ObjectId.createFromHexString(userId)}, 
    //         //     {
    //         //         $set: { "ratings.$.rating": rating}
    //         //     });
    //         // } else {
    //         //     // insert new rating
    //         //     collection.updateOne({_id: ObjectId.createFromHexString(productId)}, 
    //         //     { 
    //         //         $push: { ratings: {rating: rating, userId: ObjectId.createFromHexString(userId)} } 
    //         //     });
    //         // }
            
    //     } catch (error) {
    //         console.log(error)
    //         throw new ApplicationError(500, "Something went wrong");
    //     }
    // }

    // clean code
    // async rate(rating, userId, productId) {
    //     try {
    //         // 1. get the ecommerce db
    //         const db = getDatabase();
    //         // 2. get the products collection
    //         const collection = db.collection('products');
    //         // 3. rate product
    //         // 3.1 pull/remove existing rating
    //         await collection.updateOne({_id: ObjectId.createFromHexString(productId)}, 
    //         { 
    //             $pull: { ratings: { userId: ObjectId.createFromHexString(userId)} } 
    //         });
    //         // push new rating
    //         await collection.updateOne({_id: ObjectId.createFromHexString(productId)}, 
    //         { 
    //             $push: { ratings: {rating: rating, userId: ObjectId.createFromHexString(userId)} } 
    //         });
    //     } catch (error) {
    //         console.log(error)
    //         throw new ApplicationError(500, "Something went wrong");
    //     }
    // }


    // add reviews with mongoose
    async rate(rating, userId, productId) {
        try {
           // 1. check if product exist
           const productDoc = await Product.findById(productId);
           console.log("productDoc", productDoc);
           if (!productDoc) {
                throw new Error("Product not found!");
           }

           // 2. check if review exists
           const reviewDoc = await Review.findOne({productId, userId});
           // 3. if reivew exists update the review
           if (reviewDoc) {
                reviewDoc.rating = rating;
                await reviewDoc.save();
           } else {
               // 4. else insert the review
                const newReview = new Review({
                    productId,
                    userId,
                    rating
                });
                await newReview.save();
                // adding review id to the review array in product
                productDoc.reviews.push(newReview._id);
                await productDoc.save();
           }
        } catch (error) {
            console.log(error);
            throw new ApplicationError(500, "Something went wrong");
        }
    }


    // To find the average product price per category
    async averageProductPricePerCategory() {
        try {
            // 1. get the ecommerce db
            const db = getDatabase();
            // 2. get the products collection
            const collection = db.collection('products');
            const data = await collection.aggregate( [
                // stage 1: get the average price per category
                {
                    $group: { _id: "$category", averagePrice: { $avg: "$price" } }
                },
                { $sort: { averagePrice: 1} },
                { $limit: 1 },

            ]).toArray();
            console.log("data===>", data)
            return data;
        } catch (error) {
            console.log(error)
            throw new ApplicationError(500, "Something went wrong");
        }

    }
   
    //    Find the average rating of the product
    async averageProductRating() {
        try {
            // 1. get the ecommerce db
            const db = getDatabase();
            // 2. get the products collection
            const collection = db.collection('products');
            const data = await collection.aggregate( [
                // stage 1: get ratings
                { $unwind : "$ratings" },
                //  stage 2: get the average rating
                {
                    $group: { _id: "$name", averageRating: { $avg: "$ratings.rating" } }
                },
                {
                    $match: {averageRating: {$gte: 4}}
                },

            ]).toArray();
            console.log("data===>", data)
            return data;
        } catch (error) {
            console.log(error)
            throw new ApplicationError(500, "Something went wrong");
        }

    }

    // Find the count ratings of products
    async averageProductRating() {
        try {
            // 1. get the ecommerce db
            const db = getDatabase();
            // 2. get the products collection
            const collection = db.collection('products');
            const data = await collection.aggregate( [
                // stage 1: get ratings
                { $project: {name: 1, category: 1, ratingCount: { $cond: [ {$isArray: "$ratings"}, {$size: "$ratings"}, 0 ]}}},
                // find the product with highest number of ratings
                { $sort: { ratingCount: 1} },
                { $limit: 1 },

            ]).toArray();
            console.log("data===>", data)
            return data;
        } catch (error) {
            console.log(error)
            throw new ApplicationError(500, "Something went wrong");
        }

    }
}