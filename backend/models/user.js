const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
//Data schema defined
const userSchema = mongoose.Schema({
  email: {type: String, required: true, unique:true},
  password: {type: String, required: true}
});

//adding a plugin to schema
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);



