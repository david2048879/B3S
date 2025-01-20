const { check } = require('express-validator')

exports.userActivationValidator = [
	check('email').isEmail().withMessage('Must be a valid email address'),
	check('password')
		.isLength({ min: 7 })
		.withMessage('Password must have at least 7 characters.')
]

exports.userLoginValidator = [
	check('email').isEmail().withMessage('Must be a valid email address'),
	check('password')
		.isLength({ min: 7 })
		.withMessage('Password must have at least 7 characters.')
]

exports.forgotPasswordValidator = [
	check('email').isEmail().withMessage('Must be a valid email address'),
]

exports.resetPasswordValidator = [
	check('newPassword')
		.isLength({ min: 7 })
		.withMessage('Password must have at least 7 characters long'),
	// check('resetPasswordLink').not().isEmpty().withMessage('Token is required'),
	check('email').isEmail().withMessage('Must be a valid email address'),
]