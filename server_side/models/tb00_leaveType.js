const mongoose = require("mongoose");

const leaveTypeSchema = new mongoose.Schema(
	{
		leaveName: {
			type: String,
			required: true,
			trim: true,
		},
		daysEntitled: Number
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb00_LeaveType", leaveTypeSchema);