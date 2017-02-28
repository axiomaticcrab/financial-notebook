var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');

var Schema = mongoose.Schema;

var accountSchema = new Schema({
    email: {
        type: String,
        required: '{PATH} is required',
        unique: true,
        trim: true,
        minlenght: 1,
        validate: {
            validator: function (value) {
                return validator.isEmail(value);
            },
            message: 'The given {VALUE} is not a valid email adress.'
        }
    },
    password: {
        type: String,
        require: '{PATH} is required.',
        minlenght: 6,
    },
    tokens: [{
        access: {
            type: String,
            require: '{PATH} is required.'
        },
        token: {
            type: String,
            require: '{PATH} is required.'
        },
    }]
});

accountSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';

    var token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'secret');

    user.tokens.push({
        access,
        token,
    });

    return user.save().then(() => token);
}

//this is a schema function.
accountSchema.statics.findByToken = function (token) {
    var Account = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'secret')
    } catch (e) {
        return Promise.reject();
    }

    return Account.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
}

accountSchema.statics.findByCredentials = function (email, password) {
    return Account.findOne({
        'email': email,
        'password': password
    });
}

accountSchema.methods.toJSON = function () {
    var account = this;
    var accountObject = account.toObject();
    return _.pick(accountObject, ['_id', 'email']);
}

var Account = mongoose.model('account', accountSchema);
module.exports = Account;