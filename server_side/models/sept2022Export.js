const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const sept2022ExportSchema = new mongoose.Schema(
	{
		employeeCode: {
			type: Number,
			required: true,
			unique: true,
			index: true,
		},
		EmployeeName: {
			type: String,
			trim: true,
			required: true,
			max: 150,
		},
		AppointedDate: Date,
		ContractType: String,
		Department: String,
		Division: String,
		jobTitle: String,
		Branch: String,
		ReportingLine: String,
		ContractExpiration: Date,
	},
	{ timestamps: true }
);
module.exports = mongoose.model("sept2022Export", sept2022ExportSchema);
