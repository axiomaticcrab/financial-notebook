var mongoose = require('mongoose');
var numeral = require('numeral');
var common = require('../utils/common');
var logger = require('../utils/logger');

var _l = new logger();
_l.init(_l.LogLevels.Info);

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
    },
    infinite: {
        type: Boolean,
        required: '{PATH} is required',
        default: false
    }
});

// paymentSchema.pre('save', function (doc) {
//     //todo : check if there are any other payment objects with current expneseId and date.if yes throw an error because that should not be possible!
// })

paymentSchema.post('save', function (doc) {
    _l.logInfo('payment created : ');
    _l.logInfo(doc);
});

paymentSchema.post('remove', function (doc) {
    _l.logInfo(`Removed payment with id ${doc.id}`);
});

paymentSchema.virtual('prettyMoney').get(function () {
    return _c.prettyMoney(this.amount);
});

paymentSchema.methods.includeVirtuals = function () {
    return this.toJSON({
        virtuals: true
    });
}

var Payment = mongoose.model('payment', paymentSchema);

module.exports = Payment;