const mongoose = require("mongoose");

const officerCodeSchema = new mongoose.Schema(
	{
		
		OfficerCode: Number,
		EmployeeCode: Number,
	},
	{ timestamps: true }
);
module.exports = mongoose.model("aofficerCode", officerCodeSchema);
