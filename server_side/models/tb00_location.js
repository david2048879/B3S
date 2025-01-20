const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
	{
		Location: {
			type: String,
			required: true,
			trim: true,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_Location", locationSchema);
