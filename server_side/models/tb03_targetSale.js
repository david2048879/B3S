const mongoose = require("mongoose");

const targetSaleSchema = new mongoose.Schema(
	{
        branchLocation: {
			type: String,
			required: true,
			trim: true,
		},
        staffStatus: {
			type: String,
			required: true,
			trim: true,
		},
        saleType: {
			type: String,
			required: true,
			trim: true,
		},
		maxAmount: {
			type: Number,
			required: true,
		},		
		minAmount: {
			type: Number,
			required: true,
		},
		maxClient: {
			type: Number,
			required: true,
		},
		minClient: {
			type: Number,
			required: true,
		},
		applicableDate: Date
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb03_TargetSale", targetSaleSchema);
