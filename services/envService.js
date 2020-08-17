const dotenv = require('dotenv')
const path = require('path')

const loadDotenv = () => {
	switch (process.env.NODE_ENV) {
		case 'dev':
			console.log('Loaded dev env')
			dotenv.config({ path: path.join(__dirname, '../.env.dev') })
			break
		default:
			dotenv.config({ path: path.join(__dirname, '../.env') })
			console.log('Loaded env')
			break
	}
}

module.exports = { loadDotenv }
