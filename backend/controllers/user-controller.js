const User = require('../model/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = (req, res, next)=> {
  bcrypt.hash(req.body.password, 10 ) //the parameter, saltround
    .then(hash =>{
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result =>{
          res.status(201).json({
            message: "User created successfully",
            result: result
          });
        })
        .catch(err=>{
          res.status(500).json({
            message: "User already exist."
          });
        })
    })
}

exports.userLogin = (req, res, next) =>{
  let fetchedUser;
  User.findOne({email: req.body.email})
    .then(user=>{
      if(!user){
        return res.status(401).json({
          message: "User not found"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password) //to compare the password between input and db
    })
    .then(result =>{
      if(!result){
        return res.status(401).json({
          message: "Authentication failed"
        });
        //return used as we dont want it to continue execution if !result
      }
      //will be executed once the password matches
      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
        process.env.JWT_KEY,
        {expiresIn: "1h"});
      //js object{info from db} which will be used to generate the jwt, secret key/password to create the hash
      // (optional)expiresIn determines how long the token will last
      //for security as the token is stored at the frontend
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      }); //requires no return statement as there is no code after this block if its a successful execution
    })
    .catch(err =>{
      return res.status(401).json({
        message: "User not found."
      });
    })
}
