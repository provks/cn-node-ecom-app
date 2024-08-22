export default class CartItemModel {
    constructor(_id, _userId, _productId, _quantity) {
        this.id = _id;
        this.userId = _userId;
        this.productId = _productId;
        this.quantity = _quantity;
    }

    // add product to cart
    // static addToCart(userId, productId, quantity) {
    //     const newCartItem = new CartItemModel(
    //         cartItems.length+1,
    //         userId,
    //         productId,
    //         quantity
    //     );
    //     cartItems.push(newCartItem);
    //     return newCartItem;
    // }
    
    // get all cartItems
    static get(userId) {
        const cartItemsByUserId = cartItems.filter((cartItem) => cartItem.userId == userId);
        return cartItemsByUserId;
    }
    
    // delete cartItem
    static delete(id, userId) {
        // validation: check if cartItem exists against the id and userId
        const cartItemIndex = cartItems.findIndex((cartItem) => cartItem.id == id && cartItem.userId == userId);
        if (cartItemIndex == -1) {
            return "cartItem not found!";
        }
        cartItems.splice(cartItemIndex, 1);
    }
}

const cartItems = [
    new CartItemModel(1, 2, 1, 1),
    new CartItemModel(2, 2, 3, 1)
];