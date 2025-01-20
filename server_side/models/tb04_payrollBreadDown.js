const mongoose = require("mongoose");

const payrollBreakDownSchema = new mongoose.Schema(
	{
		salaryYear: {
			type: Number,
		},
		salaryMonth: {
			type: String,
		},
		empCode: {
			type: Number,
		},
		empNames: {
			type: String,
		},
		dob: {
			type: Date,
		},
		gender: {
			type: String,
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
		},
		appointedDate: {
			type: Date,
		},
		jobTitle: {
			type: String,
		},
		reportTo: {
			type: String,
		},
		contractEndDate: {
			type: Date,
		},
		contractType: {
			type: String,
		},
		branchName: {
			type: String,
		},
		division: {
			type: String,
		},
		branchCode: {
			type: String,
		},
		dptName: {
			type: String,
		},
		dptCode: {
			type: String,
		},
		functionType: {
			type: String,
		},
		basicSalary: {
			type: Number,
		},
		bonus: {
			type: Number,
		},
		adjustment: {
			type: Number,
		},
		incentives: {
			type: Number,
		},
		overtime: {
			type: Number,
		},
		responsibilityAllowance: {
			type: Number,
		},
		internetAllowance: {
			type: Number,
		},
		rentalCostAllowance: {
			type: Number,
		},
		technAllowance: {
			type: Number,
		},
		transportAllowance: {
			type: Number,
		},
		tellerAllowance: {
			type: Number,
		},
		grossEarnings: {
			type: Number,
		},
		communicationAllowance: {
			type: Number,
		},
		transportAllRelocation: {
			type: Number,
		},
		lunchPayments: {
			type: Number,
		},
		sportsFitnessFees: {
			type: Number,
		},
		advanceDeduction: {
			type: Number,
		},
		medicalExpensesDeficit: {
			type: Number,
		},
		sanlamLifeInsurance: {
			type: Number,
		},
		matLeaveEmployeeDed: {
			type: Number,
		},
		SFAR: {
			type: Number,
		},
		shortageDeductions: {
			type: Number,
		},
		PAYE: {
			type: Number,
		},
		staffLoansConsolidated: {
			type: Number,
		},
		staffSavingsConsolidated: {
			type: Number,
		},
		matLeaveCompContrib: { type: Number },
		CSREmployerContr: {
			type: Number,
		},
		communityHealthyBasedScheme: {
			type: Number,
		},
		totalDeductions: {
			type: Number,
		},
		netSalary: {
			type: Number,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model(
	"tb04_payrollBreakDown",
	payrollBreakDownSchema
);
