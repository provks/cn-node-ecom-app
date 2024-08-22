import express from 'express';

// add the product controller
import CartController from './cartItem.controller.js';

const cartController = new CartController();

const router = express.Router();

// domainName.com/api/cart/
router.get('/', (req, res) => {
    cartController.getAllCartItems(req, res);
});

// domainName.com/api/cart?productId=1&quantity=1      (req.query)
router.post('/', (req, res) => {
    cartController.addCartItem(req, res);
});

// domainName.com/api/cart/2   (req.params)
router.delete('/:id', (req, res) => {
    cartController.deleteCartItem(req, res);
});

export default router;