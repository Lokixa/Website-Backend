var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')

var projectsRouter = require('./routes/projects')
var mongoSetup = require('./mongo/mongo-setup')

var app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

mongoSetup()
app.use('/projects', projectsRouter)

module.exports = app
