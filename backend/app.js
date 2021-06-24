const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PostRoutes = require('./routes/posts');
const path = require('path');

const app = express();

mongoose.connect('mongodb+srv://user_1:tester1234@blogtest.kidjf.mongodb.net/node-angular?retryWrites=true&w=majority')
  .then(()=>{
    console.log("connected")
  })
  .catch(()=>{
    console.log("connection fail")
  });

app.use(bodyParser.json()); //return a valid middleware to parse json data
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images"))); //giving allowance, and pointing using path property from express

app.use((req, res, next) =>{
  //to allow cross server sharing of info, the following headers are added
  //spelling must be correct
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, PUT, OPTIONS');
  next();
})

app.use('/api/posts', PostRoutes);

module.exports = app;
