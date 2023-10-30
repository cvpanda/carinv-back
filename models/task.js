let mongoose = require('mongoose')

let task = mongoose.Schema({
    name: {
        type: String,
        default: 'Dealer',
        index: true
    },
    car_id: {
        type: mongoose.Schema.Types.ObjectId,
        refs: 'car'
    }
}, { timestamps: true })

module.exports = mongoose.model("task", task)