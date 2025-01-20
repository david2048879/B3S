const mongoose = require("mongoose");

const inflationSchema = new mongoose.Schema(
	{
		empCode: Number,
		allowanceAmount: Number,
		adjustmentAmount: Number,
	},
	{ timestamps: true }
);
module.exports = mongoose.model("ainflationdata", inflationSchema);
