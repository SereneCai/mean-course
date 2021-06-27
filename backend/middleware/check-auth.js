const jwt = require("jsonwebtoken");

module.exports = (req, res, next) =>{
  try{
    const token = req.headers.authorization.split(" ")[1]; //because the form is "Bearer (token id)"
    jwt.verify(token, 'secret_should_be_longer');
    next();
  } catch (error){
    res.status(401).json({
      message: "Authentication failed"
    })
  }
}
