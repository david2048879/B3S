const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
	{
		roleName: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_Role", roleSchema);
