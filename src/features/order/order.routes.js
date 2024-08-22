import express from 'express';

// add the order controller
import OrderController from './order.controller.js';

const orderController = new OrderController();

const router = express.Router();

// placing order
router.post('/', (req, res, next) => {
    orderController.placeOrder(req, res, next);
});

export default router;