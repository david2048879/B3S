const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userRoleSchema = new mongoose.Schema(
	{
		roleName: {
			type: String,
			required: true,
		},
		roleSummary: {
			type: String,
			default: "No summary provided for this role",
		},
		linkTo: {
			type: String,
			required: true,
		},
		linkParameter: String,
		roleAction: {type: String, required: true},
		recordedBy: {
			type: ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("UserRole", userRoleSchema);
