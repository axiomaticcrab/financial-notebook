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

var saveCall = function (res, model) {
    model.save((err) => {
        if (err) {
            loggerInstance.logError(err);
            res.status(500).send(JSON.stringify(err));
        } else {
            loggerInstance.logInfo('object created successfully');
            loggerInstance.logInfo(model);
            res.send(JSON.stringify(model));
        }
    })
}


var Income = require('./data/income');

//todo move this to another module!
var incomeApiMethods = [{
    userFriendlyName: 'Create New Income',
    methodName: '/incomes/create',
    httpRequestType: 'post',
    parameters: [{
        objName: 'name',
        reqName: 'name',
        type: 'value'
    }, {
        objName: 'amount',
        reqName: 'amount',
        type: 'value'
    }],
    execute: function (req, res, next, i = 0) {

        var parameters = incomeApiMethods[0].parameters;
        objectBuilder.init();
        parameters.forEach(function (element) {
            if (element.type === 'value') {
                objectBuilder.add(element.objName, req.body[element.reqName]);
            } else if (element.type === 'object') {
                loggerInstance.logInfo('object builder does not know how to add new child object yet!');
            } else {
                loggerInstance.logException('not know parameter type');
            }
        }, this);

        var incomeData = objectBuilder.finalize();
        var income = new Income(incomeData);
        saveCall(res, income);
    }
}];

incomeApiMethods.forEach(function (element) {

    if (element.httpRequestType === 'get') {
        loggerInstance.logInfo('get is not implemented')
    } else if (element.httpRequestType === 'post') {
        app.post(element.methodName, element.execute);
        loggerInstance.logInfo('Http Method Registered');
        loggerInstance.logInfo(element);
    } else {
        loggerInstance.logInfo('Unknown http method type');
    }
}, this);

app.listen(3000, () => console.log('server started at port 3000'));