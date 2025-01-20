const { check } = require('express-validator')

exports.empIdentificationValidator = [
	check('empCode').isLength({ min: 6, max: 7}).withMessage('Must provide a valid staff ID'),
	check('empNames').not().isEmpty().withMessage('Names of employee are required'),
]

exports.appointmentValidator = [
	check('appointedDate').not().isEmpty().withMessage('Must provide a valid appointment date'),
	check('jobTitle').not().isEmpty().withMessage('Appointment job title is required'),
	check('contractType').not().isEmpty().withMessage('Must provide contract type'),
	check('branch').not().isEmpty().withMessage('Must specify the Branch.'),
]