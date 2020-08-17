var express = require('express')
var path = require('path')
var logger = require('morgan')
var cors = require('cors')
var helmet = require('helmet')
var expressSanitizer = require('express-sanitizer')

var envService = require('./services/envService')
var mongoSetup = require('./mongo/mongo-setup')

var projectsRouter = require('./routes/projects')
const { trySetJWTHeader, checkForJWTHeader } = require('./services/jwtService')

var app = express()
envService.loadDotenv()

app.set('trust proxy', 'loopback')

app.use(cors({ origin: process.env['ALLOWED_ORIGIN'] }))
app.use(helmet())
app.use(logger('dev'))
app.use((req, res, next) => {
	console.log(req.headers['x-forwarded-for'], req.headers['x-proxy-host'])
	next()
})
// JWT
app.use(trySetJWTHeader, checkForJWTHeader)

app.use(expressSanitizer())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

mongoSetup()

app.use(express.static(path.join(__dirname, 'public')))
app.use('/projects', projectsRouter)

module.exports = app
