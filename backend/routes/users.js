const express = require ('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post("/signup", (req, res, next)=> {
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
            error: err
          });
        })
    })

});

router.post('/login', (req, res, next) =>{
  User.findOne({email: req.body.email})
    .then(user=>{
        if(!user){
          return res.status(401).json({
            message: "User not found"
          });
        }
       return bcrypt.compare(req.body.password, user.password) //to compare the password between input and db
    })
    .then(result =>{
      if(!result){
        return res.status(401).json({
          message: "Authentication failed"
        });
      }
      const token = jwt.sign({email: user.email, userId: user._id},
        'secret_should_be_longer',
        {expiresIn: "1h"});
      //js object passing, secret key we are use, (optional)expires
    })
    .catch(err =>{
      return res.status(401).json({
        message: "User not found"
      });
    })

})



module.exports = router;
