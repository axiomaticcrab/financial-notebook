var moment = require('moment');


function common() {

}

common.prototype.isValidDate = function (candidate) {
    var date = moment(candidate, 'MM/YYYY');
    if (date) {
        return true;
    } else {
        return false;
    }
}


module.exports = common;