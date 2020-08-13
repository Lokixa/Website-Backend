var express = require('express')
var router = express.Router()
const db = require('../mongo/mongo-db')
const { body, param, validationResult } = require('express-validator')

const bodyChecks = {
	name: body('name').isLength({ min: 3, max: 30 }),
	url: body('url').isURL().isLength({ min: 12, max: 100 }),
	language: body('language').isLength({ min: 1, max: 10 }),
	description: body('description').isLength({ min: 3, max: 150 }),
	license: body('license').isLength({ min: 1, max: 10 }),
}
router.get('/', async function (req, res) {
	const docs = await db.find({})
	res.json(docs)
})
router.get(
	'/:name',
	param('name').isLength({ min: 3, max: 20 }),
	async (req, res) => {
		const doc = await db.find({ name: req.sanitize(req.params.name) })
		res.json(doc)
	}
)
router.post(
	'/',
	[
		bodyChecks.name.notEmpty(),
		bodyChecks.url.notEmpty(),
		bodyChecks.language.notEmpty(),
		bodyChecks.description.if((value, { req }) => req.body.description),
		bodyChecks.license.if((value, { req }) => req.body.license),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() })
			return
		}
		const doc = await db.create(req.body)
		res.json(doc)
	}
)
router.put(
	'/:name',
	[
		param('name').isLength({ min: 3, max: 20 }).isAscii(),
		bodyChecks.name.if((value, { req }) => req.body.name),
		bodyChecks.url.if((value, { req }) => req.body.url),
		bodyChecks.language.if((value, { req }) => req.body.language),
		bodyChecks.description.if((value, { req }) => req.body.description),
		bodyChecks.license.if((value, { req }) => req.body.license),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() })
			return
		}

		const doc = await db.updateOne(
			{ name: req.sanitize(req.params.name) },
			req.body
		)
		res.json(doc)
	}
)
router.delete(
	'/:name',
	[param('name').isLength({ min: 3, max: 30 }).isAscii()],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() })
			return
		}
		const doc = await db.deleteOne({ name: req.sanitize(req.params.name) })
		res.json(doc)
	}
)

module.exports = router
