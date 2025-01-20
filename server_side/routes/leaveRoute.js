const express = require("express");
const router = express.Router();

const {
	requireSignin,
	staffMiddleware,
	hrMiddleware,
	managerMiddleware,
} = require("../controllers/authController");
const fileUploadMiddleware=require("../middlewares/uploadDocument")

const {
	addLeavePlan,
	addLeavePlanDates,
	addLeaveRequest,
	leaveRequestApproval,getSupervisors,
	addAnnualLeave,
	getLeaveInfo,
	listSupervisorAnnualLeavePlanApproval,
	supervisorApproveLeave,
	supervisorModifyLeaveDates,
	stuffDeleteLeavePlanDates,
	UpdateLeavePlanDates,
	UpdateSingleLeavePlanDates,
	getLeaveType,
	requestLeave,
	getActualLeaveInfo,
	getActingPersonDetails,
	updateActualLeave,
	actualLeaveDeleteRequest,
	getSupervisorRequest,
	getExecutives,
	supervisorActualLeaveReview,
	getLineManagerRequestInfo,
	getHRstaff,
	lineManagerRequestReview,
	getHRManagerRequestInfo,
	HumanResourceManagerRequestReview,
	addOffDays,
	getAllOff,
	updateOneOffDay,
	updateManyOffDays,
	addFile,
	LeaveStatistics,
	LeaveDashboardStatsPerLeave,
	AnnualLeaveStats,
	supervisorAnnualLeaveStatistics,
	SupervisorStatistics,
	DepartmentalStatisticsAnnualLeaveReport,
	testSupervisorMonthlyAnnualLeaveReport,
	RecallLeave,
	addSupervisor,
	deleteSupervisor,
	updateSupervisor,
	getAllStaffSupervisors,
	getAllEmployees,
	getSupervisorDetails,
	DepartmentMonthlyAnnualLeaveReport,
	getCEODetails
	
} = require("../controllers/leaveController");

router.post("/newLeavePlan", requireSignin, managerMiddleware, addLeavePlan);

router.put(
	"/leavePlanDates/:leaveplanID",
	requireSignin,
	managerMiddleware,
	addLeavePlanDates
);

router.put(
	"/leaveRequest/:leaveplanID",
	requireSignin,
	staffMiddleware,
	addLeaveRequest
);

router.put(
	"/leavePlanDates/:leaveplanID",
	requireSignin,
	managerMiddleware,
	leaveRequestApproval
);
router.get("/leave/getsupervisors",requireSignin,staffMiddleware,getSupervisors)
router.get("/leave/executives",requireSignin,staffMiddleware,getExecutives)
router.get("/leave/gethrstaff",requireSignin,staffMiddleware,getHRstaff)
router.post("/leave/addannualplan",requireSignin,staffMiddleware,addAnnualLeave)
router.post("/leave/actualleave/requestleave",requireSignin,staffMiddleware,requestLeave)
router.post("/leave/actualleave/addfile",requireSignin,staffMiddleware,fileUploadMiddleware,addFile)
router.post("/leave/actualleave/updateleave",requireSignin,staffMiddleware,updateActualLeave)
router.post("/leave/actualleave/updateleave",requireSignin,staffMiddleware,updateActualLeave)
router.put("/leave/actualleave/supervisor/review",requireSignin,staffMiddleware,supervisorActualLeaveReview)
router.put("/leave/actualleave/linemanager/review",requireSignin,staffMiddleware,lineManagerRequestReview)
router.put("/leave/actualleave/hrmanager/review",requireSignin,staffMiddleware,HumanResourceManagerRequestReview)
router.get("/leave/actualleave/getleaveinfo/:empid",requireSignin,staffMiddleware,getActualLeaveInfo)
router.get("/leave/actualleave/supervisor/getrequests/:supervisorid",requireSignin,staffMiddleware,getSupervisorRequest)
router.put("/leave/actualleave/annualleave/recall",requireSignin,staffMiddleware,RecallLeave)
router.get("/leave/actualleave/linemanager/getrequests/:linemanagerid",requireSignin,staffMiddleware,getLineManagerRequestInfo)
router.get("/leave/actualleave/hrmanager/getrequests/:hrmanagerid",requireSignin,staffMiddleware,getHRManagerRequestInfo)
router.get("/leave/actualleave/actingperson",requireSignin,staffMiddleware,getActingPersonDetails)
router.put("/leave/updateannualplan/:leaveid",requireSignin,staffMiddleware,UpdateLeavePlanDates)
router.post("/leave/supervisor/leaverequest",requireSignin,staffMiddleware,listSupervisorAnnualLeavePlanApproval)
router.post("/leave/supervisor/approve",requireSignin,staffMiddleware,supervisorApproveLeave)
router.post("/leave/supervisor/modify/:leaveid",requireSignin,staffMiddleware,supervisorModifyLeaveDates)
router.get("/leave/getleaveinfo/:empid",requireSignin,staffMiddleware,getLeaveInfo)
router.put("/leave/planneddates/staff/delete",requireSignin,staffMiddleware,stuffDeleteLeavePlanDates)
router.put("/leave/planneddates/staff/update",requireSignin,staffMiddleware,UpdateSingleLeavePlanDates)
router.get("/leave/getleavetypes",requireSignin,staffMiddleware,getLeaveType)
router.post("/leave/addoffdays",requireSignin,staffMiddleware,addOffDays)
router.get("/leave/viewoffdays",requireSignin,staffMiddleware,getAllOff)
router.put("/leave/offdays/updateone",requireSignin,staffMiddleware,updateOneOffDay)
router.put("/leave/offdays/updatemany",requireSignin,staffMiddleware,updateManyOffDays)
router.get("/leave/leavestats/:empid",requireSignin,staffMiddleware,LeaveStatistics)
router.get("/leave/statsperleave/:empid",requireSignin,staffMiddleware,LeaveDashboardStatsPerLeave)
router.get("/leave/annualleavestats/:empid",requireSignin,staffMiddleware,AnnualLeaveStats)
router.get("/leave/supervisorstats/:empid",requireSignin,staffMiddleware,supervisorAnnualLeaveStatistics)
router.get("/leave/supervisorstatistics/:empid",requireSignin,staffMiddleware,SupervisorStatistics)
router.get("/leave/supervisormonthlyreport/:empid",requireSignin,staffMiddleware,testSupervisorMonthlyAnnualLeaveReport)
router.post("/leave/department/leaveperformance",requireSignin,staffMiddleware,DepartmentalStatisticsAnnualLeaveReport)
router.post("/leave/department/monthlystatistics",requireSignin,staffMiddleware,DepartmentMonthlyAnnualLeaveReport)
router.post("/leave/admin/addsupervisor",requireSignin,staffMiddleware,addSupervisor)
router.delete("/leave/admin/deletesupervisor/:id",requireSignin,staffMiddleware,deleteSupervisor)
router.put("/leave/admin/updatesupervisor",requireSignin,staffMiddleware,updateSupervisor)
router.get("/leave/admin/getallsupervisors",requireSignin,staffMiddleware,getAllStaffSupervisors)
router.get("/leave/admin/getallemployees",requireSignin,staffMiddleware,getAllEmployees)
router.post("/leave/admin/getsupervisordetails",requireSignin,staffMiddleware,getSupervisorDetails)
router.post("/leave/CEO/getdetails",requireSignin,staffMiddleware,getCEODetails)

module.exports = router;

