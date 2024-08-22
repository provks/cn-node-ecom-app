import express from 'express';

// add the product controller
import ProductController from './product.controller.js';

const productController = new ProductController();

const router = express.Router();

// filter products (req.query)
// domainName.com/api/product/filter?name=value&anotherName=value2
router.get('/filter', (req, res) => {
    productController.getFilteredProducts(req, res);
});

// domainName.com/api/product/
router.get('/', (req, res) => {
        productController.getAllProducts(req, res);
});

// domainName.com/api/product/      (req.body)
// router.post('/', productController.addProduct);
router.post('/', (req, res) => {
    productController.addProduct(req, res);
});

// average product price per category
router.get('/averagePrice', (req, res, next) => {
    productController.avgPrice(req, res, next);
});


// domainName.com/api/product/:id  (req.params)
router.get('/:id', (req, res) => {
    productController.getProductBydId(req, res);
});

// domainName.com/api/product/rate
router.post('/rate', (req, res) => {
    productController.rateProduct(req, res)
});


// ************* HOME WORK ASSIGNMENT ****************
// domainName.com/api/product/id
router.post('/:id', productController.updateProduct);

// domainName.com/api/product/id
router.delete('/:id', productController.deleteProduct);

export default router;