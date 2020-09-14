const mongoose = require('mongoose');

const newAddress = new mongoose.Schema({
    address:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model('addresses' , newAddress )