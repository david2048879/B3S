const Tb01_Employee = require("../models/tb01_employee");
const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");

const { isNumeric } = require("../helpers/utilityFunctions");
const { branchManagerMiddleware } = require("./authController");
const { clearScreenDown } = require("readline");

//s3
const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

exports.addProfile = (req, res) => {
	const {
		empNames,
		empCode,
		officerCode,
		rssbNumber,
		email,
		phone,
		idNumber,
		idType,
		nationality,
		gender,
		maritalStatus,
		dob,
	} = req.body;
	Tb01_Employee.findOne({ empCode }).exec((err, employee) => {
		if (employee) {
			return res.status(400).json({
				error: "Looks like this employee is already recorded!",
			});
		} else {
			try {
				const newEmployee = new Tb01_Employee({
					empNames,
					empCode,
					officerCode,
					rssbNumber,
					email,
					phone,
					idDetails: { idNumber, idType },
					nationality,
					gender,
					maritalStatus,
					dob,
					recordedBy: req.user._id,
				});
				newEmployee.save((err, result) => {
					if (err) {
						return res.status(401).json({
							error: "Unable to save the employee",
						});
					} else {
						return res.status(200).json({
							message: `${empNames} is added on active employees list.`,
						});
					}
				});
			} catch (error) {
				return res.status(401).json({
					error: "Unable to save the employee",
				});
			}
		}
	});
};

exports.listProfiles = async (req, res) => {
	const myProfiles = await Tb01_Employee.find(
		{ "currentAppointment.active": true },
		"empCode officerCode empNames email phone idDetails nationality gender maritalStatus dob picture loanAccount currentAppointment currentMonthSalary inflationAllowance"
	)
		.sort({
			updatedAt: -1,
		})
		.limit(7);
	return res.json({ myProfiles });
};

exports.listWithoutInflationAllowance = async (req, res) => {
	// console.log("Reached here...");
	const myProfiles = await Tb01_Employee.find(
		{
			"currentAppointment.active": true,
			"inflationAllowance.allowanceAmount": undefined,
		},
		"empCode officerCode empNames email phone idDetails nationality gender maritalStatus dob picture loanAccount currentAppointment currentMonthSalary inflationAllowance"
	).sort({
		empNames: 1,
	});

	return res.json({ myProfiles });
};

exports.listSearchedProfiles = async (req, res) => {
	const { searchValue } = req.body;
	const myProfiles = await Tb01_Employee.find(
		{
			"currentAppointment.active": true,
			$or: [
				{ empCode: isNumeric(searchValue) ? searchValue : -1 },
				{ officerCode: isNumeric(searchValue) ? searchValue : -1 },
				{ empNames: { $regex: ".*(?i)" + searchValue + ".*(?i)" } },
				{ email: { $regex: ".*(?i)" + searchValue + ".*(?i)" } },
				{
					"currentAppointment.contractType": {
						$regex: ".*(?i)" + searchValue + ".*(?i)",
					},
				},
				{
					"currentAppointment.jobTitle": {
						$regex: ".*(?i)" + searchValue + ".*(?i)",
					},
				},
				{
					"currentAppointment.branch": {
						$regex: ".*(?i)" + searchValue + ".*(?i)",
					},
				},
			],
		},
		"empCode officerCode empNames email phone idDetails nationality gender maritalStatus dob picture loanAccount currentAppointment currentMonthSalary inflationAllowance"
	).sort({ empNames: 1 });
	return res.json({ myProfiles });
};

exports.listDividionProfiles = async (req, res) => {
	const { division } = req.body;
	const myProfiles = await Tb01_Employee.find(
		{
			"currentAppointment.active": true,
			"currentAppointment.division": division,
		},
		"empCode officerCode empNames email phone idDetails nationality gender maritalStatus dob picture loanAccount currentAppointment currentMonthSalary"
	).sort({ empNames: 1 });
	return res.json({ myProfiles });
};

exports.listDepartmentProfiles = async (req, res) => {
	const { department } = req.body;
	const myProfiles = await Tb01_Employee.find(
		{
			"currentAppointment.active": true,
			"currentAppointment.department": department,
		},
		"empCode officerCode empNames email phone idDetails nationality gender maritalStatus dob picture loanAccount currentAppointment currentMonthSalary"
	).sort({ empNames: 1 });
	return res.json({ myProfiles });
};

exports.readProfile = async (req, res) => {
	const myProfile = await Tb01_Employee.findOne({
		_id: req.params.employeeid,
	});
	// console.log("My profile: ", myProfile);
	if (!myProfile || myProfile === null) {
		return res.json({
			message: "Employee not found!",
		});
	}
	return res.json({ myProfile });
};

exports.readOwnProfile = async (req, res) => {
	const myProfile = await Tb01_Employee.findOne({
		_id: req.params.employeeid,
	});
	if (!myProfile || myProfile === null) {
		return res.json({
			message: "Employee not found!",
		});
	}
	return res.json({ myProfile });
};

exports.readProfileOfficerCode = async (req, res) => {
	const myProfile = await Tb01_Employee.findOne({
		officerCode: parseInt(req.params.officerCode),
	});
	console.log(myProfile);

	if (!myProfile || myProfile === null) {
		return res.json({
			message: "Employee not found!",
		});
	}
	return res.json({ myProfile });
};

exports.readProfileEmpCode = async (req, res) => {
	const myProfile = await Tb01_Employee.findOne({
		empCode: parseInt(req.params.empCode),
	});
	if (!myProfile || myProfile === null) {
		return res.json({
			message: "Employee not found!",
		});
	}
	return res.json({ myProfile });
};

exports.readProfileEmail = async (req, res) => {
	const staffProfile = await Tb01_Employee.findOne({
		email: req.params.email,
	});
	if (!staffProfile || staffProfile === null) {
		return res.json({
			message: "Employee not found!",
		});
	}
	return res.json({ staffProfile });
};

exports.editProfile = (req, res) => {
	const {
		empNames,
		empCode,
		officerCode,
		rssbNumber,
		email,
		phone,
		idNumber,
		idType,
		nationality,
		gender,
		maritalStatus,
		dob,
	} = req.body;
	Tb01_Employee.findOneAndUpdate(
		{ _id: req.params.employeeid },
		{
			empNames,
			empCode,
			officerCode,
			rssbNumber,
			email,
			phone,
			idDetails: { idNumber, idType },
			nationality,
			gender,
			maritalStatus,
			dob,
			recordedBy: req.user._id,
		},
		{ new: true }
	).exec((err, updated) => {
		if (err) {
			return res.status(400).json({
				error: "Error updating information of the employee",
			});
		}
		res.json({
			message: "Employee data updated successfully!",
		});
	});
};

exports.editOwnProfile = (req, res) => {
	const { phone, idNumber, idType, nationality, gender, maritalStatus, dob } =
		req.body;
	Tb01_Employee.findOneAndUpdate(
		{ _id: req.params.employeeid },
		{
			phone,
			idDetails: { idNumber, idType },
			nationality,
			gender,
			maritalStatus,
			dob,
			recordedBy: req.params.employeeid,
		},
		{ new: true }
	).exec((err, updated) => {
		if (err) {
			return res.status(400).json({
				error: "Error occured while updating the profile",
			});
		}
		res.status(200).json({
			message: "Profile updated successfully!",
		});
	});
};

//=============================================Appointments================================
exports.addAppointment = async (req, res) => {
	let currentEmp;
	try {
		currentEmp = await Tb01_Employee.findOne({
			_id: req.params.employeeid,
		}).exec();
	} catch (error) {
		return res.status(400).json({
			error: "Unable to record the appointment!",
		});
	}
	const {
		appointedDate,
		contractType,
		division,
		department,
		jobTitle,
		location,
		locationType,
		branch,
		executive,
		reportTo,
		entitledBasicSalary,
		// entitledRentalCostAllowance,
		entitledTechnAllowance,
		entitledResponsibilityAllowance,
		entitledTransportAllowance,
		contractEndDate,
	} = req.body;
	const newAppt = {
		appointedDate,
		contractType,
		division,
		department,
		jobTitle,
		location,
		locationType,
		branch,
		executive,
		reportTo,
		entitledBasicSalary,
		// entitledRentalCostAllowance,
		entitledTechnAllowance,
		entitledResponsibilityAllowance,
		entitledTransportAllowance,
		contractEndDate,
		recordedBy: req.user._id,
	};
	newAppt.active = true;
	// console.log(newAppt)

	let myStaffAppointments = currentEmp.appointments
		? currentEmp.appointments
		: [];
	if (
		currentEmp.currentAppointment.jobTitle &&
		currentEmp.currentAppointment.jobTitle.length > 0
	) {
		currentEmp.currentAppointment.active = false;
		currentEmp.currentAppointment.contractEndDate = appointedDate;
		currentEmp.currentAppointment.comment =
			"This contract was ended. The staff got new appointment";
		myStaffAppointments.push(currentEmp.currentAppointment);
	}
	Tb01_Employee.findOneAndUpdate(
		{ _id: req.params.employeeid },
		{ currentAppointment: newAppt, appointments: myStaffAppointments }
	).exec((err, emp) => {
		if (err) {
			return res.status(400).json({
				error: "Unable to record the appointment!",
			});
		}
		return res.json({
			message: `Appointment recorded successfuly.`,
		});
	});
};

exports.editAppointment = (req, res) => {
	const {
		appointedDate,
		contractType,
		division,
		department,
		jobTitle,
		location,
		locationType,
		branch,
		executive,
		reportTo,
		entitledBasicSalary,
		// entitledRentalCostAllowance,
		entitledTechnAllowance,
		entitledResponsibilityAllowance,
		entitledTransportAllowance,
		contractEndDate,
	} = req.body;
	const newAppt = {
		appointedDate,
		contractType,
		division,
		department,
		jobTitle,
		location,
		locationType,
		branch,
		executive,
		reportTo,
		entitledBasicSalary,
		// entitledRentalCostAllowance,
		entitledTechnAllowance,
		entitledResponsibilityAllowance,
		entitledTransportAllowance,
		contractEndDate,
	};
	newAppt.active = true;
	Tb01_Employee.findOneAndUpdate(
		{ _id: req.params.employeeid },
		{
			currentAppointment: newAppt,
		}
	).exec((err, emp) => {
		if (err) {
			return res.status(400).json({
				error: "Unable to update the appointment!",
			});
		}
		return res.json({
			message: `Appointment updated successfuly.`,
		});
	});
};

exports.stopAppointment = async (req, res) => {
	let currentEmp;
	try {
		currentEmp = await Tb01_Employee.findOne({
			_id: req.params.employeeid,
		}).exec();
	} catch (error) {
		return res.status(400).json({
			error: "Unable to halt employee appointment!",
		});
	}

	const { contractEndDate, comment } = req.body;

	currentEmp.currentAppointment.active = false;
	currentEmp.currentAppointment.contractEndDate = contractEndDate;
	currentEmp.currentAppointment.comment = comment;
	let myStaffAppointments = currentEmp.appointments;
	let currentAppt = currentEmp.currentAppointment;
	myStaffAppointments.push(currentAppt);

	if (currentAppt.jobTitle && currentAppt.jobTitle.length > 1) {
		Tb01_Employee.findOneAndUpdate(
			{ _id: req.params.employeeid },
			{
				currentAppointment: {},
				"currentMonthSalary.salaryYear": null,
				"currentMonthSalary.salaryMonth": null,
				"currentMonthSalary.basicSalary": 0,
				"currentMonthSalary.responsibilityAllowance": 0,
				"currentMonthSalary.technAllowance": 0,
				"currentMonthSalary.transportAllowance": 0,
				"currentMonthSalary.totalOtherAllowances": 0,
				"currentMonthSalary.grossEarnings": 0,
				"currentMonthSalary.otherAllowances": [],
				"currentMonthSalary.payeTPR": 0,
				"currentMonthSalary.staffMaternityLeave": 0,
				"currentMonthSalary.staffCSR": 0,
				"currentMonthSalary.totalOtherDeductions": 0,
				"currentMonthSalary.totalStaffDeductions": 0,
				"currentMonthSalary.otherDeductions": [],
				"currentMonthSalary.netSalary": 0,
				"currentMonthSalary.cieMaternityLeave": 0,
				"currentMonthSalary.cieCSR": 0,
				"currentMonthSalary.cieCommunityHealth": 0,
				"currentMonthSalary.cieTotalContribution": 0,
				"currentMonthSalary.teamLeading": [],
				appointments: myStaffAppointments,
			}
		).exec((err, emp) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to halt employee appointment!",
				});
			}
			return res.json({
				message: `Appointment stopped successfuly.`,
			});
		});
	} else {
		return res.status(400).json({
			error: "No job title found for this employee. Please make sure the employee has an running appointment before stopping it!",
		});
	}
};

exports.listProfilesEndedContracts = async (req, res) => {
	const myProfiles = await Tb01_Employee.find(
		{
			$or: [
				// { currentAppointment: {} },
				{ "currentAppointment.active": { $exists: false } },
				{ "currentAppointment.active": false },
			],
		},
		"empCode officerCode empNames email phone idDetails nationality gender maritalStatus dob picture loanAccount currentAppointment currentMonthSalary"
	).sort({ empNames: 1 });
	// console.log(myProfiles[1])
	return res.json({ myProfiles });
};

exports.listProfilesEndedingContracts = async (req, res) => {
	var nextDate = new Date(); // Now
	nextDate.setDate(nextDate.getDate() + 30); // Set now + 30 days as the new date

	const myProfiles = await Tb01_Employee.find(
		{
			"currentAppointment.active": true,
			"currentAppointment.contractEndDate": { $lt: nextDate },
		},
		"empCode officerCode empNames email phone idDetails nationality gender maritalStatus dob picture loanAccount currentAppointment currentMonthSalary"
	).sort({ "currentAppointment.contractEndDate": -1 });
	return res.json({ myProfiles });
};

//=============================================Experience================================
exports.addExperience = (req, res) => {
	const { staffExperience } = req.body;
	// console.log(staffExperience)
	Tb01_Employee.findOneAndUpdate(
		{ _id: req.params.employeeid },
		{ workExperience: staffExperience }
	).exec((err, emp) => {
		if (err) {
			return res.status(400).json({
				error: "Unable to record the work experience!",
			});
		}
		return res.json({
			message: `Work experience recorded successfuly.`,
		});
	});
};

//=============================================Education================================
exports.addEducation = async (req, res) => {
	const { staffEducation } = req.body;
	// console.log(staffEducation)
	Tb01_Employee.findOneAndUpdate(
		{ _id: req.params.employeeid },
		{ educationBackground: staffEducation }
	).exec((err, emp) => {
		if (err) {
			return res.status(400).json({
				error: "Unable to record the education background!",
			});
		}
		return res.json({
			message: `Education background recorded successfuly.`,
		});
	});
};

//==============================================Documents===================================================================================
exports.createStaffDocument = async (req, res) => {
	let currentEmployee = await Tb01_Employee.findOne({
		_id: req.params.employeeid,
	}).exec();
	let staffDocs = currentEmployee.cvDocuments;

	let form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: "Document could not upload",
			});
		} else {
			const { title, description, docType } = fields;
			const { document } = files;
			// console.log(document.size);
			if (document.size > 2400000) {
				return res.status(400).json({
					error: "Document must be less that 24Mb",
				});
			} else {
				let oldPath = files.document.filepath;
				// let newPath =
				// 	"C:/Users/buwimana/Documents/IT/UrwegoOBF_Local/client_side/public/uploads/" + req.params.employeeid + "_" + files.document.newFilename + ".pdf";
				const newPath =
					process.env.UPLOAD_FILES_PATH +
					req.params.employeeid +
					"_" +
					files.document.newFilename +
					".pdf";

				let rawData = fs.readFileSync(oldPath);
				fs.writeFile(newPath, rawData, function (err) {
					if (err) {
						return res
							.status(400)
							.json({ error: "Could not upload the document!" });
					} else {
						// save to database
						let newStaffDoc = { title, description, docType };
						let newContent = {
							url:
								"/uploads/" +
								req.params.employeeid +
								"_" +
								files.document.newFilename +
								".pdf",
							key:
								req.params.employeeid +
								"_" +
								files.document.newFilename +
								".pdf",
						};
						newStaffDoc.content = newContent;
						staffDocs.push(newStaffDoc);
						Tb01_Employee.findByIdAndUpdate(
							{ _id: req.params.employeeid },
							{
								cvDocuments: staffDocs,
							}
						).exec((err, savedDoc) => {
							if (err) {
								// console.log(err)
								return res.status(400).json({
									error: "Could not upload the document!",
								});
							}
							return res.json({
								message: "Successfully uploaded",
							});
						});
					}
				});
			}
		}
	});
};

exports.deleteStaffDocument = (req, res) => {
	const { staffDocuments, documentKey } = req.body;
	Tb01_Employee.findOneAndUpdate(
		{ _id: req.params.employeeid },
		{ cvDocuments: staffDocuments }
	).exec((err, emp) => {
		if (err) {
			return res.status(400).json({
				error: "Unable to delete staff document!",
			});
		}
		// Deleting physical file
		// let filePathDel =
		// 	"C:/Users/buwimana/Documents/IT/UrwegoOBF_Local/client_side/public/uploads/" + documentKey;
		const filePathDel = process.env.UPLOAD_FILES_PATH + documentKey;

		fs.rmSync(filePathDel, {
			force: true,
		});

		res.json({
			message: "Document deleted successfully",
		});
	});
};

//=============================================Loan Account================================
exports.addLoanAcc = async (req, res) => {
	let currentEmp;
	try {
		currentEmp = await Tb01_Employee.findOne({
			_id: req.params.employeeid,
		}).exec();
	} catch (error) {
		return res.status(400).json({
			error: "Unable to record the loan account!",
		});
	}
	const { startDate, bankName, accountNumber, comment, endDate } = req.body;
	const newLoanAccount = {
		startDate,
		bankName,
		accountNumber,
		comment,
		endDate,
		recordedBy: req.user._id,
	};

	let staffLoanAccounts = currentEmp.loanAccountsHistory
		? currentEmp.loanAccountsHistory
		: [];
	if (
		currentEmp.loanAccount.bankName &&
		currentEmp.loanAccount.bankName.length > 0
	) {
		staffLoanAccounts.push(currentEmp.loanAccount);
	}
	Tb01_Employee.findOneAndUpdate(
		{ _id: req.params.employeeid },
		{ loanAccount: newLoanAccount, loanAccountsHistory: staffLoanAccounts }
	).exec((err, emp) => {
		if (err) {
			return res.status(400).json({
				error: "Unable to record the loan account!",
			});
		}
		return res.json({
			message: `Loan account recorded successfuly.`,
		});
	});
};

exports.editLoanAcc = (req, res) => {
	const { startDate, bankName, accountNumber, comment, endDate } = req.body;
	const newLoanAccount = {
		startDate,
		bankName,
		accountNumber,
		comment,
		endDate,
	};
	Tb01_Employee.findOneAndUpdate(
		{ _id: req.params.employeeid },
		{
			loanAccount: newLoanAccount,
		}
	).exec((err, emp) => {
		if (err) {
			return res.status(400).json({
				error: "Unable to update the loan account!",
			});
		}
		return res.json({
			message: `Loan account updated successfuly.`,
		});
	});
};

exports.listBranchStaff = async (req, res) => {
	const currentManager = await Tb01_Employee.findOne({
		email: req.params.empEmail,
	}).exec();
	if (!currentManager) {
		return res.status(400).json({
			error: "No staff found!",
		});
	} else if (
		!currentManager.currentAppointment &&
		!currentManager.currentAppointment.branch
	) {
		return res.status(400).json({
			error: "Unknown branch!",
		});
	} else {
		const branchStaff = await Tb01_Employee.find({
			"currentAppointment.active": true,
			"currentAppointment.branch":
				currentManager.currentAppointment.branch,
		}).sort({ empNames: 1 });
		return res.json({ branchStaff });
	}
};
