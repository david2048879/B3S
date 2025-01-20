const Tb01_Employee = require("../models/tb01_employee");
const Tb01_IncentiveStaff = require("../models/tb01_incentiveStaff");
const Tb03_IncentivePercentage = require("../models/tb03_incentivePercentage");
const Tb03_TargetSale = require("../models/tb03_targetSale");
// const Tb01_BranchWeeklyPerformance = require("../models/tb01_BranchWeeklyPerformance");
// const Tb03_WeeklyGrowth = require("../models/tb03_weeklyGrowth");
// const Tb00_Branch = require("../models/tb00_branch");
// const Tb03_PARTarget = require("../models/tb03_PARTarget");
// const Tb03_WeeklyPerc = require("../models/tb03_weeklyPerc");
// const Tb03_PARDiscountFactor = require("../models/tb03_PARDiscountFactor");
// const Tb03_GrowthCategory = require("../models/tb03_growthCategory");
// const Tb03_QuarterlyGrowth = require("../models/tb03_quarterlyGrowth");
const { round, set, floor } = require("lodash");

exports.isNumeric = (num) => {
	return !isNaN(num);
};

monthDiff = (myDates) => {
	d1 = new Date(myDates[0]);
	d2 = new Date(myDates[1]);
	var months;
	months = (d2.getFullYear() - d1.getFullYear()) * 12;
	months -= d1.getMonth();
	months += d2.getMonth();
	return months <= 0 ? 0 : months;
};

exports.monthDiff = monthDiff;

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////INFLATION ALLOWANCE CALCULATION///////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
exports.calcInflationAllowance = async (inflationAllowanceData) => {
	// console.log(inflationAllowanceData);
	let allowanceAmount = inflationAllowanceData.allowanceAmount,
		adjustmentAmount = inflationAllowanceData.adjustmentAmount;

	let staffMaternityLeave = 0,
		cieMaternityLeave = 0,
		payeTPR = 0,
		staffCSR = 0,
		cieCSR = 0,
		cieCommunityHealth = 0,
		totalStaffDeductions = 0,
		netSalary = 0;
	if (allowanceAmount > 0 && adjustmentAmount >= 0) {
		staffMaternityLeave = round(
			(allowanceAmount + adjustmentAmount) * (0.3 / 100),
			0
		);
		cieMaternityLeave = round(
			(allowanceAmount + adjustmentAmount) * (0.3 / 100),
			0
		);
		payeTPR = round((allowanceAmount + adjustmentAmount) * (30 / 100), 0);
		staffCSR = round((allowanceAmount + adjustmentAmount) * 0.03, 0);
		cieCSR = round((allowanceAmount + adjustmentAmount) * 0.05, 0);
		cieCommunityHealth = round(
			(allowanceAmount +
				adjustmentAmount -
				staffMaternityLeave -
				payeTPR -
				staffCSR) *
				(0.5 / 100),
			0
		);
		totalStaffDeductions = staffMaternityLeave + payeTPR + staffCSR;
		netSalary = allowanceAmount - totalStaffDeductions;
	}

	// console.log(allowanceAmount, adjustmentAmount, 30 / 100, netSalary);
	Tb01_Employee.findOneAndUpdate(
		{ _id: inflationAllowanceData.empID },
		{
			"inflationAllowance.staffMaternityLeave": staffMaternityLeave,
			"inflationAllowance.cieMaternityLeave": cieMaternityLeave,
			"inflationAllowance.payeTPR": payeTPR,
			"inflationAllowance.staffCSR": staffCSR,
			"inflationAllowance.cieCSR": cieCSR,
			"inflationAllowance.cieCommunityHealth": cieCommunityHealth,
			"inflationAllowance.totalStaffDeductions": totalStaffDeductions,
			"inflationAllowance.netSalary": netSalary,
		}
	).exec((err, emp) => {
		if (err) {
			return false;
		}
		return true;
	});
};

////////////////////////////////////////////////////////////////////////////////////
//////////////////////////MONTHLY SALARY CALCULATION///////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
exports.calcMontlySalary = async (staffSalaryData) => {
	let otherAllowance = 0;
	let otherDeduction = 0;
	let transportAllReloc = 0; //This is realocation allowance

	staffSalaryData.basicSalary = round(
		(staffSalaryData.basicSalary / 30) * staffSalaryData.daysWorked,
		0
	);
	staffSalaryData.transportAllowance = round(
		(staffSalaryData.transportAllowance / 30) * staffSalaryData.daysWorked,
		0
	);
	// staffSalaryData.rentalCostAllowance = round(
	// 	(staffSalaryData.rentalCostAllowance / 30) * staffSalaryData.daysWorked,
	// 	0
	// );
	staffSalaryData.technAllowance = round(
		(staffSalaryData.technAllowance / 30) * staffSalaryData.daysWorked,
		0
	);
	staffSalaryData.responsibilityAllowance = round(
		(staffSalaryData.responsibilityAllowance / 30) *
			staffSalaryData.daysWorked,
		0
	);

	//Calculate the total of other allowances
	if (
		staffSalaryData.otherAllowances &&
		staffSalaryData.otherAllowances.length > 0
	) {
		otherAllowance = staffSalaryData.otherAllowances.reduce(function (
			acc,
			curr
		) {
			return acc + curr.allowanceAmount;
		},
		0);
	}
	staffSalaryData.totalOtherAllowances = otherAllowance;

	const gross =
		Number(staffSalaryData.basicSalary) +
		// Number(staffSalaryData.rentalCostAllowance) +
		Number(staffSalaryData.technAllowance) +
		Number(staffSalaryData.responsibilityAllowance) +
		Number(staffSalaryData.transportAllowance) +
		Number(otherAllowance);
	const transportAll = Number(staffSalaryData.transportAllowance);

	//Calculate the total of other deductions
	//===================Computing SFAR deduction Before summing up all deductions=========

	for (deduction in staffSalaryData.otherDeductions) {
		if (
			staffSalaryData.otherDeductions[deduction].deductionName === "SFAR"
		) {
			staffSalaryData.otherDeductions[deduction].deductionAmount = round(
				(gross * 8) / 100,
				0
			);
		} else if (
			staffSalaryData.otherDeductions[deduction].deductionName ===
			"Transport Allowance - Relocation"
		) {
			transportAllReloc =
				staffSalaryData.otherDeductions[deduction].deductionAmount;
		}
	}
	//======================================================================================
	if (
		staffSalaryData.otherDeductions &&
		staffSalaryData.otherDeductions.length > 0
	) {
		otherDeduction = staffSalaryData.otherDeductions.reduce(function (
			acc,
			curr
		) {
			return acc + curr.deductionAmount;
		},
		0);
	}
	staffSalaryData.totalOtherDeductions = otherDeduction;

	staffSalaryData.grossEarnings = gross;
	////////////////////////////////////////OLD FASHION TO CALCULATE TPR////////////////////////////////
	// if (gross <= 30000) {
	// 	staffSalaryData.payeTPR = 0;
	// } else if (gross <= 100000) {
	// 	staffSalaryData.payeTPR = round((gross - 30000) * 0.2, 0);
	// } else {
	// 	staffSalaryData.payeTPR = round(14000 + (gross - 100000) * 0.3, 0);
	// }
	// staffSalaryData.staffMaternityLeave = round(
	// 	(gross - transportAll) * 0.003,
	// 	0
	// );
	///////////////////////// AUGUST 2023 //////////////////////////////////////////////////////////////
	// if (gross <= 60000) {
	// 	staffSalaryData.payeTPR = 0;
	// } else if (gross <= 100000) {
	// 	staffSalaryData.payeTPR = round((gross - 60000) * 0.2, 0);
	// } else {
	// 	staffSalaryData.payeTPR = round(8000 + (gross - 100000) * 0.3, 0);
	// }
	///////////////////////// NOVEMBER 2023 //////////////////////////////////////////////////////////////

	if (gross <= 60000) {
		staffSalaryData.payeTPR = 0;
	} else if (gross <= 100000) {
		staffSalaryData.payeTPR = round((gross - 60000) * 0.1, 0);
	} else if (gross <= 200000) {
		staffSalaryData.payeTPR = 4000 + round((gross - 100000) * 0.2, 0);
	} else {
		staffSalaryData.payeTPR = 24000 + round((gross - 200000) * 0.3, 0);
	}
	//////////////////////////////////////////////////////////////////////////////////////////////////////
	staffSalaryData.staffMaternityLeave = round(
		(gross - transportAll - transportAllReloc) * 0.003,
		0
	);
	staffSalaryData.staffCSR = round(
		(gross - transportAll - transportAllReloc) * 0.03,
		0
	);
	const totalDeductions =
		staffSalaryData.staffCSR +
		staffSalaryData.staffMaternityLeave +
		staffSalaryData.payeTPR +
		otherDeduction;
	staffSalaryData.totalStaffDeductions = totalDeductions;
	staffSalaryData.netSalary = staffSalaryData.grossEarnings - totalDeductions;

	//================================================Company contributions
	staffSalaryData.cieMaternityLeave = round(
		(gross - transportAll - transportAllReloc) * 0.003,
		0
	);
	staffSalaryData.cieCSR = round(
		(gross - transportAll - transportAllReloc) * 0.05,
		0
	);
	staffSalaryData.cieCommunityHealth = round(
		(gross -
			staffSalaryData.staffCSR -
			staffSalaryData.staffMaternityLeave -
			staffSalaryData.payeTPR) *
			0.005,
		0
	);
	staffSalaryData.cieTotalContribution =
		staffSalaryData.cieMaternityLeave +
		staffSalaryData.cieCSR +
		staffSalaryData.cieCommunityHealth;

	// console.log(staffSalaryData);
	Tb01_Employee.findOneAndUpdate(
		{ _id: staffSalaryData.empID },
		{
			currentMonthSalary: staffSalaryData,
		}
	).exec((err, emp) => {
		if (err) {
			return false;
		}
		return true;
	});
};

//////////////////////////////////////////////////////////////////////////
//////////////////////////SALES INCENTIVES///////////////////////////////
////////////////////////////////////////////////////////////////////////
exports.calcMonthlyIncentiveSales = async (incentiveData) => {
	//This routine is called for staff found in Tb01_IncentiveStaff
	// console.log("Incentive data: ", incentiveData);
	let existingNew = "";
	let numberNewSO = 0;
	let numberNewGSO = 0;
	let numberExistingSO = 0;
	let numberExistingGSO = 0;
	let branchStaff = [];
	let incePerc = {};

	let branchActualDisbClient = 0;
	let branchActualDisbAmount = 0;
	let branchTargetAmountMaxNewSO = 0;
	let branchTargetAmountMaxNewGSO = 0;
	let branchTargetAmountMinNewSO = 0;
	let branchTargetAmountMinNewGSO = 0;
	let branchTargetAmountMaxExistingSO = 0;
	let branchTargetAmountMaxExistingGSO = 0;
	let branchTargetAmountMinExistingSO = 0;
	let branchTargetAmountMinExistingGSO = 0;
	let branchTargetAmountMin = 0;
	let branchTargetAmountMax = 0;

	let branchTargetClientMaxNewSO = 0;
	let branchTargetClientMaxNewGSO = 0;
	let branchTargetClientMinNewSO = 0;
	let branchTargetClientMinNewGSO = 0;
	let branchTargetClientMaxExistingSO = 0;
	let branchTargetClientMaxExistingGSO = 0;
	let branchTargetClientMinExistingSO = 0;
	let branchTargetClientMinExistingGSO = 0;
	let branchTargetClientMin = 0;
	let branchTargetClientMax = 0;

	let eligibleForIncentiveBranchAmount = 0;
	let archivedScoreBranchAmount = 0;
	let weightedScoreAmountBranch = 0;
	let eligibleForIncentiveBranchClient = 0;
	let archivedScoreBranchClient = 0;
	let weightedScoreClientBranch = 0;
	let branchBenefitB4Delequency = 0;

	let disbClientsMin = 0;
	let disbClientsMax = 0;
	let disbAmountMin = 0;
	let disbAmountMax = 0;
	let targetRangeDisbClient = 0;
	let targetRangeDisbAmount = 0;
	let saleActualDisbClient = 0;
	let saleActualDisbAmount = 0;
	let eligibleForIncClient = 0;
	let eligibleForIncAmount = 0;
	let achievedScoreClient = 0;
	let achievedScoreAmount = 0;
	let incentiveB4Delequency = 0;
	let totalIncentiveB4Delequency = 0;
	let actualRepayment = 0;
	let ppalAreaDue = 0;

	let eligibleIncentiveB4BranchAllocation = 0;
	let overpaidAmount = 0;
	let totalIncentive = 0;

	let stlNewSO = 0;
	let stlExistingSO = 0;
	let stlNewGSO = 0;
	let stlExistingGSO = 0;
	let stlTargetClientMin = 0;
	let stlTargetClientMax = 0;
	let stlTargetAmountMin = 0;
	let stlTargetAmountMax = 0;
	let stlActualDisbClient = 0;
	let stlActualDisbAmount = 0;
	let stlEligibleForIncClient = 0;
	let stlEligibleForIncAmount = 0;
	let stlAchievedScoreClient = 0;
	let stlAchievedScoreAmount = 0;
	let stlRepayment = 0;
	let stlPpalArreas = 0;
	let branchRepayment = 0;
	let branchPpalArreas = 0;

	const branchCode = incentiveData.officerCode.toString().substring(0, 2);
	const currentEmployee = await Tb01_Employee.findOne({
		empCode: incentiveData.empCode,
		officerCode: incentiveData.officerCode,
	}).exec();

	if (!currentEmployee) return false;
	//Calculation applied to everyone in branch except Branch manager

	if (
		currentEmployee.currentAppointment &&
		currentEmployee.currentAppointment.jobTitle
	) {
		//Finding the status of employee: New or Existing
		if (
			monthDiff([
				currentEmployee.currentAppointment.appointedDate,
				new Date(),
			]) < 6
		) {
			existingNew = "New";
		} else {
			existingNew = "Existing";
		}

		//Finding New or Existing SO and GSO
		//============Remember to put staff from credit office to their main branch=========
		branchStaff = await Tb01_Employee.find({
			"currentAppointment.branch":
				currentEmployee.currentAppointment.branch,
			"currentAppointment.active": true,
		}).exec();
		////////////////// numberNewSO = 0;//////////////////////////////////////////////////
		////////////////// numberNewGSO = 2;////////////////////////////////////////////////
		////////////////// numberExistingSO = 1;///////////////////////////////////////////
		////////////////// numberExistingGSO = 9;/////////////////////////////////////////

		//Please note that numbers above will affect calculation on incentives
		//Make sure Appointment dates are correct for SO and GSO
		branchStaff.forEach((emp) => {
			if (
				emp.currentAppointment.jobTitle ===
					"Individual Sales Officer" &&
				monthDiff([emp.currentAppointment.jobTitleDate, new Date()]) < 6
			) {
				numberNewSO = numberNewSO + 1;
			}
			if (
				emp.currentAppointment.jobTitle ===
					"Individual Sales Officer" &&
				monthDiff([emp.currentAppointment.jobTitleDate, new Date()]) >=
					6
			) {
				numberExistingSO = numberExistingSO + 1;
			}
			if (
				(emp.currentAppointment.jobTitle === "Group Sales Officer" ||
					emp.currentAppointment.jobTitle === "Sales Associate") &&
				monthDiff([emp.currentAppointment.jobTitleDate, new Date()]) < 6
			) {
				numberNewGSO = numberNewGSO + 1;
			}
			if (
				(emp.currentAppointment.jobTitle === "Group Sales Officer" ||
					emp.currentAppointment.jobTitle === "Sales Associate") &&
				monthDiff([emp.currentAppointment.jobTitleDate, new Date()]) >=
					6
			) {
				numberExistingGSO = numberExistingGSO + 1;
			}
		});

		//Find Eligible amount for the staff
		//???????????????Credit Office Manager????? this role is not listed for Eligible incentive in excel calculator????????????
		incePerc = await Tb03_IncentivePercentage.findOne({
			roleName: currentEmployee.currentAppointment.jobTitle,
		}).exec();
		if (incePerc !== null) {
			eligibleIncentiveB4BranchAllocation = round(
				incePerc.avgRoleSalary * incePerc.incentivePerc,
				0
			);
		}

		//Actual amount and clients disbursed
		const monthIncentives = await Tb01_IncentiveStaff.find({
			yearIncentive: incentiveData.yearIncentive,
			monthIncentive: incentiveData.monthIncentive,
			jobTitle: {
				$in: ["Individual Sales Officer", "Group Sales Officer"],
			},
		}).exec();
		if (monthIncentives.length <= 0) return false;
		monthIncentives.forEach((incent) => {
			if (
				incent.branchName &&
				incent.branchName === incentiveData.branchName
			) {
				branchActualDisbClient =
					branchActualDisbClient + incent.disbursedClients;
				branchActualDisbAmount =
					branchActualDisbAmount + incent.disbursedAmount;
				//Branch's delequency discounter
				branchRepayment = branchRepayment + incent.repaidAmount;
				branchPpalArreas = branchPpalArreas + incent.ppalAreaDue;
			}
		});

		//Getting Branch targets ===============================
		const branchSaleTargets = await Tb03_TargetSale.find({
			branchLocation: currentEmployee.currentAppointment.locationType,
		}).exec();

		branchSaleTargets.forEach((branchTarget) => {
			if (
				branchTarget.saleType === "Individual Sales Officer" &&
				branchTarget.staffStatus === "New"
			) {
				branchTargetAmountMaxNewSO =
					branchTargetAmountMaxNewSO + branchTarget.maxAmount;
				branchTargetAmountMinNewSO =
					branchTargetAmountMinNewSO + branchTarget.minAmount;

				branchTargetClientMaxNewSO =
					branchTargetClientMaxNewSO + branchTarget.maxClient;
				branchTargetClientMinNewSO =
					branchTargetClientMinNewSO + branchTarget.minClient;
			}
			if (
				branchTarget.saleType === "Individual Sales Officer" &&
				branchTarget.staffStatus === "Existing"
			) {
				branchTargetAmountMaxExistingSO =
					branchTargetAmountMaxExistingSO + branchTarget.maxAmount;
				branchTargetAmountMinExistingSO =
					branchTargetAmountMinExistingSO + branchTarget.minAmount;

				branchTargetClientMaxExistingSO =
					branchTargetClientMaxExistingSO + branchTarget.maxClient;
				branchTargetClientMinExistingSO =
					branchTargetClientMinExistingSO + branchTarget.minClient;
			}
			if (
				branchTarget.saleType === "Group Sales Officer" &&
				branchTarget.staffStatus === "Existing"
			) {
				branchTargetAmountMaxExistingGSO =
					branchTargetAmountMaxExistingGSO + branchTarget.maxAmount;
				branchTargetAmountMinExistingGSO =
					branchTargetAmountMinExistingGSO + branchTarget.minAmount;

				branchTargetClientMaxExistingGSO =
					branchTargetClientMaxExistingGSO + branchTarget.maxClient;
				branchTargetClientMinExistingGSO =
					branchTargetClientMinExistingGSO + branchTarget.minClient;
			}
		});

		branchTargetAmountMin =
			branchTargetAmountMinNewSO * numberNewSO +
			branchTargetAmountMinExistingSO * numberExistingSO +
			branchTargetAmountMinExistingGSO *
				(numberExistingGSO + numberNewGSO);
		branchTargetAmountMax =
			branchTargetAmountMaxNewSO * numberNewSO +
			branchTargetAmountMaxExistingSO * numberExistingSO +
			branchTargetAmountMaxExistingGSO *
				(numberExistingGSO + numberNewGSO);
		branchTargetClientMin =
			branchTargetClientMinNewSO * numberNewSO +
			branchTargetClientMinExistingSO * numberExistingSO +
			branchTargetClientMinExistingGSO *
				(numberExistingGSO + numberNewGSO);
		branchTargetClientMax =
			branchTargetClientMaxNewSO * numberNewSO +
			branchTargetClientMaxExistingSO * numberExistingSO +
			branchTargetClientMaxExistingGSO *
				(numberExistingGSO + numberNewGSO);

		///Calculate eligible numbers
		eligibleForIncentiveBranchAmount =
			branchActualDisbAmount < branchTargetAmountMin
				? 0
				: branchActualDisbAmount - branchTargetAmountMin;
		archivedScoreBranchAmount =
			eligibleForIncentiveBranchAmount >
			branchTargetAmountMax - branchTargetAmountMin
				? 1
				: eligibleForIncentiveBranchAmount /
				  (branchTargetAmountMax - branchTargetAmountMin);
		weightedScoreAmountBranch = 0.6 * archivedScoreBranchAmount;

		eligibleForIncentiveBranchClient =
			branchActualDisbClient < branchTargetClientMin
				? 0
				: branchActualDisbClient - branchTargetClientMin;
		archivedScoreBranchClient =
			eligibleForIncentiveBranchClient >
			branchTargetClientMax - branchTargetClientMin
				? 1
				: eligibleForIncentiveBranchClient /
				  (branchTargetClientMax - branchTargetClientMin);
		weightedScoreClientBranch = 0.4 * archivedScoreBranchClient;

		if (incePerc) {
			branchBenefitB4Delequency =
				(weightedScoreAmountBranch + weightedScoreClientBranch) *
				incePerc.avgRoleSalary *
				0.2;
		}
	}
	const saleActuals = await Tb01_IncentiveStaff.findOne({
		empCode: currentEmployee.empCode,
		yearIncentive: incentiveData.yearIncentive,
		monthIncentive: incentiveData.monthIncentive,
	}).exec();
	if (saleActuals) {
		saleActualDisbClient = saleActuals.disbursedClients;
		saleActualDisbAmount = saleActuals.disbursedAmount;
		actualRepayment = saleActuals.repaidAmount;
		ppalAreaDue = saleActuals.ppalAreaDue;
		overpaidAmount = saleActuals.overpaidAmount;
	}

	if (
		incentiveData.jobTitle === "Individual Sales Officer" ||
		//incentiveData.jobTitle === "Senior Individual Sales Officer" || =============if used, then make sure it is in the tb03_targetsales table for mins and maxs
		incentiveData.jobTitle === "Group Sales Officer"
		// || incentiveData.jobTitle === "SME Finance Officer" =============if used, then make sure it is in the tb03_targetsales table for mins and maxs
	) {
		const saleTargets = await Tb03_TargetSale.findOne({
			branchLocation: currentEmployee.currentAppointment.locationType,
			saleType: currentEmployee.currentAppointment.jobTitle, //"Individual Sales Officer",
			staffStatus: existingNew,
		}).exec();

		if (saleTargets) {
			disbClientsMin = saleTargets.minClient;
			disbClientsMax = saleTargets.maxClient;
			disbAmountMin = saleTargets.minAmount;
			disbAmountMax = saleTargets.maxAmount;
			targetRangeDisbClient = disbClientsMax - disbClientsMin;
			targetRangeDisbAmount = disbAmountMax - disbAmountMin;
		}
		eligibleForIncClient =
			saleActualDisbClient < disbClientsMin
				? 0
				: saleActualDisbClient - disbClientsMin;
		eligibleForIncAmount =
			saleActualDisbAmount < disbAmountMin
				? 0
				: saleActualDisbAmount - disbAmountMin;
		achievedScoreClient =
			eligibleForIncClient > targetRangeDisbClient
				? 1
				: eligibleForIncClient / targetRangeDisbClient;
		achievedScoreAmount =
			eligibleForIncAmount > targetRangeDisbAmount
				? 1
				: eligibleForIncAmount / targetRangeDisbAmount;

		incentiveB4Delequency = round(
			(achievedScoreAmount * 0.6 + achievedScoreClient * 0.4) *
				eligibleIncentiveB4BranchAllocation,
			0
		);
		totalIncentiveB4Delequency =
			branchBenefitB4Delequency + incentiveB4Delequency;

		if (actualRepayment / ppalAreaDue) {
			totalIncentive = round(
				totalIncentiveB4Delequency > 0
					? totalIncentiveB4Delequency *
							(actualRepayment / ppalAreaDue)
					: 0,
				0
			);
		} else {
			totalIncentive = round(totalIncentiveB4Delequency, 0);
		}
		// console.log("Total Incentive:", totalIncentive)
		// totalIncentive = round(
		// 	totalIncentiveB4Delequency -
		// 		(1 - actualRepayment / (actualRepayment )) * //+ ppalAreaDue
		// 			totalIncentiveB4Delequency,
		// 	0
		// );
	} else if (
		incentiveData.jobTitle === "Sales Team Leader" ||
		incentiveData.jobTitle === "Senior Sales Team Leader"
	) {
		//===============Calculations for team leaders
		const teamMembers = currentEmployee.currentMonthSalary.teamLeading
			? currentEmployee.currentMonthSalary.teamLeading
			: [];
		for (tm in teamMembers) {
			if (
				teamMembers[tm].staffExistingNew === "New" &&
				teamMembers[tm].staffJobTitle === "Individual Sales Officer"
			) {
				stlNewSO = stlNewSO + 1;
			} else if (
				teamMembers[tm].staffExistingNew === "Existing" &&
				teamMembers[tm].staffJobTitle === "Individual Sales Officer"
			) {
				stlExistingSO = stlExistingSO + 1;
			} else if (
				teamMembers[tm].staffExistingNew === "New" &&
				teamMembers[tm].staffJobTitle === "Group Sales Officer"
			) {
				stlNewGSO = stlNewGSO + 1;
			} else if (
				teamMembers[tm].staffExistingNew === "Existing" &&
				teamMembers[tm].staffJobTitle === "Group Sales Officer"
			) {
				stlExistingGSO = stlExistingGSO + 1;
			}
		}
		stlTargetAmountMin =
			branchTargetAmountMinNewSO * stlNewSO +
			branchTargetAmountMinExistingSO * stlExistingSO +
			branchTargetAmountMinExistingGSO * (stlExistingGSO + stlNewGSO);
		stlTargetAmountMax =
			branchTargetAmountMaxNewSO * stlNewSO +
			branchTargetAmountMaxExistingSO * stlExistingSO +
			branchTargetAmountMaxExistingGSO * (stlExistingGSO + stlNewGSO);
		stlTargetClientMin =
			branchTargetClientMinNewSO * stlNewSO +
			branchTargetClientMinExistingSO * stlExistingSO +
			branchTargetClientMinExistingGSO * (stlExistingGSO + stlNewGSO);
		stlTargetClientMax =
			branchTargetClientMaxNewSO * stlNewSO +
			branchTargetClientMaxExistingSO * stlExistingSO +
			branchTargetClientMaxExistingGSO * (stlExistingGSO + stlNewGSO);

		///////////Calculate actuals for the STL
		let teamMemberCodes = [];
		for (code in currentEmployee.currentMonthSalary.teamLeading) {
			teamMemberCodes.push(
				currentEmployee.currentMonthSalary.teamLeading[code].staffCode
			);
		}
		const stlActuals = await Tb01_IncentiveStaff.find({
			applied: "NON",
			officerCode: { $in: teamMemberCodes },
			// $or: [
			// 	{ empCode: { $in: teamMemberCodes } },
			// 	{ officerCode: { $in: teamMemberCodes } },
			// ],
		});
		stlActualDisbClient = stlActuals.reduce(function (acc, curr) {
			return acc + curr.disbursedClients;
		}, 0);

		stlActualDisbAmount = stlActuals.reduce(function (acc, curr) {
			return acc + curr.disbursedAmount;
		}, 0);

		stlRepayment = stlActuals.reduce(function (acc, curr) {
			return acc + curr.repaidAmount;
		}, 0);
		stlPpalArreas = stlActuals.reduce(function (acc, curr) {
			return acc + curr.ppalAreaDue;
		}, 0);
		stlEligibleForIncClient =
			stlActualDisbClient < stlTargetClientMin
				? 0
				: stlActualDisbClient - stlTargetClientMin;
		stlEligibleForIncAmount =
			stlActualDisbAmount < stlTargetAmountMin
				? 0
				: stlActualDisbAmount - stlTargetAmountMin;
		stlAchievedScoreClient =
			stlEligibleForIncClient > stlTargetClientMax - stlTargetClientMin
				? 1
				: (stlEligibleForIncClient + 0.0) /
				  (stlTargetClientMax - stlTargetClientMin + 0.0);
		stlAchievedScoreAmount =
			stlEligibleForIncAmount > stlTargetAmountMax - stlTargetAmountMin
				? 1
				: (stlEligibleForIncAmount + 0.0) /
				  (stlTargetAmountMax - stlTargetAmountMin + 0.0);

		incentiveB4Delequency =
			(stlAchievedScoreAmount * 0.6 + stlAchievedScoreClient * 0.4) *
			eligibleIncentiveB4BranchAllocation;

		if (incePerc !== null) {
			branchBenefitB4Delequency =
				(archivedScoreBranchAmount * 0.6 +
					archivedScoreBranchClient * 0.4) *
				(incePerc.avgRoleSalary * 0.2);
		}

		totalIncentiveB4Delequency =
			branchBenefitB4Delequency + incentiveB4Delequency;

		totalIncentive = round(
			stlRepayment / stlPpalArreas >= 1
				? totalIncentiveB4Delequency
				: totalIncentiveB4Delequency * (stlRepayment / stlPpalArreas),
			0
		);

		// totalIncentive = round(
		// 	totalIncentiveB4Delequency -
		// 		(1 -
		// 			(stlRepayment + 0.0) /
		// 				(stlRepayment + stlPpalArreas + 0.0)) *
		// 			totalIncentiveB4Delequency,
		// 	0
		// );
	} else if (
		incentiveData.jobTitle === "Branch Manager" ||
		incentiveData.jobTitle === "Credit Office Manager"
	) {
		//===============Calculations for Branch Managers
		stlTargetAmountMin =
			branchTargetAmountMinNewSO * numberNewSO +
			branchTargetAmountMinExistingSO * numberExistingSO +
			branchTargetAmountMinExistingGSO *
				(numberExistingGSO + numberNewGSO);
		stlTargetAmountMax =
			branchTargetAmountMaxNewSO * numberNewSO +
			branchTargetAmountMaxExistingSO * numberExistingSO +
			branchTargetAmountMaxExistingGSO *
				(numberExistingGSO + numberNewGSO);
		stlTargetClientMin =
			branchTargetClientMinNewSO * numberNewSO +
			branchTargetClientMinExistingSO * numberExistingSO +
			branchTargetClientMinExistingGSO *
				(numberExistingGSO + numberNewGSO);
		stlTargetClientMax =
			branchTargetClientMaxNewSO * numberNewSO +
			branchTargetClientMaxExistingSO * numberExistingSO +
			branchTargetClientMaxExistingGSO *
				(numberExistingGSO + numberNewGSO);

		///////////Calculate actuals for the STL
		let teamMemberCodes = [];
		for (code in currentEmployee.currentMonthSalary.teamLeading) {
			teamMemberCodes.push(
				currentEmployee.currentMonthSalary.teamLeading[code].staffCode
			);
		}
		const stlActuals = await Tb01_IncentiveStaff.find({
			applied: "NON",
			branchName: currentEmployee.currentAppointment.branch,
			jobTitle: {
				$in: [
					"Senior Individual Sales Officer",
					"Individual Sales Officer",
					"Group Sales Officer",
				],
			},
		});
		stlActualDisbClient = stlActuals.reduce(function (acc, curr) {
			return acc + curr.disbursedClients;
		}, 0);

		stlActualDisbAmount = stlActuals.reduce(function (acc, curr) {
			return acc + curr.disbursedAmount;
		}, 0);

		stlRepayment = stlActuals.reduce(function (acc, curr) {
			return acc + curr.repaidAmount;
		}, 0);
		stlPpalArreas = stlActuals.reduce(function (acc, curr) {
			return acc + curr.ppalAreaDue;
		}, 0);
		stlEligibleForIncClient =
			stlActualDisbClient < stlTargetClientMin
				? 0
				: stlActualDisbClient - stlTargetClientMin;
		stlEligibleForIncAmount =
			stlActualDisbAmount < stlTargetAmountMin
				? 0
				: stlActualDisbAmount - stlTargetAmountMin;
		stlAchievedScoreClient =
			stlEligibleForIncClient > stlTargetClientMax - stlTargetClientMin
				? 1
				: (stlEligibleForIncClient + 0.0) /
				  (stlTargetClientMax - stlTargetClientMin + 0.0);
		stlAchievedScoreAmount =
			stlEligibleForIncAmount > stlTargetAmountMax - stlTargetAmountMin
				? 1
				: (stlEligibleForIncAmount + 0.0) /
				  (stlTargetAmountMax - stlTargetAmountMin + 0.0);
		incentiveB4Delequency =
			(stlAchievedScoreAmount * 0.6 + stlAchievedScoreClient * 0.4) *
			eligibleIncentiveB4BranchAllocation;

		if (incePerc !== null) {
			branchBenefitB4Delequency =
				(archivedScoreBranchAmount * 0.6 +
					archivedScoreBranchClient * 0.4) *
				incePerc.avgRoleSalary *
				0.2;
		}
		totalIncentiveB4Delequency =
			branchBenefitB4Delequency + incentiveB4Delequency;

		// totalIncentive = round(
		// 	totalIncentiveB4Delequency -
		// 		(1 -
		// 			(stlRepayment + 0.0) /
		// 				(stlRepayment + stlPpalArreas + 0.0)) *
		// 			totalIncentiveB4Delequency,
		// 	0
		// );
		totalIncentive =
			branchRepayment / branchPpalArreas >= 1
				? incentiveB4Delequency
				: incentiveB4Delequency * (branchRepayment / branchPpalArreas);
	} else {
		//=============Calculations for other branch staff except BM

		branchBenefitB4Delequency =
			(archivedScoreBranchAmount * 0.6 +
				archivedScoreBranchClient * 0.4) *
			eligibleIncentiveB4BranchAllocation;
		totalIncentive =
			branchBenefitB4Delequency > 0
				? branchBenefitB4Delequency *
				  (branchRepayment / branchPpalArreas)
				: 0;
		// console.log("Total incentives: ", totalIncentive);
		// totalIncentive =
		// 	branchBenefitB4Delequency > 0
		// 		? branchBenefitB4Delequency -
		// 		  (1 -
		// 				(branchRepayment + 0.0) /
		// 					(branchRepayment + branchPpalArreas + 0.0)) *
		// 				branchBenefitB4Delequency
		// 		: 0;
	}
	//Updating database after calculations
	Tb01_IncentiveStaff.findOneAndUpdate(
		{
			empCode: incentiveData.empCode, //officerCode: incentiveData.officerCode DOES NOT WORK BECAUSE MORE THAN 1 PERSONS HAVE SAME officerCode
			yearIncentive: incentiveData.yearIncentive,
			monthIncentive: incentiveData.monthIncentive,
		},
		{
			branchDisbusedClients: branchActualDisbClient,
			branchDisbusedAmount: branchActualDisbAmount,
			branchRepaidAmount: branchRepayment,
			branchAreaDue: branchPpalArreas,
			IncentiveBeforeDelequency: incentiveB4Delequency,
			BranchBenefitBeforeDelequency: branchBenefitB4Delequency,
			TotalIncentiveBeforeDelequency:
				branchBenefitB4Delequency + incentiveB4Delequency,
			Delequency: round(
				actualRepayment / ppalAreaDue, //actualRepayment +
				3
			),
			IncentiveAfterDelequency: totalIncentive ? totalIncentive : 0,

			incentiveNet: round(totalIncentive - overpaidAmount, 0),
		}
	).exec((err, staffIncentive) => {
		if (err) {
			// console.log(incentiveData.officerCode)
			console.log(err);
			return false;
		}
		return true;
	});
};

exports.removeAdhocAllowanceAndDeduction = async (
	staffID,
	staffOtherAllowances,
	staffOtherDeductions
) => {
	if (staffOtherAllowances && staffOtherAllowances.length > 0) {
		staffOtherAllowances = staffOtherAllowances.filter(
			(item) =>
				(item.endDate && item.endDate > new Date()) ||
				item.isRepeated === "YES"
		);
	} else {
		staffOtherAllowances = [];
	}

	if (staffOtherDeductions && staffOtherDeductions.length > 0) {
		staffOtherDeductions = staffOtherDeductions.filter(
			(item) =>
				(item.endDate && item.endDate > new Date()) ||
				item.isRepeated === "YES"
		);
	} else {
		staffOtherDeductions = [];
	}
	Tb01_Employee.findOneAndUpdate(
		{ _id: staffID },
		{
			"currentMonthSalary.otherAllowances": staffOtherAllowances,
			"currentMonthSalary.staffOtherDeductions": staffOtherDeductions,
		}
	).exec((err, emp) => {
		if (err) {
			return false;
		}
		return true;
	});
};

exports.resetSalaryComponents = async (
	staffID,
	entitledBasicSalary,
	// entitledRentalCostAllowance,
	entitledTechnAllowance,
	entitledResponsibilityAllowance,
	entitledTransportAllowance
) => {
	Tb01_Employee.findOneAndUpdate(
		{ _id: staffID },
		{
			"currentMonthSalary.basicSalary": entitledBasicSalary,
			// "currentMonthSalary.rentalCostAllowance":
			// 	entitledRentalCostAllowance,
			"currentMonthSalary.technAllowance": entitledTechnAllowance,
			"currentMonthSalary.responsibilityAllowance":
				entitledResponsibilityAllowance,
			"currentMonthSalary.transportAllowance": entitledTransportAllowance,
			"currentMonthSalary.daysWorked": 30,
		}
	).exec((err, emp) => {
		if (err) {
			return false;
		}
		return true;
	});
};
