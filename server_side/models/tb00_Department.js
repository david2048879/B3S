const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
	{
		department: {
			type: String,
			required: true,
			trim: true,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_Department", departmentSchema);
