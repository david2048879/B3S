const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
	{
		staffNames: String,
		staffEmpCode: Number,
		staffEmail: String,
		staffPhone: String,
		staffJobPosition: String,
		staffBranch: String,
		staffDepartment: String,

		startDate: Date,
		startYearMonthDay: String,
		endDate: Date,
		endYearMonthDay: String,
		tripObjective: String,
		staffLocation: String, // This is the branch where the staff is from.
		tripDestination: String, // This is the branch where the job will be done.
		tripRequestDate: Date,
		tripReport: String,

		lineManagerTripDate: Date, //Date on which the request for the trip was submitted to the line manager
		lineManagerNames: String,
		lineManagerEmpCode: Number,
		lineManagerEmail: String,
		lineManagerPhone: String,
		lineManagerTripComment: String,
		lineManagerReportComment: String,

		transportCostamount: { type: Number, default: 0 },
		transportCostCurrency: String,
		transportCostChangedDate: Date,
		transportCostChangedUserStaffID: Number,
		transportCostChangedUserStaffNames: String,

		perdiemAmount: { type: Number, default: 0 },
		perdiemCurrency: String,
		perdiemChangedDate: Date,
		perdiemChangedUserStaffID: Number,
		perdiemChangedUserStaffNames: String,

		destinationManagerNames: String,
		destinationManagerEmpCode: Number,
		destinationManagerEmail: String,
		destinationManagerPhone: String,
		destinationManagerComment: String,
		destinationManagerDate: Date,

		requestStatus: String, //PENDING or APPROVED or REJECTED
		dateApproval: Date,

		//Signed trip form
		tripDocuments: [
			{
				title: {
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
module.exports = mongoose.model("Tb01_Trip", tripSchema);
