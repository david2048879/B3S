const Tb01_Employee = require("../models/tb01_employee");

exports.read = (req, res) => {
	req.profile.hashedPassword = undefined;
	req.profile.salt = undefined;
	return res.json(req.profile);
};

exports.readProfile = async (req, res) => {
	// console.log(req.params)
	const myProfile = await Tb01_Employee.findOne({
		empCode: req.params.empCode,
	});
	if (!myProfile || myProfile === null) {
		return res.json({
			message: "Your profile is not found!",
		});
	}
	return res.json({ myProfile });
};

exports.findStaffByEmail = async (req, res) => {
	const foundStaff = await Tb01_Employee.findOne({
		email: req.params.email,
	}).exec();
	// console.log("Found Staff: ", foundStaff)
	if (!foundStaff || foundStaff === null) {
		return res.json({
			message: "Email address not found on employees list!",
		});
	}

	return res.json({ foundStaff });
};

exports.changePicture = (req, res) => {};
