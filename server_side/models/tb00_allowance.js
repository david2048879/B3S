const mongoose = require("mongoose");

const allowanceSchema = new mongoose.Schema(
	{
		allowanceName: {
			type: String,
			required: true,
			trim: true,
		},
        comment: String
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_Allowance", allowanceSchema);