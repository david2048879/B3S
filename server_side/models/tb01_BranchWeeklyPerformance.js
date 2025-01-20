const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema

const weeklyPerformanceSchema = new mongoose.Schema(
	{
        BranchName: {
			type: String,
			required: true,
		},
        PerformanceYear:{
            type: Number,
            required:true,
        },
		MonthName: {
			type: String,
			required: true,
		},
        WeekNumber: {
			type: Number,
			required: true,
		},
        DateWeekStart: Date,
        DateWeekEnd: Date,
        BranchCode: Number,
        GrowthPerc: Number,
        StartGLP: Number,
        EndGLP: Number,
        WeeklyIncentiveEarnings: Number,
        MonthEndPAR30: Number,
        performanceQuarter: Number,
        weeksInMonth: Number,
        growthWeeks: Number,
        GrowthWeeksPerc: Number,
        PARTarget: Number,
        PAR30Points: Number,
        WeeksTotalIncentive: Number,
        WeeksGrowthDiscount: Number,
        PAR30Incentive: Number,
        MonthlyIncentive: Number,
        QuarterlyIncentive: Number,
        NetBMIncentive: Number,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb01_BranchWeeklyPerformance", weeklyPerformanceSchema);
			
