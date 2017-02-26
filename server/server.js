const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const numeral = require('numeral');

const logger = require('./utils/logger');
const common = require('./utils/common');
const summary = require('./data/dto/summary');
const _ = require('lodash');
const authenticate = require('./middleware/authenticate');

mongoose.Promise = global.Promise;

var _c = new common();

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


function finalize(err, obj, res, header) {
    if (err) {
        _l.logException(err);
        res.status(500).send(err.message)
    } else {
        if (header) {
            res.header(header).send(obj);
        } else {
            res.send(obj);
        }

    }
}

var Income = require('./data/income');
var Expense = require('./data/expense');
var Note = require('./data/note');
var Account = require('./data/account');

app.post('/expense/add', function (req, res) {
    var data = _.pick(req.body, ['name', 'amount', 'toWhere', 'installmentAmount']);
    data.date = _c.formatDate(req.body.date);
    var expense = new Expense(data);

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
                        finalize(null, `Deleted expense with id ${expenseId} .`, res);
                    }
                });
            } else {
                finalize(null, `There is no expense with id ${expenseId} to remove.`, res);
            }
        }
    });
});

app.post('/income/add', function (req, res) {
    var data = _.pick(req.body, ['name', 'amount', 'infinite']);
    data.date = _c.formatDate(req.body.date);
    var income = new Income(data);

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
                        finalize(null, `Removed income with id ${incomeId} .`, res);
                    }
                });
            } else {
                finalize(null, `There is no income with id ${incomeId} to remove.`, res);
            }
        }
    })
});

app.post('/note/add', function (req, res) {
    var text = req.body.text;
    var date = _c.formatDate(req.body.date);
    var note = new Note({
        text,
        date
    });

    note.save(function (err) {
        finalize(err, note, res);
    });
});

app.get('/note/remove/:id', function (req, res) {
    var noteId = req.params.id;

    Note.findById(noteId, function (err, note) {
        if (err) {
            finalize(err, null, res);
        } else {
            if (note) {
                note.remove(function (err) {
                    if (err) {
                        finalize(err, null, res);
                    } else {
                        finalize(err, `Removed note with id ${noteId} .`, res);
                    }
                });
            } else {
                finalize(null, `There is no note with id ${noteId} to remove.`, res);
            }
        }
    });
});

app.get('/summary/get/:date', function (req, res) {
    var requestedDate = req.params.date;
    requestedDate = _c.formatDate(requestedDate);
    _l.log('incoming date is : ' + requestedDate);

    if (requestedDate) {
        var result = new summary(requestedDate);
        result
            .findIncomes()
            .then(() => result.findPayments())
            .then(() => result.findNotes())
            .then((result) => {
                result
                    .calculateTotalIncomeAmount()
                    .calculateTotalPaymentAmount()
                    .calculateBalance()
                    .toPrettyMoney();
                finalize(null, result, res)
            });
    } else {
        finalize(Error('invalid date format'), 'Invalid date format!', res);
    }
});

app.post('/api/accounts', function (req, res) {
    var data = _.pick(req.body, ['email', 'password']);
    var account = new Account(data);

    account.save()
        .then(() => {
            return account.generateAuthToken();
        })
        .then((token) => {
            finalize(null, _.pick(account, ['email', '_id']), res, {
                'x-auth': token
            });
        })
        .catch((e) => {
            finalize(e, null, res, null);
        });
});

app.get('/api/accounts/me', authenticate, function (req, res) {
    res.send('Hola!');
});

app.listen(3000, () => console.log('server started at port 3000'));