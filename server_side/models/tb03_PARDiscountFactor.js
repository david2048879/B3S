const mongoose = require("mongoose");

const parDiscountFactorSchema = new mongoose.Schema(
	{
		ExeedTarget: {
			type: Boolean,
            required: true,
		},
		MaxPoints: {
			type: Number,
			required: true,
		},
		ApplicableIncentive: {
			type: Number,
			required: true,
			default: 0,
		},
        ApplicableDate: Date
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb03_PARDiscountFactor", parDiscountFactorSchema);
