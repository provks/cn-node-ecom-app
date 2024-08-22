import express from 'express';

// add the like controller
import LikeController from './like.controller.js';

const likeController = new LikeController();

const router = express.Router();


// router.post('/like', likeController.addLike); (req.body)
router.post('/', (req, res) => {
    likeController.addLike(req, res);
});

// get likes
router.get('/', (req, res) => {
    likeController.getLikes(req, res);
});


export default router;