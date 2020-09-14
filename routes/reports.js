const express = require('express');
const router = express.Router();
const Orders = require('../models/Orders')
const Items = require('../models/Items')
const productClassess = require('../models/productClassess')
const Products = require('../models/Products')
const Employees = require('../models/Employees')
const Constants = require('../models/Constants');
const { model } = require('../models/Orders');


//welcome page
router.get('/employees', async (req, res) => {
  const query = req.query
  const empArr = []

  if (Object.keys(query).length > 0) {
    const parsedOrder = Orders.find({ deleviryDate: { $gte: query.fromDeleviryDate, $lte: query.toDeleviryDate } }, {
      'deliveryCompany': 1, 'orderCase': 1
      , 'emplRecivedID': 1, 'emplWraperID': 1, 'orderPrice': 1, 'orderDate': 1, 'orderCase.productClass.id': 1, 'orderCase.productKind': 1,
      'orderCase.orderPrepar.id': 1, 'orderCase.orderHelper.id': 1, 'orderCase.price': 1,
    })
      .populate({ path: 'orderCase.productKind.id', model: 'product', select: 'productTask' })
    const empTask = await Constants.findOne()
    //array that has the final groups of employees   
    const ordersData = await parsedOrder
    const emp = await Employees.find()
    emp.map(async (singleEmp, index) => {

      let singleEmpSchema = {
        id: '',
        name: '',
        recivedOrders: {
          orderCount: 0,
          productsCount: 0,
          totalPrice: 0
        },
        wrapingOrders: {
          orderCount: 0,
          productsCount: 0,
          totalPrice: 0
        },
        basicInOrders: {
          orderCount: 0,
          productsCount: 0,
          totalPrice: 0
        },
        helperInOrders: {
          orderCount: 0,
          productsCount: 0,
          totalPrice: 0
        }
      }
      ordersData.map(orderDocument => {
        const id = singleEmp._id
        singleEmpSchema.id = singleEmp._id
        singleEmpSchema.name = singleEmp.employeeName

        //recivedOrders
        if (orderDocument.emplRecivedID == id) {
          let recivedOrders = singleEmpSchema.recivedOrders
          recivedOrders.orderCount++
          recivedOrders.productsCount = recivedOrders.productsCount + orderDocument.orderCase.length
          /// edit plz!
          const currentTotalrecived = (orderDocument.orderCase.length * empTask.recivedTaskOnProduct) + empTask.recivedTaskOnOrder
          recivedOrders.totalPrice = recivedOrders.totalPrice + currentTotalrecived
        }

        //wrapingOrders
        if (orderDocument.emplWraperID == id) {
          let wrapingOrders = singleEmpSchema.wrapingOrders
          wrapingOrders.orderCount++
          wrapingOrders.productsCount = wrapingOrders.productsCount + orderDocument.orderCase.length
          const currentTotalwraping = orderDocument.orderCase.length * empTask.wraperTask
          wrapingOrders.totalPrice = wrapingOrders.totalPrice + currentTotalwraping
        }
        //orderPrepar and orderHelper
        let isOrderPrepar = false
        let isOrderHelper = false
        orderDocument.orderCase.map((product, index) => {
          if (product.orderPrepar.id == id) {
            isOrderPrepar = true
            let basicInOrders = singleEmpSchema.basicInOrders
            const preparTask = product.productKind.id.productTask.basic
            basicInOrders.productsCount++
            basicInOrders.totalPrice = basicInOrders.totalPrice + parseFloat(preparTask)
          }
          if (product.orderHelper.id == id) {
            isOrderHelper = true
            let helperInOrders = singleEmpSchema.helperInOrders
            const helperTask = product.productKind.id.productTask.helper
            helperInOrders.productsCount++
            helperInOrders.totalPrice = helperInOrders.totalPrice + parseFloat(helperTask)
          }
          if (++index >= orderDocument.orderCase.length) {
            if (isOrderPrepar) {
              singleEmpSchema.basicInOrders.orderCount++
              isOrderPrepar = false

            }
            if (isOrderHelper) {
              singleEmpSchema.helperInOrders.orderCount++
              isOrderHelper = false

            }

          }

        })
      })

      empArr.push(singleEmpSchema)
    })
    return res.render('admin/reports/employees', { empArr, dates: query, path: '/reports' })
  }

  empArr.push({ id: 0 })
  res.render('admin/reports/employees', { empArr, dates: query, path: '/reports' })
})





router.get('/sales', async (req, res) => {
  const query = req.query

  if (Object.keys(query).length > 0) {
    let parsedOrder = Orders.find({ deleviryDate: { $gte: query.fromDeleviryDate, $lte: query.toDeleviryDate } }, { orderCase: 1 })
      .populate({ path: 'orderCase.productKind.id', model: 'product' })

    const productsClassess = await productClassess.find()
    const ordersData = await parsedOrder
    const products = await Products.find({}, { id: 1, productName: 1, productClass: 1, productPrice: 1 })
    const item = await Items.find()
    const empTask = await Constants.findOne()
    let productsCount = 0
    let productsCost = 0
    let productsPriceTotal = 0
    let productsEmpTasks = 0
    let totalprofit = 0


    let salesArr = []
    let mergedOrdersCases = []
    ordersData.map(order => {
      mergedOrdersCases = Array.prototype.concat.apply(mergedOrdersCases, order.orderCase)
    })

    //proccess
    productsClassess.map(singleProductClass => {
      const singleProductClassSchema = {
        id: singleProductClass.id,
        className: singleProductClass.className,
        products: []
      }

      //filter product by class to maping orders by this
      let filterdproducts = products.filter(product => product.productClass == singleProductClassSchema.id)

      filterdproducts.map(product => {
        const singleProductSchema = {
          productId: product.id,
          productName: product.productName,
          productCount: 0,
          productCost: 0,
          productPriceTotal: 0,
          productEmpTasks: 0
        }
        //filter data by product
        let foundProduct = mergedOrdersCases.filter(item => item.productKind.id._id == singleProductSchema.productId)

        singleProductSchema.productCount = foundProduct.length
        singleProductSchema.productPriceTotal = foundProduct.length * parseInt(product.productPrice)
        if (foundProduct == false)
          return
        let totalConsumptionElements = 0
        foundProduct[0].productKind.id.consumptionElements.map((elem, index) => {
          const element = item.find(item => item.id == elem.id)
          totalConsumptionElements = totalConsumptionElements + (element.unitPrice * elem.qty)

        })
        let totalEmpTasks = 0
        foundProduct.map(elem => {
          totalEmpTasks = totalEmpTasks + parseFloat(elem.productKind.id.productTask.basic)
            + parseFloat(elem.productKind.id.productTask.helper) + empTask.wraperTask + empTask.recivedTaskOnProduct
        })
        singleProductSchema.productCost = totalConsumptionElements;
        singleProductSchema.productEmpTasks = totalEmpTasks;
        singleProductClassSchema.products.push(singleProductSchema)

      })
      salesArr.push(singleProductClassSchema)

    })
    salesArr.map(item=>{
      item.products.map(product=>{
        productsCount = productsCount + product.productCount
        productsCost = productsCost + product.productCost
        productsPriceTotal = productsPriceTotal + product.productPriceTotal
        productsEmpTasks = productsEmpTasks + product.productEmpTasks

      })
    })
    totalprofit = productsPriceTotal - productsCost - productsEmpTasks


    return res.render('admin/reports/sales', { salesArr, totals:{
      productsCount , productsCost , productsPriceTotal , productsEmpTasks ,  totalprofit
    } , dates: query, path: '/reports' })
  }
  return res.render('admin/reports/sales', { salesArr: [], totals:{} , dates: query, path: '/reports' })

})


module.exports = router 