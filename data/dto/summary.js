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

function summary() {

}


summary.prototype.findIncomes = function (date, callback) {
    Income.find()
        .or([{
            date: date
        }, {
            infinite: true
        }])
        .exec(function (err, incomes) {
            var list = [];
            incomes.forEach(function (element) {
                list.push(element.includeVirtuals());
            }, this);
            callback(list);
        });
};

summary.prototype.findPayments = function (date, callback) {
    Payment.find()
        .or([{
            date: date
        }, {
            infinite: true
        }])
        .exec(function (err, payments) {
            var list = [];
            payments.forEach(function (element) {
                list.push(element.includeVirtuals());
            }, this);
            callback(list);
        });
};

summary.prototype.findNotes = function (date, callback) {
    Note.find()
        .where('date', date)
        .exec(function (err, notes) {
            callback(notes);
        })
};

summary.prototype.calculateTotalIncomeAmount = function () {
    var result = 0;
    this.incomes.forEach(function (element) {
        result += element.amount;
    }, this);
    this.totalIncomeAmount = result;
};

summary.prototype.calculateTotalPaymentAmount = function () {
    var result = 0;
    this.payments.forEach(function (element) {
        result += element.amount;
    }, this);
    this.totalPaymentAmount = result;
};

summary.prototype.calculateBalance = function () {
    var result;
    if (this.totalIncomeAmount && this.totalPaymentAmount) {
        result = this.totalIncomeAmount - this.totalPaymentAmount;
    } else {
        if (!this.totalIncomeAmount) {
            result = -1 * this.totalPaymentAmount;
            this.isNegativeBalance = true;
        } else if (!this.totalPaymentAmount) {
            result = this.totalIncomeAmount;
        } else {
            result = 0;
        }
    }
    this.balance = result;
};

summary.prototype.toPrettyMoney = function () {
    this.totalIncomeAmount = _c.prettyMoney(this.totalIncomeAmount);
    this.totalPaymentAmount = _c.prettyMoney(this.calculateTotalPaymentAmount);
    this.balance = _c.prettyMoney(this.balance);
}

module.exports = summary;