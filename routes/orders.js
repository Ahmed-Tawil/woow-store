const express = require('express');
const { json } = require('express');
const Orders = require('../models/Orders')
const Items = require('../models/Items')
const productClassess = require('../models/productClassess')
const Products = require('../models/Products')
const Employees = require('../models/Employees')
const deliveryCompanies = require('../models/deliveryCompanies')
const Constants = require('../models/Constants')
const Addresses = require('../models/Addresses')
const OrderWays = require('../models/OrderWays')
const fs = require('fs-extra')
const cors = require('cors')
const router = express.Router();


router.get('/action/:id', cors(), async (req, res) => {
    const Orderid = req.params.id
    const action = req.query.action
    switch (action) {
        case 'delete':
            const order = await Orders.findById(Orderid)
            if(order.orderStatus == 'recived'){
                await Orders.findByIdAndDelete(Orderid)
                req.flash('success_msg', 'تم الحذف بنجاح.')
                return res.redirect('/orders')
            }
            if (!order) {return res.redirect('back') }
            const productIds = order.orderCase.map(item => item.productKind.id)
            const product = await Products.find({ _id: { $in: productIds } }, { consumptionElements: 1 })
            if (!product) {return res.redirect('back') }
            product.map(async(item, index) => {
                item.consumptionElements.map(async(item, index) => {
                    const id = item.id;
                    const qty = item.qty
                    await Items.updateOne({ _id: id }, { $inc: { "qty": qty } })
                })
                index++
                if (index >= product.length) {
                    await Orders.findByIdAndDelete(Orderid)
                    fs.rmdir(`public/uploads/${Orderid}`, { recursive: true });
                    req.flash('success_msg', 'تم الحذف بنجاح.')
                    res.redirect('/orders')
                }
            });

            break;

        case 'edit':
            req.app.locals.images = []
            const employeesData = await Employees.find()
            const deliveryCompaniesData = await deliveryCompanies.find()
            const productClassessData = await productClassess.find()
            const ProductsData = await Products.find()
            const addressesData = await Addresses.find()
            const OrderWaysData = await OrderWays.find()

            const data = await Orders.findById(Orderid)
            res.render('admin/orders/edit-order', {
                employeesData,
                deliveryCompaniesData,
                productClassessData,
                ProductsData,
                addressesData: addressesData,
                OrderWay:OrderWaysData,
                data: data,
                path:'/orders' 

            })
            break;
        case 'display':
            const dataDisplay = await Orders.findById(Orderid).populate({ path: 'emplRecivedID emplWraperID', model: 'employees' })
                .populate({ path: 'mainUserAddress', model: 'addresses' }).populate({ path: 'deliveryCompany', model: 'deliveryCompanies' })
                .populate({ path: 'orderWay', model: 'OrderWays' })
            //res.json(dataDisplay)
            res.render('admin/orders/display-order', { data: dataDisplay , path:'/orders'} )

            break
        case 'print':
            const dataPrint = await Orders.findById(Orderid).populate({ path: 'emplRecivedID emplWraperID', model: 'employees' })
                .populate({ path: 'mainUserAddress', model: 'addresses' }).populate({ path: 'deliveryCompany', model: 'deliveryCompanies' })
                
            await Orders.updateOne({_id:dataPrint} , {printed:true})    
                
            //res.json(dataDisplay)
            res.render('admin/orders/print-order', { data: dataPrint , path:'/orders'})

            break

        case 'getOrderData':
            const orderCase = await Orders.findOne({ _id: Orderid }, { orderCase: 1, images: 1 })
            res.json(orderCase)

            break;

        default:
            break;
    }
    // back min items from warehouse

});


// get add order
router.get('/add-order', async (req, res) => {

    const employeesData = await Employees.find()
    const deliveryCompaniesData = await deliveryCompanies.find()
    const productClassessData = await productClassess.find()
    const ProductsData = await Products.find()
    const addressesData = await Addresses.find()
    const lastOrderNumb = await Constants.findOne({}, { orderNumb: 1 })
    const OrderWaysData = await OrderWays.find()

    let test;
    try {
        test = lastOrderNumb.orderNumb
    } catch (error) {
        test = 1
        const initializeConstants = new Constants({
            wraperTask: 0.2,
            recivedTask: 0.2,
            orderNumb: 1
        })
        initializeConstants.save()
    }
    req.app.locals.images = []
    res.render('admin/orders/add-order', {
        employeesData,
        deliveryCompaniesData,
        productClassessData,
        ProductsData,
        addressesData: addressesData,
        lastOrderNumb: test,
        OrderWays:OrderWaysData,
        path:'/orders'

    })

});


router.get('/', (req, res) => {
    if (req.query.order == 'date') {
        Orders.find().populate({path:'orderWay' , model:'OrderWays'}).sort({ deleviryDate: 1 }).then(data => {
            res.render('admin/orders/orders', { data , path:'/orders' })
        })
    } else {
        Orders.find().populate({path:'orderWay' , model:'OrderWays'}).then(data => {
            res.render('admin/orders/orders', { data , path:'/orders' })
        })
    }
});
router.get('/pending-orders', (req, res) => {
    if (req.query.order == 'date') {
        Orders.find({ orderStatus: 'pending' }).populate({path:'orderWay' , model:'OrderWays'}).sort({ deleviryDate: 1 }).then(data => {
            res.render('admin/orders/pending-orders', { data , path:'/orders'})
        })
    } else {
        Orders.find({ orderStatus: 'pending' }).populate({path:'orderWay' , model:'OrderWays'}).then(data => {
            res.render('admin/orders/pending-orders', { data , path:'/orders' })
        })
    }
});
router.get('/ready-orders', (req, res) => {
    if (req.query.order == 'date') {
        Orders.find({ orderStatus: 'ready' }).populate({path:'orderWay' , model:'OrderWays'}).sort({ deleviryDate: 1 }).then(data => {
            res.render('admin/orders/ready-orders', { data , path:'/orders'})
        })
    } else {
        Orders.find({ orderStatus: 'ready' }).populate({path:'orderWay' , model:'OrderWays'}).then(data => {
            res.render('admin/orders/ready-orders', { data , path:'/orders'})
        })
    }
});
router.get('/sent-orders', (req, res) => {
    if (req.query.order == 'date') {
        Orders.find({ orderStatus: 'sent' }).populate({path:'orderWay' , model:'OrderWays'}).populate({path:'deliveryCompany' , model:'deliveryCompanies'}).sort({ deleviryDate: 1 }).then(data => {
            res.render('admin/orders/sent-orders', { data , path:'/orders'})
        })
    } else {
        Orders.find({ orderStatus: 'sent' }).populate({path:'orderWay' , model:'OrderWays'}).populate({path:'deliveryCompany' , model:'deliveryCompanies'}).then(data => {
            res.render('admin/orders/sent-orders', { data , path:'/orders'})
        })
    }
});

router.get('/recived-orders', (req, res) => {
    if (req.query.order == 'date') {
        Orders.find({ orderStatus: 'recived' }).populate({path:'orderWay' , model:'OrderWays'}).sort({ deleviryDate: 1 }).then(data => {
            res.render('admin/orders/recived-orders', { data , path:'/orders'})
        })
    } else {
        Orders.find({ orderStatus: 'recived' }).populate({path:'orderWay' , model:'OrderWays'}).then(data => {
            res.render('admin/orders/recived-orders', { data , path:'/orders'})
        })
    }
});

router.get('/exist-user', cors(), async (req, res) => {
    const userMobile = req.query.userMobile

    const data = await Orders.findOne({ userMobile: userMobile }, {
        userName: 1, userSocial: 1, orderWay: 1,
        deliveryCompany: 1, mainUserAddress: 1, secondUserAddress: 1
    }).sort({ _id: -1 })
    res.json(data)

});

router.post('/add-order', async (req, res) => {

    let images = [...req.app.locals.images]
    let parsedBody = { ...req.body, orderCase: JSON.parse(req.body.orderCase) }
    /*
    let temp = parsedBody.userAdress

    temp = parsedBody.orderNotes
    let [forUser, forDelivery] = temp.split(/\r?\n/)
    parsedBody.orderNotes = {
        forUser: forUser || '',
        forDelivery: forDelivery || ''
    }
    */


    let { userNameInput, socialUserNameInput, orderWay
        , userMobile, deliveryCompany, mainUserAddress, secondUserAddress, discount, deleviryDate, orderCase, emplRecivedID, emplWraperID, forDeliveryNotes, forUserNotes } = parsedBody

    const orderNotes = {
        forUser: forUserNotes,
        forDelivery: forDeliveryNotes
    }

    let total = 0
    const deliveryTask = await deliveryCompanies.findById(deliveryCompany)
    let lastOrderNumb = await Constants.findOne({}, { orderNumb: 1 })

    orderCase.map(item => {
        total = total + parseInt(item.price)
    })

    total = total - parseInt(discount) + parseInt(deliveryTask.price)
    let order = new Orders({
        userName: userNameInput,
        userSocial: socialUserNameInput,
        orderWay: orderWay,
        userMobile: userMobile,
        deliveryCompany: deliveryCompany,
        mainUserAddress: mainUserAddress,
        secondUserAddress: secondUserAddress,
        discount: discount,
        deleviryDate: deleviryDate,
        orderCase: orderCase,
        orderNotes: orderNotes,
        emplRecivedID: emplRecivedID,
        emplWraperID: emplWraperID,
        images: images,
        orderNotes: orderNotes,
        orderPrice: total,
        orderNumb: lastOrderNumb.orderNumb
    })
    order.save(async (err) => {
        await Constants.updateOne({ _id: 'constant' }, { $inc: { 'orderNumb': 1 } })

        if (err) {
            console.log(err);
            return
        } //handel err
        // min items from warehouse
        const productIds = order.orderCase.map(item => item.productKind.id)
        const product = await Products.find({ _id: { $in: productIds } }, { consumptionElements: 1 })
        product.map((item, index) => {
            item.consumptionElements.map((item2) => {
                const id = item2.id;
                const qty = item2.qty
                Items.updateOne({ _id: id }, { $inc: { "qty": -qty } }).then((err) => {
                    if (err)
                        console.log(err); //handel err
                })
            })

            if (++index >= product.length) {
                if (images !== false) {
                    images.map(img => {
                        fs.moveSync(`public/uploads/imgs/${img}`, `public/uploads/${order._id}/${img}`)
                    })
                }
                fs.rmdir('public/uploads/imgs', { recursive: true });
                req.app.locals.images = []
                req.flash('success_msg', 'تم إضافة الطلب بنجاح!')
                res.redirect('/orders')
            }
        });
    })

});


router.post('/edit-order/:id', async (req, res) => {
    const id = req.params.id
    const thisOrder = await Orders.findOne({ _id: id }, { images: 1, orderCase:1 , orderStatus:1})
    const orderCasebfrUpdate = thisOrder.orderCase
    const orderImages = thisOrder.images
    const tempImages = req.app.locals.images
    const images = orderImages.concat(tempImages)
    let parsedBody = { ...req.body, orderCase: JSON.parse(req.body.orderCase) }
    /*
    let temp = parsedBody.userAdress

    temp = parsedBody.orderNotes
    let [forUser, forDelivery] = temp.split(/\r?\n/)
    parsedBody.orderNotes = {
        forUser: forUser || '',
        forDelivery: forDelivery || ''
    }
    */
    //file upload

    let { userNameInput, socialUserNameInput, orderWay
        , userMobile, deliveryCompany, mainUserAddress, secondUserAddress, discount, deleviryDate, orderCase, emplRecivedID, emplWraperID, forDeliveryNotes, forUserNotes } = parsedBody
    let total = 0
    const deliveryTask = await deliveryCompanies.findById(deliveryCompany)
    // let lastOrderNumb = await Constants.findOne({}, { orderNumb: 1 })
    const orderNotes = {
        forUser: forUserNotes,
        forDelivery: forDeliveryNotes
    }
    orderCase.map(item => {
        total = total + parseInt(item.price)
    })

    total = total - parseInt(discount) + parseInt(deliveryTask.price)
    let order = {
        userName: userNameInput,
        userSocial: socialUserNameInput,
        orderWay: orderWay,
        userMobile: userMobile,
        deliveryCompany: deliveryCompany,
        mainUserAddress: mainUserAddress,
        secondUserAddress: secondUserAddress,
        discount: discount,
        deleviryDate: deleviryDate,
        orderCase: orderCase,
        orderNotes: orderNotes,
        emplRecivedID: emplRecivedID,
        emplWraperID: emplWraperID,
        images: images,
        orderNotes: orderNotes,
        forDeliveryNotes: forDeliveryNotes,
        forUserNotes: forUserNotes,
        orderPrice: total
        //,
        //orderNumb: lastOrderNumb.orderNumb
    }
    if(thisOrder.orderStatus == 'recived'){
        await Orders.updateOne({ _id: id }, { $set: order })
        req.flash('success_msg', 'تم التعديل بنجاح.')
        return res.redirect('/orders')
    }

    Orders.updateOne({ _id: id }, { $set: order }).then(async (err) => {
        if (err) {
            console.log(err);
        } //handel err

        //back all items to warehouse to update the new
        const oldProductIds = orderCasebfrUpdate.map(item => item.productKind.id)
        const oldProduct = await Products.find({ _id: { $in: oldProductIds } }, { consumptionElements: 1 })
        oldProduct.map((item, index) => {
            item.consumptionElements.map((item2) => {
                const id = item2.id;
                const qty = item2.qty
                Items.updateOne({ _id: id }, { $inc: { "qty": qty } }).then((err) => {
                    if (err)
                        console.log(err); //handel err
                })
            })
        });

        // min new items from warehouse
        const productIds = order.orderCase.map(item => item.productKind.id)
        const product = await Products.find({ _id: { $in: productIds } }, { consumptionElements: 1 })
        product.map((item, index) => {
            item.consumptionElements.map((item2) => {
                const id = item2.id;
                const qty = item2.qty
                Items.updateOne({ _id: id }, { $inc: { "qty": -qty } }).then((err) => {
                    if (err)
                        console.log(err); //handel err
                })
            })

            if (++index >= product.length) {
                if (tempImages !== false) {
                    tempImages.map(img => {
                        fs.moveSync(`public/uploads/imgs/${img}`, `public/uploads/${id}/${img}`)
                    })
                }
                fs.rmdir('public/uploads/imgs', { recursive: true });
                req.app.locals.images = []
                req.flash('success_msg', 'تم تعديل الطلب بنجاح!')
                res.redirect('/orders')
            }
        });
    })


});

router.post('/pending-orders', (req, res) => {
    const { movingItems, movingStage } = req.body
    if (!movingItems) {
        //show errorr
    }
    Orders.updateMany({ _id: { $in: movingItems } }, { orderStatus: movingStage }).then((data) => {
        req.flash('success_msg', 'تم النقل بنجاح.')
        res.redirect('/orders/pending-orders')
    })


});
router.post('/ready-orders', (req, res) => {
    const { movingItems, movingStage } = req.body
    if (!movingItems) {
        //show errorr
    }
    Orders.updateMany({ _id: { $in: movingItems } }, { orderStatus: movingStage }).then((data) => {
        //console.log(data);
        req.flash('success_msg', 'تم النقل بنجاح.')

        res.redirect('/orders/ready-orders')
    })


});

router.post('/sent-orders', (req, res) => {
    const { movingItems, movingStage } = req.body
    if (!movingItems) {
        //show errorr
    }
    Orders.updateMany({ _id: { $in: movingItems } }, { orderStatus: movingStage }).then((data) => {
        req.flash('success_msg', 'تم النقل بنجاح.')
        res.redirect('/orders/sent-orders')
    })


});

router.post('/recived-orders', (req, res) => {
    const { movingItems, movingStage } = req.body
    if (!movingItems) {
        //show errorr
    }
    Orders.updateMany({ _id: { $in: movingItems } }, { orderStatus: movingStage }).then((data) => {
        req.flash('success_msg', 'تم النقل بنجاح.')
        res.redirect('/orders/recived-orders')
    })


});

router.get('/recived', async (req, res) => {
});




module.exports = router;
