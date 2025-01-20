const mongoose = require("mongoose");

const weeklyPercSchema = new mongoose.Schema(
	{
		growthAchieved: {
			type: Number,
			required: true,
		},		
		discountPerc: {
			type: Number,
			required: true,
		},
		applicableDate: Date
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb03_WeeklyPerc", weeklyPercSchema);
