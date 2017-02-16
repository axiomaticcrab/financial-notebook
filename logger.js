function logger(logLevel) {
    this.currentLogLevel = logLevel;
}

function log(msg) {
    console.log(msg);
}

logger.prototype.logInfo = function (msg) {
    if (this.checkIfShouldLog(this.LogLevels.Info)) {
        log('iiiii==>' + convertToJsonIfRequired(msg));
    }
}

logger.prototype.logError = function (msg) {
    if (this.checkIfShouldLog(this.LogLevels.Error)) {
        log('eeeee==>' + convertToJsonIfRequired(msg));
    }
}

logger.prototype.logWarn = function (msg) {
    if (this.checkIfShouldLog(this.LogLevels.Warn)) {
        log('wwwww==>' + convertToJsonIfRequired(msg));
    }
}


logger.prototype.logException = function (msg) {
    if (this.checkIfShouldLog(this.LogLevels.Exception)) {
        log('###############==>' + convertToJsonIfRequired(msg));
    }
}

logger.prototype.LogLevels = {
    None: 9999,
    Info: 1,
    Warn: 2,
    Error: 3,
    Exception: 4
}

logger.prototype.checkIfShouldLog = function (targetLogLevel) {
    if (this.currentLogLevel === 0) {
        return false;
    }

    if (this.currentLogLevel <= targetLogLevel) {
        return true;
    }
    return false;
}

function convertToJsonIfRequired(obj) {
    if (typeof obj === 'object') {
        return JSON.stringify(obj);
    } else {
        return obj;
    }
}

module.exports = logger;