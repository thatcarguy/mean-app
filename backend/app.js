const path = require('path');
const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const app = express();

mongoose.connect("mongodb://dukas:"+process.env.MONGO_ATLAS_PW+"@ds235378.mlab.com:35378/project-express")
.then(()=>{
  console.log('Connected To the Database!');
})
.catch(()=>{
  console.log('Connection to MongoDB FAILEDDD!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
//granting access to the images folder.
app.use("/images", express.static(path.join("images")));

app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods',
  'GET, POST, PATCH, PUT, DELETE, OPTIONS');

  next();
});

//filtering only when path starts with this
app.use('/api/posts',postsRoutes)
app.use('/api/user',userRoutes);

module.exports = app;
