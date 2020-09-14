const mongoose = require('mongoose');

const newdeliveryCompany = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('deliveryCompanies' , newdeliveryCompany)