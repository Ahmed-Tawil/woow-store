const mongoose = require('mongoose');

const newUser= new mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }

})

module.exports = mongoose.model('users' , newUser)