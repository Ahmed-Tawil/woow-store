const express = require('express');
const router = express.Router();
const cors = require('cors')
const Products = require('../models/Products')
const Orders = require('../models/Orders')

const productClassess = require('../models/productClassess')
const Items = require('../models/Items')
const Constants = require('../models/Constants')

const { authRole , blockEmp } = require('../helper/auth')

//welcome page
router.get('/', async(req, res) => {

    const products = await Products.find().populate('productClass');
    const constantsData = await Constants.findOne()
    const itemsData = await Items.find()
    const productArr = []
    products.map(singleProduct=>{
        const singleProductSchema = {
            id:0,
            productCost:0
        }
        singleProductSchema.id = singleProduct._id
        singleProductSchema.productCost = parseFloat(singleProduct.productTask.basic) + parseFloat(singleProduct.productTask.helper) +
        + constantsData.recivedTaskOnProduct + constantsData.wraperTask
        let consumptionElementsTotals = 0
        singleProduct.consumptionElements.map(item=>{
            const tempGet = itemsData.filter(found=>item.id == found._id)
            consumptionElementsTotals = consumptionElementsTotals + (item.qty * tempGet[0].unitPrice)
        })
        singleProductSchema.productCost = singleProductSchema.productCost + consumptionElementsTotals
        productArr.push(singleProductSchema)
    })
     res.render('admin/products/products', { data:products , productsCost:productArr, path: '/products' })
   //res.send(productArr)

});
router.get('/getJson', cors(), (req, res) => {

    Products.find({}).then((data) => {
        res.json(data)
    });

});

router.get('/add-product',blockEmp, authRole('admin'), (req, res) => {
    productClassess.find().then(data => {
        return data
    }).then((data) => {
        Items.find().then((items) => {
            res.render('admin/products/add-product', { data, items, path: '/products' })
        })

    })
});

router.get('/add-class',blockEmp, (req, res) => {
    res.render('admin/products/add-product-class', { path: '/products' })
});

router.get('/classess', (req, res) => {
    productClassess.find().then(data => {
        res.render('admin/products/products-classess', { data, path: '/products' })
    })
});
router.post('/edit-class/:id',blockEmp, (req, res) => {
    const id = req.params.id
    const className = req.body.classNameInput
    productClassess.updateOne({ _id: id }, { className: className }).then(() => {
        req.flash('success_msg', 'تم التعديل بنجاح.')
        res.redirect('/products/classess')
    })
});
router.get('/action/:id',blockEmp, async(req, res) => {
    const id = req.params.id
    const query = req.query.action
    switch (query) {
        case 'delete':
            const found = await Orders.findOne({'orderCase.productKind.id':id})
            if(found){
                req.flash('error_msg', 'لا يمكن حذف منتج مستخدم مسبقا!')
                res.redirect('back')
                return
            }
            
            Products.deleteOne({ _id: id }).then(() => {
                req.flash('success_msg', 'تم الحذف بنجاح.')
                res.redirect('back')
            })
            break;
        case 'edit':
            productClassess.find().then((classess) => {
                return classess
            }).then((classess) => {
                Products.findById(id).then((data) => {
                    return data
                }).then((data) => {
                    Items.find().then((items) => {
                        res.render('admin/products/edit-product', { data, classess, items, path: '/products' })
                    })
                })
            })
            break;
        case 'consumptionElements':

            Products.findById(id).then((data) => {
                res.json(data)
            })

            break;

        case 'deleteClass':

            Products.findOne({ 'productClass': id }).then((found) => {
                if (found) {
                    req.flash('error', 'لا يمكن حذف صنف مستخدم في منتجات!')
                    res.redirect('back')
                    return

                }


                productClassess.findByIdAndDelete(id).then(() => {
                    req.flash('success_msg', 'تم حذف الصنف بنجاح')
                    res.redirect('back')
                })

            })


            break;
        case 'editClass':
            productClassess.findById(id).then((data) => {
                res.render('admin/products/edit-product-class', { data, path: '/products' })
            })
            break;
        default:


    }
})



router.post('/add-class',blockEmp, (req, res) => {
    const className = req.body.classNameInput
    const newProductClass = new productClassess({ className: className }).save().then(() => {
        req.flash('success_msg', 'تم الإضافة بنجاح.')

        res.redirect('/products/classess')
    })
});

router.post('/add-product',blockEmp, (req, res) => {
    const { productNameInput, productClass, productPrice, basicEmpPrice, helperEmpPrice } = req.body
    const consumptionElements = JSON.parse(req.body.consumptionElements)
    const schema = {
        productName: productNameInput,
        productClass: productClass,
        productPrice: productPrice,
        productTask: {
            basic: basicEmpPrice,
            helper: helperEmpPrice
        },
        consumptionElements: consumptionElements
    }

    const newProduct = new Products(schema)
    newProduct.save().then((d) => {
        req.flash('success_msg', 'تم الإضافة بنجاح.')
        res.redirect('/products')
    })
});

router.post('/edit-product/:id',blockEmp, (req, res) => {
    const id = req.params.id

    const { productNameInput, productClass, productPrice, basicEmpPrice, helperEmpPrice } = req.body
    const consumptionElements = JSON.parse(req.body.consumptionElements)


    const schema = {
        productName: productNameInput,
        productClass: productClass,
        productPrice: productPrice,
        productTask: {
            basic: basicEmpPrice,
            helper: helperEmpPrice
        },
        consumptionElements: consumptionElements
    }
    Products.updateOne({ _id: id }, schema).then((p) => {
        req.flash('success_msg', 'تم التعديل بنجاح.')
        res.redirect('/products')
    })

});


module.exports = router;