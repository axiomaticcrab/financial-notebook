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
    },
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        required: '{PATH} is required'
    }
});

noteSchema.statics.findAndDelete = function (noteId, account) {
    return new Promise(function (resolve, reject) {
        Note.findById(noteId).then((note) => {
            if (note) {
                resolve(note.delete(account));
            } else {
                reject(`There is no Note with id ${noteId}`);
            }
        }).catch((e) => {
            reject(e);
        })
    });
}

noteSchema.methods.delete = function (account) {
    var note = this;
    return new Promise(function (resolve, reject) {
        if (account._doc._id.equals(note._doc.accountId) === false) {
            reject('This user can not delete this note.')
        } else {
            resolve(note.remove());
        }
    });
}

noteSchema.post('save', function (doc) {
    _l.logInfo('Note created : ');
    _l.logInfo(doc);
});

noteSchema.post('remove', function (doc) {
    _l.logInfo(`Removed note with id ${doc.id}`);
})

var Note = mongoose.model('note', noteSchema);

module.exports = Note;