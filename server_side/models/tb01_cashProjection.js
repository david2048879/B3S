const mongoose = require("mongoose");

const cashProjectionSchema = new mongoose.Schema(
	{
		weekStartDate: Date,
		weekEndDate: Date,
		requestDate: Date,
		requesterName: {
			type: String,
			trim: true,
		},
		requesterEmail: {
			type: String,
			trim: true,
			lowercase: true,
		},
		branchName: {
			type: String,
			trim: true,
		},
		departmentName: {
			type: String,
			trim: true,
		},
		bankName: {
			type: String,
			trim: true,
		},
		currencyCode: {
			type: String,
			trim: true,
		},
		supplierName: String,
		requestAmount: Number,
		description: String,
		currentRequestStatus: {
			type: String,
			enum: ["PENDING", "PROCESSED", "CANCELLED"],
		},
		currentRequestStatusDate: Date,
		currentStatusComment: String,
		content: {
			url: String,
			key: String,
		},
		requestStatusHistory: [
			{
				requestStatus: String,
				statusDate: Date,
				changedBy: String,
				currentStatusComment: String,
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("tb01_cashProjection", cashProjectionSchema);
