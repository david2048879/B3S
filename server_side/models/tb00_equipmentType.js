const mongoose = require("mongoose");
const equipmentTypeSchema = new mongoose.Schema(
	{
		typeName: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: true }
);
module.exports = mongoose.model("Tb00_EquipmentType", equipmentTypeSchema);
