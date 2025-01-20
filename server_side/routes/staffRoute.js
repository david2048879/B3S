const express = require("express");
const router = express.Router();

//import validators
const {
	empIdentificationValidator,
} = require("../validators/empProfileValidator");
const { runValidation } = require("../validators/index");

const {
	requireSignin,
	staffMiddleware,
	adminMiddleware,
	hrMiddleware,
	accountantMiddleware,
	excoMiddleware,
	branchManagerMiddleware,
	businessMiddleware,
	ceoMiddleware,
	findRoleMenus,
	addUserRole,
	editUserRole,
	readUserRole,
	listUsrRoles,
	listSearchedUsrRoles,
	financeMiddleware,
	infoSharingMiddleware,
} = require("../controllers/authController");

const {
	readProfile,
	findStaffByEmail,
	read,
} = require("../controllers/staffController");

router.get("/staffProfile/:empCode", requireSignin, hrMiddleware, readProfile);
router.get("/ownProfile/:empCode", requireSignin, staffMiddleware, readProfile);
router.get("/roleMenus/:usrRole", findRoleMenus);
router.post("/addUsrRole", requireSignin, adminMiddleware, addUserRole);
router.post(
	"/editUsrRole/:usrRoleID",
	requireSignin,
	adminMiddleware,
	editUserRole
);
router.get("/usrRole/:usrRoleID", requireSignin, adminMiddleware, readUserRole);
router.post(
	"/searchUsrRole/",
	requireSignin,
	adminMiddleware,
	listSearchedUsrRoles
);
router.get("/usrRoles/", requireSignin, adminMiddleware, listUsrRoles);
router.get("/findStaff/:email", findStaffByEmail);

//==============================================================================

router.get("/staff", requireSignin, staffMiddleware, read);
router.get("/hr", requireSignin, hrMiddleware, read);
router.get("/InfoSharing", requireSignin, infoSharingMiddleware, read);
router.get("/accountant", requireSignin, accountantMiddleware, read);
router.get("/exco", requireSignin, excoMiddleware, read);
router.get("/ceo", requireSignin, ceoMiddleware, read);
router.get("/admin", requireSignin, adminMiddleware, read);
router.get("/branchManager", requireSignin, branchManagerMiddleware, read);
router.get("/business", requireSignin, businessMiddleware, read);
router.get("/finance", requireSignin, financeMiddleware, read);

module.exports = router;
