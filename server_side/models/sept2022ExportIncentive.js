const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const sept2022ExportIncentiveSchema = new mongoose.Schema(
	{
		officerCode: {
			type: Number,
			required: true,
			index: true,
		},
		EmployeeNumber: Number,
		Name: String,
		EmployeeRole: String,			
		Supervisor: String,
		Branch: String,
		Status: String,
		ContractType: String,
		AppointedDate: Date,
	},
	{ timestamps: true }
);
module.exports = mongoose.model("sept2022ExportIncentive", sept2022ExportIncentiveSchema);
