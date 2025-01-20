const fs = require("fs");
const Tb01_Employee = require("../models/tb01_employee");
const Tb01_SalaryArchive = require("../models/tb01_salaryArchive");
const Tb00_Deduction = require("../models/Tb00_deduction");
const Tb00_Allowance = require("../models/tb00_allowance");
const Tb04_PayrollBreakDown = require("../models/tb04_payrollBreadDown");

const {
	calcMontlySalary,
	removeAdhocAllowanceAndDeduction,
	resetSalaryComponents,
} = require("../helpers/utilityFunctions");

exports.editSalary = async (req, res) => {
	//Check if the status is not APPROVED or VALIDATED
	const oneActiveStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
		"currentMonthSalary.salaryYear": { $ne: undefined },
		"currentMonthSalary.salaryMonth": { $ne: undefined },
	}).exec();
	if (
		oneActiveStaff.currentMonthSalary.salaryStatus === "APPROVED" ||
		oneActiveStaff.currentMonthSalary.salaryStatus === "VALIDATED"
	) {
		return res.status(400).json({
			error: `Salary is ${oneActiveStaff.currentMonthSalary.salaryStatus}. No more edits can be done!`,
		});
	}
	//---------------------------------------------------------
	const { currentMonthSalary } = req.body;
	const currentEmp = await Tb01_Employee.findOne({
		_id: req.params.employeeid,
	});
	if (currentMonthSalary.updatedData === "Core") {
		if (currentEmp.currentMonthSalary.otherAllowances)
			currentMonthSalary.otherAllowances =
				currentEmp.currentMonthSalary.otherAllowances;
		if (currentEmp.currentMonthSalary.otherDeductions)
			currentMonthSalary.otherDeductions =
				currentEmp.currentMonthSalary.otherDeductions;
	}

	currentMonthSalary.empID = req.params.employeeid;
	currentMonthSalary.salaryMonth =
		oneActiveStaff.currentMonthSalary.salaryMonth;
	currentMonthSalary.salaryYear =
		oneActiveStaff.currentMonthSalary.salaryYear;

	const calculationDone = calcMontlySalary(currentMonthSalary);
	if (calculationDone) {
		return res.json({
			message: `Salary calculated!.`,
		});
	} else {
		return res.status(400).json({
			error: "Unable to calculate salary!",
		});
	}
};

exports.editOtherAllowances = async (req, res) => {
	//Check if the status is not APPROVED or VALIDATED
	const oneActiveStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
	}).exec();
	if (
		oneActiveStaff.currentMonthSalary.salaryStatus === "APPROVED" ||
		oneActiveStaff.currentMonthSalary.salaryStatus === "VALIDATED"
	) {
		return res.status(400).json({
			error: `Salary is ${oneActiveStaff.currentMonthSalary.salaryStatus}. No more edits can be done!`,
		});
	}
	//---------------------------------------------------------
	const { staffAllowance } = req.body;
	let totalAllowance = staffAllowance.reduce(function (acc, curr) {
		return acc + parseInt(curr.allowanceAmount);
	}, 0);
	if (staffAllowance) {
		Tb01_Employee.findOneAndUpdate(
			{ _id: req.params.employeeid },
			{
				"currentMonthSalary.otherAllowances": staffAllowance,
				"currentMonthSalary.totalOtherAllowances": totalAllowance,
			}
		).exec((err, emp) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to update allowances!",
				});
			}
			return res.json({
				message: `Moththly allowances updated successfuly.`,
			});
		});
	} else {
		return res.status(400).json({
			error: "Unable to update allowances!",
		});
	}
};

exports.editOtherDeductions = async (req, res) => {
	//Check if the status is not APPROVED or VALIDATED
	const oneActiveStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
	}).exec();
	if (
		oneActiveStaff.currentMonthSalary.salaryStatus === "APPROVED" ||
		oneActiveStaff.currentMonthSalary.salaryStatus === "VALIDATED"
	) {
		return res.status(400).json({
			error: `Salary is ${oneActiveStaff.currentMonthSalary.salaryStatus}. No more edits can be done!`,
		});
	}
	//---------------------------------------------------------
	const { staffDeduction } = req.body;

	let totalDeduction = staffDeduction.reduce(function (acc, curr) {
		return acc + parseInt(curr.deductionAmount);
	}, 0);
	if (staffDeduction) {
		Tb01_Employee.findOneAndUpdate(
			{ _id: req.params.employeeid },
			{
				"currentMonthSalary.otherDeductions": staffDeduction,
				"currentMonthSalary.totalOtherDeductions": totalDeduction,
			}
		).exec((err, emp) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to update deductions!",
				});
			}
			return res.json({
				message: `Moththly deductions updated successfuly.`,
			});
		});
	} else {
		return res.status(400).json({
			error: "Unable to update deductions!",
		});
	}
};

exports.calculateSalary = async (req, res) => {
	const allActiveStaff = await Tb01_Employee.find({
		"currentAppointment.active": true,
		// empCode: 900712,
	}).exec();

	//Check if the status is 'INITIALIZED'
	if (
		allActiveStaff[0].currentMonthSalary.salaryStatus === "APPROVED" ||
		allActiveStaff[0].currentMonthSalary.salaryStatus === "VALIDATED"
	) {
		return res.status(400).json({
			error: `Salary is ${allActiveStaff[0].currentMonthSalary.salaryStatus}. No more calculation can be done!`,
		});
	}
	//If status is 'INITIALIZED', call salary calculation for all staff
	try {
		for (staff in allActiveStaff) {
			let currentMonthSalary = allActiveStaff[staff].currentMonthSalary;
			currentMonthSalary.basicSalary = allActiveStaff[staff]
				.currentAppointment.entitledBasicSalary
				? allActiveStaff[staff].currentAppointment.entitledBasicSalary
				: 0;
			// currentMonthSalary.rentalCostAllowance = allActiveStaff[staff]
			// 	.currentAppointment.entitledRentalCostAllowance
			// 	? allActiveStaff[staff].currentAppointment
			// 			.entitledRentalCostAllowance
			// 	: 0;
			currentMonthSalary.technAllowance = allActiveStaff[staff]
				.currentAppointment.entitledTechnAllowance
				? allActiveStaff[staff].currentAppointment
						.entitledTechnAllowance
				: 0;
			currentMonthSalary.responsibilityAllowance = allActiveStaff[staff]
				.currentAppointment.entitledResponsibilityAllowance
				? allActiveStaff[staff].currentAppointment
						.entitledResponsibilityAllowance
				: 0;
			currentMonthSalary.transportAllowance = allActiveStaff[staff]
				.currentAppointment.entitledTransportAllowance
				? allActiveStaff[staff].currentAppointment
						.entitledTransportAllowance
				: 0;
			currentMonthSalary.daysWorked = allActiveStaff[staff]
				.currentMonthSalary.daysWorked
				? allActiveStaff[staff].currentMonthSalary.daysWorked
				: 30;
			if (allActiveStaff[staff].currentMonthSalary.otherAllowances)
				currentMonthSalary.otherAllowances =
					allActiveStaff[staff].currentMonthSalary.otherAllowances;
			if (allActiveStaff[staff].currentMonthSalary.otherDeductions)
				currentMonthSalary.otherDeductions =
					allActiveStaff[staff].currentMonthSalary.otherDeductions;

			currentMonthSalary.empID = allActiveStaff[staff]._id;

			calcMontlySalary(currentMonthSalary);
		}

		return res.status(200).json({
			message: `Payroll calculations for ${allActiveStaff[0].currentMonthSalary.salaryMonth} ${allActiveStaff[0].currentMonthSalary.salaryYear} is completed!.`,
		});
	} catch (error) {
		// console.log(error);
		return res.status(400).json({
			error: `Unable to complete payroll calculations for ${allActiveStaff[0].currentMonthSalary.salaryMonth} ${allActiveStaff[0].currentMonthSalary.salaryYear}!`,
		});
	}
};

exports.validateSalary = async (req, res) => {
	const { validatedBy, validatedComment, salaryStatus } = req.body;
	const oneActiveStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
	}).exec();
	//Check if the status is 'INNITIALIZED'
	if (oneActiveStaff.currentMonthSalary.salaryStatus === "APPROVED") {
		return res.status(400).json({
			error: "Previous month payroll is APPROVED. Cannot validate approved salary",
		});
	}
	//Set the status to 'VALIDATED'
	try {
		await Tb01_Employee.updateMany(
			{ "currentAppointment.active": true },
			{
				$set: {
					"currentMonthSalary.salaryStatus": salaryStatus,
					"currentMonthSalary.validatedBy": validatedBy,
					"currentMonthSalary.validatedComment": validatedComment,
					"currentMonthSalary.validatedDate": new Date(),
				},
			}
		);
		let returnedMsg = "";
		if (salaryStatus === "VALIDATED") {
			returnedMsg = `${oneActiveStaff.currentMonthSalary.salaryMonth} ${oneActiveStaff.currentMonthSalary.salaryYear} salary is VALIDATED!`;
		} else {
			returnedMsg = `${oneActiveStaff.currentMonthSalary.salaryMonth} ${oneActiveStaff.currentMonthSalary.salaryYear} salary is NOT VALIDATED! Some corrections are needed`;
		}
		return res.status(200).json({
			message: returnedMsg,
		});
	} catch (error) {
		return res.status(400).json({
			error: `Unable to VALIDATE ${oneActiveStaff.currentMonthSalary.salaryMonth} ${oneActiveStaff.currentMonthSalary.salaryYear} salary!.`,
		});
	}
};

exports.approveSalary = async (req, res) => {
	const { approvedBy, approvalComment, salaryStatus } = req.body;
	const oneActiveStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
	}).exec();
	//Check if the status is 'VALIDATED' or has first APPROVAL
	if (
		oneActiveStaff.currentMonthSalary.salaryStatus !== "VALIDATED" &&
		oneActiveStaff.currentMonthSalary.salaryStatus !== "APPROVED"
	) {
		return res.status(400).json({
			error: "Current month payroll is not yet VALIDATED. Only validated salary can be approved",
		});
	}
	//Set the status to 'APPROVED'
	try {
		if (oneActiveStaff.currentMonthSalary.salaryStatus !== "APPROVED") {
			await Tb01_Employee.updateMany(
				{ "currentAppointment.active": true },
				{
					$set: {
						"currentMonthSalary.salaryStatus": salaryStatus,
						"currentMonthSalary.approvedBy": approvedBy,
						"currentMonthSalary.approvalComment": approvalComment,
						"currentMonthSalary.approvalDate": new Date(),
					},
				}
			);
		} else {
			await Tb01_Employee.updateMany(
				{ "currentAppointment.active": true },
				{
					$set: {
						"currentMonthSalary.salaryStatus2": salaryStatus,
						"currentMonthSalary.approvedBy2": approvedBy,
						"currentMonthSalary.approvalComment2": approvalComment,
						"currentMonthSalary.approvalDate2": new Date(),
					},
				}
			);
		}
		let returnedMsg = "";
		if (salaryStatus === "APPROVED") {
			returnedMsg = `${oneActiveStaff.currentMonthSalary.salaryMonth} ${oneActiveStaff.currentMonthSalary.salaryYear} salary is APPROVED!`;
		} else {
			returnedMsg = `${oneActiveStaff.currentMonthSalary.salaryMonth} ${oneActiveStaff.currentMonthSalary.salaryYear} salary is NOT APPROVED! Some corrections are needed`;
		}
		return res.status(200).json({
			message: returnedMsg,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			error: `Unable to APPROVE ${oneActiveStaff.currentMonthSalary.salaryMonth} ${oneActiveStaff.currentMonthSalary.salaryYear} salary!.`,
		});
	}
};

exports.initializeSalary = async (req, res) => {
	const { currentMonth, currentYear } = req.body;
	console.log("Here we go....");

	const oneActiveStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
	}).exec();
	//Check if the status is 'APPROVED'
	if (oneActiveStaff.currentMonthSalary.salaryStatus !== "APPROVED") {
		return res.status(400).json({
			error: `${oneActiveStaff.currentMonthSalary.salaryMonth}, ${oneActiveStaff.currentMonthSalary.salaryYear} payroll is not yet approved. Initialization can be done only when current salary is APPROVED!`,
		});
	}
	const activeStaff = await Tb01_Employee.find(
		{
			// empCode: 100510,
			"currentAppointment.active": true,
		},
		{
			_id: 0,
			empCode: 1,
			officerCode: 1,
			currentMonthSalary: 1,
			email: 1,
			empNames: 1,
			currentAppointment: 1,
		}
	).exec();
	//Copy current salary for all staff to the Tb01_SalaryArchive
	try {
		await Tb01_SalaryArchive.deleteMany({
			"currentMonthSalary.salaryYear":
				oneActiveStaff.currentMonthSalary.salaryYear,
			"currentMonthSalary.salaryMonth":
				oneActiveStaff.currentMonthSalary.salaryMonth,
		});
	} catch (error) {
		return res.status(400).json({
			error: `Unable to delete ${oneActiveStaff.currentMonthSalary.salaryMonth}, ${oneActiveStaff.currentMonthSalary.salaryYear} salary from the archive!`,
		});
	}
	//Set month and year for the salary
	try {
		await Tb01_SalaryArchive.insertMany(activeStaff)
			.then(function () {
				console.log(
					`${oneActiveStaff.currentMonthSalary.salaryMonth}, ${oneActiveStaff.currentMonthSalary.salaryYear} salary is archived!`
				);
			})
			.catch(function (error) {
				console.log(error);
				return res.status(400).json({
					error: `Unable to archive ${oneActiveStaff.currentMonthSalary.salaryMonth}, ${oneActiveStaff.currentMonthSalary.salaryYear} salary!`,
				});
			});
		await Tb01_Employee.updateMany(
			{ "currentAppointment.active": true },
			{
				$set: {
					"currentMonthSalary.salaryYear": currentYear,
					"currentMonthSalary.salaryMonth": currentMonth,
					"currentMonthSalary.validatedBy": "",
					"currentMonthSalary.validatedDate": "",
					"currentMonthSalary.validatedComment": "",
					"currentMonthSalary.approvedBy": "",
					"currentMonthSalary.approvalDate": "",
					"currentMonthSalary.approvalComment": "",
					"currentMonthSalary.approvedBy2": "",
					"currentMonthSalary.approvalDate2": "",
					"currentMonthSalary.approvalComment2": "",
					"currentMonthSalary.grossEarnings": 0,
					"currentMonthSalary.totalOtherAllowances": 0,
					"currentMonthSalary.payeTPR": 0,
					"currentMonthSalary.staffMaternityLeave": 0,
					"currentMonthSalary.staffCSR": 0,
					"currentMonthSalary.totalOtherDeductions": 0,
					"currentMonthSalary.totalStaffDeductions": 0,
					"currentMonthSalary.netSalary": 0,
					"currentMonthSalary.cieMaternityLeave": 0,
					"currentMonthSalary.cieCSR": 0,
					"currentMonthSalary.cieCommunityHealth": 0,
					"currentMonthSalary.cieTotalContribution": 0,
				},
			}
		);
	} catch (error) {
		return res.status(400).json({
			error: `Unable to set ${currentMonth}, ${currentYear} period for salary!`,
		});
	}
	//Remove other non-repeat allowances and deductions
	for (staff in activeStaff) {
		removeAdhocAllowanceAndDeduction(
			activeStaff[staff]._id,
			activeStaff[staff].currentMonthSalary.otherAllowances,
			activeStaff[staff].currentMonthSalary.otherDeductions
		);
		resetSalaryComponents(
			activeStaff[staff]._id,
			activeStaff[staff].currentAppointment.entitledBasicSalary,
			// activeStaff[staff].currentAppointment.entitledRentalCostAllowance,
			activeStaff[staff].currentAppointment.entitledTechnAllowance,
			activeStaff[staff].currentAppointment
				.entitledResponsibilityAllowance,
			activeStaff[staff].currentAppointment.entitledTransportAllowance
		);
	}
	// Set the status to 'INITIALIZED'
	try {
		await Tb01_Employee.updateMany(
			{ "currentAppointment.active": true },
			{
				$set: {
					"currentMonthSalary.salaryStatus": "INITIALIZED",
					"currentMonthSalary.salaryStatus2": "INITIALIZED",
				},
			}
		);
		// console.log("Initilization done...")
		return res.status(200).json({
			message: `${currentMonth}, ${currentYear} salary is successfuly initialized!`,
		});
	} catch (error) {
		return res.status(400).json({
			error: `Unable to initialize ${currentMonth}, ${currentYear} salary!`,
		});
	}
};

exports.exportSalary = async (req, res) => {
	const activeStaff = await Tb01_Employee.find({
		"currentAppointment.active": true,
		"currentMonthSalary.bankName": "Urwego Bank",
	}).exec();
	// //Check if the status is 'APPROVED'
	if (activeStaff[0].currentMonthSalary.salaryStatus !== "APPROVED") {
		return res.status(400).json({
			error: `${activeStaff[0].currentMonthSalary.salaryMonth}, ${activeStaff[0].currentMonthSalary.salaryYear} payroll is not yet approved. You can export only APPROVED salary!`,
		});
	}
	let salaryExport = [];
	// data for Urwegobank staff
	try {
		for (emp in activeStaff) {
			let seqNumber = parseInt(emp) + 1;
			let accNumber = activeStaff[emp].currentMonthSalary.accountNumber
				? activeStaff[emp].currentMonthSalary.accountNumber
				: "Employee account not specified";
			let bankNames = activeStaff[emp].currentMonthSalary.bankName
				? activeStaff[emp].currentMonthSalary.bankName
				: "Bank not specified";
			let salMonth = "MonthNotSpecified";
			if (
				activeStaff[emp].currentMonthSalary &&
				activeStaff[emp].currentMonthSalary.salaryMonth
			) {
				salMonth =
					activeStaff[
						emp
					].currentMonthSalary.salaryMonth.toUpperCase();
			}
			let record = [
				activeStaff[emp].currentMonthSalary.salaryYear +
					"|" +
					activeStaff[emp].currentMonthSalary.salaryMonth +
					"|" +
					activeStaff[emp].empCode +
					"|AC|RWF1820210200001|RWF|" +
					activeStaff[emp].currentMonthSalary.netSalary +
					"|RWF|" +
					bankNames +
					"|" +
					accNumber +
					"|SAL" +
					salMonth +
					activeStaff[emp].currentMonthSalary.salaryYear,
			];
			salaryExport.push(record);
		}

		return res.json({
			salaryExport,
		});
	} catch (error) {
		return res.status(400).json({
			error: `Unable to export ${activeStaff[0].currentMonthSalary.salaryMonth}, ${activeStaff[0].currentMonthSalary.salaryYear} salary to file. ${error}`,
		});
	}
};

exports.exportSalaryOtherBanks = async (req, res) => {
	const activeStaffOtherBanks = await Tb01_Employee.find({
		"currentAppointment.active": true,
		"currentMonthSalary.bankName": { $ne: "Urwego Bank" },
	}).exec();

	// //Check if the status is 'APPROVED'
	if (
		activeStaffOtherBanks[0].currentMonthSalary.salaryStatus !== "APPROVED"
	) {
		return res.status(400).json({
			error: `${activeStaffOtherBanks[0].currentMonthSalary.salaryMonth}, ${activeStaffOtherBanks[0].currentMonthSalary.salaryYear} payroll is not yet approved. You can export only APPROVED salary!`,
		});
	}
	let salaryExportOtherBanks = [];
	try {
		for (emp in activeStaffOtherBanks) {
			let seqNumber = parseInt(emp) + 1;
			let accNumber = activeStaffOtherBanks[emp].currentMonthSalary
				.accountNumber
				? activeStaffOtherBanks[emp].currentMonthSalary.accountNumber
				: "Employee account not specified";
			let salMonth = "MonthNotSpecified";
			let bankNames = activeStaffOtherBanks[emp].currentMonthSalary
				.bankName
				? activeStaffOtherBanks[emp].currentMonthSalary.bankName
				: "Bank not specified";

			if (
				activeStaffOtherBanks[emp].currentMonthSalary &&
				activeStaffOtherBanks[emp].currentMonthSalary.salaryMonth
			) {
				salMonth =
					activeStaffOtherBanks[
						emp
					].currentMonthSalary.salaryMonth.toUpperCase();
			}
			let record = [
				activeStaffOtherBanks[emp].currentMonthSalary.salaryYear +
					"," +
					activeStaffOtherBanks[emp].currentMonthSalary.salaryMonth +
					"," +
					activeStaffOtherBanks[emp].empNames +
					"," +
					activeStaffOtherBanks[emp].empCode +
					",AC,RWF1820210200001,RWF," +
					activeStaffOtherBanks[emp].currentMonthSalary.netSalary +
					",RWF," +
					bankNames +
					"," +
					accNumber +
					",SAL" +
					salMonth +
					activeStaffOtherBanks[emp].currentMonthSalary.salaryYear,
			];
			salaryExportOtherBanks.push(record);
		}
		// console.log(salaryExportOtherBanks);
		return res.json({
			salaryExportOtherBanks,
		});
	} catch (error) {
		return res.status(400).json({
			error: `Unable to export ${activeStaffOtherBanks[0].currentMonthSalary.salaryMonth}, ${activeStaffOtherBanks[0].currentMonthSalary.salaryYear} salary to file. ${error}`,
		});
	}
};

exports.exportForValidation = async (req, res) => {
	const activeStaff = await Tb01_Employee.find({
		"currentAppointment.active": true,
	})
		.sort({ "currentAppointment.branch": 1, empNames: 1 })
		.exec();

	// const writeStream = fs.createWriteStream(
	// 	"C:/salaryExport/salaryValidation.csv"
	// );
	// const pathName = writeStream.path;
	let salaryExportValidation = [
		[
			"Month",
			"Year",
			"StaffID",
			"Names",
			"Job Title",
			"Branch",
			"Basic Salary",
			"Techn. Allowance",
			"Responsibility Allowance",
			"Transport Allowance",
			"Total Other Allowances",
			"Gross",
			"PAYE",
			"Maternity Leave",
			"CSR",
			"Other Deductions",
			"Net",
			"Cie Maternity Leave",
			"Cie CSR",
			"Cie Community Health",
			"Cie Total Contribution",
			"Account",
			"Bank",
		],
	];

	try {
		for (emp in activeStaff) {
			let accNumber = activeStaff[emp].currentMonthSalary.accountNumber
				? activeStaff[emp].currentMonthSalary.accountNumber
				: "";
			let bankName = activeStaff[emp].currentMonthSalary.bankName
				? activeStaff[emp].currentMonthSalary.bankName
				: "";
			let record = [
				'"' +
					activeStaff[emp].currentMonthSalary.salaryMonth +
					'","' +
					activeStaff[emp].currentMonthSalary.salaryYear +
					'","' +
					activeStaff[emp].empCode +
					'","' +
					activeStaff[emp].empNames +
					'","' +
					activeStaff[emp].currentAppointment.jobTitle +
					'","' +
					activeStaff[emp].currentAppointment.branch +
					'","' +
					activeStaff[emp].currentMonthSalary.basicSalary +
					'","' +
					activeStaff[emp].currentMonthSalary.technAllowance +
					'","' +
					activeStaff[emp].currentMonthSalary
						.responsibilityAllowance +
					'","' +
					activeStaff[emp].currentMonthSalary.transportAllowance +
					'","' +
					activeStaff[emp].currentMonthSalary.totalOtherAllowances +
					'","' +
					activeStaff[emp].currentMonthSalary.grossEarnings +
					'","' +
					activeStaff[emp].currentMonthSalary.payeTPR +
					'","' +
					activeStaff[emp].currentMonthSalary.staffMaternityLeave +
					'","' +
					activeStaff[emp].currentMonthSalary.staffCSR +
					'","' +
					activeStaff[emp].currentMonthSalary.totalOtherDeductions +
					'","' +
					activeStaff[emp].currentMonthSalary.netSalary +
					'","' +
					activeStaff[emp].currentMonthSalary.cieMaternityLeave +
					'","' +
					activeStaff[emp].currentMonthSalary.cieCSR +
					'","' +
					activeStaff[emp].currentMonthSalary.cieCommunityHealth +
					'","' +
					activeStaff[emp].currentMonthSalary.cieTotalContribution +
					'","' +
					accNumber +
					'","' +
					bankName +
					'"',
			];
			salaryExportValidation.push(record);
		}
		return res.json({
			salaryExportValidation,
		});
	} catch (error) {
		return res.status(400).json({
			error: `Unable to export ${activeStaff[0].currentMonthSalary.salaryMonth}, ${activeStaff[0].currentMonthSalary.salaryYear} salary to file. ${error}`,
		});
	}
};

exports.payrollStatus = async (req, res) => {
	//Read on active employee salary status
	const myPayrollStatus = await Tb01_Employee.findOne(
		{
			"currentAppointment.active": true,
		},
		{ _id: 0, currentMonthSalary: 1 }
	);
	return res.json({ myPayrollStatus });
};

exports.summarySalary = async (req, res) => {
	//Compute sums of each salary component
	const currentMonthSalary = await Tb01_Employee.find(
		{
			// "currentMonthSalary.salaryMonth": monthSalary,
			// "currentMonthSalary.salaryYear": yearSalary,
			"currentAppointment.active": true,
		},
		{ _id: 0, currentMonthSalary: 1 }
	); //.limit(2)

	let sumBasicSalary = currentMonthSalary.reduce(function (acc, curr) {
		return acc + parseInt(curr.currentMonthSalary.basicSalary);
	}, 0);
	// let sumRentalCostAllowance = currentMonthSalary.reduce(function (
	// 	acc,
	// 	curr
	// ) {
	// 	return acc + parseInt(curr.currentMonthSalary.rentalCostAllowance);
	// },
	// 0);
	let sumTechnAllowance = currentMonthSalary.reduce(function (acc, curr) {
		return acc + parseInt(curr.currentMonthSalary.technAllowance);
	}, 0);
	let sumResponsibilityAllowance = currentMonthSalary.reduce(function (
		acc,
		curr
	) {
		return acc + parseInt(curr.currentMonthSalary.responsibilityAllowance);
	},
	0);
	let sumTransportAllowance = currentMonthSalary.reduce(function (acc, curr) {
		return acc + parseInt(curr.currentMonthSalary.transportAllowance);
	}, 0);
	let sumTotalOtherAllowances = currentMonthSalary.reduce(function (
		acc,
		curr
	) {
		return acc + parseInt(curr.currentMonthSalary.totalOtherAllowances);
	},
	0);
	let sumGross = currentMonthSalary.reduce(function (acc, curr) {
		return acc + parseInt(curr.currentMonthSalary.grossEarnings);
	}, 0);

	let sumPAYE = currentMonthSalary.reduce(function (acc, curr) {
		return acc + parseInt(curr.currentMonthSalary.payeTPR);
	}, 0);
	let sumStaffMatLeave = currentMonthSalary.reduce(function (acc, curr) {
		return acc + parseInt(curr.currentMonthSalary.staffMaternityLeave);
	}, 0);
	let sumStaffCSR = currentMonthSalary.reduce(function (acc, curr) {
		return acc + parseInt(curr.currentMonthSalary.staffCSR);
	}, 0);
	let sumStaffOtherDeductions = currentMonthSalary.reduce(function (
		acc,
		curr
	) {
		return acc + parseInt(curr.currentMonthSalary.totalOtherDeductions);
	},
	0);
	let sumNetPay = currentMonthSalary.reduce(function (acc, curr) {
		return acc + parseInt(curr.currentMonthSalary.netSalary);
	}, 0);

	let sumCieMatLeave = currentMonthSalary.reduce(function (acc, curr) {
		return acc + parseInt(curr.currentMonthSalary.cieMaternityLeave);
	}, 0);
	let sumCieCSR = currentMonthSalary.reduce(function (acc, curr) {
		return acc + parseInt(curr.currentMonthSalary.cieCSR);
	}, 0);
	let sumCommunityHealth = currentMonthSalary.reduce(function (acc, curr) {
		return acc + parseInt(curr.currentMonthSalary.cieCommunityHealth);
	}, 0);
	let sumCieTotalContribution = currentMonthSalary.reduce(function (
		acc,
		curr
	) {
		return acc + parseInt(curr.currentMonthSalary.cieTotalContribution);
	},
	0);

	let salSummary = {
		Year: currentMonthSalary[0].currentMonthSalary.salaryYear,
		Month: currentMonthSalary[0].currentMonthSalary.salaryMonth,
		"Number of Employees": currentMonthSalary.length,
		"Basic Salary": sumBasicSalary,
		// "Rental Cost Allowance": sumRentalCostAllowance,
		"Techn. Allowance": sumTechnAllowance,
		"Responsibility Allowance": sumResponsibilityAllowance,
		"Transport Allowance": sumTransportAllowance,
		"Other Allowances": sumTotalOtherAllowances,
		Gross: sumGross,
		"P.A.Y.E": sumPAYE,
		"Mat. Leave - Staff contribution": sumStaffMatLeave,
		"CSR - Staff contribution": sumStaffCSR,
		"Other Deductions": sumStaffOtherDeductions,
		"Net Pay": sumNetPay,
		"Mat. Leave - Cie contribution": sumCieMatLeave,
		"CSR - Cie contribution": sumCieCSR,
		"Community Health": sumCommunityHealth,
		"Cie Total Contribution": sumCieTotalContribution,
	};
	// console.log(salSummary)
	return res.status(200).json(salSummary);
};

exports.summarySalaryParBranch = async (req, res) => {
	const allActiveStaff = await Tb01_Employee.find({
		"currentAppointment.active": true,
	}).sort({ "currentAppointment.branch": 1 });

	const deductionsList = await Tb00_Deduction.find(
		{}, // deductionName: "Staff Savings - Consolidated"
		{ deductionName: 1, _id: 0 }
	).exec();
	const allowancesList = await Tb00_Allowance.find(
		{},
		{ allowanceName: 1, _id: 0 }
	).exec();

	let salSummryFinance = [];
	for (currentDeduction in deductionsList) {
		let aDeduction = {};
		let aDedutionAmount = 0;
		let contractType = "";
		let functionType = "";
		let department = "";
		let branch = "";
		for (currentStaff in allActiveStaff) {
			branch = allActiveStaff[currentStaff].currentAppointment.branch;
			department =
				allActiveStaff[currentStaff].currentAppointment.department;

			if (
				allActiveStaff[currentStaff].currentAppointment.contractType ===
				"Permanent"
			) {
				contractType = "Permanent";
			} else {
				contractType = "Temporary";
			}
			if (
				allActiveStaff[currentStaff].currentAppointment.jobTitle
					.toUpperCase()
					.includes("SALES")
			) {
				functionType = "Lending Officer";
			} else {
				functionType = "Admin";
			}
			let indexOtherDeduction = allActiveStaff[
				currentStaff
			].currentMonthSalary.otherDeductions.findIndex(
				(otherDeduction) =>
					otherDeduction.deductionName ===
					deductionsList[currentDeduction].deductionName
			);
			if (indexOtherDeduction !== -1) {
				aDedutionAmount =
					aDedutionAmount +
					allActiveStaff[currentStaff].currentMonthSalary
						.otherDeductions[indexOtherDeduction].deductionAmount;
			}
		}
		if (aDedutionAmount > 0) {
			// console.log(
			// 	summaryBranch[currentBranch]._id.branch,
			// 	summaryBranch[currentBranch]._id.department,
			// 	deductionsList[currentDeduction].deductionName,
			// 	aDedutionAmount
			// );
			aDeduction.branch = branch;
			aDeduction.department = department;
			aDeduction.contractType = contractType;
			aDeduction.functionType = functionType;
			aDeduction.salaryComponent =
				deductionsList[currentDeduction].deductionName;
			aDeduction.salaryComponentAmount = aDedutionAmount;
			salSummryFinance.push(aDeduction);
		}
	}

	// console.log(salSummryFinance.length);
	return res.status(200).json(salSummryFinance);
};

exports.loadFileData = async (req, res) => {
	//Check if the status is not APPROVED or VALIDATED
	const oneActiveStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
	}).exec();
	if (
		oneActiveStaff.currentMonthSalary.salaryStatus !== "INITIALIZED" &&
		oneActiveStaff.currentMonthSalary.salaryStatus !== "NOT VALIDATED"
	) {
		return res.status(400).json({
			error: `Salary is ${oneActiveStaff.currentMonthSalary.salaryStatus}. No more changes can be done!`,
		});
	}
	/////////////////======================================///////////////////////////////////
	const { fileUploadText, array } = req.body;
	// console.log(array[1]);
	try {
		for (rec in array) {
			// console.log(parseInt(array[rec].EMPLOYEE_CODE))
			if (array[rec].EMPLOYEE_CODE && array[rec].EMPLOYEE_CODE > 0) {
				let currentEmployee = await Tb01_Employee.findOne({
					empCode: parseInt(array[rec].EMPLOYEE_CODE),
				}).exec();
				if (fileUploadText === "allowances.csv") {
					const repeatedAllowances = ["Technical Allowance"];
					if (currentEmployee && currentEmployee.currentMonthSalary) {
						let oAl =
							currentEmployee.currentMonthSalary.otherAllowances;

						const AllowanceIndex = oAl.findIndex(
							(Allowance) =>
								Allowance.allowanceName ===
								array[rec].ALLOWANCE_NAME
						);
						if (AllowanceIndex !== -1) {
							oAl.splice(AllowanceIndex, 1);
						}
						let newAllowance = {};
						newAllowance.allowanceName = array[rec].ALLOWANCE_NAME;
						newAllowance.allowanceComment = "Loaded from file";
						newAllowance.allowanceAmount = parseInt(
							array[rec]["ALLOWANCE_AMOUNT\r"].replace("\r", "")
						);
						newAllowance.isRepeated = array[rec].REPEATED;
						// if (array[rec].ALLOWANCE_NAME in repeatedAllowances) {
						// 	newAllowance.isRepeated = "YES";
						// } else {
						// 	newAllowance.isRepeated = "NON";
						// }

						oAl.push(newAllowance);

						Tb01_Employee.findOneAndUpdate(
							{ empCode: parseInt(array[rec].EMPLOYEE_CODE) },
							{
								"currentMonthSalary.otherAllowances": oAl,
							}
						).exec((err, emp) => {
							if (err) {
								console.log(err);
							}
						});
					}
				} else if (fileUploadText === "deductions.csv") {
					const repeatedDeductions = [
						"Medical Expenses Deficit",
						"Sanlam Life Insurance",
						"SFAR",
						"Shortage Deductions",
						"Staff Loans - Consolidated",
					];
					if (currentEmployee && currentEmployee.currentMonthSalary) {
						let oDe =
							currentEmployee.currentMonthSalary.otherDeductions;
						let deductionIndex = oDe.findIndex(
							(deduction) =>
								deduction.deductionName ===
								array[rec].DEDUCTION_NAME
						);
						if (deductionIndex !== -1) {
							oDe.splice(deductionIndex, 1);
						}
						//Deleting Staff Saving Consolidated
						let deductionIndex1 = oDe.findIndex(
							(deduction) =>
								deduction.deductionName ===
								"Staff Saving Consolidated"
						);
						if (deductionIndex1 !== -1) {
							oDe.splice(deductionIndex1, 1);
						}
						//////////////////////////////////
						let newDeduction = {};
						newDeduction.deductionName = array[rec].DEDUCTION_NAME;
						newDeduction.deductionComment = "Loaded from file";
						newDeduction.deductionAmount = parseInt(
							array[rec]["DEDUCTION_AMOUNT\r"].replace("\r", "")
						);
						newDeduction.isRepeated = array[rec].REPEATED;
						// if (array[rec].DEDUCTION_NAME in repeatedDeductions) {
						// 	newDeduction.isRepeated = "YES";
						// } else {
						// 	newDeduction.isRepeated = "NON";
						// }

						oDe.push(newDeduction);

						Tb01_Employee.findOneAndUpdate(
							{ empCode: parseInt(array[rec].EMPLOYEE_CODE) },
							{
								"currentMonthSalary.otherDeductions": oDe,
							}
						).exec((err, emp) => {
							if (err) {
								console.log(err);
							}
						});
					}
				}
			} else {
				return res.status(400).json({
					message: `Data from ${fileUploadText} have an issue!`,
				});
			}
		}
		return res.status(200).json({
			message: `Data from ${fileUploadText} successfully loaded into the system.`,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			error: `Unable to load data from ${fileUploadText} file. Please correct the file and try again.`,
		});
	}
};

exports.archiveSalary = async (req, res) => {
	const { yearSalary, monthSalary } = req.body;
	const paySlip = await Tb01_SalaryArchive.findOne({
		"currentMonthSalary.salaryMonth": monthSalary,
		"currentMonthSalary.salaryYear": yearSalary,
		empCode: req.params.empCode,
	});
	if (paySlip) {
		return res.status(200).json(paySlip);
	} else {
		return res.status(400).json({
			error: `Unable to retrieve pay slip for ${monthSalary}, ${yearSalary} .`,
		});
	}
};

//=========================================================================================================================
//======================================================Reports============================================================
//=========================================================================================================================
exports.payrollAccountingEntry = async (req, res) => {
	const { yearSalary, monthSalary, viewEport } = req.body;

	const accountingEnties = await Tb04_PayrollBreakDown.findOne({
		salaryYear: yearSalary,
		salaryMonth: monthSalary,
	}).count();

	if (accountingEnties && accountingEnties > 0) {
		const salaryAccountEntry = await Tb04_PayrollBreakDown.aggregate([
			{
				$match: {
					salaryYear: yearSalary,
					salaryMonth: monthSalary,
				},
			},
			{ $sort: { branchName: 1 } },
			{
				$group: {
					_id: {
						contractType: "$contractType",
						department: "$dptName",
						branchName: "$branchName",
						functionType: "$functionType",
					},
					basicSalary: { $sum: "$basicSalary" },
					bonus: { $sum: "$bonus" },
					adjustment: { $sum: "$adjustment" },
					incentives: { $sum: "$incentives" },
					overtime: { $sum: "$overtime" },
					responsibilityAllowance: {
						$sum: "$responsibilityAllowance",
					},
					internetAllowance: { $sum: "$internetAllowance" },
					rentalCostAllowance: { $sum: "$rentalCostAllowance" },
					technAllowance: { $sum: "$technAllowance" },
					transportAllowance: { $sum: "$transportAllowance" },
					tellerAllowance: { $sum: "$tellerAllowance" },
					grossEarnings: { $sum: "$grossEarnings" },
					communicationAllowance: { $sum: "$communicationAllowance" },
					lunchPayments: { $sum: "$lunchPayments" },
					sportsFitnessFees: { $sum: "$sportsFitnessFees" },
					advanceDeduction: { $sum: "$advanceDeduction" },
					medicalExpensesDeficit: { $sum: "$medicalExpensesDeficit" },
					sanlamLifeInsurance: { $sum: "$sanlamLifeInsurance" },
					matLeaveEmployeeDed: { $sum: "$matLeaveEmployeeDed" },
					matLeaveCompContrib: { $sum: "$matLeaveCompContrib" },
					SFAR: { $sum: "$SFAR" },
					shortageDeductions: { $sum: "$shortageDeductions" },
					CSREmployeeDeduction: { $sum: "CSREmployeeDeduction" },
					PAYE: { $sum: "$PAYE" },
					staffLoansConsolidated: { $sum: "$staffLoansConsolidated" },
					staffSavingsConsolidated: {
						$sum: "$staffSavingsConsolidated",
					},
					CSREmployerContr: { $sum: "$CSREmployerContr" },
					communityHealthyBasedScheme: {
						$sum: "$communityHealthyBasedScheme",
					},
					totalDeductions: { $sum: "$totalDeductions" },
					netSalary: { $sum: "$netSalary" },
				},
			},
		]);
		if (viewEport === "VIEW") {
			let dataSources = [];
			salaryAccountEntry.forEach(function (d) {
				dataSources.push({
					contractType: d._id.contractType,
					departments: d._id.department,
					branchNames: d._id.branchName,
					functionType: d._id.functionType,
					basicSalary: d.basicSalary,
					// technAllowance: d.technAllowance,
					transportAllowance: d.transportAllowance,
					incentives: d.incentives,
					grossEarnings: d.grossEarnings,
					netSalary: d.netSalary,
				});
			});
			return res.json({ dataSources });
		} else if (viewEport === "EXPORT") {
			let accountEntryArray = makeArrayAccountEntry(salaryAccountEntry);
			return res.json({ accountEntryArray });
		} else {
			return res.status(400).json({
				error: `Unknown ${viewEport} parameter. Please try again later.`,
			});
		}
	} else {
		return res.status(400).json({
			error: `Payroll of ${monthSalary} ${yearSalary} not found. Please select correct month and year.`,
		});
	}
};

exports.payrollSummary = async (req, res) => {
	const { yearSalary, monthSalary, viewEport } = req.body;
	const salSummary = await Tb04_PayrollBreakDown.findOne({
		salaryYear: yearSalary,
		salaryMonth: monthSalary,
		"currentAppointment.active": true,
	}).count();

	if (salSummary && salSummary > 0) {
		// console.log(yearSalary, monthSalary, salSummary);
		const salarySummary = await Tb04_PayrollBreakDown.aggregate([
			{
				$match: {
					salaryYear: yearSalary,
					salaryMonth: monthSalary,
				},
			},
			{ $sort: { branchName: 1 } },
			{
				$group: {
					_id: {
						salaryYear: "$salaryYear",
						salaryMonth: "$salaryMonth",
					},
					basicSalary: { $sum: "$basicSalary" },
					bonus: { $sum: "$bonus" },
					adjustment: { $sum: "$adjustment" },
					incentives: { $sum: "$incentives" },
					overtime: { $sum: "$overtime" },
					responsibilityAllowance: {
						$sum: "$responsibilityAllowance",
					},
					internetAllowance: { $sum: "$internetAllowance" },
					rentalCostAllowance: { $sum: "$rentalCostAllowance" },
					technAllowance: { $sum: "$technAllowance" },
					transportAllowance: { $sum: "$transportAllowance" },
					tellerAllowance: { $sum: "$tellerAllowance" },
					grossEarnings: { $sum: "$grossEarnings" },
					communicationAllowance: { $sum: "$communicationAllowance" },
					lunchPayments: { $sum: "$lunchPayments" },
					sportsFitnessFees: { $sum: "$sportsFitnessFees" },
					advanceDeduction: { $sum: "$advanceDeduction" },
					medicalExpensesDeficit: { $sum: "$medicalExpensesDeficit" },
					sanlamLifeInsurance: { $sum: "$sanlamLifeInsurance" },
					matLeaveEmployeeDed: { $sum: "$matLeaveEmployeeDed" },
					SFAR: { $sum: "$SFAR" },
					shortageDeductions: { $sum: "$shortageDeductions" },
					CSREmployeeDeduction: { $sum: "CSREmployeeDeduction" },
					PAYE: { $sum: "$PAYE" },
					staffLoansConsolidated: { $sum: "$staffLoansConsolidated" },
					staffSavingsConsolidated: {
						$sum: "$staffSavingsConsolidated",
					},
					matLeaveCompContrib: { $sum: "$matLeaveCompContrib" },
					CSREmployerContr: { $sum: "$CSREmployerContr" },
					communityHealthyBasedScheme: {
						$sum: "$communityHealthyBasedScheme",
					},
					totalDeductions: { $sum: "$totalDeductions" },
					netSalary: { $sum: "$netSalary" },
				},
			},
		]);

		if (viewEport === "VIEW") {
			let summarySalaryReport = salarySummary[0];
			return res.json({ summarySalaryReport });
		} else if (viewEport === "EXPORT") {
			let summarySalaryReport = makeSummarySalary(salarySummary[0]);
			return res.json({ summarySalaryReport });
		}
	} else {
		return res.status(400).json({
			error: `Payroll of ${monthSalary} ${yearSalary} not found. Please try again later.`,
		});
	}
};

exports.payrollBreakDown = async (req, res) => {
	let yearSalary, monthSalary;
	const oneStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
		"currentMonthSalary.salaryMonth": { $ne: undefined },
		"currentMonthSalary.salaryYear": { $ne: undefined },
	}).sort({ empCode: 1 });

	yearSalary = oneStaff.currentMonthSalary.salaryYear
		? oneStaff.currentMonthSalary.salaryYear
		: new Date().getFullYear();
	monthSalary = oneStaff.currentMonthSalary.salaryMonth
		? oneStaff.currentMonthSalary.salaryMonth
		: new Date().toLocaleString("default", { month: "long" });

	const reportedPayroll = await Tb01_Employee.find({
		"currentAppointment.active": true,
	}).sort({ empCode: 1 });
	if (reportedPayroll && reportedPayroll.length > 0) {
		let breaDownPayroll = [];
		for (staffPay in reportedPayroll) {
			let breakDownStaff = {};
			// if (
			// 	reportedPayroll[staffPay].currentAppointment.contractType ===
			// 	"Permanent"
			// ) {
			// 	breakDownStaff.contractType = "Permanent";
			// } else {
			// 	breakDownStaff.contractType = "Temporary";
			// }

			breakDownStaff.empCode = reportedPayroll[staffPay].empCode;
			breakDownStaff.empNames = reportedPayroll[staffPay].empNames;
			breakDownStaff.gender = reportedPayroll[staffPay].gender;
			breakDownStaff.email = reportedPayroll[staffPay].email;
			breakDownStaff.phone = reportedPayroll[staffPay].phone;
			breakDownStaff.dob = reportedPayroll[staffPay].dob
				? reportedPayroll[staffPay].dob.toISOString().slice(0, 10)
				: "";
			breakDownStaff.officerCode = reportedPayroll[staffPay].officerCode
				? reportedPayroll[staffPay].officerCode
				: "";
			breakDownStaff.appointedDate = reportedPayroll[staffPay]
				.currentAppointment.appointedDate
				? reportedPayroll[staffPay].currentAppointment.appointedDate
						.toISOString()
						.slice(0, 10)
				: "";
			breakDownStaff.contractType =
				reportedPayroll[staffPay].currentAppointment.contractType;
			breakDownStaff.jobTitle =
				reportedPayroll[staffPay].currentAppointment.jobTitle;
			breakDownStaff.reportTo =
				reportedPayroll[staffPay].currentAppointment.reportTo;
			breakDownStaff.contractEndDate = reportedPayroll[staffPay]
				.currentAppointment.contractEndDate
				? reportedPayroll[staffPay].currentAppointment.contractEndDate
						.toISOString()
						.slice(0, 10)
				: "";
			breakDownStaff.branchName =
				reportedPayroll[staffPay].currentAppointment.branch;
			breakDownStaff.divName =
				reportedPayroll[staffPay].currentAppointment.division;
			breakDownStaff.department =
				reportedPayroll[staffPay].currentAppointment.department;

			if (
				reportedPayroll[staffPay].currentAppointment.jobTitle &&
				reportedPayroll[staffPay].currentAppointment.jobTitle
					.toUpperCase()
					.includes("SALES")
			) {
				breakDownStaff.functionType = "Lending Officer";
			} else {
				breakDownStaff.functionType = "Admin";
			}
			breakDownStaff.salaryMonth = monthSalary;
			breakDownStaff.salaryYear = yearSalary;
			breakDownStaff.basicSalary =
				reportedPayroll[staffPay].currentMonthSalary.basicSalary;
			breakDownStaff.bonus = valueAllowance(
				"Bonus",
				reportedPayroll[staffPay].currentMonthSalary.otherAllowances
			);
			breakDownStaff.adjustment = valueAllowance(
				"Adjustment",
				reportedPayroll[staffPay].currentMonthSalary.otherAllowances
			);
			breakDownStaff.incentives = valueAllowance(
				"Incentives",
				reportedPayroll[staffPay].currentMonthSalary.otherAllowances
			);
			breakDownStaff.responsibilityAllowance =
				valueAllowance(
					"Responsibility Allowance",
					reportedPayroll[staffPay].currentMonthSalary.otherAllowances
				) +
				reportedPayroll[staffPay].currentMonthSalary
					.responsibilityAllowance;

			breakDownStaff.rentalCostAllowance = valueAllowance(
				"Rental Cost Allowance",
				reportedPayroll[staffPay].currentMonthSalary.otherAllowances
			);
			breakDownStaff.overtime = valueAllowance(
				"Overtime",
				reportedPayroll[staffPay].currentMonthSalary.otherAllowances
			);
			breakDownStaff.internetAllowance = valueAllowance(
				"Internet  Allowance",
				reportedPayroll[staffPay].currentMonthSalary.otherAllowances
			);
			breakDownStaff.technAllowance =
				reportedPayroll[staffPay].currentMonthSalary.technAllowance;
			breakDownStaff.transportAllowance =
				reportedPayroll[staffPay].currentMonthSalary.transportAllowance;
			breakDownStaff.tellerAllowance = valueAllowance(
				"Teller Allowance",
				reportedPayroll[staffPay].currentMonthSalary.otherAllowances
			);
			breakDownStaff.transportAllRelocation = valueAllowance(
				"Transport Allowance - Relocation",
				reportedPayroll[staffPay].currentMonthSalary.otherAllowances
			);
			breakDownStaff.grossEarnings =
				reportedPayroll[staffPay].currentMonthSalary.grossEarnings;
			breakDownStaff.communicationAllowance = valueDeduction(
				"Communication Allowance Deficit",
				reportedPayroll[staffPay].currentMonthSalary.otherDeductions
			);
			breakDownStaff.lunchPayments = valueDeduction(
				"Lunch Payments",
				reportedPayroll[staffPay].currentMonthSalary.otherDeductions
			);
			breakDownStaff.sportsFitnessFees = valueDeduction(
				"Sports & Fitness Fees",
				reportedPayroll[staffPay].currentMonthSalary.otherDeductions
			);
			breakDownStaff.advanceDeduction = valueDeduction(
				"Advance Deduction",
				reportedPayroll[staffPay].currentMonthSalary.otherDeductions
			);
			breakDownStaff.medicalExpensesDeficit = valueDeduction(
				"Medical Expenses Deficit",
				reportedPayroll[staffPay].currentMonthSalary.otherDeductions
			);
			breakDownStaff.sanlamLifeInsurance = valueDeduction(
				"Sanlam Life Insurance",
				reportedPayroll[staffPay].currentMonthSalary.otherDeductions
			);
			breakDownStaff.matLeaveEmployeeDed =
				reportedPayroll[
					staffPay
				].currentMonthSalary.staffMaternityLeave;
			breakDownStaff.matLeaveCompContrib =
				reportedPayroll[staffPay].currentMonthSalary.cieMaternityLeave;
			breakDownStaff.SFAR = valueDeduction(
				"SFAR",
				reportedPayroll[staffPay].currentMonthSalary.otherDeductions
			);
			breakDownStaff.shortageDeductions = valueDeduction(
				"Shortage Deductions",
				reportedPayroll[staffPay].currentMonthSalary.otherDeductions
			);
			breakDownStaff.PAYE =
				reportedPayroll[staffPay].currentMonthSalary.payeTPR;

			breakDownStaff.staffLoansConsolidated = valueDeduction(
				"Staff Loans - Consolidated",
				reportedPayroll[staffPay].currentMonthSalary.otherDeductions
			);
			breakDownStaff.staffSavingsConsolidated = valueDeduction(
				"Staff Savings - Consolidated",
				reportedPayroll[staffPay].currentMonthSalary.otherDeductions
			);
			breakDownStaff.CSREmployeeDeduction =
				reportedPayroll[staffPay].currentMonthSalary.staffCSR;
			breakDownStaff.CSREmployerContr =
				reportedPayroll[staffPay].currentMonthSalary.cieCSR;
			breakDownStaff.communityHealthyBasedScheme =
				reportedPayroll[staffPay].currentMonthSalary.cieCommunityHealth;
			breakDownStaff.totalDeductions =
				reportedPayroll[
					staffPay
				].currentMonthSalary.totalStaffDeductions;

			breakDownStaff.netSalary =
				reportedPayroll[staffPay].currentMonthSalary.netSalary;
			breaDownPayroll.push(breakDownStaff);
		}
		let breakDownPayrollArray = makeArrayToExport(breaDownPayroll);
		//Saving to collection
		try {
			const options = { ordered: true };
			await Tb04_PayrollBreakDown.deleteMany({
				salaryYear: yearSalary,
				salaryMonth: monthSalary,
			});
			await Tb04_PayrollBreakDown.insertMany(breaDownPayroll, options);
		} catch (error) {
			return res.status(401).json({
				error: "Unable to save data",
			});
		}

		///////////////Exporting payroll breakdown//////////////////////////
		return res.json({ breakDownPayrollArray });
		/////////////////////////////////////////////////////////////////////
	} else {
		return res.status(400).json({
			error: `Payroll of ${monthSalary} ${yearSalary} not found. Please try again later.`,
		});
	}
};

valueAllowance = (allowanceName, allowances) => {
	let indexOtherAllowance = allowances.findIndex(
		(otherAllowance) => otherAllowance.allowanceName === allowanceName
	);
	return indexOtherAllowance !== -1
		? allowances[indexOtherAllowance].allowanceAmount
		: 0;
};

valueDeduction = (deductionName, deductions) => {
	let indexOtherDeduction = deductions.findIndex(
		(otherDeduction) => otherDeduction.deductionName === deductionName
	);
	return indexOtherDeduction !== -1
		? deductions[indexOtherDeduction].deductionAmount
		: 0;
};

makeArrayToExport = (arrayReceived) => {
	let breakDownPayroll = [
		[
			"Employee Code",
			"Employee Names",
			"Date of birth",
			"Gender",
			"Email",
			"Phone",
			"Officer Code",
			"Appointment Date",
			"Contract Type",
			"Job Title",
			"Report To",
			"Contract End Date",
			"Branch",
			"Division",
			"Department",
			"Function Type",
			"Month",
			"Year",
			"Basic Salary",
			"bonus",
			"Adjustment",
			"Incentives",
			"responsibilityAllowance",
			"Rental Cost Allowance",
			"Overtime",
			"Internet Allowance",
			"Techn. Allowance",
			"Transport Allowance",
			"Teller Allowance",
			"Transport Allowance - Relocation",
			"Gross Earnings",
			"Communication Allowance",
			"Lunch Payments",
			"sportsFitnessFees",
			"Advance Deduction",
			"Medical Expenses Deficit",
			"Sanlam Life Insurance",
			"Mat. Leave - Employee Deduction",
			"Mat. Leave - Employer Contribution",
			"SFAR",
			"Shortage Deductions",
			"P.A.Y.E",
			"Staff Loans Consolidated",
			"Staff Savings Consolidated",
			"CSR Employee Deduction",
			"CSR Employer Contribution",
			"community Healthy Based Scheme",
			"Total Deductions",
			"Net Salary",
		],
	];
	try {
		for (rec in arrayReceived) {
			let record = [
				'"' +
					arrayReceived[rec].empCode +
					'","' +
					arrayReceived[rec].empNames +
					'","' +
					arrayReceived[rec].dob +
					'","' +
					arrayReceived[rec].gender +
					'","' +
					arrayReceived[rec].email +
					'","' +
					arrayReceived[rec].phone +
					'","' +
					arrayReceived[rec].officerCode +
					'","' +
					arrayReceived[rec].appointedDate +
					'","' +
					arrayReceived[rec].contractType +
					'","' +
					arrayReceived[rec].jobTitle +
					'","' +
					arrayReceived[rec].reportTo +
					'","' +
					arrayReceived[rec].contractEndDate +
					'","' +
					arrayReceived[rec].branchName +
					'","' +
					arrayReceived[rec].divName +
					'","' +
					arrayReceived[rec].department +
					'","' +
					arrayReceived[rec].functionType +
					'","' +
					arrayReceived[rec].salaryMonth +
					'","' +
					arrayReceived[rec].salaryYear +
					'","' +
					arrayReceived[rec].basicSalary +
					'","' +
					arrayReceived[rec].bonus +
					'","' +
					arrayReceived[rec].adjustment +
					'","' +
					arrayReceived[rec].incentives +
					'","' +
					arrayReceived[rec].responsibilityAllowance +
					'","' +
					arrayReceived[rec].rentalCostAllowance +
					'","' +
					arrayReceived[rec].overtime +
					'","' +
					arrayReceived[rec].internetAllowance +
					'","' +
					arrayReceived[rec].technAllowance +
					'","' +
					arrayReceived[rec].transportAllowance +
					'","' +
					arrayReceived[rec].tellerAllowance +
					'","' +
					arrayReceived[rec].transportAllRelocation +
					'","' +
					arrayReceived[rec].grossEarnings +
					'","' +
					arrayReceived[rec].communicationAllowance +
					'","' +
					arrayReceived[rec].lunchPayments +
					'","' +
					arrayReceived[rec].sportsFitnessFees +
					'","' +
					arrayReceived[rec].advanceDeduction +
					'","' +
					arrayReceived[rec].medicalExpensesDeficit +
					'","' +
					arrayReceived[rec].sanlamLifeInsurance +
					'","' +
					arrayReceived[rec].matLeaveEmployeeDed +
					'","' +
					arrayReceived[rec].matLeaveCompContrib +
					'","' +
					arrayReceived[rec].SFAR +
					'","' +
					arrayReceived[rec].shortageDeductions +
					'","' +
					arrayReceived[rec].PAYE +
					'","' +
					arrayReceived[rec].staffLoansConsolidated +
					'","' +
					arrayReceived[rec].staffSavingsConsolidated +
					'","' +
					arrayReceived[rec].CSREmployeeDeduction +
					'","' +
					arrayReceived[rec].CSREmployerContr +
					'","' +
					arrayReceived[rec].communityHealthyBasedScheme +
					'","' +
					arrayReceived[rec].totalDeductions +
					'","' +
					arrayReceived[rec].netSalary +
					'"',
			];
			breakDownPayroll.push(record);
		}
		return breakDownPayroll;
	} catch (error) {
		console.log(error);
	}
};

makeArrayAccountEntry = (arrayReceived) => {
	let accountingEntry = [
		[
			"Contract Type",
			"Branch Name",
			"Department",
			"Function Type",
			"Basic Salary",
			"Bonus",
			"Adjustment",
			"Incentives",
			"Overtime",
			"Resp. Allowance",
			"Internet Allowance",
			"Rental Cost Allowance",
			"Techn. Allowance",
			"Transport Allowance",
			"Teller Allowance",
			"Gross Earnings",
			"Commun. Allowance",
			"Lunch Payments",
			"Sport and Fitness Fees",
			"Advance Deduction",
			"Medical Exp. Deficit",
			"Sanlam Life Insurance",
			"Mat. Leave Employee Deduction",
			"Mat. Leave Employer Contribution",
			"SFAR",
			"Shortage Deduction",
			"P.A.Y.E.",
			"Staff Loan Consolidated",
			"Staff Savings Consolidated",
			"CSR Employee Deduction",
			"CSR Employer Contribution",
			"Community Health Based Scheme",
			"Total Deductions",
			"Net Salary",
		],
	];
	try {
		for (rec in arrayReceived) {
			let record = [
				'"' +
					arrayReceived[rec]._id.contractType +
					'","' +
					arrayReceived[rec]._id.branchName +
					'","' +
					arrayReceived[rec]._id.department +
					'","' +
					arrayReceived[rec]._id.functionType +
					'","' +
					arrayReceived[rec].basicSalary +
					'","' +
					arrayReceived[rec].bonus +
					'","' +
					arrayReceived[rec].adjustment +
					'","' +
					arrayReceived[rec].incentives +
					'","' +
					arrayReceived[rec].overtime +
					'","' +
					arrayReceived[rec].responsibilityAllowance +
					'","' +
					arrayReceived[rec].internetAllowance +
					'","' +
					arrayReceived[rec].rentalCostAllowance +
					'","' +
					arrayReceived[rec].technAllowance +
					'","' +
					arrayReceived[rec].transportAllowance +
					'","' +
					arrayReceived[rec].tellerAllowance +
					'","' +
					arrayReceived[rec].grossEarnings +
					'","' +
					arrayReceived[rec].communicationAllowance +
					'","' +
					arrayReceived[rec].lunchPayments +
					'","' +
					arrayReceived[rec].sportsFitnessFees +
					'","' +
					arrayReceived[rec].advanceDeduction +
					'","' +
					arrayReceived[rec].medicalExpensesDeficit +
					'","' +
					arrayReceived[rec].sanlamLifeInsurance +
					'","' +
					arrayReceived[rec].matLeaveEmployeeDed +
					'","' +
					arrayReceived[rec].matLeaveCompContrib +
					'","' +
					arrayReceived[rec].SFAR +
					'","' +
					arrayReceived[rec].shortageDeductions +
					'","' +
					arrayReceived[rec].PAYE +
					'","' +
					arrayReceived[rec].staffLoansConsolidated +
					'","' +
					arrayReceived[rec].staffSavingsConsolidated +
					'","' +
					arrayReceived[rec].CSREmployeeDeduction +
					'","' +
					arrayReceived[rec].CSREmployerContr +
					'","' +
					arrayReceived[rec].communityHealthyBasedScheme +
					'","' +
					arrayReceived[rec].totalDeductions +
					'","' +
					arrayReceived[rec].netSalary +
					'"',
			];
			accountingEntry.push(record);
		}

		return accountingEntry;
	} catch (error) {
		console.log(error);
	}
};

makeSummarySalary = (objectReceived) => {
	let summaryData = [["TRANSACTIONS", "PERIOD AMOUNT"]];
	try {
		let record = ['"Basic Salary","' + objectReceived.basicSalary + '"'];
		summaryData.push(record);
		record = ['"Bonus","' + objectReceived.bonus + '"'];
		summaryData.push(record);
		record = ['"Adjustment","' + objectReceived.adjustment + '"'];
		summaryData.push(record);
		record = ['"Indentives","' + objectReceived.incentives + '"'];
		summaryData.push(record);
		record = ['"Overtime","' + objectReceived.overtime + '"'];
		summaryData.push(record);
		record = [
			'"Responsibility Allowance","' +
				objectReceived.responsibilityAllowance +
				'"',
		];
		summaryData.push(record);
		record = [
			'"Internet Allowance","' + objectReceived.internetAllowance + '"',
		];
		summaryData.push(record);
		record = [
			'"Rental Cost Allowance","' +
				objectReceived.rentalCostAllowance +
				'"',
		];
		summaryData.push(record);
		record = ['"Techn. Allowance","' + objectReceived.technAllowance + '"'];
		summaryData.push(record);
		record = [
			'"Transport Allowance","' + objectReceived.transportAllowance + '"',
		];
		summaryData.push(record);
		record = [
			'"Teller Allowance","' + objectReceived.tellerAllowance + '"',
		];
		summaryData.push(record);
		record = ['"Gross Earnings","' + objectReceived.grossEarnings + '"'];
		summaryData.push(record);
		record = [
			'"Comm. Allowance Deduction","' +
				objectReceived.communicationAllowance +
				'"',
		];
		summaryData.push(record);
		record = ['"Lunch Payments","' + objectReceived.lunchPayments + '"'];
		summaryData.push(record);
		record = [
			'"Sport and Fitness Fees","' +
				objectReceived.sportsFitnessFees +
				'"',
		];
		summaryData.push(record);
		record = [
			'"Advance Deduction","' + objectReceived.advanceDeduction + '"',
		];
		summaryData.push(record);
		record = [
			'"Medical Expenses Deficit","' +
				objectReceived.medicalExpensesDeficit +
				'"',
		];
		summaryData.push(record);
		record = [
			'"Sanlam Life Insurance","' +
				objectReceived.sanlamLifeInsurance +
				'"',
		];
		summaryData.push(record);
		record = [
			'"Mat. Leave Emp. Deduction","' +
				objectReceived.matLeaveEmployeeDed +
				'"',
		];
		summaryData.push(record);
		record = ['"SFAR","' + objectReceived.SFAR + '"'];
		summaryData.push(record);
		record = [
			'"Shortage Deductions","' + objectReceived.shortageDeductions + '"',
		];
		summaryData.push(record);
		record = [
			'"CSR Employee Deduction","' +
				objectReceived.CSREmployeeDeduction +
				'"',
		];
		summaryData.push(record);
		record = ['"P.A.Y.E","' + objectReceived.PAYE + '"'];
		summaryData.push(record);
		record = [
			'"Staff Loan consolidated","' +
				objectReceived.staffLoansConsolidated +
				'"',
		];
		summaryData.push(record);
		record = [
			'"Staff Saving consolidated","' +
				objectReceived.staffSavingsConsolidated +
				'"',
		];
		summaryData.push(record);
		record = [
			'"Mat. Leave Employer Contr.","' +
				objectReceived.matLeaveCompContrib +
				'"',
		];
		summaryData.push(record);
		record = [
			'"CSR Employer Contr.","' + objectReceived.CSREmployerContr + '"',
		];
		summaryData.push(record);
		record = [
			'"Community Healthy Based Scheme","' +
				objectReceived.communityHealthyBasedScheme +
				'"',
		];
		summaryData.push(record);
		record = [
			'"Total Deductions","' + objectReceived.totalDeductions + '"',
		];
		summaryData.push(record);
		record = ['"Net Salary","' + objectReceived.netSalary + '"'];
		summaryData.push(record);
		return summaryData;
	} catch (error) {
		console.log(error);
	}
};
