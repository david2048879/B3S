const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema

const incentiveStaffSchema = new mongoose.Schema(
	{
        yearIncentive:{
            type: Number,
            required:true,
        },
		monthIncentive: {
			type: String,
			required: true,
		},
		empNames: {
			type: String,
			required: true,
		},
        empCode:Number,
        officerCode: Number,
		branchName: String,
		branchCode: String,
		jobTitle: {
			type: String,
			required: true,
		},
		jobTitleDate: Date,
		staffExistingNew: String,
        disbursedAmount: Number,
        disbursedClients: Number,
        repaidAmount: Number,
		branchRepaidAmount: Number,
        incentiveB4Delenquency: Number,
        ppalAreaDue: Number,
		branchAreaDue: Number,
        overpaidAmount: {type: Number, default: 0}, 
		branchDisbusedClients: Number,
		branchDisbusedAmount: Number,
		IncentiveBeforeDelequency: Number,
		BranchBenefitBeforeDelequency: Number,
		TotalIncentiveBeforeDelequency:Number,
		IncentiveAfterDelequency: Number,
		DelequencyDiscounter: Number,
		incentiveNet: Number,
		incentiveNet2: Number,
		applied: {type: String, default: "NON"},
		monthAppliedTo: String,
		yearAppliedTo: Number,
		employeeID: {
			type: ObjectId,
			ref: "Tb01_Employee",
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb01_IncentiveStaff", incentiveStaffSchema);
			
