 var logger = require('./logger');

 var loggerInstance = new logger(0);

 var resultObject;

 function init() {
     resultObject = {};
     loggerInstance.logInfo('object builder started');
     loggerInstance.logInfo(resultObject);
 }

 function add(propName, propValue) {
     loggerInstance.logInfo(`adding ${propName} with value ${propValue}`);
     resultObject[propName] = propValue;
     loggerInstance.logInfo(resultObject);
 }

 function newChildObject(propName) {
     resultObject[propName] = {};
 }

 function finalize() {
     loggerInstance.logInfo('returning result');
     loggerInstance.logInfo(resultObject);
     return resultObject;
 }

 module.exports = {
     init,
     add,
     newChildObject,
     finalize
 };