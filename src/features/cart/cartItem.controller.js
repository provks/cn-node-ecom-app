import ApplicationError from "../../error_handler/app.error.js";
import CartItemModel from "./cartItem.model.js";
import CartItemRepository from "./cartItem.repository.js";

export default class CartItemController {

    constructor() {
        this.cartItemRepository = new CartItemRepository();
    }

    // adding product/cartItem to Cart
    async addCartItem(req, res) {
        try {
            const { productId, quantity } = req.body;
            const userId = req.userId;
            // CartItemModel.addToCart(userId, productId, quantity);
            const cartCreated = await this.cartItemRepository.add(userId, productId, quantity);
            console.log("cartCreated", cartCreated);
            return res.status(201).send("Item added to cart successfully!");
        } catch (error) {
            console.log(error);
            throw new ApplicationError(500, "something went wrong!");
        }
    }
    
    // get all cartItems for user
    async getAllCartItems(req, res) {
        try {
            const userId = req.userId;
            // const cartItems = CartItemModel.get(userId);
            const cartItems = await this.cartItemRepository.get(userId);
            return res.status(200).send(cartItems);
        } catch (error) {
            console.log(error);
            throw new ApplicationError(500, "something went wrong!");
        }
    }
    
    // get all cartItems for user
    async deleteCartItem(req, res) {
        try {
            const {id: cartItemId} = req.params;
            const userId = req.userId;
            // const error = CartItemModel.delete(cartItemId, userId);
            const result  = await this.cartItemRepository.delete(cartItemId, userId);
            console.log("delete result", result);
            if (result.deletedCount < 1) {
                return res.status(400).send("Bad request");
            }
            return res.status(200).send("Item removed from cart successfully!");
        } catch (error) {
            console.log(error);
            throw new ApplicationError(500, "something went wrong!");
        }
    }
}