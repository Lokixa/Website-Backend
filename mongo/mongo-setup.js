function mongoSetup() {
	const mongoose = require('mongoose')

	mongoose.connect(process.env['MONGO_INSTANCE'], {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})

	mongoose.connection.on(
		'error',
		console.error.bind(console, 'connection error:')
	)

	mongoose.connection.once('open', () => {
		console.log('Connected to mongodb')
	})
}
module.exports = mongoSetup
