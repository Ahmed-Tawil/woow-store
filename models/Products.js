const mongoose = require('mongoose')

const productSchema = new  mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    productClass:{
        type:String,
        default: mongoose.Types.ObjectId,
        ref:'productClass',
    },
    productPrice:{
        type:String,
        required:true
    },
    productTask:{
        basic:{
            type:String, 
        },
        helper:{
            type:String
        }
    },
    consumptionElements:{
        type:Array,
        ref:'items'
    }
    
})

module.exports = mongoose.model('product' , productSchema)