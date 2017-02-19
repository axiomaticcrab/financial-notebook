var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var incomeSchema = new Schema({
    name: String,
    amount: Number,
    date: String,
});
var Income = mongoose.model('Income', incomeSchema);
module.exports = Income;