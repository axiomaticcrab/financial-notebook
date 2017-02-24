var Income = require('../income');
var Payment = require('../payment');
var Note = require('../note');

var incomes = [];
var payments = [];
var totalIncomeAmount;
var totalPaymentAmount;
var balance;
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
            callback(incomes);
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
            callback(payments);
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
    if (this.totalIncomeAmount && this.totalPaymentAmount) {
        this.balance = this.totalIncomeAmount - this.totalPaymentAmount;
    } else {
        if (!this.totalIncomeAmount) {
            this.balance = -1 * this.totalPaymentAmount;
        } else if (!this.totalPaymentAmount) {
            this.balance = this.totalIncomeAmount;
        } else {
            this.balance = 0;
        }
    }
};

module.exports = summary;