const express = require("express");
const router = express.Router();

//import controllers
const {
	mergeEmpData,
	importDataFromFiles,
	checkExistingCollectionData,
	mergeIsentiveID,
	updateLocationType,
	updateSupervision,
	updateBranchName,
	updateSalaryComponents,
	importEmployees,
	importOfficerCodes,
	updateIncentiveData,
	inserCombinedData,
	makeTeamLeading,
	updateOfficerCodes,
	payrollImport,
	updateInflationAllowanceData,
	removeOneDeductionForAll,
	removeOneAllowanceForAll,
	combineInflationAndBasicSalary,
	removeInflationFromBasicSalary,
} = require("../controllers/dataToolsController");

// router.get("/updatePayroll", payrollImport);
// router.get("/empData", mergeEmpData);
// router.get("/importData", importDataFromFiles);
// router.get("/readExistingData", checkExistingCollectionData);
// router.get("/locationTypes", updateLocationType);
// router.get("/supervisedEmp", updateSupervision);
// router.get("/branchInIncentive", updateBranchName);
// router.get("/entitledSalaryComponents", updateSalaryComponents);
// router.get("/sept2022Employees", importEmployees);
// router.get("/sept2022EmployeeIncentives", importOfficerCodes);
// router.get("/incentiveData", updateIncentiveData);
router.get("/inflationAllowanceData", updateInflationAllowanceData);
// router.get("/combinedData", inserCombinedData);
router.get("/teamLeading", makeTeamLeading);
router.get("/updateOCodes", updateOfficerCodes);
router.get("/removeOneDeductionForAll", removeOneDeductionForAll);
router.get("/removeOneAllowanceForAll", removeOneAllowanceForAll);
// router.get("/inflationAndBasicSalary", combineInflationAndBasicSalary);
// router.get("/inflationFromBasicSalary", removeInflationFromBasicSalary);

module.exports = router;
