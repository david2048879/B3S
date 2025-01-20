const Country = require("../models/tb00_country");
const MaritalStatus = require("../models/tb00_maritalStatus");
const ContractType = require("../models/tb00_contractType");
const LeaveType = require("../models/tb00_leaveType");
const Department = require("../models/tb00_Department");
const Division = require("../models/tb00_Division");
const JobTitle = require("../models/tb00_JobTitle");
const Branch = require("../models/tb00_branch");
const Location = require("../models/tb00_location");
const Executive = require("../models/tb00_executive");
const Bank = require("../models/tb00_bank");
const Role = require("../models/tb00_role");
const Month = require("../models/tb00_month");
const Deduction = require("../models/Tb00_deduction");
const Allowance = require("../models/tb00_allowance");
const Currency = require("../models/tb00_currency");

exports.listCurrencies = (req, res) => {
	Currency.find()
		.sort({ currency: 1 })
		.exec((err, currencies) => {
			if (err || !currencies) {
				return res.status(400).json({
					error: "No currencies found",
				});
			}
			return res.json(currencies);
		});
};

exports.listCountries = (req, res) => {
	Country.find()
		.sort({ country_name: 1 })
		.exec((err, countries) => {
			if (err || !countries) {
				return res.status(400).json({
					error: "No countries found",
				});
			}
			return res.json({ countries });
		});
};

exports.listMaritalStatuses = (req, res) => {
	MaritalStatus.find().exec((err, maritalStatuses) => {
		if (err || !maritalStatuses) {
			return res.status(400).json({
				error: "No maritalStatuse found",
			});
		}
		// console.log(maritalStatuses)
		return res.json({ maritalStatuses });
	});
};

exports.listContractTypes = (req, res) => {
	ContractType.find().exec((err, contracttypes) => {
		if (err || !contracttypes) {
			return res.status(400).json({
				error: "No contract types found",
			});
		}
		return res.json({ contracttypes });
	});
};
exports.listLeaveTypes = (req, res) => {
	LeaveType.find().exec((err, leavetypes) => {
		if (err || !leavetypes) {
			return res.status(400).json({
				error: "No leave types found",
			});
		}
		return res.json({ leavetypes });
	});
};

exports.listDivisions = (req, res) => {
	Division.find().exec((err, divisions) => {
		if (err || !divisions) {
			return res.status(400).json({
				error: "No divisions found",
			});
		}
		return res.json({ divisions });
	});
};

exports.listDepartments = (req, res) => {
	Department.find()
		.sort({ department: 1 })
		.exec((err, departments) => {
			if (err || !departments) {
				return res.status(400).json({
					error: "No departments found",
				});
			}
			return res.json({ departments });
		});
};

exports.listJobTitles = (req, res) => {
	JobTitle.find()
		.sort({ JobTitle: 1 })
		.exec((err, jobtitles) => {
			if (err || !jobtitles) {
				return res.status(400).json({
					error: "No job titles found",
				});
			}
			return res.json({ jobtitles });
		});
};

exports.listBranches = (req, res) => {
	Branch.find()
		.sort({ branchName: 1 })
		.exec((err, branches) => {
			if (err || !branches) {
				return res.status(400).json({
					error: "No branches found",
				});
			}
			return res.json({ branches });
		});
};

exports.listLocations = (req, res) => {
	Location.find().exec((err, locations) => {
		if (err || !locations) {
			return res.status(400).json({
				error: "No locations found",
			});
		}
		return res.json({ locations });
	});
};

exports.listExecutives = (req, res) => {
	Executive.find()
		.sort({ Executive: 1 })
		.exec((err, executives) => {
			if (err || !executives) {
				return res.status(400).json({
					error: "No executives found",
				});
			}
			return res.json({ executives });
		});
};

exports.listBanks = (req, res) => {
	Bank.find()
		.sort({ bankName: 1 })
		.exec((err, banks) => {
			if (err || !banks) {
				return res.status(400).json({
					error: "No banks found",
				});
			}
			return res.json({ banks });
		});
};

exports.listRoles = (req, res) => {
	Role.find()
		.sort({ roleName: 1 })
		.exec((err, roles) => {
			if (err || !roles) {
				return res.status(400).json({
					error: "No roles found",
				});
			}
			return res.json({ roles });
		});
};

exports.listMonths = (req, res) => {
	Month.find()
		// .sort({ MonthID: 1 })
		.exec((err, months) => {
			if (err || !months) {
				return res.status(400).json({
					error: "No months found",
				});
			}
			return res.json({ months });
		});
};

exports.listDeductions = (req, res) => {
	Deduction.find()
		.sort({ _id: 1 })
		.exec((err, deductions) => {
			if (err || !deductions) {
				return res.status(400).json({
					error: "No deductions found",
				});
			}
			return res.json({ deductions });
		});
};

exports.listAllowances = (req, res) => {
	Allowance.find()
		.sort({ _id: 1 })
		.exec((err, allowances) => {
			if (err || !allowances) {
				return res.status(400).json({
					error: "No allowances found",
				});
			}
			return res.json({ allowances });
		});
};
