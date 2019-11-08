const express = require('express');
const multer = require('multer');

const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png':'png',
  'image/jpeg':'jpeg',
  'image/jpg':'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid Mime type');
    if(isValid){
      error = null;
    }
    //path is relative to the server.js file
    callback(error, "backend/images");
  },
  filename: (req, file, callback) =>{
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name+'-'+ Date.now()+'.'+ext);
  }
})

//removed path because it's already filtered in app.js
//passing multer as function with storage as argument and saying it expects single image from the body request.
router.post(
  "",
  checkAuth,
  multer({storage:storage}).single("image"),
  (req,res,next)=>{
  const url = req.protocol + '://' + req.get('host'); // constructs url to server
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost =>{
    res.status(201).json({
      message:'Post added successfully',
      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath
      }
    });
  });
});

router.put(
  "/:id",
  checkAuth,
  multer({storage:storage}).single("image"),
  (req,res,next) => {
    let imagePath = req.body.imagePath;
    if(req.file){
      const url = req.protocol + '://' + req.get('host'); // constructs url to server
      imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result => {
      if(result.nModified > 0){
        res.status(200).json({message: "Update successful"});
      }else{
        res.status(401).json({
          message: 'Not Authorized'
        });
      }
    });
});

router.get("", (req, res, next) => {
  //query params come as string so add plus so they convert to numbers
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  //skip skips 10 * currentPage -1, limit pulls only 10
  if(pageSize && currentPage){
    postQuery
      .skip(pageSize*(currentPage-1))
      .limit(pageSize);
  }
  postQuery
    .then(documents =>{
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully",
        posts: fetchedPosts,
        maxPosts: count
      })
    });
});

router.get("/:id", (req,res,next) =>{
  console.log("Hi here");
  Post.findById(req.params.id).then(post =>{
    if(post){
      res.status(200).json(post);
    }else{
      res.status(404).json({message:'Post not found'});
    }
  });
});

router.delete(
  "/:id",
  checkAuth,
  (req,res,next)=>{
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result=>{
    if(result.n > 0){
      res.status(200).json({message: "Post Deleted!"});
    }else{
      res.status(401).json({
        message: 'Not Authorized'
      });
    }
  });
});

module.exports = router;
