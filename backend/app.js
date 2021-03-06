const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const PostRoutes = require('./routes/posts');
const UserRoutes = require ('./routes/users');
const path = require('path');

const app = express();

mongoose.connect("mongodb+srv://user_1:"+ process.env.MONGO_ATLAS_PW + "@blogtest.kidjf.mongodb.net/node-angular")
  .then(()=>{
    console.log("connected")
  })
  .catch(()=>{
    console.log("connection fail")
  });

app.use(bodyParser.json()); //return a valid middleware to parse json data
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join(__dirname, "images"))); //giving allowance, and pointing using path property from express
app.use("/", express.static(path.join(__dirname, "angular")));

app.use((req, res, next) =>{
  //to allow cross server sharing of info, the following headers are added
  //spelling must be correct
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, PUT, OPTIONS');
  next();
})

app.use('/api/posts', PostRoutes); //nvr use a url same as backend for angular
app.use('/api/users', UserRoutes);
//to forward any path that's not targetting api routes
app.use((req,res,next)=>{
  res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
