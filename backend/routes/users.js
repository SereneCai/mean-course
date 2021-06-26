const express = require ('express');
const router = express.Router();
const User = require('../model/user');
const bcrypt = require('bcrypt');

router.post("/signup", (req, res, next)=> {
  bcrypt.hash(req.body.password, 10 ) //the parameter, saltround
    .then(hash =>{
      const user = new User({
        email: req.body.email,
        password: req.body.password
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





module.exports = router;
