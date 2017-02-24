var moment = require('moment');
var numeral = require('numeral');

numeral.register('locale', 'tr', {
    delimiters: {
        thousands: '.',
        decimal: ','
    },
    abbreviations: {
        thousand: 'b',
        million: 'm',
        billion: 'b',
        trillion: 't'
    },
    ordinal: function (number) {
        return '';
    },
    currency: {
        symbol: '₺'
    }
});

function common() {
    numeral.locale('tr');
}

common.prototype.formatDate = function (targetString) {
    if (this.isValidDate(targetString)) {
        return moment(targetString, 'MM/YYYY').format('MM/YYYY');
    } else {
        return null;
    }
}

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

common.prototype.prettyMoney = function (uglyMoney) {
    return numeral(uglyMoney).format('$ 0,0[.]00');
}

module.exports = common;