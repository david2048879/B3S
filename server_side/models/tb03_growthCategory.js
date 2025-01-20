const mongoose = require("mongoose");

const growthCategorySchema = new mongoose.Schema(
	{
		categoryCode: {
			type: String,
			trim: true,
		},
		GLP: {
			type: String,
			required: true,
			trim: true,
		},
		minimumAmount: {
			type: Number,
			required: true,
			default: 0,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb03_GrowthCategory", growthCategorySchema);
