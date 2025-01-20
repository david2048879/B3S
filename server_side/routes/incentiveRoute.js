const express = require("express");
const router = express.Router();

//import validators
const { monthlySalaryValidator } = require("../validators/salaryValidator");
const { runValidation } = require("../validators/index");

//import controller methods
const {
	requireSignin,
	hrMiddleware,
	branchManagerMiddleware, businessMiddleware
} = require("../controllers/authController");

const {
	editIncentive,
	calculateIncentiveBM,
	calculateIncentiveStaff,
	readIncentive,
	listIncentives,
	listSearchedIncentives,
	listSalesOfficers,
	editSupervision,applySalesIncentives, loadIncentiveData, loadIncentiveFileData, exportMontlyIncentives, listBranchIncentiveStaff, swapIncentives
} = require("../controllers/incentiveController");

router.put(
	"/incentive/:incentiveid",
	requireSignin,
	hrMiddleware, 
	editIncentive
);
router.put(
	"/incentiveSales",
	requireSignin,
	hrMiddleware,
	calculateIncentiveStaff
);
router.put("/incentiveBM", requireSignin, hrMiddleware, calculateIncentiveBM);
router.post(
	"/searchIncentives",
	requireSignin,
	hrMiddleware,
	listSearchedIncentives
);
router.post(
	"/businessSearchIncentives",
	requireSignin,
	businessMiddleware,
	listSearchedIncentives
);

router.get("/incentives", requireSignin, hrMiddleware, listIncentives);
router.get("/businessIncentives", requireSignin, businessMiddleware, listIncentives);
router.post("/apply_incentives", requireSignin, hrMiddleware, applySalesIncentives);
router.post("/sale_officers", requireSignin, hrMiddleware, listSalesOfficers);
router.post("/bm_sale_officers", requireSignin, branchManagerMiddleware, listSalesOfficers);
router.post(
	"/supervision/:supervisorid",
	requireSignin,
	hrMiddleware,
	editSupervision
);
router.post(
	"/bm_supervision/:supervisorid",
	requireSignin,
	branchManagerMiddleware,
	editSupervision
);
router.get(
	"/incentive/:incentiveid",
	requireSignin,
	hrMiddleware,
	readIncentive
);
router.get(
	"/businessIncentive/:incentiveid",
	requireSignin,
	businessMiddleware,
	readIncentive
);
router.get(
	"/loadCurrentIncentiveData",
	requireSignin,
	hrMiddleware,
	loadIncentiveData
);
router.put("/loadIncentiveFile", requireSignin, hrMiddleware, loadIncentiveFileData);
router.get(
	"/exportIncentives",
	requireSignin,
	businessMiddleware,
	exportMontlyIncentives
);
router.get(
	"/branchIncentiveStaff/:officerCode",
	requireSignin,
	businessMiddleware,
	listBranchIncentiveStaff
);
router.put("/swapIncentive", requireSignin, businessMiddleware, swapIncentives);
module.exports = router;
