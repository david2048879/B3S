const mongoose = require("mongoose");

const weeklyGrowthSchema = new mongoose.Schema(
	{
        code: {
			type: String,
			trim: true,
		},
        GLP: {
			type: String,
			trim: true,
		},		
		minAmount: {
			type: Number,
			required: true,
		},
		growthPerc: {
			type: Number,
			required: true,
		},
		earnedAmount: {
			type: Number,
			required: true,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb03_WeeklyGrowth", weeklyGrowthSchema);
