const mongoose = require("mongoose");

const incentivePercSchema = new mongoose.Schema(
	{
		roleName: {
			type: String,
            required: true,
			trim: true,
		},
		avgRoleSalary: {
			type: Number,
			required: true,
		},
		incentivePerc: {
			type: Number,
			required: true,
			default: 0,
		},
        eligibleAmount: {
			type: Number,
			required: true,
			default: 0,
		},
        branchBenefitPerc: {
			type: Number,
			required: true,
			default: 0,
		},
        totalEligibleAmount: {
			type: Number,
			required: true,
			default: 0,
		},
        applicableDate: Date
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb03_IncentivePercentage", incentivePercSchema);
