const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema(
	{
		branchName: {
			type: String,
			required: true,
			trim: true,
		},
		branchLocation: {
			type: String,
			required: true,
			trim: true,
		},
		branchCode: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_Branch", branchSchema);
