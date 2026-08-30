const mongoose = require('mongoose');

const userSchema = {
    "userId" : Number,
    "name" : String,
    "age"  : Number
}
 
const UserModel =  mongoose.model('user',userSchema);
module.exports = UserModel;