const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const leaveSupervisorsSchema = new mongoose.Schema(
	{
		staff: {
			type: ObjectId,
			ref: "Tb01_Employee",
			required: true,
		},
		role: {
			type: String,
			default: "STAFF",
			enum: ["SUPERVISOR", "EXECUTIVE", "EXCO", "SYSTEMADMIN","SYSTEMADMIN2", "HR", "HRMANAGER"]
		},
		responsability: {
			category: {
				type: String,
				default: "DEPARTMENT",
				enum: ["DIVISION", "DEPARTMENT"]
			},
			inChargeOf: {
				type: String
			}
		},

		state: {
			type: String,
			default: "ACTIVE",
			enum: ["ACTIVE", "INACTIVE"]
		}
	},
	{ timestamps: true }
);
module.exports = mongoose.model("Tb01_Leave_Supervisor", leaveSupervisorsSchema);
