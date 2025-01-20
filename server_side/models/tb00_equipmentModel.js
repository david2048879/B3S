const mongoose = require("mongoose");
const equipmentModelSchema = new mongoose.Schema(
	{
		modelName: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: true }
);
module.exports = mongoose.model("Tb00_EquipmentModel", equipmentModelSchema);
