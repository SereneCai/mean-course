const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./model/post');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://user_1:tester1234@blogtest.kidjf.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(()=>{
    console.log("connected")
  })
  .catch(()=>{
    console.log("connection fail")
  });

app.use(bodyParser.json()); //return a valid middleware to parse json data

app.use((req, res, next) =>{
  //to allow cross server sharing of info, the following headers are added
  //spelling must be correct
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT, OPTIONS');
  next();
})

app.post('/api/posts', (req, res, next) =>{
  const post = new Post({
    title:  req.body.title, //function of body parser
    content: req.body.content
  });
  post.save()
    .then((result)=>{
      res.status(201).json({
        message:"post added successfully",
        postId: result._id //returning this as part of the response
      })
    });
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then((result)=>{
      console.log(result);
      //to get data of posts as json at the browser side
      res.status(200).json({
        message: 'Successful getting of data',
        posts: result
      })
    })

});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result =>{
      console.log(result);
      res.status(200).json({
        message: "Deleted"
      });
    })
})

module.exports = app;
