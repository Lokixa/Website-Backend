var express = require('express')
var path = require('path')
var logger = require('morgan')
var cors = require('cors')
var helmet = require('helmet')
var expressSanitizer = require('express-sanitizer')
var jwt = require('jsonwebtoken')

var envService = require('./services/envService')
var mongoSetup = require('./mongo/mongo-setup')

var projectsRouter = require('./routes/projects')

var app = express()
envService.loadDotenv()

app.set('trust proxy', 'loopback')

// JWT
app.use(
	// Verification
	(req, res, next) => {
		req.user = undefined
		if (req.headers && req.headers.authorization) {
			let auth = req.headers.authorization.split(' ')
			if (auth[0] === 'JWT') {
				jwt.verify(
					auth[1],
					process.env['API_SECRET'],
					(err, decode) => {
						if (!err) {
							req.user = decode
						}
					}
				)
			}
		}
		next()
	},
	// Login check
	(req, res, next) => {
		if (req.user) {
			next()
		} else res.status(400).send('No Authentication')
	}
)

app.use(cors({ origin: process.env['ALLOWED_ORIGIN'] }))
app.use(helmet())
app.use(expressSanitizer())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

mongoSetup()
app.use('/projects', projectsRouter)

module.exports = app
