const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const scanningRoleSchema = new mongoose.Schema(
	{
		staff: {
			type: ObjectId,
			ref: "Tb01_Employee",
			required: true,
		},
		role: {
			type: String,
			default: "STAFF",
			enum: ["OPERATOR", "ADMIN"]
		},
	
		state: {
			type: String,
			default: "ACTIVE",
			enum: ["ACTIVE", "INACTIVE"]
		}
	},
	{ timestamps: true }
);
module.exports = mongoose.model("Tb01_Scan_Operation_Roles", scanningRoleSchema);
