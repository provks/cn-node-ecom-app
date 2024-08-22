import ApplicationError from '../../error_handler/app.error.js';
import LikeRepository from './like.repository.js';

export default class LikeController {

    constructor() {
        this.likeRepository = new LikeRepository;
    }

    async getLikes(req, res) {
        try {
            const {id, type} = req.query;
            const likes = await this.likeRepository.getLikes(id, type);
            return res.status(200).send(likes);
        } catch (error) {
            console.log(error);
            throw new ApplicationError(500, "Something went wrong!")
        }
    }

    // like a product/category
    async addLike(req, res) {
        try {
            // const products = ProductModel.getAllProducts();
            const {id, type} = req.body;
            const userId = req.userId;
            if (!type || (type!="Category" && type!="Product")) {
                return res.status(400).send("Invalid request");
            }

            if (type=="Category") {
                await this.likeRepository.likeCategory(userId, id);
            }

            if (type=="Product") {
                await this.likeRepository.likeProduct(userId, id);
            } 
            return res.status(201).send(`${type} is liked succesfully!`);
        } catch (error) {
            console.log(error);
            throw new ApplicationError(500, "Something went wrong!")
        }
    }

    
}

