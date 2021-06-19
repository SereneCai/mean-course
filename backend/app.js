const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./model/post');

const app = express();

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
    content: req.body.content,
  });

  console.log(post);
  res.status(201).json({
    message:"post added successfully"
  })
});

app.get('/api/posts', (req, res, next) => {
  const posts =[
    {
      id: 'asd1234',
      title: 'test1',
      content: 'testing text one'
    },
    {
      id: '4321asd',
      title: 'test2',
      content: 'testing text two two'
    },
  ];

  //to get data of posts as json at the browser side
  res.status(200).json({
    message: 'hi it worked.',
    posts: posts
  })
});

module.exports = app;
