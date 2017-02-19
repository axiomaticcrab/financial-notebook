const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const objectBuilder = require('./utils/objectBuilder');
const logger = require('./utils/logger');

var _l = new logger();
_l.init(_l.LogLevels.Info);

var app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/financial-notebook');


mongoose.connection.on('connected', () => {
    _l.logInfo('db connection established');
});

mongoose.connection.on('error', (err) => {
    _l.logException('db connection error' + err);
});

mongoose.connection.on('disconnected', () => {
    _l.logInfo('db connection is lost!');
});


function finalize(err, obj, res) {
    if (err) {
        _l.logException(err);
        res.status(500).send(JSON.stringify(err))
    } else {
        res.send(obj);
    }
}

var Income = require('./data/income');
var Expense = require('./data/expense');
var Note = require('./data/note');

app.post('/expense/add', function (req, res) {
    var name = req.body.name;
    var date = req.body.date;
    var amount = req.body.amount;
    var toWhere = req.body.toWhere;
    var installmentAmount = req.body.installmentAmount;

    var expense = new Expense({
        name,
        date,
        amount,
        toWhere,
        installmentAmount
    });

    expense.save(function (err) {
        finalize(err, expense, res);
    });
});

app.get('/expense/remove/:id', function (req, res) {
    var expenseId = req.params.id;
    Expense.findById(expenseId, function (err, expense) {
        if (err) {
            finalize(err, null, res);
        } else {
            if (expense) {
                expense.remove(function (err) {
                    if (err) {
                        finalize(err, null, res);
                    } else {
                        finalize(null, `Deleted expense with id ${expenseId}`, res);
                    }
                });
            } else {
                finalize(null, 'There is nothing to remove', res);
            }
        }
    });
});

app.post('/income/add', function (req, res) {
    var name = req.body.name;
    var amount = req.body.amount;
    var date = req.body.date;
    var infinite = req.body.infinite;

    var income = new Income({
        name,
        amount,
        date,
        infinite
    });

    income.save(function (err) {
        finalize(err, income, res);
    });
});

app.get('/income/remove/:id', function (req, res) {
    var incomeId = req.params.id;
    Income.findById(incomeId, function (err, income) {
        if (err) {
            finalize(err, null, res);
        } else {
            if (income) {
                income.remove(function (err) {
                    if (err) {
                        finalize(err, null, res);
                    } else {
                        finalize(null, `Removed income with id ${incomeId}`, res);
                    }
                });
            } else {
                finalize(null, `There is no income with id ${incomeId} to remove.`, res);
            }
        }
    })
});

app.post('/note/add', function (req, res) {
    finalize(null, 'add note', res);
});

app.get('/note/remove/:id', function (req, res) {
    finalize(null, 'remove note with id ' + req.params.id, res);
});

app.get('/balance/get/:date', function (req, res) {
    finalize(null, 'get balance for date : ' + req.params.date, res);
});

app.listen(3000, () => console.log('server started at port 3000'));