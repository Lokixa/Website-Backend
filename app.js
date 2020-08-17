var express = require('express')
var path = require('path')
var logger = require('morgan')
var cors = require('cors')
var helmet = require('helmet')
var expressSanitizer = require('express-sanitizer')
var envService = require('./services/envService')

var projectsRouter = require('./routes/projects')
var mongoSetup = require('./mongo/mongo-setup')

var app = express()
envService.loadDotenv()

app.set('trust proxy', true)
app.set('trust proxy', 'loopback')

app.use(cors({ origin: process.env['ALLOWED_ORIGIN'] }))
app.use(helmet())
app.use(expressSanitizer())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

mongoSetup()
app.use('/projects', projectsRouter)
app.use((err, req, res, next) => {
	if (err) {
		console.error(err)
		next(err)
	}
	next()
})

module.exports = app
