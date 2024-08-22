import express from 'express';

// add the user controller
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';

const userController = new UserController();

const router = express.Router();


// domainName.com/api/user/login      (req.body)
// router.post('/login', userController.login);
router.post('/login', (req, res) => {
    userController.login(req, res);
});

// router.post('/signup', userController.signup);
router.post('/signup', (req, res, next) => {
    userController.signup(req, res, next)
});

// update password
router.put('/password/update', jwtAuth, (req, res, next) => {
    userController.updatePassword(req, res, next)
});

export default router;