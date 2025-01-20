const express = require("express");
const router = express.Router();

//import validators
const {
	empIdentificationValidator,
	appointmentValidator,
} = require("../validators/empProfileValidator");
const { runValidation } = require("../validators/index");

const {
	requireSignin,
	staffMiddleware,
	hrMiddleware,
	accountantMiddleware,
	excoMiddleware,
	branchManagerMiddleware,
	ceoMiddleware,
} = require("../controllers/authController");

const {
	addProfile,
	editProfile,
	editOwnProfile,
	listProfiles,
	readProfile,
	readOwnProfile,
	readProfileOfficerCode,
	readProfileEmpCode,
	readProfileEmail,
	listSearchedProfiles,
	listDividionProfiles,
	listDepartmentProfiles,
	//===================Appointments=================
	addAppointment,
	editAppointment,
	stopAppointment,
	listProfilesEndedContracts,
	listProfilesEndedingContracts,
	//===================Experience=================
	addExperience,
	//===================Education=================
	addEducation,
	//===================Documents=================
	createStaffDocument,
	deleteStaffDocument,
	//===================Appointments=================
	addLoanAcc,
	editLoanAcc,
	//===================Sale Teams=================
	listBranchStaff,
	//==================Inflation Allowance
	listWithoutInflationAllowance,
} = require("../controllers/employeeController");
// const { default: branchManager } = require("../../client_side/pages/branchManager");

//==============================================Profile routes=====================================
router.get("/profiles", requireSignin, hrMiddleware, listProfiles);
router.get(
	"/withoutInflationAllowance",
	requireSignin,
	hrMiddleware,
	listWithoutInflationAllowance
);
router.get(
	"/withoutInflationAllowanceAccountant",
	requireSignin,
	accountantMiddleware,
	listWithoutInflationAllowance
);
router.get(
	"/profilesAccountant",
	requireSignin,
	accountantMiddleware,
	listProfiles
);
router.get("/profilesCEO", requireSignin, ceoMiddleware, listProfiles);
router.get("/profilesExco", requireSignin, excoMiddleware, listProfiles);

router.post(
	"/searchProfiles",
	requireSignin,
	hrMiddleware,
	listSearchedProfiles
);
router.post(
	"/searchProfilesAccountant",
	requireSignin,
	accountantMiddleware,
	listSearchedProfiles
);
router.post(
	"/searchProfilesExco",
	requireSignin,
	excoMiddleware,
	listSearchedProfiles
);
router.post(
	"/searchProfilesCEO",
	requireSignin,
	ceoMiddleware,
	listSearchedProfiles
);
router.post(
	"/divisionProfilesCEO",
	requireSignin,
	ceoMiddleware,
	listDividionProfiles
);
router.post(
	"/departmentProfilesCEO",
	requireSignin,
	ceoMiddleware,
	listDepartmentProfiles
);
router.get("/profile/:employeeid", requireSignin, hrMiddleware, readProfile);
router.get(
	"/staffProfile/:employeeid",
	requireSignin,
	staffMiddleware,
	readOwnProfile
);
router.get(
	"/profileOC/:officerCode",
	requireSignin,
	hrMiddleware,
	readProfileOfficerCode
);
router.get(
	"/bm_profileOC/:officerCode",
	requireSignin,
	branchManagerMiddleware,
	readProfileOfficerCode
);
router.get(
	"/profileEmpCode/:empCode",
	requireSignin,
	hrMiddleware,
	readProfileEmpCode
);
router.get(
	"/bm_profileEmpCode/:empCode",
	requireSignin,
	branchManagerMiddleware,
	readProfileEmpCode
);
router.get(
	"/ceo_profileEmpCode/:empCode",
	requireSignin,
	ceoMiddleware,
	readProfileEmpCode
);

router.get("/staff_email/:email", readProfileEmail);
router.get(
	"/profileAccountant/:employeeid",
	requireSignin,
	accountantMiddleware,
	readOwnProfile
);
router.get(
	"/profileExco/:employeeid",
	requireSignin,
	excoMiddleware,
	readOwnProfile
);
router.post(
	"/profile",
	empIdentificationValidator,
	runValidation,
	requireSignin,
	hrMiddleware,
	addProfile
);

router.put(
	"/profile/:employeeid",
	empIdentificationValidator,
	runValidation,
	requireSignin,
	hrMiddleware,
	editProfile
);

router.put(
	"/staffProfile/:employeeid",
	// requireSignin,
	// staffMiddleware,
	editOwnProfile
);

//=============================================Appointment routes================================
router.get(
	"/profilesEndedContract/",
	requireSignin,
	hrMiddleware,
	listProfilesEndedContracts
);
router.get(
	"/profilesEndedingContract/",
	requireSignin,
	hrMiddleware,
	listProfilesEndedingContracts
);
router.put(
	"/appointment/:employeeid",
	appointmentValidator,
	runValidation,
	requireSignin,
	hrMiddleware,
	editAppointment
);
router.put(
	"/stopAppointment/:employeeid",
	requireSignin,
	hrMiddleware,
	stopAppointment
);
router.put(
	"/addAppointment/:employeeid",
	appointmentValidator,
	runValidation,
	requireSignin,
	hrMiddleware,
	addAppointment
);

//=============================================Experience routes=================================
router.put(
	"/experience/:employeeid",
	requireSignin,
	staffMiddleware,
	addExperience
);

router.put(
	"/staffExperience/:employeeid",
	requireSignin,
	staffMiddleware,
	addExperience
);
//=============================================Education Background================================
router.put(
	"/education/:employeeid",
	requireSignin,
	staffMiddleware,
	addEducation
);
router.put(
	"/staffEducation/:employeeid",
	requireSignin,
	staffMiddleware,
	addEducation
);

//=============================================Staff Documents=====================================
router.post(
	"/staffDocument/:employeeid",
	requireSignin,
	staffMiddleware,
	createStaffDocument
);

router.put(
	"/delStaffDocument/:employeeid",
	requireSignin,
	hrMiddleware,
	deleteStaffDocument
);

//=============================================Loan Account routes================================
router.put(
	"/loanAccount/:employeeid",
	requireSignin,
	hrMiddleware,
	editLoanAcc
);
router.put(
	"/addLoanAccount/:employeeid",
	requireSignin,
	hrMiddleware,
	addLoanAcc
);
//=============================================Branch Manager - Sale Teams================================
router.get(
	"/allBranchStaff/:empEmail",
	requireSignin,
	branchManagerMiddleware,
	listBranchStaff
);

module.exports = router;
