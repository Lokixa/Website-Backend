var express = require('express')
var router = express.Router()
const db = require('../mongo/mongo-db')
const { body, param, validationResult } = require('express-validator')

const checks = [
	body('name').isLength({ min: 3, max: 30 }),
	body('url').isURL().isLength({ min: 12, max: 40 }),
	body('language').isLength({ min: 1, max: 10 }),
	body('description').isLength({ min: 3, max: 150 }),
	body('license').isLength({ min: 1, max: 10 }),
]

router.get('/', async function (req, res) {
	const docs = await db.find({})
	res.json(docs)
})
router.get('/:name', async (req, res) => {
	const doc = await db.find({ name: req.params.name })
	res.json(doc)
})
router.post(
	'/',
	[
		body('name').notEmpty().isLength({ min: 3, max: 30 }),
		body('url').notEmpty().isURL().isLength({ min: 12, max: 100 }),
		body('language').notEmpty().isLength({ min: 1, max: 10 }),
		body('description')
			.if((value, { req }) => req.body.description)
			.isLength({ min: 3, max: 150 }),
		body('license')
			.if((value, { req }) => req.body.license)
			.isLength({ min: 1, max: 10 }),
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
		body('name')
			.if((value, { req }) => req.body.name)
			.isLength({ min: 3, max: 30 }),
		body('url')
			.if((value, { req }) => req.body.url)
			.isURL()
			.isLength({ min: 12, max: 40 }),
		body('language')
			.if((value, { req }) => req.body.language)
			.isLength({ min: 1, max: 10 }),
		body('description')
			.if((value, { req }) => req.body.description)
			.isLength({ min: 3, max: 150 }),
		body('license')
			.if((value, { req }) => req.body.license)
			.isLength({ min: 1, max: 10 }),
	],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() })
			return
		}

		const doc = await db.updateOne({ name: req.params.name }, req.body)
		res.json(doc)
	}
)
router.delete(
	'/:name',
	[param('name').notEmpty().isLength({ min: 3, max: 30 })],
	async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() })
			return
		}
		const doc = await db.deleteOne({ name: req.params.name })
		res.json(doc)
	}
)

module.exports = router
