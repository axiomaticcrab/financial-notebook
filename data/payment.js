var mongoose = require('mongoose');
var common = require('../utils/common');

var _c = new common();
var Schema = mongoose.Schema;

var paymentSchema = new Schema({
    name: {
        type: String,
        required: '{PATH} is required'
    },
    amount: {
        type: Number,
        required: '{PATH} is required',
        min: [1, 'The value of `{PATH}` needs to be equal or greater than ({MIN}). It is currently ({VALUE})']
    },
    date: {
        type: String,
        required: '{PATH} is required',
        validate: {
            validator: function (v) {
                return _c.isValidDate(v);
            },
            messsage: 'The given date {VALUE} is not valid! Please send a date string with following format MM/YYYY'
        }
    },
    expenseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: '{PATH} is required',
        validate: {
            validator: function (i) {
                //todo : check if the expense is exist.
                return true;
            },
            messsage: 'The given expense id {VALUE} is not exist.'
        }
    }
});

// paymentSchema.pre('save', function (doc) {
//     //todo : check if there are any other payment objects with current expneseId and date.if yes throw an error because that should not possible!
// })

var Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;