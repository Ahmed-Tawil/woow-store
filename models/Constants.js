const mongoose = require('mongoose');

const constant = new mongoose.Schema({
    _id:{
        type:String,
        default:'constant'
    },
    wraperTask:{
        type:Number,
        required:true
    },
    recivedTaskOnOrder:{
        type:Number,
        required:true
    },
    recivedTaskOnProduct:{
        type:Number,
        required:true
    },
    orderNumb:{
        type:Number,
        required:true
    }

})

module.exports = mongoose.model('constants' , constant)