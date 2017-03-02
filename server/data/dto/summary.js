var common = require('../../utils/common');
var _c = new common();

var Income = require('../income');
var Payment = require('../payment');
var Note = require('../note');

var incomes = [];
var payments = [];
var totalIncomeAmount;
var totalPaymentAmount;
var balance;
var isNegativeBalance = false;
var notes = [];

var self;
var date;
var accountId;

function summary(date, account) {
    self = this;
    self.date = date;
    self.accountId = account._doc._id;
}


summary.prototype.findIncomes = function () {
    return new Promise(function (resolve, reject) {
        Income.find()
            .or([{
                date: self.date
            }, {
                infinite: true
            }])
            .and({
                accountId: self.accountId
            })
            .exec(function (err, incomes) {
                var list = [];
                incomes.forEach(function (element) {
                    list.push(element.includeVirtuals());
                }, this);
                self.incomes = list;
                resolve();
            });
    });
};

summary.prototype.findPayments = function () {
    return new Promise(function (resolve, reject) {
        Payment.find()
            .or([{
                date: self.date
            }, {
                infinite: true
            }])
            .and({
                accountId: self.accountId
            })
            .exec(function (err, payments) {
                var list = [];
                payments.forEach(function (element) {
                    list.push(element.includeVirtuals());
                }, this);
                self.payments = list;
                resolve();
            });
    });
};

summary.prototype.findNotes = function () {
    return new Promise(function (resolve, reject) {
        Note.find().and({
                date: self.date,
                accountId: self.accountId
            })
            .exec(function (err, notes) {
                self.notes = notes;
                resolve(self);
            })
    });
};

summary.prototype.calculateTotalIncomeAmount = function () {
    var result = 0;
    self.incomes.forEach(function (element) {
        result += element.amount;
    }, this);
    self.totalIncomeAmount = result;
    return self;
};

summary.prototype.calculateTotalPaymentAmount = function () {
    var result = 0;
    self.payments.forEach(function (element) {
        result += element.amount;
    }, this);
    self.totalPaymentAmount = result;
    return self;
};

summary.prototype.calculateBalance = function () {
    var result;
    if (self.totalIncomeAmount && self.totalPaymentAmount) {
        result = self.totalIncomeAmount - self.totalPaymentAmount;
    } else {
        if (!self.totalIncomeAmount) {
            result = -1 * self.totalPaymentAmount;
            self.isNegativeBalance = true;
        } else if (!self.totalPaymentAmount) {
            result = self.totalIncomeAmount;
        } else {
            result = 0;
        }
    }
    self.balance = result;
    return self;
};

summary.prototype.toPrettyMoney = function () {
    self.totalIncomeAmount = _c.prettyMoney(this.totalIncomeAmount);
    self.totalPaymentAmount = _c.prettyMoney(this.totalPaymentAmount);
    self.balance = _c.prettyMoney(this.balance);
    return self;
}

module.exports = summary;