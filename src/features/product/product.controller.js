import ApplicationError from '../../error_handler/app.error.js';
import Category from './category.schema.js';
import ProductModel from './product.model.js';
import ProductRepository from './product.repository.js';

export default class ProductController {

    constructor() {
        this.productRepository = new ProductRepository();
    }

    // get all products
    async getAllProducts(req, res) {
        try {
            // const products = ProductModel.getAllProducts();
            const products = await this.productRepository.getAllProducts();
            return res.status(200).json(products);
        } catch (error) {
            console.log(error);
            throw new ApplicationError(500, "Something went wrong!")
        }
    }

    // get one specific products
    async getProductBydId(req, res) {
        try {
            const {id: productId} = req.params;
            // const product = ProductModel.getProductBydId(productId);
            const product = await this.productRepository.getProductBydId(productId);
            if (product) {
                return res.status(200).send(product);
            }
            return res.status(404).send("Product not found!");
        } catch (error) {
            console.log(error);
            throw new ApplicationError(500, "Something went wrong!")
        }
    }
    
    // add a product
    async addProduct(req, res) {
        console.log("req.body", req.body);
        // destructuring the req.body
        const { name, description, imageUrl, categories, price } = req.body;
        const product = new ProductModel(name, description, imageUrl, categories, price);
        const productCreated = await this.productRepository.addProduct(product);
        console.log("productCreated ==>", productCreated)
        // const products =  ProductModel.getAllProducts();
        // return res.status(201).send({msg: "added product successfully!", productId: productCreated.insertedId});
        return res.status(201).send({msg: "added product successfully!", productId: productCreated._id});
    }
    
    // filter products
    async getFilteredProducts(req, res) {
        try{
            // destructuring the req.query
            const { minPrice, maxPrice, category } = req.query;
            const filteredProducts = await this.productRepository.filter(minPrice, maxPrice, category);
            // const filteredProducts = ProductModel.getFilteredProducts(minPrice, maxPrice, category);
            return res.status(200).send(filteredProducts);
        } catch (error) {
            console.log(error);
            throw new ApplicationError(500, "Something went wrong!")
        }
    }
    
    // rate product
    async rateProduct(req, res, next) {
        try {
            // destructuring the req.body
            const { rating, productId } = req.body;
            const userId = req.userId;
            if (!rating || !productId) {
                return res.status(400).send("bad request!");
            }
            // try {
                // ProductModel.rateProduct(rating, userId, productId); 
                await this.productRepository.rate(rating, userId, productId); 
                return res.status(200).send("Added rating successfully");
            
        } catch (error) {
            console.log("Inside Catch Error", error);
            // return res.status(503).send("We are looking into it, Please try again later!");
            next(error);
        }
        // } catch (err) {
            // console.log("err ===>", err)
            // console.log("typeof err ===>", typeof err)
            // return res.status(400).send(err.message);
        // }
        // if (error) {
        //     return res.status(400).send(error);
        // }
    }

    // update product
    updateProduct(req, res) {

    }
    
    // delete product
    deleteProduct(req, res) {
    }

    async avgPrice(req, res, next) {
        try {
            // const result = await this.productRepository.averageProductPricePerCategory();
            // average product rating
            const result = await this.productRepository.averageProductRating();
            return res.status(200).send(result);
        } catch (error) {
            console.log("Inside Catch Error", error);
            // return res.status(503).send("We are looking into it, Please try again later!");
            next(error);
        }
    }
}

