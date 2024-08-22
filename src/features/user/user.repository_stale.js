import { getDatabase } from "../../config/mongodb.config.js";
import ApplicationError from "../../error_handler/app.error.js";

class UserRepository {
    async signup(newUser) {
        try {
            // 1. get the ecommerce db
            const db = getDatabase();
            // 2. get the users collection
            const collection = db.collection('users');
            // 3. Insert newUser to users collection, in the ecommerce db
            const createdUser = await collection.insertOne(newUser);
            console.log('createdUser =>', createdUser)
            // users.push(newUser);
            return newUser;
        } catch (error) {
            console.log(error)
            throw new ApplicationError(500, "Something went wrong!");
        }
    }
    
    // static async login(email, password) {
    //     try {
    //         const db = getDatabase();
    //         // 2. get the users collection
    //         const collection = db.collection('users');
    //         return await collection.findOne({email});
    //     } catch (error) {
    //         console.log(error)
    //         throw new ApplicationError(500, "Something went wrong!");
    //     }
    // }
    
    async getByEmail(email) {
        try {
            const db = getDatabase();
            // 2. get the users collection
            const collection = db.collection('users');
            return await collection.findOne({email});

        } catch (error) {
            console.log(error)
            throw new ApplicationError(500, "Something went wrong!");
        }
    }
}

export default UserRepository;