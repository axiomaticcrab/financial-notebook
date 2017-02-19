var mongoose = require('mongoose');
var common = require('../utils/common');
var logger = require('../utils/logger');

var _c = new common();
var _l = new logger();
_l.init(_l.LogLevels.Info);

var Schema = mongoose.Schema;

var noteSchema = new Schema({
    text: {
        type: String,
        required: '{PATH} is required'
    },
    date: {
        type: String,
        required: '{PATH} is required',
        validate: {
            validator: function (v) {
                return _c.isValidDate(v);
            },
            messsage: 'The given date {VALUE} is not valid! Please send a date string with following format MM/YYYY'
        }
    }
});

noteSchema.post('save', function (doc) {
    _l.logInfo('Note created : ');
    _l.logInfo(doc);
});

noteSchema.post('remove', function (doc) {
    _l.logInfo(`Removed note with id ${doc.id}`);
})

var Note = mongoose.model('note', noteSchema);

module.exports = Note;