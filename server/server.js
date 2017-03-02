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
        if (err.hasOwnProperty('message')) {
            res.status(500).send(err.message)
        } else {
            res.status(500).send(err);
        }

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

app.post('/api/expense', authenticate, function (req, res) {
    var data = _.pick(req.body, ['name', 'amount', 'toWhere', 'installmentAmount']);
    data.date = _c.formatDate(req.body.date);
    data.accountId = req.account._id;

    var expense = new Expense(data);
    expense.save(function (err) {
        finalize(err, expense, res);
    });
});

app.delete('/api/expense/:id', authenticate, function (req, res) {
    var expenseId = req.params.id;

    Expense.findAndDelete(expenseId, req.account).then(() => {
        finalize(null, `Deleted expense with id ${expenseId} .`, res);
    }).catch((e) => {
        finalize(e, null, res);
    });
});

app.post('/api/income', authenticate, function (req, res) {
    var data = _.pick(req.body, ['name', 'amount', 'infinite']);
    data.date = _c.formatDate(req.body.date);
    data.accountId = req.account._id;
    var income = new Income(data);

    income.save(function (err) {
        finalize(err, income, res);
    });
});

app.delete('/api/income/:id', authenticate, function (req, res) {
    var incomeId = req.params.id;
    Income.findAndDelete(incomeId, req.account).then(() => {
        finalize(null, `Deleted income with id ${incomeId}`, res);
    }).catch((e) => {
        finalize(e, null, res);
    });
});

app.post('/api/note/', authenticate, function (req, res) {
    var text = req.body.text;
    var date = _c.formatDate(req.body.date);
    var accountId = req.account._id;
    var note = new Note({
        text,
        date,
        accountId
    });

    note.save(function (err) {
        finalize(err, note, res);
    });
});

app.delete('/api/note/:id', authenticate, function (req, res) {
    var noteId = req.params.id;

    Note.findAndDelete(noteId, req.account).then(() => {
        finalize(null, `Deletd note with id ${noteId} .`, res);
    }).catch((e) => {
        finalize(e, null, res);
    });
});

app.get('/summary/get/:date', authenticate, function (req, res) {
    var requestedDate = req.params.date;
    requestedDate = _c.formatDate(requestedDate);
    _l.log('incoming date is : ' + requestedDate);

    if (requestedDate) {
        var result = new summary(requestedDate, req.account);
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
            }).catch((e) => {
                finalize(e, null, res);
            });
    } else {
        finalize(Error('invalid date format'), 'Invalid date format!', res);
    }
});

app.post('/api/account', function (req, res) {
    var data = _.pick(req.body, ['email', 'password']);
    var account = new Account(data);

    account.save()
        .then(() => {
            return account.generateAuthToken();
        })
        .then((token) => {
            finalize(null, account, res, {
                'x-auth': token
            });
        })
        .catch((e) => {
            finalize(e, null, res, null);
        });
});

app.post('/api/account/login', function (req, res) {
    var email = req.body.email;
    var password = req.body.password;

    Account.findByCredentials(email, password).then((account) => {
        return account.generateAuthToken()
            .then((token) => {
                finalize(null, account, res, {
                    'x-auth': token
                });
            }).catch((e) => {
                finalize(e, null, res, null);
            });
    });
})

app.get('/api/account/me', authenticate, function (req, res) {
    res.send(req.account);
});

app.listen(3000, () => console.log('server started at port 3000'));