const mongoose = require("mongoose");

const offDaysSchema = new mongoose.Schema(
	{
		day: {
			type: Date,
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_OffDays", offDaysSchema);
