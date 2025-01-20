const express = require("express");
const router = express.Router();

//import controllers
const {
	listCountries,
	listMaritalStatuses,
	listContractTypes,
	listDivisions,
	listDepartments,
	listJobTitles,
	listBranches,
	listLocations,
	listExecutives,
	listBanks,
	listMonths,
	listDeductions,
	listAllowances,
	listRoles,
	listLeaveTypes,
	listCurrencies,
} = require("../controllers/basicDataController");

//routes
router.get("/countries", listCountries);
router.get("/maritalStatuses", listMaritalStatuses);
router.get("/contracttypes", listContractTypes);
router.get("/divisions", listDivisions);
router.get("/departments", listDepartments);
router.get("/jobtitles", listJobTitles);
router.get("/branches", listBranches);
router.get("/locations", listLocations);
router.get("/executives", listExecutives);
router.get("/banks", listBanks);
router.get("/months", listMonths);
router.get("/deductions", listDeductions);
router.get("/allowances", listAllowances);
router.get("/roles", listRoles);
router.get("/leavetypes", listLeaveTypes);
router.get("/currencies", listCurrencies);

module.exports = router;
