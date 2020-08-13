var express = require('express')
var path = require('path')
var logger = require('morgan')
var cors = require('cors')
var helmet = require('helmet')
var expressSanitizer = require('express-sanitizer')

var projectsRouter = require('./routes/projects')
var mongoSetup = require('./mongo/mongo-setup')
const config = require('./config.json')

var app = express()
const allowedOrigin = config.AllowedOrigin

app.set('trust proxy', true)
app.set('trust proxy', 'loopback')

app.use(cors({ origin: allowedOrigin }))
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
