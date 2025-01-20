const mongoose = require("mongoose");
const currencySchema = new mongoose.Schema(
	{
		currency_code: {
			type: String,
			trim: true,
		},
		currency: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: true }
);
module.exports = mongoose.model("tb00_currency", currencySchema);
