const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, 'First Name is Required']
	},
	lastName: {
		type: String,
		required: [true, 'Last Name is Required']
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'Email is Required']
	},
	password: {
		type: String,
		required: [true, 'Password is Required']
	},
	level: {
		type: Number,
		default: 1
	},
	rank: {
	    type: String,
	    default: 'F'
	},
	isAdmin: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('User', userSchema)