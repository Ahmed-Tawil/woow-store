const mongoose = require('mongoose')

const classSchema = new  mongoose.Schema({
    className:{
        type:String,
        default:0,
        required:true
    }
})

module.exports = mongoose.model('productClass' , classSchema)