const mongoose = require("mongoose");

const teamLeadingSchema = new mongoose.Schema(
	{
		Branch: String,
		TeamLeaderName: String,
		TeamLeaderCode: Number,
		EmployeeName: String,
		OfficerCode: Number,
		EmployeeCode: Number,
		ExistingNew: String,
		EmployeeTitle: String,
	},
	{ timestamps: true }
);
module.exports = mongoose.model("ateamLeading", teamLeadingSchema);
