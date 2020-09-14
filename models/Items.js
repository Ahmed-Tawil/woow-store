const mongoose = require('mongoose');

const newItem = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    unitPrice:{
        type:String,
        required:true
    },
    qty:{
        type:Number,
        required:true
    }
})

module.exports = mongoose.model('items' , newItem)