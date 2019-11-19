const express = require('express');


const PostController = require('../controllers/post');

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const router = express.Router();



//removed path because it's already filtered in app.js
//passing multer as function with storage as argument and saying it expects single image from the body request.
//pass the controller method by reference not with parenthesis.

router.post("",checkAuth,extractFile,PostController.createPost);

router.put("/:id",checkAuth,extractFile, PostController.updatePost);

router.get("", PostController.getPost);

router.get("/:id", PostController.getPostById);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
