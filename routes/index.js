const express = require('express');
const Orders = require('../models/Orders')
const router = express.Router();

//welcome page
router.get('/' , (req , res)=> {
    let objCount = {}
    Orders.countDocuments({orderStatus:'pending'}).then(count=>{
        objCount.pending = count
        return  Orders.countDocuments({orderStatus:'ready'})
    }).then(count=>{
        objCount.ready = count
        return Orders.countDocuments({orderStatus:'sent'})
    }).then(count=>{
        objCount.sent = count
        return Orders.countDocuments({orderStatus:'recived'})
    }).then(count=>{
        objCount.recived = count
        res.render('index' , {objCount , path:'/'})
    }).catch(err=>console.log(err))
});


module.exports = router ;