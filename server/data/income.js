var mongoose = require('mongoose');
var numeral = require('numeral');
var common = require('../utils/common');
var logger = require('../utils/logger');

var _l = new logger();
_l.init(_l.LogLevels.Info);

var _c = new common();
var Schema = mongoose.Schema;

var incomeSchema = new Schema({
    name: {
        type: String,
        required: '{PATH} is required',
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
            validator: function (date) {
                return _c.isValidDate(date);
            },
            messsage: 'The given date {VALUE} is not valid! Please send a date string with following format MM/YYYY'
        }
    },
    infinite: {
        type: Boolean,
        required: false,
        default: false
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: '{PATH} is required.'
    }
});

incomeSchema.post('save', function (doc) {
    _l.logInfo('Income created.');
    _l.logInfo(doc);
});

incomeSchema.statics.findAndDelete = function (incomeId, account) {
    return new Promise(function (resolve, reject) {
        Income.findById(incomeId).then((income) => {
            if (income) {
                resolve(income.delete(account));
            } else {
                reject(`There is no income with id ${incomeId} to remove.`);
            }
        }).catch(function (e) {
            reject(e);
        });
    });
}

incomeSchema.methods.delete = function (account) {
    var income = this;
    return new Promise(function (resolve, reject) {
        if (account._doc._id.equals(income._doc.accountId) === false) {
            reject(new Error('This account can not remove this income'), null);
        } else {
            resolve(income.remove());
        }
    });
};


incomeSchema.post('remove', function (doc) {
    _l.logInfo(`Removed income with id ${doc.id}`);
});

//Calculated Property
incomeSchema.virtual('prettyMoney').get(function () {
    return _c.prettyMoney(this.amount);
});

//Instance function
incomeSchema.methods.includeVirtuals = function () {
    return this.toJSON({
        virtuals: true
    });
}

var Income = mongoose.model('Income', incomeSchema);

module.exports = Income;