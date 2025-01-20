const express = require("express");
const router = express.Router();

const {
	requireSignin,
	staffMiddleware,
	hrMiddleware,
	accountantMiddleware,
	excoMiddleware,
} = require("../controllers/authController");

const {
	addInflationAllowance,
	computeInflationAllowance,
	excelInflationAllowance,
	txtInflationAllowance,
	txtInflationAllowanceOB,
	summaryInflationAllowance,
	validateInflationAllowance,
	approveInflationAllowance,
} = require("../controllers/inflationAllowanceController");

router.put(
	"/addInflationAllowance/:employeeid",
	requireSignin,
	hrMiddleware,
	addInflationAllowance
);

router.get(
	"/calcInflationAllowance",
	requireSignin,
	hrMiddleware,
	computeInflationAllowance
);

router.get(
	"/exportInflationAllowance",
	requireSignin,
	hrMiddleware,
	excelInflationAllowance
);
router.get(
	"/exportInflationAllowanceAccountant",
	requireSignin,
	accountantMiddleware,
	excelInflationAllowance
);
router.get(
	"/exportInflationAllowanceEXCO",
	requireSignin,
	excoMiddleware,
	excelInflationAllowance
);

router.get("/toTxtFile", requireSignin, hrMiddleware, txtInflationAllowance);
router.get(
	"/toTxtFileAccountant",
	requireSignin,
	accountantMiddleware,
	txtInflationAllowance
);
router.get(
	"/toTxtFileOB",
	requireSignin,
	hrMiddleware,
	txtInflationAllowanceOB
);
router.get(
	"/toTxtFileOBAccountant",
	requireSignin,
	accountantMiddleware,
	txtInflationAllowanceOB
);
router.get(
	"/sumInflationAllowance",
	requireSignin,
	accountantMiddleware,
	summaryInflationAllowance
);
router.get(
	"/sumInflationAllowanceExco",
	requireSignin,
	excoMiddleware,
	summaryInflationAllowance
);
router.put(
	"/validateInflationAllowance",
	requireSignin,
	accountantMiddleware,
	validateInflationAllowance
);

router.put(
	"/approveInflationAllowance",
	requireSignin,
	excoMiddleware,
	approveInflationAllowance
);

module.exports = router;
