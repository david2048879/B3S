const fs = require("fs");
const mongoose = require("mongoose");
let csvToJson = require("convert-csv-to-json");
const Tb01_Employee = require("../models/tb01_employee");
const sept2022ExportIncentive = require("../models/sept2022ExportIncentive");
const import202209 = require("../models/import202209");
const CombinedData = require("../models/combinedData");
const TeamLeading = require("../models/ateamLeading");
const InflationAllowance = require("../models/ainflationdata");
const OfficerCode = require("../models/aofficerCode");
const Payroll = require("../models/april2023payroll");

const Tb00_Country = require("../models/tb00_country");
const Tb00_Branch = require("../models/tb00_branch");
const Tb03_Supervision = require("../models/tb03_supervision");
const Tb01_IncentiveStaff = require("../models/tb01_incentiveStaff");
const { monthDiff } = require("../helpers/utilityFunctions");
const _ = require("lodash");
const { result } = require("lodash");

//Dumping a mongo db
//C:\Users\buwimana\Downloads>mongodump mongodb+srv://benjamin:benJamin777@react-node-aws.uwcbj.mongodb.net/con_site  =========> dumping cloud
//C:\Users\buwimana\Downloads>mongodump -d ub_obf   =========> dumping local database

//Dumping a SECURED LOCAL mongo db
//mongodump --uri=mongodb://obfUser:Urwego321@10.10.64.182:27017/ub_obf

//connect to cloud mongo db
//C:\Users\buwimana\Documents\IT\UrwegoOBFBackup\dump>mongo mongodb+srv://ubenjamin:mweyswhn69ZPMlFn@urwegobank.noqhj.mongodb.net/ub_obf

//Dropping a db on atlas cloud:
//1. Change the user MongoDB righs to atlasAdmin@admin
//2. Connect to cloud mongo db you want to drop
//3. Make sure you're connected to the db you want to drop ==> use db command
//4. Drop the db ==> use db.dropDatabase() command

//Restoring mongo db
//mongorestore -d con_site --drop dump/con_site ==============> on localhost
//mongorestore -d ub_obf --drop dump/ub_obf ==============> on localhost
//C:\Users\buwimana\Documents\IT\UrwegoOBFBackup\dump>mongorestore --uri mongodb+srv://ubenjamin:mweyswhn69ZPMlFn@urwegobank.noqhj.mongodb.net/ub_obf --drop ub_obf ==> on cloud

//https://www.npmjs.com/package/xml-js ======> json / js to xml and vice versa

// exports.mergeEmpData = async (req, res) => {
// 	const listTmpEmp = await TmpEmployee.find({}).exec();
// 	// console.log("Emp DATA:",listTmpEmp)
// 	for (emp in listTmpEmp) {
// 		// console.log(listTmpEmp[emp])
// 		const deploy = {};
// 		deploy.appointedDate = listTmpEmp[emp].AppointedDate;
// 		deploy.contractType = listTmpEmp[emp].ContractType;
// 		deploy.department = listTmpEmp[emp].Department;
// 		deploy.jobTitle = listTmpEmp[emp].JobTitle;
// 		deploy.location = listTmpEmp[emp].Location;
// 		deploy.branch = listTmpEmp[emp].Branch;
// 		deploy.executive = listTmpEmp[emp].Executive;
// 		deploy.reportTo = listTmpEmp[emp].ReportTo;
// 		deploy.contractEndDate = listTmpEmp[emp].ContractEndDate;
// 		Tb01_Employee.findOneAndUpdate(
// 			{ empCode: listTmpEmp[emp].EmpCode },
// 			{ appointments: deploy }
// 		).exec();
// 	}
// 	// TmpEmployee.insertMany({"EmpCode": 100000})
// 	return res.json({
// 		message: `Data read!`,
// 	});
// };

// exports.updateField = async (req, res) => {
// 	const listEmp = await Tb01_Employee.find({}).exec();
// 	// console.log("Emp DATA:",listTmpEmp)
// 	for (emp in listEmp) {
// 		// console.log(listTmpEmp[emp])
// 		const deploy = listEmp[emp].appointments[0];
// 		Tb01_Employee.findOneAndUpdate(
// 			{ empCode: listEmp[emp].empCode },
// 			{ currentAppointment: deploy }
// 		).exec((err, result) =>{
// 			if(err || !result){
// 				console.log(err)
// 			}
// 			else{
// 				console.log(listEmp[emp].empCode)
// 			}
// 		});

// exports.updateField = async (req, res) => {
// 	const listEmp = await Tb01_Employee.find({}).exec();
// 	// console.log("Emp DATA:",listTmpEmp)
// 	for (emp in listEmp) {
// 		// console.log(listTmpEmp[emp])
// 		const deploy = listEmp[emp].appointments[0];
// 		Tb01_Employee.findOneAndUpdate(
// 			{ empCode: listEmp[emp].empCode },
// 			{ currentAppointment: deploy }
// 		).exec((err, result) =>{
// 			if(err || !result){
// 				console.log(err)
// 			}
// 			else{
// 				console.log(listEmp[emp].empCode)
// 			}
// 		});
// 	}
// 	// TmpEmployee.insertMany({"EmpCode": 100000})
// 	return res.json({
// 		message: `Data read!`,
// 	});
// };

// monthDiff = (myDates) => {
// 	d1 = new Date(myDates[0]);
// 	d2 = new Date(myDates[1]);
// 	var months;
// 	months = (d2.getFullYear() - d1.getFullYear()) * 12;
// 	months -= d1.getMonth();
// 	months += d2.getMonth();
// 	return months <= 0 ? 0 : months;
// };

exports.updateLocationType = async (req, res) => {
	const listEmp = await Tb01_Employee.find({}).exec();
	// console.log("Emp DATA:",listTmpEmp)
	for (emp in listEmp) {
		const branchNames = listEmp[emp].currentAppointment.branch;
		if (branchNames) {
			const locBranch = await Tb00_Branch.findOne({
				branchName: branchNames,
			});
			Tb01_Employee.findOneAndUpdate(
				{ empCode: listEmp[emp].empCode },
				{
					"currentAppointment.locationType":
						locBranch && locBranch.branchLocation,
				}
			).exec((err, result) => {
				if (err || !result) {
					console.log(err);
				} else {
					console.log(listEmp[emp].empCode);
				}
			});
		}
	}
	// TmpEmployee.insertMany({"EmpCode": 100000})
	return res.json({
		message: `Location types updated!`,
	});
};

// exports.updateBranchName = async (req, res) => {
// 	const listIncentive = await Tb01_IncentiveStaff.find({}).exec();
// 	// console.log("Emp DATA:",listTmpEmp)
// 	for (incent in listIncentive) {
// 		let branchCode = listIncentive[incent].officerCode
// 			.toString()
// 			.substring(0, 2);
// 		let branch = await Tb00_Branch.findOne({ branchCode }).exec();
// 		let branchName = branch ? branch.branchName : "";
// 		await Tb01_IncentiveStaff.findOneAndUpdate(
// 			{ _id: listIncentive[incent]._id },
// 			{ $set: { branchName, applied: "NON" } }
// 		).exec((err, result)=>{
// 			if(err){
// 				console.log("unable to update")
// 			}else{
// 				console.log(`${listIncentive[incent].empNames} updated`)
// 			}
// 		});
// 	}

// 	return res.json({
// 		message: `Branch names updated!`,
// 	});
// };
exports.updateSalaryComponents = async (req, res) => {
	const listEmployees = await Tb01_Employee.find({}).exec();
	// console.log("Emp DATA:",listEmployees.length)
	for (emp in listEmployees) {
		// console.log(listEmployees[emp].empNames)
		let entitledBasicSalary = listEmployees[emp].currentMonthSalary
			.basicSalary
			? listEmployees[emp].currentMonthSalary.basicSalary
			: 0;
		let entitledTransportAllowance = listEmployees[emp].currentMonthSalary
			.transportAllowance
			? listEmployees[emp].currentMonthSalary.transportAllowance
			: 0;
		let entitledRentalCostAllowance = listEmployees[emp].currentMonthSalary
			.rentalCostAllowance
			? listEmployees[emp].currentMonthSalary.rentalCostAllowance
			: 0;
		let entitledResponsibilityAllowance = listEmployees[emp]
			.currentMonthSalary.responsibilityAllowance
			? listEmployees[emp].currentMonthSalary.responsibilityAllowance
			: 0;

		await Tb01_Employee.findOneAndUpdate(
			{ _id: listEmployees[emp]._id },
			{
				$unset: {
					"currentAppointment.entitledBasicSalary":
						entitledBasicSalary,
					"currentAppointment.entitledRentalCostAllowance":
						entitledRentalCostAllowance,
					"currentAppointment.entitledResponsibilityAllowance":
						entitledResponsibilityAllowance,
					"currentAppointment.entitledTransportAllowance":
						entitledTransportAllowance,
				},
			}
		).exec((err, result) => {
			if (err) {
				console.log("Unable to update entitled salary components");
			} else {
				console.log(`${listEmployees[emp].empNames} updated`);
			}
		});
	}
	return res.json({
		message: `Salary components updated!`,
	});
};

// exports.importDataFromFiles = async (req, res) => {
// 	let rights = csvToJson
// 		.fieldDelimiter(",")
// 		.getJsonFromCsv(__dirname + "/myUserRights.csv");
// 	try {
// 		await userRole.create(rights);
// 		return res.json({
// 			message: `Data imported!`,
// 		});
// 	} catch (error) {
// 		console.log("Error: ", error)
// 		return res.json({
// 			message: `Error while importing data!`,
// 		});
// 	}
// };

exports.checkExistingCollectionData = async (req, res) => {
	try {
		const response = await Tb00_Country.find().exec();
		return res.json({
			Countries: response,
		});
	} catch (error) {
		return res.json({
			message: `Error while reading data!`,
		});
	}
};

exports.updateSupervision = async (req, res) => {
	const listEmp = await Tb01_Employee.find({
		"currentAppointment.jobTitle": "Sales Team Leader",
		// officerCode: {
		// 	$in: [
		// 		2051, 2057, 2060, 2227, 2242, 2269, 2281, 2304, 2309, 2312,
		// 		2396, 2451, 2452, 2560, 2591, 2662, 2766, 3006, 3008, 3063,
		// 		3102, 3109, 3159, 3206, 3207, 3208, 4003, 4009, 4082, 4111,
		// 		4120, 5111, 5114, 5122, 5161, 5210, 5254, 5259, 6007, 6008,
		// 		6055, 6210, 6211, 6252,
		// 	],
		// },
	}).exec();
	for (emp in listEmp) {
		let supervisedEmployees = await Tb03_Supervision.find({
			supervisorOfficerCode: listEmp[emp].officerCode,
		});
		// console.log(listEmp[emp].officerCode, supervisedEmployees.length)
		if (supervisedEmployees.length > 0) {
			setSupervisedStaff(supervisedEmployees);
		}
	}

	return res.json({
		message: `Supervised employees updated!`,
	});
};

const setSupervisedStaff = async (supervisedEmployees) => {
	let supervisedStaff = [];
	for (supEmp in supervisedEmployees) {
		let supStaff = {};
		supStaff.staffCode = supervisedEmployees[supEmp].staffOfficerCode;
		supStaff.staffNames = supervisedEmployees[supEmp].staff;
		supStaff.staffJobTitle = supervisedEmployees[supEmp].staffSaleType;
		supStaff.staffExistingNew = supervisedEmployees[supEmp].staffStatus;
		supStaff.supervisor = supervisedEmployees[supEmp].supervisorOfficerCode;
		supervisedStaff.push(supStaff);
	}

	const supervisorCode = supervisedEmployees[0].supervisorOfficerCode;
	// console.log(supervisorCode);
	Tb01_Employee.findOneAndUpdate(
		{ officerCode: supervisorCode },
		{
			"currentMonthSalary.teamLeading": supervisedStaff,
		}
	).exec((err, result) => {
		if (err || !result) {
			// console.log(err);
			return;
		} else {
			return;
		}
	});
};

exports.importEmployees = async (req, res) => {
	let sept2022Eployees = await Sept2022Export.find().exec(); //{employeeCode: 100463}
	let kigaliLoc = [
		"kigali",
		"kicukiro",
		"kimironko",
		"nyabugogo",
		"gisozi",
		"head office",
	];
	for (emp in sept2022Eployees) {
		let currentStaff = {};
		currentStaff.currentAppointment = {};
		currentStaff.empCode = sept2022Eployees[emp].employeeCode;
		currentStaff.empNames = sept2022Eployees[emp].EmployeeName;
		currentStaff.currentAppointment.appointedDate =
			sept2022Eployees[emp].AppointedDate;
		currentStaff.currentAppointment.jobTitleDate =
			sept2022Eployees[emp].AppointedDate;
		currentStaff.currentAppointment.contractType =
			sept2022Eployees[emp].ContractType;

		currentStaff.currentAppointment.department =
			sept2022Eployees[emp].Department;
		currentStaff.currentAppointment.division =
			sept2022Eployees[emp].Division;
		currentStaff.currentAppointment.jobTitle =
			sept2022Eployees[emp].jobTitle;
		currentStaff.currentAppointment.location = sept2022Eployees[emp].Branch;
		// console.log(sept2022Eployees[emp].Branch.toLowerCase())
		const locationIndex = kigaliLoc.findIndex(
			(location) =>
				location === sept2022Eployees[emp].Branch.toLowerCase()
		);
		if (locationIndex !== -1) {
			currentStaff.currentAppointment.locationType = "Kigali";
		} else {
			currentStaff.currentAppointment.locationType = "Up Country";
		}
		if (sept2022Eployees[emp].Department === "Finance") {
			currentStaff.currentAppointment.executive = "Jessica Igoma";
		} else if (sept2022Eployees[emp].Department === "Business") {
			currentStaff.currentAppointment.executive = "Simon Mugisha";
		} else if (
			sept2022Eployees[emp].Department in
			["Operations", "Credit", "Security", "Digital Channel", "Marketing"]
		) {
			currentStaff.currentAppointment.executive = "Jimmy Rutabingwa";
		} else if (
			sept2022Eployees[emp].Department in
			["SI", "Human Ressources", "Legal", "Logistics"]
		) {
			currentStaff.currentAppointment.executive = "Wilson Karamaga";
		} else if (
			sept2022Eployees[emp].Department in ["Executive", "Interanal Audit"]
		) {
			currentStaff.currentAppointment.executive = "Christine Baingana";
		}
		currentStaff.currentAppointment.branch = sept2022Eployees[emp].Branch;
		currentStaff.currentAppointment.reportTo =
			sept2022Eployees[emp].ReportingLine;
		currentStaff.currentAppointment.contractEndDate =
			sept2022Eployees[emp].ContractExpiration;
		currentStaff.currentAppointment.entitledBasicSalary = 50000;
		currentStaff.currentAppointment.entitledRentalCostAllowance = 0;
		currentStaff.currentAppointment.entitledResponsibilityAllowance = 0;
		currentStaff.currentAppointment.entitledTransportAllowance = 0;
		currentStaff.currentAppointment.comment =
			"Imported from Sept 2022 employees file";
		await Tb01_Employee.findOne({
			empCode: sept2022Eployees[emp].employeeCode,
		}).exec((err, employee) => {
			if (!employee) {
				const newEmployee = new Tb01_Employee({
					empNames: currentStaff.empNames,
					empCode: currentStaff.empCode,
					currentAppointment: currentStaff.currentAppointment,
				});
				newEmployee.save((err, result) => {
					if (err) {
						// console.log(err)
						console.log(
							`Unable to save ${sept2022Eployees[emp].EmployeeName}`
						);
					}
				});
			}
		});
	}
	return res.json({
		message: `Employees imported: ${sept2022Eployees.length}`,
	});
};

exports.importOfficerCodes = async (req, res) => {
	let sept2022Eployeeincentives = await sept2022ExportIncentive.find().exec(); //{ EmployeeNumber: { $in: [100388, 100288] } }
	for (emp in sept2022Eployeeincentives) {
		let teamLeading = [];
		let officerCode = sept2022Eployeeincentives[emp].officerCode;
		if (!officerCode)
			officerCode = sept2022Eployeeincentives[emp].EmployeeNumber;
		let supervisedEmployees = await sept2022ExportIncentive.find({
			Supervisor: sept2022Eployeeincentives[emp].Name,
		});
		// console.log(supervisedEmployees)
		for (supEmp in supervisedEmployees) {
			let teamLeadingEmployee = {};
			teamLeadingEmployee.staffCode = supervisedEmployees[supEmp]
				.officerCode
				? supervisedEmployees[supEmp].officerCode
				: supervisedEmployees[supEmp].EmployeeNumber;
			teamLeadingEmployee.staffNames = supervisedEmployees[supEmp].Name;
			teamLeadingEmployee.staffJobTitle =
				supervisedEmployees[supEmp].EmployeeRole;
			teamLeadingEmployee.staffExistingNew =
				supervisedEmployees[supEmp].Status;
			teamLeading.push(teamLeadingEmployee);
		}
		// console.log(teamLeading);
		Tb01_Employee.findOneAndUpdate(
			{ empCode: sept2022Eployeeincentives[emp].EmployeeNumber },
			{
				"currentMonthSalary.teamLeading": teamLeading,
				officerCode,
			}
		).exec((err, result) => {
			if (err || !result) {
				console.log(err);
				// return
			}
		});
	}
	return res.json({
		message: `Incentives imported: ${sept2022Eployeeincentives.length}`,
	});
};

exports.updateIncentiveData = async (req, res) => {
	let importData = await import202209.find().exec(); //{officerCode: 2003}
	for (incent in importData) {
		Tb01_IncentiveStaff.findOneAndUpdate(
			{
				officerCode: importData[incent].officerCode,
				monthIncentive: "September",
			},
			{
				disbursedClients: importData[incent].disbClients,
				disbursedAmount: importData[incent].disbAmount,
				ppalAreaDue: importData[incent].ppalArreas,
				repaidAmount: importData[incent].actualRepayment,
			}
		).exec((err, result) => {
			if (err || !result) {
				console.log(err);
				// return
			}
		});
	}
	return res.json({
		message: `Incentives updated: ${importData.length}`,
	});
};

exports.updateInflationAllowanceData = async (req, res) => {
	let importData = await InflationAllowance.find().exec(); //{officerCode: 2003}
	console.log("We have: ", importData.length);
	for (infl in importData) {
		let currentEmp = await Tb01_Employee.findOne({
			empCode: importData[infl].empCode,
		}).exec();
		if (currentEmp.empCode > 0) {
			Tb01_Employee.findOneAndUpdate(
				{
					empCode: importData[infl].empCode,
				},
				{
					"inflationAllowance.bankName":
						currentEmp.currentMonthSalary.bankName,
					"inflationAllowance.accountNumber":
						currentEmp.currentMonthSalary.accountNumber,
					"inflationAllowance.salaryYear": 2023,
					"inflationAllowance.salaryMonth": "July",
					"inflationAllowance.payDate": new Date(),
					"inflationAllowance.allowanceAmount":
						importData[infl].allowanceAmount,
					"inflationAllowance.adjustmentAmount":
						importData[infl].adjustmentAmount,
					"inflationAllowance.salaryStatus": "INITIALIZED",
				}
			).exec((err, result) => {
				if (err || !result) {
					console.log(err);
					// return
				}
			});
		}
	}
	return res.json({
		message: `Inflation allowances updated: ${importData.length}`,
	});
};

exports.combineInflationAndBasicSalary = async (req, res) => {
	let importData = await InflationAllowance.find({ empCode: 900468 }).exec(); //
	// console.log("We have: ", importData.length);
	for (infl in importData) {
		let currentEmp = await Tb01_Employee.findOne({
			empCode: importData[infl].empCode,
		}).exec();
		if (currentEmp.empCode > 0) {
			let currentBasic =
				currentEmp.currentAppointment.entitledBasicSalary;

			Tb01_Employee.findOneAndUpdate(
				{
					empCode: importData[infl].empCode,
				},
				{
					"currentAppointment.entitledBasicSalary":
						importData[infl].allowanceAmount + 0 + currentBasic,
				}
			).exec((err, result) => {
				if (err || !result) {
					console.log(err);
					// return
				}
			});
		}
	}
	return res.json({
		message: `Basic salary updated for: ${importData.length} employees`,
	});
};

exports.removeInflationFromBasicSalary = async (req, res) => {
	let importData = await InflationAllowance.find({ empCode: 900468 }).exec(); //
	// console.log("We have: ", importData.length);
	for (infl in importData) {
		let currentEmp = await Tb01_Employee.findOne({
			empCode: importData[infl].empCode,
		}).exec();
		if (currentEmp.empCode > 0) {
			let currentBasic =
				currentEmp.currentAppointment.entitledBasicSalary;

			Tb01_Employee.findOneAndUpdate(
				{
					empCode: importData[infl].empCode,
				},
				{
					"currentAppointment.entitledBasicSalary":
						currentBasic - importData[infl].allowanceAmount,
				}
			).exec((err, result) => {
				if (err || !result) {
					console.log(err);
					// return
				}
			});
		}
	}
	return res.json({
		message: `Basic salary updated for: ${importData.length} employees`,
	});
};

exports.inserCombinedData = async (req, res) => {
	let combinedData = await CombinedData.find().exec();
	console.log("Records: ", combinedData.length);
	let kigaliLoc = [
		"kigali",
		"kicukiro",
		"kimironko",
		"nyabugogo",
		"gisozi",
		"head office",
		"remera",
	];
	for (emp in combinedData) {
		let currentStaff = {};
		currentStaff.currentAppointment = {};
		currentStaff.empCode = combinedData[emp].EmployeeCode;
		currentStaff.empNames = combinedData[emp].EmployeeName;
		currentStaff.email = combinedData[emp].email;
		currentStaff.phone = combinedData[emp].TELEPHONE;
		currentStaff.rssbNumber = combinedData[emp].RSSB_Number;
		currentStaff.gender = combinedData[emp].Gender;
		currentStaff.dob = combinedData[emp].DOB;

		currentStaff.currentAppointment.appointedDate =
			combinedData[emp].AppointedDate;
		currentStaff.currentAppointment.jobTitleDate =
			combinedData[emp].AppointedDate;
		currentStaff.currentAppointment.contractType =
			combinedData[emp].ContractTerm;

		currentStaff.currentAppointment.department =
			combinedData[emp].Department;
		currentStaff.currentAppointment.division = combinedData[emp].Division;
		currentStaff.currentAppointment.jobTitle =
			combinedData[emp].EmployeeTitle;
		currentStaff.currentAppointment.location = combinedData[emp].Branch;
		const locationIndex = kigaliLoc.findIndex(
			(location) => location === combinedData[emp].Branch.toLowerCase()
		);
		if (locationIndex !== -1) {
			currentStaff.currentAppointment.locationType = "Kigali";
		} else {
			currentStaff.currentAppointment.locationType = "Up Country";
		}

		if (combinedData[emp].Department === "Finance") {
			currentStaff.currentAppointment.executive = "Michel Rudasingwa";
		} else if (
			combinedData[emp].Department in
			[
				"Business",
				"Sales Team",
				"Recovery",
				"Retail Banking",
				"Branch Leadership",
			]
		) {
			currentStaff.currentAppointment.executive = "Simon Mugisha";
		} else if (
			combinedData[emp].Department in
			[
				"Operations",
				"Credit",
				"Security",
				"IT",
				"Digital Channel",
				"Marketing",
			]
		) {
			currentStaff.currentAppointment.executive = "Jimmy Rutabingwa";
		} else if (
			combinedData[emp].Department in
			[
				"SI",
				"Spiritaul Intergration",
				"Human Ressources",
				"Legal",
				"Logistics",
			]
		) {
			currentStaff.currentAppointment.executive = "Wilson Karamaga";
		} else if (
			combinedData[emp].Department in
			["Executive", "Compliance", "Interanal Audit"]
		) {
			currentStaff.currentAppointment.executive = "Christine Baingana";
		}

		currentStaff.currentAppointment.branch = combinedData[emp].Branch;
		currentStaff.currentAppointment.reportTo =
			combinedData[emp].ReportingLine;
		currentStaff.currentAppointment.contractEndDate =
			combinedData[emp].ContractExpiration;
		currentStaff.currentAppointment.entitledBasicSalary = 50000;
		currentStaff.currentAppointment.entitledRentalCostAllowance = 0;
		currentStaff.currentAppointment.entitledResponsibilityAllowance = 0;
		currentStaff.currentAppointment.entitledTransportAllowance = 0;
		currentStaff.currentAppointment.comment =
			"Imported from Dec 2022 employees file";

		const newEmployee = new Tb01_Employee({
			empNames: currentStaff.empNames,
			empCode: currentStaff.empCode,
			email: currentStaff.email,
			phone: currentStaff.phone,
			rssbNumber: currentStaff.rssbNumber,
			gender: currentStaff.gender,
			dob: currentStaff.dob,
			"idDetails.idNumber": combinedData[emp].NID,
			"idDetails.idType": combinedData[emp].NID,
			currentAppointment: currentStaff.currentAppointment,
			"currentMonthSalary.bankName": combinedData[emp].BankName,
			"currentMonthSalary.accountNumber": combinedData[emp].AccountNumber,
		});
		newEmployee.save((err, result) => {
			if (err) {
				// console.log(err)
				console.log(`Unable to save ${combinedData[emp].EmployeeName}`);
			}
		});
	}
	return res.json({
		message: `Employees imported: ${combinedData.length}`,
	});
};

exports.makeTeamLeading = async (req, res) => {
	let teamLeaderCode = await TeamLeading.distinct("TeamLeaderCode").exec();
	for (supCode in teamLeaderCode) {
		let teamLeader = await TeamLeading.findOne({
			TeamLeaderCode: teamLeaderCode[supCode],
		});
		// console.log(teamLeader)
		let supervisedEmployees = await TeamLeading.find({
			TeamLeaderCode: teamLeaderCode[supCode],
		});
		// console.log(supervisedEmployees)
		let supervisedStaff = [];
		for (supEmp in supervisedEmployees) {
			let supStaff = {};
			supStaff.staffCode = supervisedEmployees[supEmp].OfficerCode;
			supStaff.staffNames = supervisedEmployees[supEmp].EmployeeName;
			supStaff.staffJobTitle = supervisedEmployees[supEmp].EmployeeTitle;
			supStaff.staffExistingNew = supervisedEmployees[supEmp].ExistingNew;
			supervisedStaff.push(supStaff);
		}
		// console.log(supervisedStaff)

		await Tb01_Employee.findOneAndUpdate(
			{ empCode: teamLeaderCode[supCode] },
			{
				"currentMonthSalary.teamLeading": supervisedStaff,
				officerCode: teamLeader.OfficerCode,
			}
		).exec((err, result) => {
			if (err || !result) {
				// console.log(err);
				return;
			} else {
				return;
			}
		});
	}
	return res.json({
		message: `Supervisors: ${teamLeaderCode.length}`,
	});
};

exports.updateOfficerCodes = async (req, res) => {
	let officerCodes = await OfficerCode.find({}).exec();
	for (oCode in officerCodes) {
		await Tb01_Employee.findOneAndUpdate(
			{ empCode: officerCodes[oCode].EmployeeCode },
			{
				officerCode: officerCodes[oCode].OfficerCode,
			}
		).exec((err, result) => {
			if (err || !result) {
				// console.log(err);
				return;
			} else {
				return;
			}
		});
	}
	return res.json({
		message: `Officer codes: ${officerCodes.length}`,
	});
};

exports.payrollImport = async (req, res) => {
	let aprilPay = await Payroll.find({}).exec(); //EmployeeCode:100474

	for (oCode in aprilPay) {
		let currentEmployee = await Tb01_Employee.findOne({
			empCode: aprilPay[oCode].EmployeeCode,
		});
		if (!currentEmployee) {
			console.log(
				aprilPay[oCode].EmployeeCode,
				aprilPay[oCode].EmployeeName
			);
		} else if (currentEmployee.currentAppointment.active === false) {
			console.log(
				aprilPay[oCode].EmployeeCode,
				aprilPay[oCode].EmployeeName
			);
		}
		let staffOtherAllowances = [];
		let staffOtherDeductions = [];
		let anAllowance = {};
		let aDeduction = {};

		if (aprilPay[oCode].TellerAllowance > 0) {
			anAllowance = {};
			anAllowance.allowanceName = "Teller Allowance";
			anAllowance.allowanceAmount = aprilPay[oCode].TellerAllowance;
			anAllowance.allowanceComment = "Imported from April 2023 payroll";
			anAllowance.isRepeated = true;
			staffOtherAllowances.push(anAllowance);
		}

		if (aprilPay[oCode].RentalCostAllowance > 0) {
			anAllowance = {};
			anAllowance.allowanceName = "Rental Cost Allowance";
			anAllowance.allowanceAmount = aprilPay[oCode].RentalCostAllowance;
			anAllowance.allowanceComment = "Imported from April 2023 payroll";
			anAllowance.isRepeated = true;
			staffOtherAllowances.push(anAllowance);
		}

		if (aprilPay[oCode].InternetAllowance > 0) {
			anAllowance = {};
			anAllowance.allowanceName = "Internet  Allowance";
			anAllowance.allowanceAmount = aprilPay[oCode].InternetAllowance;
			anAllowance.allowanceComment = "Imported from April 2023 payroll";
			anAllowance.isRepeated = true;
			staffOtherAllowances.push(anAllowance);
		}

		if (aprilPay[oCode].LunchPayments > 0) {
			aDeduction = {};
			aDeduction.deductionName = "Lunch Payments";
			aDeduction.deductionAmount = aprilPay[oCode].LunchPayments;
			aDeduction.deductionComment = "Imported from April 2023 payroll";
			aDeduction.isRepeated = false;
			staffOtherDeductions.push(aDeduction);
		}

		if (aprilPay[oCode].SportsFitnessFees > 0) {
			aDeduction = {};
			aDeduction.deductionName = "Sports & Fitness Fees";
			aDeduction.deductionAmount = aprilPay[oCode].SportsFitnessFees;
			aDeduction.deductionComment = "Imported from April 2023 payroll";
			aDeduction.isRepeated = false;
			staffOtherDeductions.push(aDeduction);
		}

		if (aprilPay[oCode].MedicalExpensesDeficit > 0) {
			aDeduction = {};
			aDeduction.deductionName = "Medical Expenses Deficit";
			aDeduction.deductionAmount = aprilPay[oCode].MedicalExpensesDeficit;
			aDeduction.deductionComment = "Imported from April 2023 payroll";
			aDeduction.isRepeated = false;
			staffOtherDeductions.push(aDeduction);
		}

		if (aprilPay[oCode].SanlamLifeInsurance > 0) {
			aDeduction = {};
			aDeduction.deductionName = "Sanlam Life Insurance";
			aDeduction.deductionAmount = aprilPay[oCode].SanlamLifeInsurance;
			aDeduction.deductionComment = "Imported from April 2023 payroll";
			aDeduction.isRepeated = true;
			staffOtherDeductions.push(aDeduction);
		}

		if (aprilPay[oCode].ShortageDeductions > 0) {
			aDeduction = {};
			aDeduction.deductionName = "Shortage Deductions";
			aDeduction.deductionAmount = aprilPay[oCode].ShortageDeductions;
			aDeduction.deductionComment = "Imported from April 2023 payroll";
			aDeduction.isRepeated = false;
			staffOtherDeductions.push(aDeduction);
		}

		if (aprilPay[oCode].StaffLoansConsolidated > 0) {
			aDeduction = {};
			aDeduction.deductionName = "Staff Loans - Consolidated";
			aDeduction.deductionAmount = aprilPay[oCode].StaffLoansConsolidated;
			aDeduction.deductionComment = "Imported from April 2023 payroll";
			aDeduction.isRepeated = true;
			staffOtherDeductions.push(aDeduction);
		}

		if (aprilPay[oCode].StaffSavingsConsolidated > 0) {
			aDeduction = {};
			aDeduction.deductionName = "Staff Savings - Consolidated";
			aDeduction.deductionAmount =
				aprilPay[oCode].StaffSavingsConsolidated;
			aDeduction.deductionComment = "Imported from April 2023 payroll";
			aDeduction.isRepeated = true;
			staffOtherDeductions.push(aDeduction);
		}

		// console.log(staffOtherAllowances)
		// console.log(staffOtherDeductions)
		await Tb01_Employee.findOneAndUpdate(
			{ empCode: aprilPay[oCode].EmployeeCode },
			{
				"currentAppointment.entitledBasicSalary":
					aprilPay[oCode].BasicSalary,
				// "currentAppointment.entitledRentalCostAllowance": aprilPay[oCode].RentalCostAllowance,
				"currentAppointment.entitledTechnAllowance":
					aprilPay[oCode].TechnAllowance,
				"currentAppointment.entitledTransportAllowance":
					aprilPay[oCode].TransportAllowance,
				"currentAppointment.entitledResponsibilityAllowance":
					aprilPay[oCode].ResponsibilityAllowance,

				"currentMonthSalary.basicSalary": aprilPay[oCode].BasicSalary,
				"currentMonthSalary.rentalCostAllowance":
					aprilPay[oCode].RentalCostAllowance,
				"currentMonthSalary.transportAllowance":
					aprilPay[oCode].TransportAllowance,
				"currentMonthSalary.responsibilityAllowance":
					aprilPay[oCode].ResponsibilityAllowance,
				"currentMonthSalary.otherAllowances": staffOtherAllowances,
				"currentMonthSalary.otherDeductions": staffOtherDeductions,
				"currentAppointment.appointedDate":
					aprilPay[oCode].AppointedDate,
				"currentAppointment.contractEndDate":
					aprilPay[oCode].ContractExpiration,
				"currentAppointment.contractType": aprilPay[oCode].ContractTerm,

				"currentAppointment.active": true,

				"currentAppointment.jobTitle": aprilPay[oCode].EmployeeTitle,
				"currentAppointment.reportTo": aprilPay[oCode].ReportingLine,
				"currentAppointment.department": aprilPay[oCode].Department,
				"currentAppointment.division": aprilPay[oCode].Division,
				"currentAppointment.branch": aprilPay[oCode].Branch,
			}
		).exec((err, result) => {
			if (err || !result) {
				// console.log(err);
				return;
			} else {
				return;
			}
		});
	}
	return res.json({
		message: `Employees updated: ${aprilPay.length}`,
	});
};

exports.removeOneDeductionForAll = async (req, res) => {
	const listEmp = await Tb01_Employee.find({
		"currentAppointment.active": true,
		// empCode: {
		// 	$in: [
		// 		100539, 100552, 900010, 900026, 900240, 900277, 900338, 900369,
		// 		900382, 900434, 900488, 900508, 900599, 900621, 900622, 900641,
		// 		900645, 900651,
		// 	],
		// },
	}).exec();
	for (emp in listEmp) {
		let staffDeductions = listEmp[emp].currentMonthSalary.otherDeductions;
		let filteredDeductions = [];
		if (staffDeductions.length > 0) {
			filteredDeductions = staffDeductions.filter(
				(dedution) => dedution.deductionName !== "Sports & Fitness Fees"
			);
		}

		await Tb01_Employee.findOneAndUpdate(
			{ _id: listEmp[emp]._id },
			{ "currentMonthSalary.otherDeductions": filteredDeductions }
		);
	}
	return res.json({
		message: `Sports & Fitness Fees deductions are removed!`,
	});
};

exports.removeOneAllowanceForAll = async (req, res) => {
	const listEmp = await Tb01_Employee.find({
		"currentAppointment.active": true,
	}).exec();
	for (emp in listEmp) {
		let staffAllowances = listEmp[emp].currentMonthSalary.otherAllowances;
		let filteredAllowances = [];
		if (staffAllowances.length > 0) {
			filteredAllowances = staffAllowances.filter(
				(dedution) => dedution.deductionName !== "Adjustment"
			);
		}
		await Tb01_Employee.findOneAndUpdate(
			{ _id: listEmp[emp]._id },
			{ "currentMonthSalary.otherAllowances": filteredAllowances }
		);
	}
	return res.json({
		message: `Adjustment allowances are removed!`,
	});
};
