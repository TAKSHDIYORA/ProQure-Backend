const mongoose = require('mongoose');
const dotenv = require('dotenv');

const connectToDB = ()=>{
    return mongoose.connect(process.env.MONGO_URI);
}

module.exports = connectToDB;