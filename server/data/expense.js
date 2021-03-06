var mongoose = require('mongoose');
var common = require('../utils/common');
var logger = require('../utils/logger');
var Payment = require('./payment');

var _l = new logger();
_l.init(_l.LogLevels.Info);

var _c = new common();

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
            validator: function (date) {
                return _c.isValidDate(date);
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
    installmentAmount: { //the number of payment(s) needs to be created for this expense.
        type: Number,
        required: '{PATH} is required',
        min: [-1, 'The value of `{PATH}` needs to be equal or greater than ({MIN}). It is currently ({VALUE})']
    },
    infinite: {
        type: Boolean,
        required: '{PATH} is required',
        default: false
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: '{PATH} is require.'
    }
});


expenseSchema.statics.findAndDelete = function (expenseId, account) {
    return new Promise(function (resolve, reject) {
        Expense.findById(expenseId).then((expense) => {
            if (expense) {
                resolve(expense.delete(account));
            } else {
                reject(`There is no expense with id ${expenseId}`);
            }
        }).catch((e) => {
            reject(e);
        })
    });
}

expenseSchema.methods.delete = function (account) {
    var expense = this;
    return new Promise(function (resolve, reject) {
        if (account._doc._id.equals(expense._doc.accountId) === false) {
            reject(`This account can not delete given expense.`);
        } else {
            resolve(expense.remove());
        }
    });
}

//we need to create relevant payment object(s) after expense object has created.
expenseSchema.post('save', function (doc) {
    if (doc.installmentAmount === 0) {
        doc.createPayment(doc.accountId, doc.createPaymentName(doc.toWhere, doc.name), doc.amount, doc.date, doc.id);
    } else if (doc.installmentAmount > 0) {
        var date = doc.date;
        for (i = 0; i < doc.installmentAmount; i++) {
            var order = i + 1;
            doc.createPayment(doc.accountId, doc.createPaymentName(doc.toWhere, doc.name, doc.installmentAmount, order, false), doc.amount, date, doc.id);
            date = _c.getNextMonth(date);
        }
    } else if (doc.installmentAmount === -1) {
        doc.installmentAmount = 0;
        doc.infinite = true;
        doc.createPayment(doc.accountId, doc.createPaymentName(doc.toWhere, doc.name), doc.amount, doc.date, doc.id, doc.infinite);
    }
    _l.logInfo('expense created : ')
    _l.logInfo(doc);
});


expenseSchema.post('remove', function (doc) {
    _l.logInfo(`Removed expense with id ${doc.id}`);
    return Expense.deletePayments(doc.id);
});

//delete relevant payment objects.
expenseSchema.statics.deletePayments = function (expenseId) {
    Payment.find({
        expenseId: expenseId
    }, function (err, payments) {
        payments.forEach(function (element) {
            element.remove(function (err) {
                if (err) throw err;
            });
        }, this);
    });
}

expenseSchema.methods.createPayment = function (accountId, name, amount, date, expenseId, infinite) {
    var payment = new Payment({
        name,
        amount,
        date,
        expenseId,
        infinite,
        accountId
    });
    payment.save(function (err) {
        if (err) {
            throw err;
        } else {
            return payment
        };
    });
};

expenseSchema.methods.createPaymentName = function (toWhere, expenseName, installmentAmount, installmentOrder, infinite) {
    var result = `${toWhere} - ${expenseName}`;

    if (installmentAmount && installmentAmount > 0) {
        result += ` (${installmentOrder} / ${installmentAmount})`;
    } else if (infinite) {
        result += ' -Infinite';
    }
    return result;
}

var Expense = mongoose.model('expense', expenseSchema);

module.exports = Expense;