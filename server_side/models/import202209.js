const mongoose = require("mongoose");

const import202209Schema = new mongoose.Schema(
	{
		officerCode: Number,
		disbClients:Number,
        disbAmount: Number,
        ppalArreas: Number,
        actualRepayment: Number
	}
);
module.exports = mongoose.model("import202209", import202209Schema);
