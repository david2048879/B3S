const mongoose = require("mongoose");

const quartelyGrowthSchema = new mongoose.Schema(
	{
		minimumAmount: {
			type: Number,
			required: true,
		},
		code: {
			type: String,
			trim: true,
		},
		GLP: {
			type: String,
			trim: true,
		},
		growthPerc: {
			type: Number,
			required: true,
		},
		insentiveAmount: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb03_QuarterlyGrowth", quartelyGrowthSchema);

				

