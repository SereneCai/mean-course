const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, //not here for validation of user. more for mongodb and mongoose performance optimization
  },
  password:{
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('User', userSchema);
