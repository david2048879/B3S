const mongoose = require("mongoose");

const maritalStatusSchema = new mongoose.Schema(
	{
		MaritalStatusID: String,
        MaritalStatus:String
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_MaritalStatus", maritalStatusSchema);