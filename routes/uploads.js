var express = require('express');
var router = express.Router();
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const Orders = require('../models/Orders')
/* GET home page. */

router.delete('/',  function (req, res, next) {
  let action = req.query.action
  let file = req.body.file
  let path
  switch (action) {
    case 'dltNew':      
       path = `public/uploads/imgs/${file}`
      fs.unlink(path, (err) => {
        if (err){
          res.status(500).end()
        }
        let tempArr = req.app.locals.images.filter(img=> img !== file)
        req.app.locals.images = tempArr
        res.status(200).end()

      })

      break;
    case 'dltExist':
       path = `public${file}`
      fs.unlink(path, async(err) => {
        if (err){
          res.status(500).end()
          return
        }
        const tempData = file.split('/')
        const orderId = tempData[2]
        const fileName = tempData[3]
        const orderImages = await Orders.findOne({_id:orderId} , {images:1})
        const tempArr = orderImages.images.filter(img=>img !== fileName )
        await Orders.updateOne({_id:orderId} , {images:tempArr})
        res.status(200).end()
      })
      break;

  }

});
//let temp = uniqueSuffix

router.post('/', function (req, res, next) {
  let fileName = ''
  var storage = multer.diskStorage({
    destination: `./public/uploads/imgs/`,
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const temp = uniqueSuffix + path.extname(file.originalname)
      fileName = temp
      cb(null, temp)

    }
   
  })

  var upload = multer({ storage: storage 
  }).single('photos')

  upload(req, res, (err) => { 
    if (err)
      res.status(500).send()
    req.app.locals.images.push(fileName)
    res.status(200).send(fileName)
  })

});



module.exports = router;
