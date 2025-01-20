const mongoose = require("mongoose");

const deductionSchema = new mongoose.Schema(
	{
		deductionName: {
			type: String,
			required: true,
			trim: true,
		},
        comment: String
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_Deduction", deductionSchema);