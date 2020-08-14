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

app.set('trust proxy', 'loopback')

app.use(cors({origin:allowedOrigin}))
app.use(helmet())
app.use(expressSanitizer())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

mongoSetup()

// Only accept requests from the allowedOrigin
app.use(function (req,res,next) {
	const origin = req.headers['origin'] || null
	console.log(origin)
	if(!origin){
		throw new Error("No Origin")
	}
	else if(origin !== allowedOrigin){
		throw new Error("Invalid Origin")
	}
	console.log(req.headers)

	next()
})
app.use('/projects', projectsRouter)
app.use((err, req, res, next) => {
	res.status(400).json(err.message)
})

module.exports = app
