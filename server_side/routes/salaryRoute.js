const express = require("express");
const router = express.Router();

//import validators
const { monthlySalaryValidator } = require("../validators/salaryValidator");
const { runValidation } = require("../validators/index");

//import controller methods
const {
	requireSignin,
	hrMiddleware,
	accountantMiddleware,
	excoMiddleware,
	staffMiddleware,
} = require("../controllers/authController");

const {
	editSalary,
	calculateSalary,
	validateSalary,
	approveSalary,
	initializeSalary,
	exportSalary,
	exportSalaryOtherBanks,
	editOtherDeductions,
	editOtherAllowances,
	calculateIncentiveStaff,
	calculateIncentiveBM,
	summarySalary,
	payrollStatus,
	exportForValidation,
	loadFileData,
	archiveSalary,
	summarySalaryParBranch,
	payrollBreakDown,
	payrollAccountingEntry,
	payrollSummary,
} = require("../controllers/salaryController");

//============================Salary Routes================================
router.put("/salary/:employeeid", requireSignin, hrMiddleware, editSalary);
router.put(
	"/otherAllowance/:employeeid",
	requireSignin,
	hrMiddleware,
	editOtherAllowances
);
router.put(
	"/otherDeduction/:employeeid",
	requireSignin,
	hrMiddleware,
	editOtherDeductions
);
router.put("/calculateSalary", requireSignin, hrMiddleware, calculateSalary);
router.put(
	"/validateSalary",
	requireSignin,
	accountantMiddleware,
	validateSalary
);
router.put("/approveSalary", requireSignin, excoMiddleware, approveSalary);
router.put("/initializeSalary", requireSignin, hrMiddleware, initializeSalary);
router.put("/loadFile", requireSignin, hrMiddleware, loadFileData);
router.get("/exportSalary", requireSignin, hrMiddleware, exportSalary);
// router.get("/exportSalaryEXCO", requireSignin, excoMiddleware, exportSalary);
router.get(
	"/exportSalaryAccountant",
	requireSignin,
	accountantMiddleware,
	exportSalary
);
router.get(
	"/exportSalaryOtherBanks",
	requireSignin,
	hrMiddleware,
	exportSalaryOtherBanks
);
router.get(
	"/exportSalaryOtherBanksAccountant",
	requireSignin,
	accountantMiddleware,
	exportSalaryOtherBanks
);
router.get(
	"/exportForVerification",
	requireSignin,
	hrMiddleware,
	exportForValidation
);
router.get("/salaryBreakDownHR", requireSignin, hrMiddleware, payrollBreakDown);
router.get("/payrollStatus", requireSignin, hrMiddleware, payrollStatus);
router.get("/sumSalary", requireSignin, accountantMiddleware, summarySalary);
router.get(
	"/sumSalaryBranch",
	requireSignin,
	accountantMiddleware,
	summarySalaryParBranch
);
router.get(
	"/exportForValidation",
	requireSignin,
	accountantMiddleware,
	exportForValidation
);
router.get("/sumSalaryExco", requireSignin, excoMiddleware, summarySalary);
router.post(
	"/archivePaySlip/:empCode",
	requireSignin,
	staffMiddleware,
	archiveSalary
);
router.get(
	"/salaryBreakDown",
	requireSignin,
	accountantMiddleware,
	payrollBreakDown
);
router.get(
	"/salaryBreakDownExco",
	requireSignin,
	excoMiddleware,
	payrollBreakDown
);
router.put(
	"/salaryAccountEntry",
	requireSignin,
	accountantMiddleware,
	payrollAccountingEntry
);
router.put(
	"/paySummarySignature",
	requireSignin,
	accountantMiddleware,
	payrollSummary
);

module.exports = router;
