const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

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

userSchema.plugin(uniqueValidator); //plugin is a feature provided by mongoose that adds an extra hook to check the schema
//now will get an error when trying to save same emails

module.exports = mongoose.model('User', userSchema);
