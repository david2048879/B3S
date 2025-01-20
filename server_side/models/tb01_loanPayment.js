const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema

const loanPaymentSchema = new mongoose.Schema(
	{
		bankName: {
			type: String,
			required: true,
		},
		loanAccount: {
			type: String,
			required: true,
		},
		startDate: { type: Date, required: true },
		endDate: Date,
		employeeID: {
			type: ObjectId,
			ref: "Tb01_Employee",
		},
		recordedBy: {
			type: ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb01_LoanPayment", loanPaymentSchema);
