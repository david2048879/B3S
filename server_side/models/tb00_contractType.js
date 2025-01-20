const mongoose = require("mongoose");

const contractTypeSchema = new mongoose.Schema(
	{
		ContractType: {
			type: String,
			required: true,
			trim: true,
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_ContractType", contractTypeSchema);
