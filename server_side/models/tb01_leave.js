const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const leaveSchema = new mongoose.Schema(
	{
		staff: {
			type: ObjectId,
			ref: "Tb01_Employee",
			required: true,
		},
		planYear: {
			type: Number,
			required: true,
		},
		yearsOfService: Number,
		daysEligible: Number,
		supervisorValidated: { type: Boolean, default: false },
		supervisorCode: Number,
		totalDaysTaken: Number, //To be computed and updated as the staff takes leave
		daysRemaining: Number, //To be computed and updated as the staff takes leave
		carriedOndays: {
            numberOfDays: Number, //Leave days not taken previous year
            Reason: String,
        },
		plannedDates: [
			{
				leaveTypePlanned: { type: String, default: "Annual Leave" },
				startDate: Date,
				endDate: Date,
				daysPlanned: Number,
			},
		],
		actualLeaves: [
			//Staff submits leave request to supervisor
			//NB: planned leave requests should be submitted a week before the staff goes to leave
			{
				leaveType: String,
				startDate: Date,
				endDate: Date,
				returnDate: Date,
				daysTaken: Number,
				leaveReason: String,
				supervisorRequestDate: Date,
				actingPerson: {
					names: String,
					empCode: Number,
				},
				managerRequestDate: Date,
				hrRequestDate: Date,
				supervisorApproval: {
					supervisor: {
						names: String,
						empCode: Number,
						email: String,
						phone: String,
					},
					requestStatus: String, //PENDING or APPROVED or REJECTED
					comment: String,
					dateApproval: Date,
				},
				//Supervisor approves or rejects for the staff to set agreed dates
				//Once approved, update total number of days taken and submit the request to both line Manager and HR
				//Especially for business, line manager approves and submits the request to HR
				lineManagerApproval: {
					lineManager: {
						names: String,
						empCode: Number,
						email: String,
						phone: String,
					},
					requestStatus: String, //PENDING or APPROVED or REJECTED
					comment: String,
					dateApproval: Date,
				},
				//HR checks if the staff has requested days and approves the leave
				hrManagerApproval: {
					hrManager: {
						names: String,
						empCode: Number,
						email: String,
						phone: String,
					},
					requestStatus: String, //PENDING or APPROVED or REJECTED
					comment: String,
					dateApproval: Date,
				},
				//Signed leave form
				content: {
					url: String,
					key: String,
				},
			},
		],
	},
	{ timestamps: true }
);
module.exports = mongoose.model("Tb01_Leave", leaveSchema);
