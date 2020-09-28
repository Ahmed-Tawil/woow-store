const mongoose = require('mongoose');

const newItem = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    unitPrice: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    },
    minQty: {
        type: Number,
        default:0
    }

})

module.exports = mongoose.model('items', newItem)