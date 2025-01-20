const Tb01_Employee = require("../models/tb01_employee");
const Tb01_IncentiveStaff = require("../models/tb01_incentiveStaff");
const {
	calcMonthlyIncentiveSales,
	calcMonthlyIncentiveBM,
	isNumeric,
	monthDiff,
} = require("../helpers/utilityFunctions");

exports.editIncentive = async (req, res) => {
	const { overpaidAmount } = req.body;
	Tb01_IncentiveStaff.findOneAndUpdate(
		{ _id: req.params.incentiveid },
		{
			overpaidAmount,
		}
	).exec((err, incent) => {
		if (err) {
			return res.status(400).json({
				error: "Unable to update the incentive!",
			});
		}
		return res.status(200).json({
			message: `Incentive updated successfuly.`,
		});
	});
};

exports.calculateIncentiveStaff = async (req, res) => {
	const { salaryYear, salaryMonth } = req.body;
	const monthlyIncentives = await Tb01_IncentiveStaff.find({
		yearIncentive: salaryYear,
		monthIncentive: salaryMonth,
		// "currentAppointment.branch": "Muhanga",
		// empCode: 900473,
	}).exec();
	if (monthlyIncentives.length <= 0) {
		return res.status(400).json({
			error: `Unable to find incentives for ${salaryMonth} ${salaryYear}`,
		});
	}
	try {
		for (monthIncent in monthlyIncentives) {
			if (
				monthlyIncentives[monthIncent].officerCode &&
				monthlyIncentives[monthIncent].officerCode > 0
			) {
				let incentiveData = {
					yearIncentive: salaryYear,
					monthIncentive: salaryMonth,
					empCode: monthlyIncentives[monthIncent].empCode,
					officerCode: monthlyIncentives[monthIncent].officerCode,
					jobTitle: monthlyIncentives[monthIncent].jobTitle,
					branchName: monthlyIncentives[monthIncent].branchName,
				};
				let calculatedValues = await calcMonthlyIncentiveSales(
					incentiveData
				);
			}
		}
		return res.json({
			message: `Moththly staff incentives of ${salaryMonth} ${salaryYear} are successfuly computed.`,
		});
	} catch (error) {
		// console.log(error);
		return res.status(400).json({
			error: `Unable to compute staff incentives for ${salaryMonth} ${salaryYear}`,
		});
	}
};

exports.applySalesIncentives = async (req, res) => {
	const { salaryYear, salaryMonth } = req.body;
	const incentivesToApply = await Tb01_IncentiveStaff.findOne({
		yearIncentive: salaryYear,
		monthIncentive: salaryMonth,
		applied: "NON",
	}).exec();
	if (!incentivesToApply) {
		return res.status(400).json({
			error: `Unable to perform this action. Incentives for ${salaryMonth} ${salaryYear} have been merged with salary or are not found!`,
		});
	}
	const activeStaffs = await Tb01_Employee.find({
		"currentAppointment.active": true,
	}).exec();
	if (!activeStaffs || activeStaffs.length === 0) {
		return res.status(400).json({
			error: `No staff found!`,
		});
	}
	if (activeStaffs[0].currentMonthSalary.salaryStatus !== "INITIALIZED") {
		return res.status(400).json({
			error: `${activeStaffs[0].currentMonthSalary.salaryMonth}, ${activeStaffs[0].currentMonthSalary.salaryYear} payroll is not yet approved. Incentives can be applied only when current salary is INITIALIZED!`,
		});
	}
	for (emp in activeStaffs) {
		let currentIncentives = [];
		if (activeStaffs[emp].empCode && activeStaffs[emp].officerCode) {
			currentIncentives = await Tb01_IncentiveStaff.find({
				applied: "NON",
				empCode: activeStaffs[emp].empCode,
				officerCode: activeStaffs[emp].officerCode,
			}).exec();
		}
		if (currentIncentives.length > 0) {
			applyOneIncentive(currentIncentives, activeStaffs[emp]);
		}
	}
	try {
		await Tb01_IncentiveStaff.updateMany(
			{
				yearIncentive: salaryYear,
				monthIncentive: salaryMonth,
				applied: "NON",
			},
			{
				$set: {
					applied: "YES",
					monthAppliedTo:
						activeStaffs[0].currentMonthSalary.salaryMonth,
					yearAppliedTo:
						activeStaffs[0].currentMonthSalary.salaryYear,
				},
			}
		);
		return res.status(200).json({
			message: "Staff incentives are merged with current month salary!",
		});
	} catch (error) {
		return res.status(400).json({
			error: `Unable to merge incentives with current monthly salary!`,
		});
	}
};

const applyOneIncentive = async (currentIncentives, employee) => {
	let cumulativeIncentives = currentIncentives.reduce(function (acc, curr) {
		return acc + curr.incentiveNet;
	}, 0);
	let staffOtherAllowances = [];
	let incentiveAllowance = {};
	incentiveAllowance.allowanceName = "Incentives";
	incentiveAllowance.allowanceComment = "Monthly Staff Allowance";
	incentiveAllowance.allowanceAmount = cumulativeIncentives;
	incentiveAllowance.isRepeated = "NON";
	if (
		employee.currentMonthSalary &&
		employee.currentMonthSalary.otherAllowances
	) {
		staffOtherAllowances = employee.currentMonthSalary.otherAllowances;
		const incentiveIndex = staffOtherAllowances.findIndex(
			(incentive) => incentive.allowanceName === "Incentives" ///Make sure this is the name in basic data table
		);
		if (incentiveIndex !== -1) {
			staffOtherAllowances[incentiveIndex] === incentiveAllowance;
		} else {
			staffOtherAllowances.push(incentiveAllowance);
		}
	} else {
		staffOtherAllowances.push(incentiveAllowance);
	}
	Tb01_Employee.findOneAndUpdate(
		{ _id: employee._id },
		{
			"currentMonthSalary.otherAllowances": staffOtherAllowances,
		}
	).exec((err, allowance) => {
		if (err) {
			return false;
		}
		return true;
	});
};

exports.applyBMIncentives = async (req, res) => {};

exports.calculateIncentiveBM = async (req, res) => {
	const { performanceYear, performanceQuarter } = req.body;
	incentiveData = {
		performanceYear,
		performanceQuarter,
	};
	const calculatedValues = await calcMonthlyIncentiveBM(incentiveData);
	return res.json({
		calculatedValues,
	});
};

exports.readIncentive = async (req, res) => {
	// console.log(req.params.incentiveid)
	const myIncentive = await Tb01_IncentiveStaff.findOne({
		_id: req.params.incentiveid,
		applied: "NON",
	});
	if (!myIncentive || myIncentive === null) {
		return res.json({
			message: "Incentive not found!",
		});
	}
	// console.log(myIncentive);
	return res.json({ myIncentive });
};

exports.listIncentives = async (req, res) => {
	const myIncentives = await Tb01_IncentiveStaff.find({
		applied: "NON",
	}).sort({ branchName: 1, officerCode: 1 });
	if (!myIncentives || myIncentives === null) {
		return res.json({
			message: "Incentives not found!",
		});
	}
	return res.json({ myIncentives });
};

exports.listSearchedIncentives = async (req, res) => {
	const { searchValue } = req.body;
	const myIncentives = await Tb01_IncentiveStaff.find({
		applied: "NON",
		$or: [
			{ empCode: isNumeric(searchValue) ? searchValue : -1 },
			{ officerCode: isNumeric(searchValue) ? searchValue : -1 },
			{ empNames: { $regex: ".*(?i)" + searchValue + ".*(?i)" } },
			{ branchName: { $regex: ".*(?i)" + searchValue + ".*(?i)" } },
			{ jobTitle: { $regex: ".*(?i)" + searchValue + ".*(?i)" } },
		],
	}).sort({ branchName: 1, officerCode: 1 });
	return res.json({ myIncentives });
};

exports.listSalesOfficers = async (req, res) => {
	const { branchName } = req.body;
	const saleOfficers = await Tb01_Employee.find({
		"currentAppointment.branch": branchName,
		// $or: [
		// 	{ "currentAppointment.jobTitle": "Individual Sales Officer" },
		// 	{ "currentAppointment.jobTitle": "Group Sales Officer"},
		// ],
	}).sort({ empNames: 1 });
	return res.json({ saleOfficers });
};

exports.editSupervision = async (req, res) => {
	const { staffSupervision } = req.body;
	// console.log(staffSupervision)
	Tb01_Employee.findOneAndUpdate(
		{ _id: req.params.supervisorid },
		{
			"currentMonthSalary.teamLeading": staffSupervision,
		}
	).exec((err, sup) => {
		if (err) {
			return res.status(400).json({
				error: "Unable to update the supervision!",
			});
		}
		return res.status(200).json({
			message: `Incentive updated successfuly.`,
		});
	});
};

exports.loadIncentiveData = async (req, res) => {
	//Check if the status is not APPROVED or VALIDATED
	const oneActiveStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
	}).exec();
	if (oneActiveStaff.currentMonthSalary.salaryStatus !== "INITIALIZED") {
		return res.status(400).json({
			error: `To be able to load incentive data, salary must be INITIALIZED!`,
		});
	}
	const activeStaffs = await Tb01_Employee.find({
		"currentAppointment.active": true,
		"currentAppointment.branch": { $ne: "Head Office" },
	}).exec();

	//===================Remove current month incentive data, if any==============================================
	await Tb01_IncentiveStaff.deleteMany({
		yearIncentive: activeStaffs[0].currentMonthSalary.salaryYear,
		monthIncentive: activeStaffs[0].currentMonthSalary.salaryMonth,
		// applied: "NON",
	}).exec();

	//===================Insert current month incentive data from Tb01_Employees==================================
	for (emp in activeStaffs) {
		let staffStatus = "";
		if (
			monthDiff([
				activeStaffs[emp].currentAppointment.jobTitleDate,
				new Date(),
			]) < 6
		) {
			staffStatus = "New";
		} else {
			staffStatus = "Existing";
		}
		let newIncentiveData = new Tb01_IncentiveStaff({
			yearIncentive: activeStaffs[emp].currentMonthSalary.salaryYear,
			monthIncentive: activeStaffs[emp].currentMonthSalary.salaryMonth,
			empNames: activeStaffs[emp].empNames,
			empCode: activeStaffs[emp].empCode,
			officerCode: activeStaffs[emp].officerCode,
			branchName: activeStaffs[emp].currentAppointment.branch,
			jobTitle: activeStaffs[emp].currentAppointment.jobTitle,
			jobTitleDate: activeStaffs[emp].currentAppointment.jobTitleDate,
			staffExistingNew: staffStatus,
			disbursedAmount: 0,
			disbursedClients: 0,
			repaidAmount: 0,
			ppalAreaDue: 0,
			branchDisbusedClients: 0,
			branchDisbusedAmount: 0,
			IncentiveBeforeDelequency: 0,
			BranchBenefitBeforeDelequency: 0,
			TotalIncentiveBeforeDelequency: 0,
			IncentiveAfterDelequency: 0,
			DelequencyDiscounter: 0,
			incentiveNet: 0,
			incentiveNet2: 0,
		});
		newIncentiveData.save((err, result) => {
			if (err) {
				console.log(err);
				console.log(
					`Unable to load ${activeStaffs[0].currentMonthSalary.salaryMonth} ${activeStaffs[0].currentMonthSalary.salaryYear} incentive data.`
				);
			}
		});
	}
	return res.json({
		message: `Incentive data for ${activeStaffs[0].currentMonthSalary.salaryMonth} ${activeStaffs[0].currentMonthSalary.salaryYear} are loaded!`,
	});
};

exports.loadIncentiveFileData = async (req, res) => {
	//Check if the status is not APPROVED or VALIDATED

	const oneActiveStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
	}).exec();
	const monthIncentive = oneActiveStaff.currentMonthSalary.salaryMonth;
	const yearIncentive = oneActiveStaff.currentMonthSalary.salaryYear;
	/////////////////======================================///////////////////////////////////
	const { fileUploadText, array } = req.body;
	// console.log(array);
	try {
		for (rec in array) {
			if (fileUploadText === "incentive_data.csv") {
				let officerCode = array[rec].OFFICER_CODE
					? parseInt(array[rec].OFFICER_CODE)
					: 0;
				let disbursedAmount = array[rec].DISBURSEMENT_AMOUNT
					? parseInt(array[rec].DISBURSEMENT_AMOUNT)
					: 0;
				let disbursedClients = array[rec].DISBURSMENT_CLIENTS
					? parseInt(array[rec].DISBURSMENT_CLIENTS)
					: 0;
				let areaDue = array[rec].ARREARS
					? parseInt(array[rec].ARREARS)
					: 0;
				let repaidAmount = array[rec].REPAYMENT_AMOUNT
					? parseInt(array[rec].REPAYMENT_AMOUNT)
					: 0;
				let expectedPayment = repaidAmount + areaDue;
				// console.log(officerCode, monthIncentive, yearIncentive);
				if (officerCode > 0) {
					Tb01_IncentiveStaff.findOneAndUpdate(
						{ officerCode, monthIncentive, yearIncentive },
						{
							disbursedAmount,
							disbursedClients,
							ppalAreaDue: expectedPayment,
							repaidAmount,
						}
					).exec((err, emp) => {
						if (err) {
							console.log(err);
						}
					});
				}
			}
		}
		return res.status(200).json({
			message: `Data from ${fileUploadText} successfully loaded into the system.`,
		});
	} catch (error) {
		return res.status(400).json({
			error: `Unable to load data from ${fileUploadText} file. Please correct the file and try again.`,
		});
	}
};

exports.exportMontlyIncentives = async (req, res) => {
	const currentIncentives = await Tb01_IncentiveStaff.find({
		applied: "NON",
	})
		.sort({ branchName: 1, empNames: 1 })
		.exec();

	// const writeStream = fs.createWriteStream(
	// 	"C:/salaryExport/salaryValidation.csv"
	// );
	// const pathName = writeStream.path;
	let monthlyIncentives = [
		[
			"Month",
			"Year",
			"StaffID",
			"Names",
			"Job Title",
			"Branch",
			"Disbursed Amount",
			"Disbursed Clients",
			"Actual Repayment",
			"Expected Repayment",
			"Net Incentive",
		],
	];

	try {
		for (incent in currentIncentives) {
			// let accNumber = activeStaff[emp].currentMonthSalary.accountNumber
			// 	? activeStaff[emp].currentMonthSalary.accountNumber
			// 	: "Account not specified";
			// let bankName = activeStaff[emp].currentMonthSalary.bankName
			// 	? activeStaff[emp].currentMonthSalary.bankName
			// 	: "Bank not specified";
			let record = [
				'"' +
					currentIncentives[incent].monthIncentive +
					'","' +
					currentIncentives[incent].yearIncentive +
					'","' +
					currentIncentives[incent].empCode +
					'","' +
					currentIncentives[incent].empNames +
					'","' +
					currentIncentives[incent].jobTitle +
					'","' +
					currentIncentives[incent].branchName +
					'","' +
					currentIncentives[incent].disbursedAmount +
					'","' +
					currentIncentives[incent].disbursedClients +
					'","' +
					currentIncentives[incent].repaidAmount +
					'","' +
					currentIncentives[incent].ppalAreaDue +
					'","' +
					currentIncentives[incent].incentiveNet +
					'"',
			];
			monthlyIncentives.push(record);
		}
		return res.json({
			monthlyIncentives,
		});
	} catch (error) {
		return res.status(400).json({
			error: `Unable to export current incentives to file. ${error}`,
		});
	}
};

exports.listBranchIncentiveStaff = async (req, res) => {
	const currentStaff = await Tb01_Employee.findOne({
		officerCode: req.params.officerCode,
	}).exec();
	let incentivesBranchStaff = [];
	if (
		currentStaff.currentAppointment &&
		currentStaff.currentAppointment.branch
	) {
		incentivesBranchStaff = await Tb01_Employee.find({
			"currentAppointment.active": true,
			"currentAppointment.branch": currentStaff.currentAppointment.branch,
		}).sort({ empNames: 1 });
	}
	return res.json({ incentivesBranchStaff });
};

exports.swapIncentives = async (req, res) => {
	const {
		currentOfficerCode,
		replacingOfficerCode,
		yearIncentive,
		monthIncentive,
	} = req.body;

	const replacingStaff = await Tb01_Employee.findOne({
		officerCode: parseInt(replacingOfficerCode),
	}).exec();

	await Tb01_IncentiveStaff.findOneAndDelete({
		officerCode: parseInt(replacingOfficerCode),
		yearIncentive,
		monthIncentive,
	}).exec();

	Tb01_IncentiveStaff.findOneAndUpdate(
		{
			officerCode: parseInt(currentOfficerCode),
			yearIncentive,
			monthIncentive,
		},
		{
			empNames: replacingStaff.empNames,
			officerCode: replacingStaff.officerCode,
			empCode: replacingStaff.empCode,
			jobTitle: replacingStaff.currentAppointment.jobTitle,
		}
	).exec((err, incent) => {
		if (err) {
			return res.status(400).json({
				error: "Unable to swap the incentive!",
			});
		}
		return res.status(200).json({
			message: `Incentive swaped successfuly!`,
		});
	});
};
