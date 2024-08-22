import UserModel from "./user.model.js";
import jwt from 'jsonwebtoken';
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';

export default class UserController {

    constructor() {
        this.userRepository = new UserRepository();
        console.log("this.userRepository", this.userRepository);
    }

    async updatePassword(req, res, next) {
        try {
            const { newPassword } = req.body;
            console.log(newPassword, typeof newPassword)
            const userId = req.userId;
            // hash the plain password
            const hashPassword = await bcrypt.hash(newPassword, 11);
            await this.userRepository.updatePassword(hashPassword, userId);
            // await this.userRepository.updatePassword(newPassword, userId);
            return res.status(200).send("Password updated successfully!");
        } catch (error) {
            // res.status(500)
            console.log(error)
            next(error);
        }
    }
    
    async login(req, res) {
        try {
            const { email, password } = req.body;
            //1. first get the user by email (check if user by email exists)
            // const user = await UserRepository.getByEmail(email);
            const user = await this.userRepository.getByEmail(email);
            console.log("user**********", user);
            // console.log("user._id**********", user._id);
            // console.log("user._id.toString()**********", user._id.toString());
            if (!user) {
                return res.status(400).send("Account with this email doesn't exist.");
            }
            // 2. match password using bcrypt
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            // const isPasswordCorrect = password === user.password
            
            if (!isPasswordCorrect) {
                return res.status(400).send("Invalid credentials");
            }
            // const user = UserModel.login(email, password);
            // if (user) {
                // create token (when user email and password are correct)
                const token = jwt.sign({ id: user._id.toString(), email: user.email, isAdmin: true }, process.env.SECRET_KEY,  { expiresIn: '1h' });
                return res.status(200).send({ token, msg: "Logged in successfully!"});
            // }
            // return res.status(400).send("Bad credentials");
        } catch (error) {
            console.log(error)
            return res.status(500).send("Something went wrong!");
        }
    }
    
    async signup(req, res, next) {
        try {
            const { email, password, name, type } = req.body;
            // hash the plain password
            const hashPassword = await bcrypt.hash(password, 11);
            const user =  {
                name,
                email,
                password: password,
                type
            }
            // const user = new UserModel(name, email, hashPassword, type);
            console.log("user ==>", user);
            console.log("this ==>", this);
            // const createUser = await UserRepository.signup(user);
            const createUser = await this.userRepository.signup(user);
            console.log("createUser ==>", createUser);
            return res.status(201).send(createUser);
        } catch (error) {
            // res.status(500)
            next(error);
        }
    }
}