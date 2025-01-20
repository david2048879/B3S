const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const equipmentSupplySchema = new mongoose.Schema(
	{
		itemType: String,
		itemModel: String,
		itemCategory: {
			type: String,
			enum: ["HARDWARE", "SOFTWARE"],
		},
		dateSupply: Date,
		quantitySupplied: Number,
		unitPrice: Number,
		totalPrice: Number,
		observation: String,
		supplierName: String,
		supplierEmail: String,
		supplierPhone: String,
		supplierAddress: String,
		supplyDocuments: [
			{
				docType: {
					type: String,
					enum: ["Delivery Note", "Supplier Contract", "Other"],
				},
				description: {
					type: String,
					trim: true,
				},
				content: {
					url: String,
					key: String,
				},
			},
		],
	},
	{ timestamps: true }
);
module.exports = mongoose.model("Tb01_EquipmentSupply", equipmentSupplySchema);
