const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
	name: {
		type: String,
		required: 'A name is required',
	},
	url: {
		type: String,
		requried: 'A url is required',
	},
	language: {
		type: String,
		requried: 'A programming language is required',
	},
	description: String,
	license: String,
})
module.exports = mongoose.connection.model('projects', projectSchema)
