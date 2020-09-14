const mongoose = require('mongoose');

const newEmployee = new mongoose.Schema({
    employeeName:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model('employees' , newEmployee )