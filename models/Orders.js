const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    orderNumb:{
        type:Number,
        default:1
    },
    userSocial:{
        type:String,
        required:true
    },
    orderWay:{
        type:String,
        required:true,
        ref:'OrderWays'
    },
    userMobile:{
        type:String,
    },
    mainUserAddress:{
        type:String,
        required:true,
        ref:'addresses'
     },
     secondUserAddress:{
        type:String,
        required:true
     },

 
    orderPrice:{
        type:Number,
        required:true
    },
    deleviryDate:{
        type:String,
        required:true
    },
    deliveryCompany:{
        type:String,
        ref:'deliveryCompanies'

    },
    orderCase:[
        {
            productClass:{
            },
            productKind:{  
                id:{
                    type:String,
                    rel:'product'       
                },
                title:{
                    type:String
                } 
            },
            orderDetails:{
            },
            orderPrepar:{
            },
            orderHelper:{
            }
            ,price:{

            }
            
        }
    ]
    ,discount:{
        type:Number
    },
    emplRecivedID:{
        type:String,
        ref:'employees',
        required:true,
    },
    emplWraperID:{
        type:String,
        ref:'employees',
        required:true,
    },
    orderNotes:{

        forUser:{
         type:String,
        },
        forDelivery:{
         type:String
        }
    
    },images:{
        type:Array
    },
    orderStatus:{
        type:String,
        default:'pending'
    },
    orderDate:{
        type:Date,
        default:Date.now()
    },printed:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('orders' , orderSchema)