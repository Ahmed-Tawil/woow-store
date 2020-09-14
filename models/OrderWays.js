const mongoose = require('mongoose');

const newOrderWay = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model('OrderWays' , newOrderWay )