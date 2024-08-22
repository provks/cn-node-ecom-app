import mongoose from "mongoose";
import { userSchema, User } from "./user.schema.js";
import ApplicationError from "../../error_handler/app.error.js";

// defined model
// const User = mongoose.model('User', userSchema);

class UserRepository{
    async signup(user) {
        try {
            // 3. Insert newUser to users collection, in the ecommerce db
            const newUser = new User(user);
            console.log('newUser =>', newUser);
            await newUser.save();   // db call to save new user
            // users.push(newUser);
            return newUser;
        } catch (error) {
            console.log("0000000 error", error);
            if (error instanceof mongoose.Error.ValidationError) {
                console.log("Inside catch mongoose error!!!!!!!!!")
                throw error;
            } else {
                throw new ApplicationError(500, "Something went wrong!");
            }
        }
    }

    // login() {

    // }
    // login
    async getByEmail(email) {
        try {
            return await User.findOne({email});

            // const user = await User.findOne({email});
            // console.log("user from db", user);
            // return user;
        } catch (error) {
            console.log(error)
            throw new ApplicationError(500, "Something went wrong!");
        }
    }


    async updatePassword(newPassword, userId) {
        try {
            const user = await User.findById(userId);
            console.log("user BEFORE updating password", user);
            user.password = newPassword;    // update user object
            console.log("user after updating password", user);
            await user.save();    // save the updated user
        } catch (error) {
            console.log(error)
            throw new ApplicationError(500, "Something went wrong!");
        }
    }

}

export default UserRepository;