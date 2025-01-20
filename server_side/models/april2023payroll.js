const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
	{
		EmployeeCode: Number,
        EmployeeName: String,
        EmployeeTitle: String,
        ReportingLine: String,
        Department: String,
        Division: String,
        Branch: String,

        BasicSalary:Number,
        AppointedDate: Date,
        ContractExpiration: Date,
        ContractTerm: String,
        //Allowances
        ResponsibilityAllowance:Number,        
        RentalCostAllowance:Number,        
        TransportAllowance:Number,
        TellerAllowance:Number,
        TechnAllowance:Number,
        InternetAllowance:Number,

        //Deductions
        LunchPayments:Number,
        SportsFitnessFees:Number,
        MedicalExpensesDeficit:Number,
        SanlamLifeInsurance:Number,
        ShortageDeductions:Number,
        StaffLoansConsolidated:Number,
        StaffSavingsConsolidated:Number,
		
	},
	{ timestamps: true }
);
module.exports = mongoose.model("april2023payroll", payrollSchema);
