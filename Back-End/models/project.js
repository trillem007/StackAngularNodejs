'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var users = Schema({
	name: String,
	password: String,
	email: String,
	avatar: String,
	tokens: Number
});

module.exports = mongoose.model('users', users);
// projects  --> guarda los documents en la coleccion




