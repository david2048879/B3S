const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const bankSchema = new mongoose.Schema(
	{
		bankID: {
			type: String,
			required: true,
			trim: true,
		},
		city: {
			type: String,
			required: true,
			trim: true,
		},
		bankName: {
			type: String,
			required: true,
			trim: true,
		},
		recordedBy: {
			type: ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_Bank", bankSchema);
