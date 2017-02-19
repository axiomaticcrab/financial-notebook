const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const objectBuilder = require('./utils/objectBuilder');
const logger = require('./utils/logger');

var loggerInstance = new logger(1);

var app = express();
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/financial-notebook');


mongoose.connection.on('connected', () => {
    loggerInstance.logInfo('db connection established');
});

mongoose.connection.on('error', (err) => {
    loggerInstance.logException('db connection error' + err);
});

mongoose.connection.on('disconnected', () => {
    loggerInstance.logInfo('db connection is lost!');
});


function finalize(err, obj, res) {
    if (err) {
        loggerInstance.logException(err);
        res.status(500).send(JSON.stringify(err))
    } else {
        res.send(obj);
    }
}

var Income = require('./data/income');
var Expense = require('./data/expense');
var Note = require('./data/note');

app.post('/expense/add', function (req, res) {
    finalize(null, 'add expense', res);
});

app.get('/expense/remove/:id', function (req, res) {
    finalize(null, 'remove expense with id ' + req.params.id, res);
});

app.post('/income/add', function (req, res) {
    finalize(null, 'add income', res);
});

app.get('/income/remove/:id', function (req, res) {
    finalize(null, 'remove income with id ' + req.params.id, res);
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