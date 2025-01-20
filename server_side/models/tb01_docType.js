const mongoose = require("mongoose");

const docTypeSchema = new mongoose.Schema(
	{
		department: {
			type: String,
			trim: true,
		},
		docType: {
			type: String,
			trim: true,
		},
		description:{
			type: String,
			trim: true,
		},
		count:{
			type:Number,
			default:0
		},
		searchFields: [{ name: String,docDataType:String,inTitle:Boolean,titlePosition: Number }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb01_DocType", docTypeSchema);
