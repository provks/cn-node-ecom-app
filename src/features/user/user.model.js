import { getDatabase } from "../../config/mongodb.config.js";
import ApplicationError from "../../error_handler/app.error.js";

export default class UserModel {
    constructor(_name, _email, _password, _type) {
        this.name = _name;
        this.email = _email;
        this.password = _password;
        this.type = _type;
    }

    // static login(email, password) {
    //     const user = users.find(user => user.email == email && user.password == password);
    //     return user;
    // }

    // static async signup(email, password, name, type) {
    //     try {
    //         const newUser = new UserModel(name, email, password, type);
    //         console.log(newUser);
    //         // 1. get the ecommerce db
    //         const db = getDatabase();
    //         // 2. get the users collection
    //         const collection = db.collection('users');
    //         // 3. Insert newUser to users collection, in the ecommerce db
    //         const createdUser = await collection.insertOne(newUser);
    //         console.log('createdUser =>', createdUser)
    //         // users.push(newUser);
    //         return newUser;
    //     } catch (error) {
    //         throw new ApplicationError(500, "Something went wrong!");
    //     }
    // }

    static getAllUsers() {
        return users;
    }
}

// const users = [
//     {
//         id: 1,
//         name: 'Seller',
//         email: 'seller@gmail.com',
//         password: 123456,
//         type: 'seller'
//     },
//     {
//         id: 2,
//         name: 'Customer',
//         email: 'customer@gmail.com',
//         password: 12345,
//         type: 'customer'
//     }
// ];