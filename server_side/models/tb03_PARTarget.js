const mongoose = require("mongoose");

const parTargetSchema = new mongoose.Schema(
	{
		yearTarget: {
			type: Number,
			required: true,
		},
		monthTarget: {
			type: String,
			required: true,
			trim: true,
		},
		PARTarget: {
			type: Number,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb03_PARTarget", parTargetSchema);
