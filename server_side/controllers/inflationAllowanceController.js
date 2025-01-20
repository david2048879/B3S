const fs = require("fs");
const Tb01_Employee = require("../models/tb01_employee");

const { calcInflationAllowance } = require("../helpers/utilityFunctions");

exports.addInflationAllowance = async (req, res) => {
	//Check if the status is not APPROVED or VALIDATED
	// let daysInCurrentMonth = new Date(/////////////////////////////////////////////
	// 	new Date().getFullYear(),
	// 	new Date().getMonth() + 1,
	// 	0
	// ).getDate();
	// console.log(daysInCurrentMonth);///////////////////////////////////////////////
	const oneActiveStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
		"inflationAllowance.salaryYear": { $ne: undefined },
		"inflationAllowance.salaryMonth": { $ne: undefined },
	}).exec();
	if (
		oneActiveStaff.inflationAllowance.salaryStatus === "APPROVED" ||
		oneActiveStaff.inflationAllowance.salaryStatus === "VALIDATED"
	) {
		return res.status(400).json({
			error: `Inflation allowance is ${oneActiveStaff.inflationAllowance.salaryStatus}. No more edits can be done!`,
		});
	} else {
		//Updating inflation allowance for a staff
		const { bankName, accountNumber, allowanceAmount, adjustmentAmount } =
			req.body;
		Tb01_Employee.findOneAndUpdate(
			{ _id: req.params.employeeid },
			{
				"inflationAllowance.salaryYear":
					oneActiveStaff.inflationAllowance.salaryYear,
				"inflationAllowance.salaryMonth":
					oneActiveStaff.inflationAllowance.salaryMonth,
				"inflationAllowance.bankName": bankName,
				"inflationAllowance.accountNumber": accountNumber,
				"inflationAllowance.allowanceAmount": allowanceAmount,
				"inflationAllowance.adjustmentAmount": adjustmentAmount,
				"inflationAllowance.payDate": new Date(),
			}
		).exec((err, emp) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to update inflation allowance!",
				});
			} else {
				//Compute the inflation allowance for one staff
				let currentInflationAllowance = {};
				currentInflationAllowance.empID = req.params.employeeid;
				currentInflationAllowance.allowanceAmount = allowanceAmount;
				currentInflationAllowance.adjustmentAmount = adjustmentAmount;
				const calculationDone = calcInflationAllowance(
					currentInflationAllowance
				);
				if (calculationDone) {
					return res.json({
						message: `Inflation allowance updated successfuly.`,
					});
				} else {
					return res.status(400).json({
						error: "Unable to update inflation allowance!",
					});
				}
			}
		});
	}
};

exports.computeInflationAllowance = async (req, res) => {
	//Check if the status is not APPROVED or VALIDATED

	const oneActiveStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
		"inflationAllowance.salaryYear": { $ne: undefined },
		"inflationAllowance.salaryMonth": { $ne: undefined },
	}).exec();
	if (
		oneActiveStaff.inflationAllowance.salaryStatus === "APPROVED" ||
		oneActiveStaff.inflationAllowance.salaryStatus === "VALIDATED"
	) {
		return res.status(400).json({
			error: `Inflation allowance is ${oneActiveStaff.inflationAllowance.salaryStatus}. No more computation can be done!`,
		});
	} else {
		//Compute inflation allowance for all staff
		const allStaff = await Tb01_Employee.find({
			"currentAppointment.active": true,
		}).exec();
		try {
			for (infl in allStaff) {
				let currentInflationAllowance = {};
				currentInflationAllowance.empID = allStaff[infl]._id;
				currentInflationAllowance.allowanceAmount =
					allStaff[infl].inflationAllowance.allowanceAmount;
				currentInflationAllowance.adjustmentAmount =
					allStaff[infl].inflationAllowance.adjustmentAmount;
				calcInflationAllowance(currentInflationAllowance);
			}
			return res.status(200).json({
				message: `Inflation allowance calculations for ${allStaff[0].inflationAllowance.salaryMonth} ${allStaff[0].inflationAllowance.salaryYear} is completed!.`,
			});
		} catch (error) {
			return res.status(400).json({
				error: `Unable to complete inflation allowance calculations for ${allStaff[0].inflationAllowance.salaryMonth} ${allStaff[0].inflationAllowance.salaryYear}!`,
			});
		}
	}
};

exports.excelInflationAllowance = async (req, res) => {
	let yearSalary, monthSalary;
	const oneStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
		"inflationAllowance.salaryMonth": { $ne: undefined },
		"inflationAllowance.salaryYear": { $ne: undefined },
	});

	yearSalary = oneStaff.inflationAllowance.salaryYear
		? oneStaff.inflationAllowance.salaryYear
		: new Date().getFullYear();
	monthSalary = oneStaff.inflationAllowance.salaryMonth
		? oneStaff.inflationAllowance.salaryMonth
		: new Date().toLocaleString("default", { month: "long" });

	const reportedInflationAllowance = await Tb01_Employee.find({
		"currentAppointment.active": true,
		"inflationAllowance.netSalary": { $gt: 0 },
	}).sort({ empCode: 1 });
	if (reportedInflationAllowance && reportedInflationAllowance.length > 0) {
		let inflationAllowances = [];
		for (staffPay in reportedInflationAllowance) {
			let inflAllowance = {};
			inflAllowance.empCode =
				reportedInflationAllowance[staffPay].empCode;
			inflAllowance.empNames =
				reportedInflationAllowance[staffPay].empNames;
			inflAllowance.officerCode = reportedInflationAllowance[staffPay]
				.officerCode
				? reportedInflationAllowance[staffPay].officerCode
				: "";
			inflAllowance.appointedDate = reportedInflationAllowance[staffPay]
				.currentAppointment.appointedDate
				? reportedInflationAllowance[
						staffPay
				  ].currentAppointment.appointedDate
						.toISOString()
						.slice(0, 10)
				: "";
			inflAllowance.contractType =
				reportedInflationAllowance[
					staffPay
				].currentAppointment.contractType;
			inflAllowance.jobTitle =
				reportedInflationAllowance[
					staffPay
				].currentAppointment.jobTitle;
			inflAllowance.reportTo =
				reportedInflationAllowance[
					staffPay
				].currentAppointment.reportTo;
			inflAllowance.contractEndDate = reportedInflationAllowance[staffPay]
				.currentAppointment.contractEndDate
				? reportedInflationAllowance[
						staffPay
				  ].currentAppointment.contractEndDate
						.toISOString()
						.slice(0, 10)
				: "";
			inflAllowance.branchName =
				reportedInflationAllowance[staffPay].currentAppointment.branch;
			inflAllowance.dptName =
				reportedInflationAllowance[
					staffPay
				].currentAppointment.department;
			if (
				reportedInflationAllowance[staffPay].currentAppointment.jobTitle
					.toUpperCase()
					.includes("SALES")
			) {
				inflAllowance.functionType = "Lending Officer";
			} else {
				inflAllowance.functionType = "Admin";
			}
			inflAllowance.salaryMonth = monthSalary;
			inflAllowance.salaryYear = yearSalary;

			inflAllowance.allowanceAmount =
				reportedInflationAllowance[
					staffPay
				].inflationAllowance.allowanceAmount;
			inflAllowance.adjustment =
				reportedInflationAllowance[
					staffPay
				].inflationAllowance.adjustmentAmount;

			inflAllowance.CSREmployeeDeduction =
				reportedInflationAllowance[
					staffPay
				].inflationAllowance.staffCSR;
			inflAllowance.CSREmployerContr =
				reportedInflationAllowance[staffPay].inflationAllowance.cieCSR;

			inflAllowance.MatLeaveEmployeeDeduction =
				reportedInflationAllowance[
					staffPay
				].inflationAllowance.staffMaternityLeave;
			inflAllowance.MatLeaveEmployerContr =
				reportedInflationAllowance[
					staffPay
				].inflationAllowance.cieMaternityLeave;
			inflAllowance.PAYE =
				reportedInflationAllowance[staffPay].inflationAllowance.payeTPR;
			inflAllowance.communityHealthyBasedScheme =
				reportedInflationAllowance[
					staffPay
				].inflationAllowance.cieCommunityHealth;
			inflAllowance.totalDeductions =
				reportedInflationAllowance[
					staffPay
				].inflationAllowance.totalStaffDeductions;

			inflAllowance.netSalary =
				reportedInflationAllowance[
					staffPay
				].inflationAllowance.netSalary;

			inflationAllowances.push(inflAllowance);
		}
		let inflationAllowanceArray =
			makeArrayToExportInflAllowance(inflationAllowances);

		///////////////Exporting payroll breakdown//////////////////////////
		return res.json({ inflationAllowanceArray });
		/////////////////////////////////////////////////////////////////////
	} else {
		return res.status(400).json({
			error: `Inflation allowance of ${monthSalary} ${yearSalary} not found. Please try again later.`,
		});
	}
};

makeArrayToExportInflAllowance = (arrayReceived) => {
	let exportInflationAllowance = [
		[
			"Employee Code",
			"Employee Names",
			"Officer Code",
			"Appointment Date",
			"Contract Type",
			"Job Title",
			"Report To",
			"Contract End Date",
			"Branch",
			"Department",
			"Function Type",
			"Month",
			"Year",
			"Allowance Amount",
			"Adjustment",
			"Mat. Leave - Employee Deduction",
			"Mat. Leave - Employer Contribution",
			"P.A.Y.E",
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
					arrayReceived[rec].dptName +
					'","' +
					arrayReceived[rec].functionType +
					'","' +
					arrayReceived[rec].salaryMonth +
					'","' +
					arrayReceived[rec].salaryYear +
					'","' +
					arrayReceived[rec].allowanceAmount +
					'","' +
					arrayReceived[rec].adjustment +
					'","' +
					arrayReceived[rec].MatLeaveEmployeeDeduction +
					'","' +
					arrayReceived[rec].MatLeaveEmployerContr +
					'","' +
					arrayReceived[rec].PAYE +
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
			exportInflationAllowance.push(record);
		}
		return exportInflationAllowance;
	} catch (error) {
		console.log(error);
	}
};

exports.txtInflationAllowance = async (req, res) => {
	const activeStaff = await Tb01_Employee.find({
		"currentAppointment.active": true,
		"inflationAllowance.netSalary": { $gt: 0 },
		"inflationAllowance.bankName": "Urwego Bank",
	}).exec();
	//Check if the status is 'APPROVED'
	if (activeStaff[0].inflationAllowance.salaryStatus !== "APPROVED") {
		return res.status(400).json({
			error: `${activeStaff[0].inflationAllowance.salaryMonth}, ${activeStaff[0].inflationAllowance.salaryYear} inflation allowance is not yet approved. You can export it only when APPROVED!`,
		});
	}
	let txtInflationAllowance = [];
	try {
		for (emp in activeStaff) {
			let seqNumber = parseInt(emp) + 1;
			let accNumber = activeStaff[emp].inflationAllowance.accountNumber
				? activeStaff[emp].inflationAllowance.accountNumber
				: "Employee account not specified";
			let bankNames = activeStaff[emp].inflationAllowance.bankName
				? activeStaff[emp].inflationAllowance.bankName
				: "Bank not specified";
			let salMonth = "MonthNotSpecified";
			if (
				activeStaff[emp].inflationAllowance &&
				activeStaff[emp].inflationAllowance.salaryMonth
			) {
				salMonth =
					activeStaff[
						emp
					].inflationAllowance.salaryMonth.toUpperCase();
			}
			let record = [
				seqNumber +
					"|" +
					activeStaff[emp].inflationAllowance.salaryYear +
					"|" +
					activeStaff[emp].inflationAllowance.salaryMonth +
					"|" +
					activeStaff[emp].empCode +
					"|AC|RWF1820210200001|RWF|" +
					activeStaff[emp].inflationAllowance.netSalary +
					"|RWF|" +
					bankNames +
					"|" +
					accNumber +
					"|SAL" +
					salMonth +
					activeStaff[emp].inflationAllowance.salaryYear,
			];
			txtInflationAllowance.push(record);
		}

		return res.json({
			txtInflationAllowance,
		});
	} catch (error) {
		return res.status(400).json({
			error: `Unable to export ${activeStaff[0].inflationAllowance.salaryMonth}, ${activeStaff[0].inflationAllowance.salaryYear} inflation allowance to file. ${error}`,
		});
	}
};

exports.txtInflationAllowanceOB = async (req, res) => {
	const activeStaff = await Tb01_Employee.find({
		"currentAppointment.active": true,
		"inflationAllowance.netSalary": { $gt: 0 },
		"inflationAllowance.bankName": { $ne: "Urwego Bank" },
	}).exec();
	//Check if the status is 'APPROVED'
	if (activeStaff[0].inflationAllowance.salaryStatus !== "APPROVED") {
		return res.status(400).json({
			error: `${activeStaff[0].inflationAllowance.salaryMonth}, ${activeStaff[0].inflationAllowance.salaryYear} inflation allowance is not yet approved. You can export it only when APPROVED!`,
		});
	}
	let txtInflationAllowance = [];
	try {
		for (emp in activeStaff) {
			let seqNumber = parseInt(emp) + 1;
			let accNumber = activeStaff[emp].inflationAllowance.accountNumber
				? activeStaff[emp].inflationAllowance.accountNumber
				: "Employee account not specified";
			let bankNames = activeStaff[emp].inflationAllowance.bankName
				? activeStaff[emp].inflationAllowance.bankName
				: "Bank not specified";
			let salMonth = "MonthNotSpecified";
			if (
				activeStaff[emp].inflationAllowance &&
				activeStaff[emp].inflationAllowance.salaryMonth
			) {
				salMonth =
					activeStaff[
						emp
					].inflationAllowance.salaryMonth.toUpperCase();
			}
			let record = [
				seqNumber +
					"|" +
					activeStaff[emp].inflationAllowance.salaryYear +
					"|" +
					activeStaff[emp].inflationAllowance.salaryMonth +
					"|" +
					activeStaff[emp].empCode +
					"|AC|RWF1820210200001|RWF|" +
					activeStaff[emp].inflationAllowance.netSalary +
					"|RWF|" +
					bankNames +
					"|" +
					accNumber +
					"|SAL" +
					salMonth +
					activeStaff[emp].inflationAllowance.salaryYear,
			];
			txtInflationAllowance.push(record);
		}

		return res.json({
			txtInflationAllowance,
		});
	} catch (error) {
		return res.status(400).json({
			error: `Unable to export ${activeStaff[0].inflationAllowance.salaryMonth}, ${activeStaff[0].inflationAllowance.salaryYear} inflation allowance to file. ${error}`,
		});
	}
};

exports.summaryInflationAllowance = async (req, res) => {
	//Compute sums of each salary component
	const inflationAllowance = await Tb01_Employee.find(
		{
			"currentAppointment.active": true,
			"inflationAllowance.allowanceAmount": { $gt: 0 },
		},
		{ _id: 0, inflationAllowance: 1 }
	);

	let sumAllowanceAmount = inflationAllowance.reduce(function (acc, curr) {
		return acc + parseInt(curr.inflationAllowance.allowanceAmount);
	}, 0);
	let sumAdjustmentAmount = inflationAllowance.reduce(function (acc, curr) {
		return acc + parseInt(curr.inflationAllowance.adjustmentAmount);
	}, 0);
	let sumTotalEarnings = sumAllowanceAmount + sumAdjustmentAmount;
	let sumStaffMatLeave = inflationAllowance.reduce(function (acc, curr) {
		return acc + parseInt(curr.inflationAllowance.staffMaternityLeave);
	}, 0);
	let sumCieMatLeave = inflationAllowance.reduce(function (acc, curr) {
		return acc + parseInt(curr.inflationAllowance.cieMaternityLeave);
	}, 0);
	let sumPAYE = inflationAllowance.reduce(function (acc, curr) {
		return acc + parseInt(curr.inflationAllowance.payeTPR);
	}, 0);
	let sumStaffCSR = inflationAllowance.reduce(function (acc, curr) {
		return acc + parseInt(curr.inflationAllowance.staffCSR);
	}, 0);
	let sumCieCSR = inflationAllowance.reduce(function (acc, curr) {
		return acc + parseInt(curr.inflationAllowance.cieCSR);
	}, 0);
	let sumCommunityHealth = inflationAllowance.reduce(function (acc, curr) {
		return acc + parseInt(curr.inflationAllowance.cieCommunityHealth);
	}, 0);
	let sumStaffTotalDeductions = inflationAllowance.reduce(function (
		acc,
		curr
	) {
		return acc + parseInt(curr.inflationAllowance.totalStaffDeductions);
	},
	0);

	let sumNetPay = inflationAllowance.reduce(function (acc, curr) {
		return acc + parseInt(curr.inflationAllowance.netSalary);
	}, 0);

	let inflationSummary = {
		Year: inflationAllowance[0].inflationAllowance.salaryYear,
		Month: inflationAllowance[0].inflationAllowance.salaryMonth,
		"Number of Employees": inflationAllowance.length,
		"Allowance Amount": sumAllowanceAmount,
		"Adjustement Amount": sumAdjustmentAmount,
		"Total Earnings": sumTotalEarnings,
		"Mat. Leave - Staff contribution": sumStaffMatLeave,
		"Mat. Leave - Cie contribution": sumCieMatLeave,
		"P.A.Y.E": sumPAYE,
		"CSR - Staff contribution": sumStaffCSR,
		"CSR - Cie contribution": sumCieCSR,
		"Community Health": sumCommunityHealth,
		"Staff Total Deductions": sumStaffTotalDeductions,
		"Net Pay": sumNetPay,
	};
	// console.log(inflationSummary)
	return res.status(200).json(inflationSummary);
};

exports.validateInflationAllowance = async (req, res) => {
	const { validatedBy, validatedComment, salaryStatus } = req.body;
	const oneActiveStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
		"inflationAllowance.allowanceAmount": { $gt: 0 },
	}).exec();
	//Check if the status is 'INNITIALIZED'
	if (oneActiveStaff.inflationAllowance.salaryStatus === "APPROVED") {
		return res.status(400).json({
			error: "Inflation allowance is APPROVED. Cannot validate it.",
		});
	}
	//Set the status to 'VALIDATED'
	try {
		await Tb01_Employee.updateMany(
			{
				"currentAppointment.active": true,
				"inflationAllowance.allowanceAmount": { $gt: 0 },
			},
			{
				$set: {
					"inflationAllowance.salaryStatus": salaryStatus,
					"inflationAllowance.validatedBy": validatedBy,
					"inflationAllowance.validatedComment": validatedComment,
					"inflationAllowance.validatedDate": new Date(),
				},
			}
		);
		let returnedMsg = "";
		if (salaryStatus === "VALIDATED") {
			returnedMsg = `${oneActiveStaff.inflationAllowance.salaryMonth} ${oneActiveStaff.inflationAllowance.salaryYear} inflation allowance is VALIDATED!`;
		} else {
			returnedMsg = `${oneActiveStaff.inflationAllowance.salaryMonth} ${oneActiveStaff.inflationAllowance.salaryYear} inflation allowance is NOT VALIDATED! Some corrections are needed`;
		}
		return res.status(200).json({
			message: returnedMsg,
		});
	} catch (error) {
		return res.status(400).json({
			error: `Unable to VALIDATE ${oneActiveStaff.inflationAllowance.salaryMonth} ${oneActiveStaff.inflationAllowance.salaryYear} inflation allowance!.`,
		});
	}
};

exports.approveInflationAllowance = async (req, res) => {
	const { approvedBy, approvalComment, salaryStatus } = req.body;
	const oneActiveStaff = await Tb01_Employee.findOne({
		"currentAppointment.active": true,
		"inflationAllowance.allowanceAmount": { $gt: 0 },
	}).exec();
	//Check if the status is 'VALIDATED' or has first APPROVAL
	if (
		oneActiveStaff.inflationAllowance.salaryStatus !== "VALIDATED" &&
		oneActiveStaff.inflationAllowance.salaryStatus !== "APPROVED"
	) {
		return res.status(400).json({
			error: "Current month payroll is not yet VALIDATED. Only validated salary can be approved",
		});
	}
	//Set the status to 'APPROVED'
	try {
		if (oneActiveStaff.inflationAllowance.salaryStatus !== "APPROVED") {
			await Tb01_Employee.updateMany(
				{
					"currentAppointment.active": true,
					"inflationAllowance.allowanceAmount": { $gt: 0 },
				},
				{
					$set: {
						"inflationAllowance.salaryStatus": salaryStatus,
						"inflationAllowance.approvedBy": approvedBy,
						"inflationAllowance.approvalComment": approvalComment,
						"inflationAllowance.approvalDate": new Date(),
					},
				}
			);
		} else {
			await Tb01_Employee.updateMany(
				{
					"currentAppointment.active": true,
					"inflationAllowance.allowanceAmount": { $gt: 0 },
				},
				{
					$set: {
						"inflationAllowance.salaryStatus2": salaryStatus,
						"inflationAllowance.approvedBy2": approvedBy,
						"inflationAllowance.approvalComment2": approvalComment,
						"inflationAllowance.approvalDate2": new Date(),
					},
				}
			);
		}

		let returnedMsg = "";
		if (salaryStatus === "APPROVED") {
			returnedMsg = `${oneActiveStaff.inflationAllowance.salaryMonth} ${oneActiveStaff.inflationAllowance.salaryYear} salary is APPROVED!`;
		} else {
			returnedMsg = `${oneActiveStaff.inflationAllowance.salaryMonth} ${oneActiveStaff.inflationAllowance.salaryYear} salary is NOT APPROVED! Some corrections are needed`;
		}
		return res.status(200).json({
			message: returnedMsg,
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			error: `Unable to APPROVE ${oneActiveStaff.inflationAllowance.salaryMonth} ${oneActiveStaff.inflationAllowance.salaryYear} salary!.`,
		});
	}
};
