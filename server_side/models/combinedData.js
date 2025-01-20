const mongoose = require("mongoose");

const combinedDataSchema = new mongoose.Schema(
	{
		EmployeeCode: Number,
		EmployeeName: String,
		BankName: String,
		AccountNumber: String,
		TELEPHONE: String,
		Gender: String,
		NID: String,
		DOB: Date,
		email: String,
		RSSB_Number: String,
		AppointedDate: Date,
		ContractTerm: String,
		Department: String,
		Division: String,
		EmployeeTitle: String,
		Branch: String,
		ReportingLine: String,
		ContractExpiration: Date,
	},
	{ timestamps: true }
);
module.exports = mongoose.model("combinedData", combinedDataSchema);
