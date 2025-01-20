const { check } = require('express-validator')

exports.monthlySalaryValidator = [
	check('bankName').not().isEmpty().withMessage('Bank name for staff salary is require'),
	check('accountNumber').not().isEmpty().withMessage('Bank Account for the staff salary is required'),
	check('salaryYear').not().isEmpty().withMessage('Please specify the current salary YEAR'),
	check('salaryMonth').not().isEmpty().withMessage('Please specify the current salary MONTH.'),
]