const express = require('express');
const router = express.Router();
const Employees = require('../models/Employees')
//welcome page
//router.get('/' , (req , res)=> res.render('index'));

router.get('/add-employee', (req, res) => {
    res.render('admin/employees/add-employee')
});
router.get('/', (req, res) => {
    Employees.find().then(data => {
        res.render('admin/employees/employees', { data, path: '/employees' })
    })
});
router.get('/action/:id', (req, res) => {

    const id = req.params.id
    const query = req.query.action
    switch (query) {
        case 'delete':
            Employees.deleteOne({ _id: id }).then(() => {
                req.flash('success_msg', 'تم الحذف بنجاح.')
                res.redirect('back')
            })
            break;
        case 'edit':
            Employees.findById(id).then((data) => {
                res.render('admin/employees/edit-employee', { data, path: '/employees' })
            })
            break;

        default:


    }
});
router.post('/add-employee', (req, res) => {
    const employeeName = req.body.employeeNameInput
    const newEmployee = new Employees({
        employeeName: employeeName
    }).save(() => {
        req.flash('success_msg', 'تم الإضافة بنجاح.')
        res.redirect('/employees')
    })
});
router.post('/edit-employee/:id', (req, res) => {
    const id = req.params.id
    const employeeName = req.body.employeeName
    Employees.updateOne({ _id: id }, { employeeName: employeeName }).then(() => {
        req.flash('success_msg', 'تم التعديل بنجاح.')
        res.redirect('/employees')
    })
});


module.exports = router;