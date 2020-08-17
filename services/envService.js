const parsed = require('dotenv').config()

const loadDotenv = () => {
	for (let key in parsed) {
		process.env[key] = parsed[key]
	}
}

module.exports = { loadDotenv }
