const express = require('express');
const deliveryCompanies = require('../models/deliveryCompanies')
const Constants = require('../models/Constants')
const Addreeses = require('../models/Addresses')
const OrderWays = require('../models/OrderWays')

const { authRole } = require('../helper/auth')
const router = express.Router();

//welcome page
router.get('/delivery-companies/action/:id', async (req, res) => {
    const action = req.query.action
    const id = req.params.id
    switch (action) {
        case 'delete':
            await deliveryCompanies.findByIdAndDelete(id)
            req.flash('success_msg', 'تم حذف الشركة بنجاح')
            res.redirect('back')
            break;

        case 'edit':
            const data = await deliveryCompanies.findById(id)
            res.render('admin/constants/edit-deliveryCompany', { data, path: '/constants' })
            break;

        default:
            res.redirect('back')
            break;
    }
});
router.get('/delivery-companies', async (req, res) => {
    const data = await deliveryCompanies.find()
    res.render('admin/constants/deliveryCompanies', { data, path: '/constants' })
});
router.get('/add-delivery-company', async (req, res) => {
    const data = await deliveryCompanies.find()
    res.render('admin/constants/add-deliveryCompany', { data, path: '/constants' })
});

router.get('/employees-tasks', authRole('admin'), async (req, res) => {
    const data = await Constants.findOne()
    res.render('admin/constants/employeesTasks', { data, path: '/constants' })
});

router.get('/addresses', async (req, res) => {
    const data = await Addreeses.find()
    res.render('admin/constants/addresses', { data, path: '/constants' })
});

router.get('/add-address', async (req, res) => {
    const data = await Addreeses.find()
    res.render('admin/constants/add-address', { data, path: '/constants' })
});
router.get('/orderWays', async (req, res) => {
    const data = await OrderWays.find()
    res.render('admin/constants/orderWays', { data, path: '/constants' })
});

router.get('/add-orderWay', async (req, res) => {
    res.render('admin/constants/add-orderWay', { path: '/constants' })
});

router.get('/addresses/action/:id', async (req, res) => {
    const id = req.params.id
    const action = req.query.action
    switch (action) {
        case 'delete':
            await Addreeses.findByIdAndDelete(id)
            req.flash('success_msg', 'تم حذف العنوان بنجاح.')
            res.redirect('back')
            break;

        case 'edit':
            const data = await Addreeses.findById(id)
            res.render('admin/constants/edit-address', { data, path: '/constants' })
            break;

        default:
            res.redirect('back')
            break;
    }
});

router.get('/orderWays/action/:id', async (req, res) => {
    const id = req.params.id
    const action = req.query.action
    switch (action) {
        case 'delete':
             await OrderWays.findByIdAndDelete(id)
            req.flash('success_msg', 'تم الحذف بنجاح.')
            break;

        case 'edit':
            const data = await OrderWays.findById(id)
            res.render('admin/constants/edit-orderWay', { data, path: '/constants' })
            break;

        default:
            res.redirect('back')
            break;
    }
});



router.post('/edit-delivery-company/:id', async (req, res) => {
    const id = req.params.id
    const { companyNameInput, deliveryTask } = req.body
    const update = await deliveryCompanies.updateOne({ _id: id }, { $set: { name: companyNameInput, price: deliveryTask } })
    req.flash('success_msg', 'تم التعديل بنجاح')
    res.redirect('/constants/delivery-companies')
});

router.post('/add-delivery-company', (req, res) => {
    const { companyNameInput, deliveryTask } = req.body
    const newDeliveryCompany = new deliveryCompanies({
        name: companyNameInput,
        price: deliveryTask
    })
    newDeliveryCompany.save(() => {
        req.flash('success_msg', 'تم الإضافة بنجاح.')
        res.redirect('/constants/delivery-companies')
    })
});
router.post('/edit-employees-tasks', authRole('admin'), async (req, res) => {
    const action = req.query.field
    const editTask = req.body.editTask
    switch (action) {
        case 'wraperTask':
            await Constants.updateOne({ _id: 'constant' }, { wraperTask: editTask })

            break;
        case 'recivedTaskOnOrder':
            await Constants.updateOne({ _id: 'constant' }, { recivedTaskOnOrder: editTask })

            break;
        case 'recivedTaskOnProduct':
            await Constants.updateOne({ _id: 'constant' }, { recivedTaskOnProduct: editTask })
            break;

        default:
            res.redirect('back')
            break;
    }
    req.flash('success_msg', 'تم التعديل بنجاح.')

    res.redirect('back')

});
router.post('/add-address', async (req, res) => {
    const address = req.body.address
    const newAddress = new Addreeses({
        address: address
    }).save(()=>{
        req.flash('success_msg', 'تم الإضافة بنجاح.')
        res.redirect('/constants/addresses')
    })
});

router.post('/edit-address/:id', async (req, res) => {
    const address = req.body.address
    const id = req.params.id
    await Addreeses.updateOne({ _id: id }, { address: address })
    req.flash('success_msg', 'تم التعديل بنجاح.')
    res.redirect('/constants/addresses')
});

router.post('/add-orderWay', (req, res) => {
    const orderWay = req.body.orderWay
    const newOrderWay = new OrderWays({
        title: orderWay
    })

    newOrderWay.save(() => {
        req.flash('success_msg', 'تم الإضافة بنجاح.')
        res.redirect('/constants/orderWays')
    })
});

router.post('/edit-orderWay/:id', async (req, res) => {
    const id = req.params.id
    const orderWay = req.body.orderWay
    await OrderWays.updateOne({ _id: id }, { title: orderWay })
    req.flash('success_msg', 'تم التعديل بنجاح.')

    res.redirect('/constants/orderWays')
});


module.exports = router;