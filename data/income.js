var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var incomeSchema = new Schema({
    name: String,
    amount: Number,
});
var Income = mongoose.model('Income', incomeSchema);
module.exports = Income;
