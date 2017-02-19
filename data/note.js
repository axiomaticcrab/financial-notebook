var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
    text : String,
    date : String
});

var Note = mongoose.model('note',noteSchema);

module.exports = Note;