const mongoose = require("mongoose");

const jobTitleSchema = new mongoose.Schema(
	{
		JobTitle: {
			type: String,
			required: true,
			trim: true,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_JobTitle", jobTitleSchema);
