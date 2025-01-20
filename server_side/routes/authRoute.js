const express = require("express");
const router = express.Router();

//import validators
const {
	userLoginValidator,
	resetPasswordValidator,
} = require("../validators/authValidator");

const { runValidation } = require("../validators/index");

//import controllers
const {
	login,
	resetPassword,
	changeRole,
	requireSignin,
	adminMiddleware,listUsers, listSearchedUsers, listOneUser, registerActivateLocal, adminResetUserPassword
} = require("../controllers/authController");

router.post("/registerLocal", registerActivateLocal);
router.post("/login", userLoginValidator, runValidation, login);

router.put(
	"/reset-password",
	resetPasswordValidator,
	runValidation,
	resetPassword
);

router.put(
	"/changeUserRole/:userid",
	requireSignin,
	adminMiddleware,
	changeRole
);
router.put(
	"/resetUserPassword",
	requireSignin,
	adminMiddleware,
	adminResetUserPassword
);

router.post(
	"/searchUsers",
	requireSignin,
	adminMiddleware,
	listSearchedUsers
);

router.get(
	"/users",
	requireSignin,
	adminMiddleware,
	listUsers
);

router.get(
	"/user/:userID",
	requireSignin,
	adminMiddleware,
	listOneUser
);

module.exports = router;
