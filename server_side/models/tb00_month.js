const mongoose = require("mongoose");

const monthSchema = new mongoose.Schema(
	{
		MonthName: {
			type: String,
			required: true,
			trim: true,
		},
		MonthID: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_Month", monthSchema);
