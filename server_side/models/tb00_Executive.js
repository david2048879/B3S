const mongoose = require("mongoose");

const executiveSchema = new mongoose.Schema(
	{
		Executive: {
			type: String,
			required: true,
			trim: true,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_Executive", executiveSchema);
