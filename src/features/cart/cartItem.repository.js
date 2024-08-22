import { ObjectId } from "mongodb";
import { getDatabase } from "../../config/mongodb.config.js";
import ApplicationError from "../../error_handler/app.error.js";

export default class CartItemRepository {
    // adding item to cart
    async add(userId, productId, quantity) {
        try {
            const db = getDatabase();
            const collection = db.collection('cart_items');
            console.log("quantity ===>", quantity);
            // return await collection.insertOne({userId: new ObjectId(userId), productId: new ObjectId(productId), quantity});
            // 1. find the doc against userId and productId
            // 2. Either insert or update document based on 1.
            
            // upsert
            const document = await this.getNextCounterForId(db); 
            console.log("document", document);
            return await collection.updateOne({productId: new ObjectId(productId), userId: new ObjectId(userId)}, 
            {
                $setOnInsert: {_id: document.count},
                $inc: {quantity: quantity}}, 
            {upsert: true});
        } catch (error) {
            console.log(error);
            throw new ApplicationError(500, "Something went wrong with db!");
        }
    }

    // getting cart items
    async get(userId) {
        try {
            const db = getDatabase();
            const collection = db.collection('cart_items');
            const result = await collection.find({userId: new ObjectId(userId)}).toArray();
            return result;
        } catch (error) {
            console.log(error);
            throw new ApplicationError(500, "Something went wrong with db!");
        }
    }

    // delete cart item
    async delete(cartItemId, userId) {
        try {
            const db = getDatabase();
            const collection = db.collection('cart_items');
            const result = await collection.deleteOne({_id: new ObjectId(cartItemId), userId: new ObjectId(userId)});
            return result;
        } catch (error) {
            console.log(error);
            throw new ApplicationError(500, "Something went wrong with db!");
        }
    }
    // fetch the next couter value for id
    async getNextCounterForId(db) {
        try {
            const document = await db.collection('counters').findOneAndUpdate({_id: 'cartItem'}, {$inc: {count: 1}}, {returnDocument: 'after'});
            return document;
        } catch (error) {
            console.log(error);
        }
    }
}

//  export default CartItemRepository;
