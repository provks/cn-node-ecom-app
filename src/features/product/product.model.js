import UserModel from "../user/user.model.js";
import ApplicationError from '../../error_handler/app.error.js';

export default class ProductModel {
    constructor(_name, _description, _imageUrl, _categories, _price) {
        // this.id = _id;
        this.name = _name;
        this.description = _description;
        this.imageUrl = _imageUrl;
        this.categories = _categories;
        this.price = _price;
    }

    //  returns all the products
    // static getAllProducts() {
    //     return products;
    // }

    // add product to products array
    // static addProduct(_name, _description, _imageUrl, _category, _price) {      
    //     const newProduct = new ProductModel(
    //       products.length+1,
    //       _name,
    //       _description,
    //       _imageUrl,
    //       _category,
    //       _price
    //     );
  
    //     products.push(newProduct);
    // }

    //  get product by id
    // static getProductBydId(id) {
    //     // const product = products.find((productObj) => { return productObj.id == id });
    //     const product = products.find(productObj =>  productObj.id == id);
    //     return product;
    // }
    
    
    //  filter products
    static getFilteredProducts(minPrice, maxPrice, category) {
        const filteredProducts = products.filter((product) => {
            return ((!minPrice || product.price >= minPrice) &&
            (!maxPrice || product.price <= maxPrice) &&
            (!category || product.category == category) )
        });
        return filteredProducts;
    }
    
    //  rate product out of 5
    static rateProduct(rating, userId, productId) {
        // 1. validate if product exists against productId
        const productFound = products.finds((product) => { return product.id === productId });
        if (!productFound) {
            // return 'Product not found!';
            throw new ApplicationError(404, 'Product not found!');
        }

        // 2. validate if product exists against productId
        const users = UserModel.getAllUsers();
        const userFound = users.finds((user) => { return user.id === userId });
        if (!userFound) {
            // return 'User not found!';
            // user-defined error
            throw new ApplicationError(400, 'User not found!');
        }

        // 3. add rating for the product
            // checking if rating array exists (adding rating first time)
        if (!productFound.ratings) {
            productFound.ratings = [];
            productFound.ratings.push({userId, rating});
        } else {
            // same userId has already rated product (update rating operation)
            const exisitingRatingIndex = productFound.ratings.findIndex((rating) =>  rating.userId == userId);
            if (exisitingRatingIndex != -1) {
                productFound.ratings[exisitingRatingIndex] = {userId, rating}
            } else {
                // add new rating to existing ratings array
                productFound.ratings.push({userId, rating});
            }
        }
    }
}

const products = [
    new ProductModel(1, "Samsung Galaxy S23", "Best AI android smartphone", "https://m.media-amazon.com/images/I/31W9+sE8McL._SY300_SX300_.jpg", 'mobile', 80000),
    new ProductModel(2, "Oneplus 12", "Flagship killer", "https://m.media-amazon.com/images/I/41+WyW0KOgL._SY300_SX300_.jpg", 'smartphone', 65000),
    new ProductModel(3, "iphone 15 pro max", "This the great phone with amazing features", "https://m.media-amazon.com/images/I/41JrUCWNjHL._SY445_SX342_QL70_FMwebp_.jpg", 'mobile', 120000),
    new ProductModel(4, "Nothing phone 2", "Best overall android phone in the market yet which supports wireless charging!", "https://m.media-amazon.com/images/I/812zEF5pJAL._SX679_.jpg", 'mobile', 120000),
    new ProductModel(5, "Nothing phone 3", "New Phone in the market!", "https://m.media-amazon.com/images/I/812zEF5pJAL._SX679_.jpg", 'smartphone', 40000),
];