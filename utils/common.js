var moment = require('moment');

function common() {}

common.prototype.isValidDate = function (candidate) {
    //todo : since moment will accept '5' like strings , I need to check if the given candidate is mm/yyyy format.
    return moment(candidate, 'MM/YYYY').isValid();
}

common.prototype.getNextMonth = function (dateString) {
    var currentDate = moment(dateString, 'MM/YYYY');
    if (currentDate.isValid()) {
        return currentDate.add(1, 'M').format('MM/YYYY');
    } else return null;
}

module.exports = common;