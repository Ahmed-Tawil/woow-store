const express = require('express');
const router = express.Router();
const Warehouse = require('../models/Items')
const Products = require('../models/Products')

router.get('/add-item', (req, res) => {
    res.render('admin/warehouse/addToWarehouse' ,   {path:'/warehouse'})
});
router.post('/plus-item', async (req, res) => {
    const id = req.query.id
    const qty = parseFloat(req.body.qty) || 0
    await Warehouse.updateOne({_id:id} , {$inc:{qty:qty}})
    req.flash('success_msg', 'تم التعديل بنجاح.')
    res.redirect('/warehouse')
});


router.get('/action/:id', async(req, res) => {

    const id = req.params.id
    const query = req.query.action
    switch (query) {
        case 'delete':
            const found = await Products.findOne({'consumptionElements.id':id})
            if(found){
                req.flash('error_msg', 'لا يمكن حذف عنصر مستخدم مسبقا!')
                res.redirect('back')
                return
            }
            Warehouse.deleteOne({ _id: id }).then(() => {
                req.flash('success_msg', 'تم الحذف بنجاح.')
                res.redirect('back')
            })
        break;

        case 'edit':
            Warehouse.findById(id).then(data=>{
               res.render('admin/warehouse/editToWarehouse' , {data , path:'/warehouse'})
            })
        break
    }
});
router.get('/', (req, res) => {
    Warehouse.find({}).then((data) => {
        res.render('admin/warehouse/warehouse', { data , path:'/warehouse' })
    })
});

router.post('/add-item', (req, res) => {
    const { itemNameInput, itemQty, itemMinQty , unitPrice } = req.body
    const newItem = new Warehouse({
        name: itemNameInput,
        unitPrice: unitPrice,
        qty: itemQty,
        minQty:itemMinQty
    })
    newItem.save(() => {
        req.flash('success_msg', 'تم الإضافة بنجاح.')
        res.redirect('/warehouse')

    })
});
router.post('/edit-item/:id', (req, res) => {
    const id = req.params.id
    const { itemNameInput, itemQty, itemMinQty, unitPrice } = req.body
    Warehouse.updateOne({_id:id} , {
        name: itemNameInput,
        unitPrice: unitPrice,
        qty: itemQty,
        minQty:itemMinQty
    }).then(()=>{
        req.flash('success_msg', 'تم التعديل بنجاح.')
        res.redirect('/warehouse')
    })
});




module.exports = router;