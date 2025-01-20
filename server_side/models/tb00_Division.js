const mongoose = require("mongoose");

const divisionSchema = new mongoose.Schema(
	{
		division: {
			type: String,
			required: true,
			trim: true,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_Division", divisionSchema);