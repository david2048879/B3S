const mongoose = require("mongoose");

const countrySchema = new mongoose.Schema(
	{
		countryName: {
			type: String,
			required: true,
			trim: true,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_Country", countrySchema);