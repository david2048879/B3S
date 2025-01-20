const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const _ = require("lodash");
const User = require("../models/user");
const Tb01_Employee = require("../models/tb01_employee");
const UserRole = require("../models/userRole");

const managerRoles = [
	"EXCO",
	"Director",
	"Head of Department",
	"Head of Section",
	"Head of Unit",
	"Branch Manager",
	"Manager",
];
const financeRoles = [
	"Accountant",
	"Director of Finance",
	"Finance",
	"System Administrator",
	"EXCO",
];
const logisticRoles = ["Logistics", "System Administrator"];
const hrRoles = ["Human Resources Officer", "System Administrator", "HR Staff"];
//Register user without passing throu AWS services
exports.registerActivateLocal = (req, res) => {
	const { email, password } = req.body;
	const userName = email.split("@")[0];
	Tb01_Employee.findOne({ email }).exec((err, emp) => {
		if (err || !emp) {
			return res.status(401).json({
				error: "Employee with provided email is NOT FOUND! Contact the HR office.",
			});
		}
		User.findOne({ email }).exec((err, user) => {
			if (user) {
				return res.status(401).json({
					error: "Looks like your account have been activated once! Contact the system administrator",
				});
			}
			// save the employee as user
			const newUser = new User({
				userName,
				fullName: emp.empNames,
				email,
				password,
			});
			newUser.save((err, savedUser) => {
				if (err) {
					// console.log(err);
					return res.status(401).json({
						error: "Error activating user account. Try later.",
					});
				}
				return res.json({
					message: `Dear ${savedUser.fullName}, your user account is activated. Please log in.`,
				});
			});
		});
	});
};

exports.login = (req, res) => {
	const { email, password } = req.body;
	User.findOne({ email }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User with that email does not exist. Please activate your account.",
			});
		}
		// Authenticate
		if (!user.authenticate(password)) {
			return res.status(400).json({
				error: "Email and password do not match.",
			});
		}
		//Generate token and sent it to client
		const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "1d",
		});
		const { _id, fullName, email, role } = user;
		return res.json({
			token,
			user: { _id, fullName, email, role },
		});
	});
};

//Please downgrade and intall npm i express-jwt@5.3.1 version.
//Updates version are not working as of 09th May 2022
exports.requireSignin = expressJwt({
	secret: process.env.JWT_SECRET,
	algorithms: ["HS256"],
});

exports.logisticsMiddleware = (req, res, next) => {
	const staffUserId = req.user._id;
	User.findOne({ _id: staffUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		const roleIsLogistics = logisticRoles.includes(user.role);
		if (!user.role || roleIsLogistics === false) {
			return res.status(400).json({
				error: "Logistic resource. Access denied",
			});
		}
		req.profile = user;
		next();
	});
};

exports.financeMiddleware = (req, res, next) => {
	const staffUserId = req.user._id;
	User.findOne({ _id: staffUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		const roleIsFinance = financeRoles.includes(user.role);
		if (!user.role || roleIsFinance === false) {
			return res.status(400).json({
				error: "Finance resource. Access denied",
			});
		}
		req.profile = user;
		next();
	});
};

exports.staffMiddleware = (req, res, next) => {
	const staffUserId = req.user._id;
	User.findOne({ _id: staffUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		if (
			!user.role ||
			user.role === "" ||
			user.role === null ||
			user.role === undefined
		) {
			return res.status(400).json({
				error: "Staff resource. Access denied",
			});
		}
		req.profile = user;
		next();
	});
};

exports.managerMiddleware = (req, res, next) => {
	const staffUserId = req.user._id;
	User.findOne({ _id: staffUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		const roleIsManager = managerRoles.includes(user.role);
		if (!user.role || roleIsManager === false) {
			return res.status(400).json({
				error: "Manager resource. Access denied",
			});
		}
		req.profile = user;
		next();
	});
};

exports.adminMiddleware = (req, res, next) => {
	const adminUserId = req.user._id;

	User.findOne({ _id: adminUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		if (user.role !== "System Administrator") {
			return res.status(400).json({
				error: "Admin resource. Access denied",
			});
		}
		req.profile = user;
		next();
	});
};

exports.infoSharingMiddleware = (req, res, next) => {
	const infoSharingUserId = req.user._id;

	User.findOne({ _id: infoSharingUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		if (user.role !== "Human Resources") {
			return res.status(400).json({
				error: "HR resource. Access denied",
			});
		}
		req.profile = user;
		next();
	});
};

exports.branchManagerMiddleware = (req, res, next) => {
	const branchManagerUserId = req.user._id;
	User.findOne({ _id: branchManagerUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}

		if (user.role !== "Branch Manager") {
			return res.status(400).json({
				error: "Branch manager resource. Access denied",
			});
		}
		req.profile = user;
		next();
	});
};
exports.businessMiddleware = (req, res, next) => {
	const branchManagerUserId = req.user._id;
	User.findOne({ _id: branchManagerUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}

		if (user.role !== "Business") {
			return res.status(400).json({
				error: "Business resource. Access denied",
			});
		}
		req.profile = user;
		next();
	});
};

exports.hrMiddleware = (req, res, next) => {
	const hrUserId = req.user._id;
	User.findOne({ _id: hrUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		const roleIsHR = hrRoles.includes(user.role);
		if (!user.role || roleIsHR === false) {
			return res.status(400).json({
				error: "HR resource. Access denied",
			});
		}

		// if (user.role !== "Human Resources Officer") {
		// 	return res.status(400).json({
		// 		error: "HR resource. Access denied",
		// 	});
		// }
		req.profile = user;
		next();
	});
};

exports.excoMiddleware = (req, res, next) => {
	const excoUserId = req.user._id;
	User.findOne({ _id: excoUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		if (user.role !== "EXCO") {
			return res.status(400).json({
				error: "EXCO resource. Access denied",
			});
		}
		req.profile = user;
		next();
	});
};

exports.ceoMiddleware = (req, res, next) => {
	const ceoUserId = req.user._id;
	User.findOne({ _id: ceoUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		if (user.role !== "CEO") {
			return res.status(400).json({
				error: "CEO resource. Access denied",
			});
		}
		req.profile = user;
		next();
	});
};

exports.accountantMiddleware = (req, res, next) => {
	const accountantUserId = req.user._id;
	User.findOne({ _id: accountantUserId }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "User not found",
			});
		}
		if (user.role !== "Accountant") {
			return res.status(400).json({
				error: "Accountant resource. Access denied",
			});
		}
		req.profile = user;
		next();
	});
};

exports.resetPassword = (req, res) => {
	const { email, currentPassword, newPassword } = req.body;

	User.findOne({ email }).exec((err, user) => {
		if (!user) {
			return res.status(401).json({
				error: "Account not activated or unknown! Please activate your account instead.",
			});
		}
		// check if the old password is valid
		else if (!user.authenticate(currentPassword)) {
			return res.status(400).json({
				error: "Please provide your correct current password.",
			});
		}
		// recording the new password
		else {
			const updateFields = {
				password: newPassword,
				resetPasswordLink: "",
			};
			user = _.extend(user, updateFields);
			user.save((err, result) => {
				if (err) {
					return res.status(400).json({
						error: "Changing password failed. Try again.",
					});
				}
				res.json({
					message: `Your password has been changed successfuly. Please login.`,
				});
			});
		}
	});
};

exports.adminResetUserPassword = (req, res) => {
	const { email, newPassword } = req.body;
	// console.table({ email, newPassword })
	User.findOne({ email }).exec((err, user) => {
		if (!user) {
			return res.status(401).json({
				error: "Looks like the user account is not activated yet! Please activate your account instead.",
			});
		}
		// recording the new password
		else {
			const updateFields = {
				password: newPassword,
			};
			user = _.extend(user, updateFields);
			user.save((err, result) => {
				if (err) {
					return res.status(400).json({
						error: "Changing user's password failed. Try again.",
					});
				}
				res.json({
					message: `User's password has been changed successfuly.`,
				});
			});
		}
	});
};

exports.findRoleMenus = async (req, res) => {
	let roleMenus = [];
	try {
		roleMenus = await UserRole.find({
			roleName: req.params.usrRole,
		})
			.sort({ listOrder: 1 })
			.exec();
		return res.json({ roleMenus });
	} catch (error) {
		res.json({ roleMenus });
	}
};

exports.addUserRole = (req, res) => {
	const { roleName, roleSummary, linkTo, linkParameter, roleAction } =
		req.body;
	UserRole.findOne({ roleName, roleAction }).exec((err, usrRole) => {
		if (usrRole) {
			return res.status(400).json({
				error: "Looks like this menu is already created!",
			});
		}
	});
	const newUserRole = new UserRole({
		roleName,
		roleSummary,
		linkTo,
		linkParameter,
		roleAction,
		recordedBy: req.user._id,
	});
	newUserRole.save((err, result) => {
		if (err) {
			// console.log(err);
			return res.status(401).json({
				error: "Unable to save the user role",
			});
		} else {
			return res.json({
				message: "User Role recorded.",
			});
		}
	});
};

exports.editUserRole = (req, res) => {
	const { roleName, roleSummary, linkTo, linkParameter, roleAction } =
		req.body;
	// console.table({roleName, linkTo, linkParameter, roleAction})
	UserRole.findOneAndUpdate(
		{ _id: req.params.usrRoleID },
		{
			roleName,
			roleSummary,
			linkTo,
			linkParameter,
			roleAction,
			recordedBy: req.user._id,
		}
	).exec((err, emp) => {
		if (err) {
			// console.log(err);
			return res.status(401).json({
				error: "Unable to save the user role",
			});
		} else {
			return res.json({
				message: "User Role updated.",
			});
		}
	});
};

exports.readUserRole = async (req, res) => {
	const myUsrRole = await UserRole.findOne({
		_id: req.params.usrRoleID,
	});
	if (!myUsrRole || myUsrRole === null) {
		return res.json({
			message: "User Role not found!",
		});
	}
	return res.json({ myUsrRole });
};

exports.listUsrRoles = async (req, res) => {
	const myUsrRoles = await UserRole.find({})
		.sort({
			roleName: -1,
		})
		.limit(100);
	return res.json({ myUsrRoles });
};

exports.listSearchedUsrRoles = async (req, res) => {
	const { searchValue } = req.body;
	const myUsrRoles = await UserRole.find({
		$or: [
			{ roleName: { $regex: ".*(?i)" + searchValue + ".*(?i)" } },
			{ roleAction: { $regex: ".*(?i)" + searchValue + ".*(?i)" } },
		],
	});
	return res.json({ myUsrRoles });
};

exports.listUsers = async (req, res) => {
	const myUsers = await User.find({})
		.sort({
			fullName: 1,
		})
		.limit(100);
	return res.json({ myUsers });
};

exports.listOneUser = async (req, res) => {
	const myUser = await User.findOne({ _id: req.params.userID });
	return res.json({ myUser });
};

exports.listSearchedUsers = async (req, res) => {
	const { searchValue } = req.body;
	const myUsers = await User.find({
		$or: [
			{ userName: { $regex: ".*(?i)" + searchValue + ".*(?i)" } },
			{ fullName: { $regex: ".*(?i)" + searchValue + ".*(?i)" } },
			{ email: { $regex: ".*(?i)" + searchValue + ".*(?i)" } },
		],
	});
	return res.json({ myUsers });
};

exports.changeRole = (req, res) => {
	const { newRole } = req.body;
	User.findOne({ _id: req.params.userid }).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "Staff not found!",
			});
		}
		if (newRole !== user.role) {
			let rHistory = user.rolesHistory;
			rHistory.push({
				roleName: user.role,
				dateStart: user.updatedAt,
				dateEnd: new Date(),
			});
			const updateFields = {
				role: newRole,
				rolesHistory: rHistory,
			};
			user = _.extend(user, updateFields);
			user.save((err, result) => {
				if (err) {
					return res.status(400).json({
						error: "Changing role failed. Try again.",
					});
				}
				res.json({
					message: `Your role has been changed successfuly.`,
				});
			});
		} else {
			res.json({
				message: `No change applied. New role is same as current one!`,
			});
		}
	});
};
