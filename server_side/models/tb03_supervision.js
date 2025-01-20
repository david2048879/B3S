const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const supervisionSchema = new mongoose.Schema(
	{
		supervisor: {
			type: String,
			required: true,
			trim: true,
		},
		staff: {
			type: String,
			required: true,
			trim: true,
		},
		staffStatus: {
			type: String,
			required: true,
			trim: true,
		},
		staffSaleType: {
			type: String,
			required: true,
			trim: true,
		},
		staffOfficerCode: Number,
		supervisorOfficerCode: Number,
		yearSupervision: {
			type: Number,
			required: true,
		},
		monthSupervision: {
			type: Number,
			required: true,
		},
		recordedBy: {
			type: ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb03_Supervision", supervisionSchema);
