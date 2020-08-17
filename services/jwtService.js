var jwt = require('jsonwebtoken')

const trySetJWTHeader = (req, res, next) => {
	req.user = undefined
	if (req.headers && req.headers.authorization) {
		let auth = req.headers.authorization.split(' ')
		if (auth[0] === 'JWT') {
			jwt.verify(auth[1], process.env['API_SECRET'], (err, decode) => {
				if (!err) {
					req.user = decode
				}
			})
		}
	}
	next()
}

const checkForJWTHeader = (req, res, next) => {
	if (req.user) {
		next()
	} else res.status(400).send('No Authentication')
}

module.exports = { trySetJWTHeader, checkForJWTHeader }
