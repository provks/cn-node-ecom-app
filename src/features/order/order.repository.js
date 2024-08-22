import { ObjectId } from "mongodb";
import { getClient, getDatabase } from "../../config/mongodb.config.js";
import ApplicationError from "../../error_handler/app.error.js";
import OrderModel from "./order.model.js";

export default class OrderRepository{
    constructor() {
        this.db = getDatabase();
        // this.collection = "order";
        this.collection = this.db.collection("orders");
    }

    async placeOrder(userId) {
        // get the client
        const client = getClient();
        // Start the session
        const session = client.startSession();
        try {

            // start transaction
            session.startTransaction();
            // 1. Getting cart items and calculating the total amount
            console.log("userId is: ", userId)
            const cartItems = await this.getOrderAmount(userId, session);
            const orderAmount = cartItems.reduce((acc, cartItem,) => acc+cartItem.totalAmount, 0);
            console.log("orderAmount:", orderAmount);

            // 2. Creating the order in the collection
            const newOrder = new OrderModel(ObjectId.createFromHexString(userId), orderAmount, new Date());
            await this.collection.insertOne(newOrder, {session});

            // 3. Reducing the stock (inventory)
            // run below query on mongosh in compass to add stock
            // db.products.updateMany({}, { $set: { "stock" :  20} });
            // iterating over cartItems and updating product one by one
            for (let cartItem of cartItems) {
                await this.db.collection("products").updateOne(
                    {_id: cartItem.productId},
                    { $inc: { stock: -cartItem.quantity } },
                    {session}
                )
            }

            // Throwing error intentionally
            // throw new Error("some db error!");

            // 4. Empty the cart
            await this.collection.deleteMany({userId: ObjectId.createFromHexString(userId)}, {session});

            // commit the transaction
            session.commitTransaction();
            // session.endSession();
        } catch (error) {
            session.abortTransaction();
            // session.endSession();
            console.log(error);
            throw new ApplicationError(500, "Something went wrong!");
        } finally {
            session.endSession();
        }
    }

    async getOrderAmount(userId, session) {
        // 1. get the ecommerce db
        //  const db = getDatabase();
        // 2. get the products collection
        //  const collection = db.collection(this.collection);
        const collection = this.collection;
        const items = await this.db.collection("cart_items").aggregate([
            // Stage 1: Filter cart items documents by userId
            {
                $match: { userId: ObjectId.createFromHexString(userId) }
            },
            // Stage 2: Get the products data from products collection
            {
                $lookup:
                  {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productData"
                  }
            },
            // Stage 3: unwind the productData
            { $unwind: "$productData" },
            // Stage 4. Calculate the amount for each cart item
            {
                $addFields: { 
                    totalAmount: { $multiply: [ "$productData.price", "$quantity" ] } 
                }
            },
            
        ], {session}).toArray();
        console.log("items:", items);
        return items;
        // iterate over result array to get cart amount
        // const cartTotal = items.reduce((acc, item,) => {
        //     return acc+item.totalAmount;
        // }, 0);
        // const cartTotal = items.reduce((acc, item,) => acc+item.totalAmount, 0);
        // console.log("cartTotal:", cartTotal);
        // return cartTotal;
    }
}