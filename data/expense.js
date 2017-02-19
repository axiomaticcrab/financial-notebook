var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var expenseSchema = new Schema({
    name: String,
    date: String,
    amount: Number,
    toWhere: String,
    installmentAmount: Number
});

var Expense = mongoose.model('expense', expenseSchema);
module.exports = Expense;