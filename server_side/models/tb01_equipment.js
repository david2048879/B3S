const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const equipmentSchema = new mongoose.Schema(
	{
		itemType: String,
		itemModel: String,
		itemCategory: {
			type: String,
			enum: ["HARDWARE", "SOFTWARE"],
		},
		tagNumber: String,
		serialNumber: String,
		supply: {
			type: ObjectId,
			ref: "Tb01_EquipmentSupply",
		},
		inStore: { type: String, enum: ["YES", "NO"] },
		currentOwnership: {
			senderBranchName: String,
			senderCode: Number,
			senderNames: String,
			senderEmail: String,
			sentDate: Date,
			receiverBranchName: String,
			receiverCode: Number,
			receiverNames: String,
			receiverEmail: String,
			dateReceived: Date,
			currentStatus: String,
			currentEstimatedValue: Number,
			comment: String,
			content: {
				url: String,
				key: String,
			},
		},
		ownershipHistory: [
			{
				senderBranchName: String,
				senderCode: Number,
				senderNames: String,
				senderEmail: String,
				sentDate: Date,
				receiverBranchName: String,
				receiverCode: Number,
				receiverNames: String,
				receiverEmail: String,
				dateReceived: Date,
				currentStatus: String,
				currentEstimatedValue: Number,
				comment: String,
			},
		],
	},
	{ timestamps: true }
);
module.exports = mongoose.model("Tb01_Equipment", equipmentSchema);
