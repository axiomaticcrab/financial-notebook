var mongoose = require('mongoose');
var common = require('../utils/common');
commonInstance = new common();

var Schema = mongoose.Schema;

var expenseSchema = new Schema({
    name: {
        type: String,
        required: '{PATH} is required'
    },
    date: {
        type: String,
        required: '{PATH is required}',
        validate: {
            validator: function (v) {
                return commonInstance.isValidDate(v);
            },
            messsage: 'The given date {VALUE} is not valid! Please send a date string with following format MM/YYYY'
        }
    },
    amount: {
        type: Number,
        required: '{PATH} is required',
        min: [1, 'The value of `{PATH}` needs to be equal or greater than ({MIN}). It is currently ({VALUE})']
    },
    toWhere: {
        type: String,
        required: '{PATH} is required for remembering what is this expense for!'
    },
    installmentAmount: {
        type: Number,
        required: '{PATH} is required',
        min: [0, 'The value of `{PATH}` needs to be equal or greater than ({MIN}). It is currently ({VALUE})']
    }
});

var Expense = mongoose.model('expense', expenseSchema);
module.exports = Expense;