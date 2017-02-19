var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paymentSchema = new Schema({
    name : String,
    amount : Number,
    date : String,
    expenseId : ObjectId
});

var Payment = mongoose.model('payment',paymentSchema);

module.exports = Payment;