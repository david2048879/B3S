const Tb01_Employee = require("../models/tb01_employee");
const Tb01_Leave = require("../models/tb01_leave");
const Tb00_LeaveTypes = require("../models/tb00_leaveType")
const Tb00_OffDays = require("../models/tb00_offDays")
const Tb01_Leave_Supervisor = require("../models/tb01_leave_supervisor")
const users = require("../models/user")
const { calculateOffDays, calculateWeekendDaysInDates, checkIfIsAWeekendHowManyDaysShouldBeAdded, } = require("../helpers/leaveHelper");


const CEO = {
	empCode: 1,
	empNames: "Baingana Christine",
	email: "cbaingana@urwegobank.com",
	phone: "078000000",
	idDetails: {
		nationality: "Rwanda",
		gender: "Female",
	},
	currentAppointment: {
		contractType: "Permanent",
		division: "CEO",
		department: "CEO",
		jobTitle: "CEO",
		location: "Head Office",
		locationType: "Kigali",
		branch: "Head Office",
	}
}


exports.addLeavePlan = (req, res) => {
	const { staff, planYear, yearsOfService, daysEligible } = req.body;
	Tb01_Leave.findOne({ staff, planYear }).exec((err, leave) => {
		if (leave) {
			return res.status(400).json({
				error: "Leave plan for the selected employee is already recorded for the selected year!",
			});
		} else {
			try {
				const newLeavePlan = new Tb01_Leave({
					staff,
					planYear,
					yearsOfService,
					daysEligible,
					recordedBy: req.user._id,
				});
				newLeavePlan.save((err, result) => {
					if (err) {
						return res.status(401).json({
							error: "Unable to save the leave plan",
						});
					} else {
						return res.status(200).json({
							message: `Leave plan successfully recorded`,
						});
					}
				});
			} catch (error) {
				return res.status(401).json({
					error: "Unable to record the leave plan! Contact the administrator of the system.",
				});
			}
		}
	});
};

exports.addLeavePlanDates = (req, res) => {
	const { plannedDates } = req.body;
	Tb01_Leave.findOneAndUpdate(
		{ _id: req.params.leaveplanID },
		{
			plannedDates,
			recordedBy: req.user._id,
		},
		{ new: true }
	).exec((err, updated) => {
		if (err) {
			return res.status(400).json({
				error: "Error updating leave plan dates",
			});
		}
		res.json({
			message: "Leave plan dates updated successfully!",
		});
	});
};

exports.addLeaveRequest = (req, res) => {
	const { leaveRequests } = req.body;
	Tb01_Leave.findOneAndUpdate(
		{ _id: req.params.leaveplanID },
		{
			leaveRequests,
		},
		{ new: true }
	).exec((err, updated) => {
		if (err) {
			return res.status(400).json({
				error: "Error updating leave plan dates",
			});
		}
		res.json({
			message: "Leave plan dates updated successfully!",
		});
	});
};

exports.leaveRequestApproval = (req, res) => {
	const { leaveRequests } = req.body;
	Tb01_Leave.findOneAndUpdate(
		{ _id: req.params.leaveplanID },
		{
			leaveRequests,
		},
		{ new: true }
	).exec((err, updated) => {
		if (err) {
			return res.status(400).json({
				error: "Error updating leave plan dates",
			});
		}
		res.json({
			message: "Leave plan dates updated successfully!",
		});
	});
};

exports.listSupervisorLeaveRequests = async (req, res) => {
	const receivedLeaveRequests = await Tb01_Leave.find({
		"leaveRequests.supervisorApproval.supervisor": req.user._id,
	})
		.sort({
			"leaveRequests.supervisorRequestDate": -1,
		})
		.populate(
			"Tb01_Employee",
			'empCode empNames email phone "currentAppointment.branch" "currentAppointment.jobTitle"'
		);

	return res.json({ receivedLeaveRequests });
};

exports.getSupervisors = async (req, res) => {
	try {

		const employees = await Tb01_Employee.find().select('empNames empCode');
		const supervisors = employees.concat(CEO)
		return res.status(200).json(supervisors);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
}
// exports.getSupervisors = async (req, res) => {
// 	let supervisorDetail = {
// 		location: "",
// 		department: "",
// 		branch: ""
// 	}
// 	if (req.body.isOnHeadOffice === true) {
// 		supervisorDetail.location = req.body.location;
// 		supervisorDetail.department = req.body.department;
// 	}
// 	try {
// 		if (req.body.isOnHeadOffice === true) {
// 			const executives = await Tb01_Employee.find({ "currentAppointment.department": "Executive" }).select('empNames empCode');
// 			const departmentMembers = await Tb01_Employee.find({ "currentAppointment.location": req.body.location, "currentAppointment.department": req.body.department }).select('empNames empCode');
// 			const supervisors = executives.concat(departmentMembers);
// 			return res.status(200).json(supervisors)
// 		}
// 		else {
// 			if (req.body.isOnHeadOffice === false && req.body.isOnBranch === true) {
// 				const executives = await Tb01_Employee.find({ "currentAppointment.department": "Executive" }).select('empNames empCode');
// 				const locationMembers = await Tb01_Employee.find({ "currentAppointment.location": req.body.location }).select('empNames empCode');
// 				const branchAssistantManager = await Tb01_Employee.find({ "currentAppointment.jobTitle": "Branch Network Assistant Manager" }).select('empNames empCode');
// 				console.log(req.user);
// 				const supervisors = executives.concat(executives, locationMembers, branchAssistantManager);
// 				let uniqueSupervisors = [];
// 				for (let i = 0; i < supervisors.length; i++) {
// 					let isDuplicate = false;
// 					for (let j = 0; j < uniqueSupervisors.length; j++) {
// 						if (supervisors[i].empCode === supervisors[j].empCode) {
// 							isDuplicate = true;
// 							break;
// 						}
// 					}
// 					if (!isDuplicate) {
// 						uniqueSupervisors.push(supervisors[i]);
// 					}
// 				}
// 				return res.status(200).json(uniqueSupervisors)
// 			}
// 		}
// 	} catch (error) {
// 		console.log(error);
// 		return res.status(500).json(error)
// 	}

// }
exports.addAnnualLeave = async (req, res) => {
	try {
		const currentDate = new Date();
		const currentYear = currentDate.getFullYear();
		let daysTaken = 0;
		req.body.leaveInfo.forEach((leave, i) => {
			daysTaken += leave.days;
		});
		// const remaining = req.body.eligibleDays - daysTaken
		let plannedLeave = req.body.leaveInfo.map(leave => ({
			leaveTypePlanned: "Annual Leave",
			startDate: leave.startDate,
			endDate: leave.endDate,
			daysPlanned: leave.days,
		}));
		const annualLeave = new Tb01_Leave({
			staff: req.body.staff.emp_id,
			planYear: currentYear,
			yearsOfService: req.body.yearsOfWork,
			daysEligible: req.body.eligibleDays,
			supervisorCode: req.body.selectedSupervisor,
			//totalDaysTaken: daysTaken,
			daysRemaining: req.body.eligibleDays,
			plannedDates: plannedLeave
		})
		if (req.body.carryDays > 0) {
			annualLeave.carriedOndays.numberOfDays = req.body.carryDays
			annualLeave.daysRemaining = Number(annualLeave.daysRemaining) + Number(req.body.carryDays);
			annualLeave.carriedOndays.Reason = req.body.Reason
		}
		else {
			annualLeave.carriedOndays.numberOfDays = 0;
		}
		await annualLeave.save();
		return res.status(200).json({ "message": "successfull" })
	} catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
}
exports.getLeaveInfo = async (req, res) => {
	const empid = req.params.empid;
	try {
		const leave = await Tb01_Leave.findOne({ staff: empid })
		if (leave !== null) {
			if (leave.supervisorCode === 1) {
				const superVisorName = CEO.empNames
				return res.status(200).json({ leave, superVisorName, dataPresent: true })
			}
			const supervisor = await Tb01_Employee.findOne({ empCode: leave.supervisorCode })
			const superVisorName = supervisor.empNames
			return res.status(200).json({ leave, superVisorName, dataPresent: true })
		}
		else {
			return res.status(200).json({ "message": "no data found", dataPresent: false })
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
}


exports.listSupervisorAnnualLeavePlanApproval = async (req, res) => {
	try {
		const receivedLeaveRequests = await Tb01_Leave.find({
			supervisorCode: req.body.empCode,
		})
			.sort({
				createdAt: -1,
			})
			.populate(
				"staff",
				'empCode empNames email phone currentAppointment.department currentAppointment.jobTitle currentAppointment.branch'
			);
		return res.status(200).json({ receivedLeaveRequests });
	}
	catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
};

exports.supervisorApproveLeave = async (req, res) => {
	try {
		const leave = await Tb01_Leave.findOne({ _id: req.body.leaveid })
		leave.supervisorValidated = true;
		await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave);
		return res.status(200).json({ "message": "successfully approved leave" })
	} catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
}

exports.stuffDeleteLeavePlanDates = async (req, res) => {
	try {
		const leave = await Tb01_Leave.findOne({ _id: req.body.id })
		leave.plannedDates.splice(req.body.index, 1)
		if (leave.totalDaysTaken === 0 && leave.daysRemaining === leave.eligibleDays) {
			await Tb01_Leave.findOneAndDelete({ _id: leave._id })
			res.status(200).json({ "message": "successfully deleted leave" })
		}
		await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave);
		return res.status(200).json({ "message": "successfully deleted leave" })
	} catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
}

exports.actualLeaveDeleteRequest = async (req, res) => {
	try {
		const leave = await Tb01_Leave.findOne({ _id: req.body.leaveid })
		leave.actualLeaves.splice(req.body.index, 1)
		await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave);
		return res.status(200).json({ "message": "successfully deleted leave" })
	} catch (error) {
		return res.status(500).json(error)
	}
}
exports.UpdateLeavePlanDates = async (req, res) => {
	try {
		const leave = await Tb01_Leave.findOne({ _id: req.params.leaveid })
		for (let i = 0; i < req.body.length; i++) {
			const newPlannedDates = {
				leaveTypePlanned: "Annual Leave",
				startDate: req.body[i].startDate,
				endDate: req.body[i].endDate,
				daysPlanned: req.body[i].days,
			}
			leave.plannedDates.push(newPlannedDates)
		}
		await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave);
		return res.status(200).json({ "message": "successfully approved leave" })
	} catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
}

exports.UpdateSingleLeavePlanDates = async (req, res) => {
	const index = req.body.index
	try {
		const leave = await Tb01_Leave.findOne({ _id: req.body.id })
		leave.plannedDates[index].startDate = req.body.startDate
		leave.plannedDates[index].endDate = req.body.endDate
		leave.plannedDates[index].daysPlanned = req.body.daysPicked
		await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave);
		return res.status(200).json({ "message": "successfully approved leave" })
	} catch (error) {
		return res.status(500).json(error)
	}
}

exports.supervisorModifyLeaveDates = async (req, res) => {
	try {
		const leave = await Tb01_Leave.findOne({ _id: req.params.leaveid });
		const newDates = req.body;
		newDates.forEach((update, i) => {
			leave.plannedDates[i] = {
				leaveTypePlanned: "Annual Leave",
				startDate: update.startDate,
				endDate: update.endDate,
				daysPlanned: update.days,
			};
		});
		await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave)
		return res.status(200).json({ message: "Successfully updated plannedDates" });
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
};

exports.getLeaveType = async (req, res) => {
	try {
		const leaveTypes = await Tb00_LeaveTypes.find()
		return res.status(200).json(leaveTypes)
	} catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
}
exports.addFile = async (req, res) => {
	try {

		const { path } = req.uploadedFile;
		console.log(path);
		if (!path) {
			return res.status(404).json({ "message": "file not found" })
		}
		let index;
		const leave = await Tb01_Leave.findOne({ _id: req.body.leaveid })
		console.log(leave);
		if (leave !== null) {
			for (let i = 0; i < leave.actualLeaves.length; i++) {
				if (leave.actualLeaves[i]._id.toString() === req.body.index) {
					index = i;
					break;
				}
			}
			leave.actualLeaves[index].content.url = path
		}
		await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave)
		return res.status(200).json({ "message": "succesfully saved files" })
	}
	catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
}
exports.requestLeave = async (req, res) => {
	try {
		console.log(req.body);
		if (
			req.body.leaveType &&
			req.body.startDate &&
			req.body.endDate &&
			req.body.returnDate &&
			req.body.daysTaken &&
			req.body.leaveReason &&
			req.body.actingPersonCode &&
			req.body.dataPresent &&
			req.body.supervisor
		) {
			const dataPresent = req.body.dataPresent
			let supervisorDetails;
			if (req.body.supervisor === 1) {
				supervisorDetails = CEO;
			}
			else {
				supervisorDetails = await Tb01_Employee.findOne({ empCode: req.body.supervisor })
			}
			const actingPersonDetails = await Tb01_Employee.findOne({ empCode: req.body.actingPersonCode })
			if (dataPresent === true) {
				const leave = await Tb01_Leave.findOne({ _id: req.body.leaveid })
				if (req.body.leaveType === "Annual Leave") {
					leave.totalDaysTaken = leave.totalDaysTaken + req.body.daysTaken;
					leave.daysRemaining = leave.daysRemaining - req.body.daysTaken;
				}
				leave.actualLeaves.push({
					leaveType: req.body.leaveType,
					startDate: req.body.startDate,
					endDate: req.body.endDate,
					returnDate: req.body.returnDate,
					daysTaken: req.body.daysTaken,
					leaveReason: req.body.leaveReason,
					supervisorRequestDate: new Date(),
					actingPerson: {
						names: actingPersonDetails.empNames,
						empCode: actingPersonDetails.empCode,
					},
					supervisorApproval: {
						supervisor: {
							names: supervisorDetails.empNames,
							empCode: supervisorDetails.empCode,
							email: supervisorDetails.email,
							phone: supervisorDetails.phone
						},
						requestStatus: "PENDING"
					},
				})
				await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave)
				return res.status(200).json({ "message": "successfully saved leave" })
			}
			else {
				if (dataPresent === false) {
					const staffDetails = await Tb01_Employee.findOne({ empCode: req.body.staffcode })
					if (req.body.leaveType === "Annual Leave") {
						leave.totalDaysTaken = leave.totalDaysTaken + req.body.daysTaken;
						leave.daysRemaining = leave.daysRemaining - req.body.daysTaken;
					}
					const currentDate = new Date();
					const currentYear = currentDate.getFullYear();
					const leave = new Tb01_Leave({
						planYear: currentYear,
						staff: staffDetails._id,
						actualLeaves: [{
							leaveType: req.body.leaveType,
							startDate: req.body.startDate,
							endDate: req.body.endDate,
							returnDate: req.body.returnDate,
							daysTaken: req.body.daysTaken,
							leaveReason: req.body.leaveReason,
							supervisorRequestDate: new Date(),
							actingPersonCode: req.body.actingPersonCode,
							supervisorApproval: {
								supervisor: {
									names: supervisorDetails.empNames,
									empCode: supervisorDetails.empCode,
									email: supervisorDetails.email,
									phone: supervisorDetails.phone
								},
								requestStatus: "PENDING"
							},
						}],
					});
					await leave.save();
					return res.status(200).json({ "message": "successfully saved leave" })
				}
			}
		}
		else {
			return res.status(400).json({ "message": "missing data" })
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
}
exports.updateActualLeave = async (req, res) => {
	try {
		if (
			req.body.startDate &&
			req.body.endDate &&
			req.body.returnDate &&
			req.body.actingPerson.empCode &&
			req.body.actingPerson.names &&
			req.body.supervisor.empCode &&
			req.body.supervisor.names
		) {
			const leave = await Tb01_Leave.findOne({ _id: req.body.leaveid })
			if (leave !== null) {
				leave.actualLeaves[req.body.index].startDate = req.body.startDate
				leave.actualLeaves[req.body.index].endDate = req.body.endDate
				leave.actualLeaves[req.body.index].return = req.body.returnDate
				if (leave.actualLeaves[req.body.index].supervisorApproval.supervisor.empCode !== req.body.supervisor.empCode) {
					const supervisorDetails = await Tb01_Employee.findOne({ empCode: req.body.supervisor.empCode })
					leave.actualLeaves[req.body.index].supervisorApproval.supervisor.empCode = supervisorDetails.empCode
					leave.actualLeaves[req.body.index].supervisorApproval.supervisor.names = supervisorDetails.empNames
					leave.actualLeaves[req.body.index].supervisorApproval.supervisor.email = supervisorDetails.email
					leave.actualLeaves[req.body.index].supervisorApproval.supervisor.phone = supervisorDetails.phone
				}
				if (leave.actualLeaves[req.body.index].actingPerson.empCode !== req.body.actingPerson.empCode) {
					const actingPerson = await Tb01_Employee.findOne({ empCode: req.body.actingPerson.empCode })
					leave.actualLeaves[req.body.index].actingPerson.empCode = actingPerson.empCode
					leave.actualLeaves[req.body.index].actingPerson.names = actingPerson.empNames
				}
				await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave)
				return res.status(200).json({ "message": "successfull" })
			}
			else {
				return res.status(404).json({ "message": "not found" })
			}
		}
		else {
			return res.status(400).json({ "message": "no data sent" })
		}
	} catch (error) {
		return res.status(400).json(error)
	}
}

exports.getActualLeaveInfo = async (req, res) => {
	const empid = req.params.empid;
	try {
		const leave = await Tb01_Leave.findOne({ staff: empid })
		if (leave?.actualLeaves !== undefined) {
			return res.status(200).json({ leave, dataPresent: true })
		}
		else {
			return res.status(200).json({ "message": "no data found", dataPresent: false })
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
}

exports.supervisorActualLeaveReview = async (req, res) => {
	try {
		if (
			req.body.leaveId &&
			req.body.actualLeaveId &&
			req.body.status
		) {
			if (req.body.status === "REJECTED") {
				if (req.body.comment !== "") {
					const leave = await Tb01_Leave.findOne({ _id: req.body.leaveId })
					let index;
					for (let i = 0; i < leave.actualLeaves.length; i++) {
						if (leave.actualLeaves[i]._id.toString() === req.body.actualLeaveId) {
							index = i;
						}
					}
					leave.actualLeaves[index].supervisorApproval.requestStatus = "REJECTED";
					leave.actualLeaves[index].supervisorApproval.comment = req.body.comment;
					console.log("element", leave.actualLeaves[index]);
					await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave)
					return res.status(200).json({ "message": "successfully saved" })
				}
				else {
					return res.status(400).json({ "message": "no comment provided" })
				}
			}
			else {
				if (req.body.status === "APPROVED") {
					if (req.body.lineManagerCode !== "") {
						const today = new Date();
						const leave = await Tb01_Leave.findOne({ _id: req.body.leaveId })
						let index;
						for (let i = 0; i < leave.actualLeaves.length; i++) {
							if (leave.actualLeaves[i]._id.toString() === req.body.actualLeaveId) {
								index = i;
							}
						}
						leave.actualLeaves[index].supervisorApproval.requestStatus = "APPROVED";
						leave.actualLeaves[index].supervisorApproval.dateApproval = today
						leave.actualLeaves[index].managerRequestDate = today
						let lineManager;
						if (req.body.lineManagerCode === 1) {
							lineManager = CEO;
						}
						else {
							lineManager = await Tb01_Employee.findOne({ empCode: req.body.lineManagerCode })
						}
						leave.actualLeaves[index].lineManagerApproval.lineManager.empCode = lineManager.empCode
						leave.actualLeaves[index].lineManagerApproval.lineManager.names = lineManager.empNames
						leave.actualLeaves[index].lineManagerApproval.lineManager.email = lineManager.email
						leave.actualLeaves[index].lineManagerApproval.lineManager.phone = lineManager.phone
						leave.actualLeaves[index].lineManagerApproval.requestStatus = "PENDING"
						await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave)
						return res.status(200).json({ "message": "successfully saved" })
					}
					else {
						return res.status(400).json({ "message": "no line manager provided" })
					}
				}
			}
		}
		else {
			return res.status(400).json({ "message": "no data sent" })
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error)
	}
}

exports.lineManagerRequestReview = async (req, res) => {
	try {
		if (
			req.body.leaveId &&
			req.body.actualLeaveId &&
			req.body.status
		) {
			if (req.body.status === "REJECTED") {
				if (req.body.comment !== "") {
					const leave = await Tb01_Leave.findOne({ _id: req.body.leaveId })
					let index;
					for (let i = 0; i < leave.actualLeaves.length; i++) {
						if (leave.actualLeaves[i]._id.toString() === req.body.actualLeaveId) {
							index = i;
						}
					}
					leave.actualLeaves[index].lineManagerApproval.requestStatus = "REJECTED";
					leave.actualLeaves[index].lineManagerApproval.comment = req.body.comment;
					await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave)
					return res.status(200).json({ "message": "successfully saved" })
				}
				else {
					return res.status(400).json({ "message": "no comment provided" })
				}
			}
			else {
				if (req.body.status === "APPROVED") {
					if (req.body.hrStaffCode !== "") {
						const today = new Date();
						const leave = await Tb01_Leave.findOne({ _id: req.body.leaveId })
						let index;
						for (let i = 0; i < leave.actualLeaves.length; i++) {
							if (leave.actualLeaves[i]._id.toString() === req.body.actualLeaveId) {
								index = i;
							}
						}
						leave.actualLeaves[index].lineManagerApproval.requestStatus = "APPROVED";
						leave.actualLeaves[index].lineManagerApproval.dateApproval = today
						leave.actualLeaves[index].hrRequestDate = today
						const hrManager = await Tb01_Employee.findOne({ empCode: req.body.hrStaffCode })
						leave.actualLeaves[index].hrManagerApproval.hrManager.empCode = hrManager.empCode
						leave.actualLeaves[index].hrManagerApproval.hrManager.names = hrManager.empNames
						leave.actualLeaves[index].hrManagerApproval.hrManager.email = hrManager.email
						leave.actualLeaves[index].hrManagerApproval.hrManager.phone = hrManager.phone
						leave.actualLeaves[index].hrManagerApproval.requestStatus = "PENDING"
						await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave)
						return res.status(200).json({ "message": "successfully saved" })
					}
					else {
						return res.status(400).json({ "message": "no hr manager provided" })
					}
				}
			}
		}
		else {
			return res.status(400).json({ "message": "no data sent" })
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error)
	}
}

exports.HumanResourceManagerRequestReview = async (req, res) => {
	try {
		if (
			req.body.leaveId &&
			req.body.actualLeaveId &&
			req.body.status
		) {
			if (req.body.status === "REJECTED") {
				if (req.body.comment !== "") {
					const leave = await Tb01_Leave.findOne({ _id: req.body.leaveId })
					let index;
					for (let i = 0; i < leave.actualLeaves.length; i++) {
						if (leave.actualLeaves[i]._id.toString() === req.body.actualLeaveId) {
							index = i;
						}
					}
					leave.actualLeaves[index].hrManagerApproval.requestStatus = "REJECTED";
					leave.actualLeaves[index].hrManagerApproval.comment = req.body.comment;
					await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave)
					return res.status(200).json({ "message": "successfully saved" })
				}
				else {
					res.status(400).json({ "message": "no comment provided" })
				}
			}
			else {
				if (req.body.status === "APPROVED") {
					const today = new Date();
					const leave = await Tb01_Leave.findOne({ _id: req.body.leaveId })
					let index;
					for (let i = 0; i < leave.actualLeaves.length; i++) {
						if (leave.actualLeaves[i]._id.toString() === req.body.actualLeaveId) {
							index = i;
						}
					}
					leave.actualLeaves[index].hrManagerApproval.requestStatus = "APPROVED";
					leave.actualLeaves[index].hrManagerApproval.dateApproval = today
					await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave)
					return res.status(200).json({ "message": "successfully saved" })
				}
			}
		}
		else {
			return res.status(400).json({ "message": "no data sent" })
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error)
	}
}


exports.getSupervisorRequest = async (req, res) => {
	const supervisorid = Number(req.params.supervisorid);
	try {
		const leaves = await Tb01_Leave.find().populate({
			path: "staff",
			select: "empCode empNames phone email gender currentAppointment.department"
		});
		let foundLeaves = [];
		if (leaves && leaves.length > 0) {
			for (let i = 0; i < leaves.length; i++) {
				const currentLeave = leaves[i];
				if (currentLeave.actualLeaves && currentLeave.actualLeaves.length > 0) {
					for (let j = 0; j < currentLeave.actualLeaves.length; j++) {
						const currentActualLeave = currentLeave.actualLeaves[j];
						if (currentActualLeave.supervisorApproval.supervisor.empCode === supervisorid) {
							const found = {
								actualLeave: currentActualLeave,
								leaveInfo: {
									leaveid: currentLeave._id,
									staff: {
										_id: currentLeave.staff?._id,
										empCode: currentLeave.staff?.empCode,
										empNames: currentLeave.staff?.empNames,
										email: currentLeave.staff?.email,
										phone: currentLeave.staff?.phone,
										gender: currentLeave.staff?.gender,
										department: currentLeave.staff?.currentAppointment.department
									},
									planYear: currentLeave.planYear,
									yearsOfService: currentLeave.yearsOfService,
									daysEligible: currentLeave.daysEligible,
									totalDaysTaken: currentLeave.totalDaysTaken,
									daysRemaining: currentLeave.daysRemaining,
									plannedDates: currentLeave.plannedDates,

								}
							}
							foundLeaves.push(found);
						}
					}
				}
			}
		}
		if (foundLeaves.length > 0) {
			return res.status(200).json({ leave: foundLeaves, dataPresent: true });
		} else {
			return res.status(200).json({ message: "No data found", dataPresent: false });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
}


exports.getLineManagerRequestInfo = async (req, res) => {
	const linemanagerid = Number(req.params.linemanagerid);
	try {
		const leaves = await Tb01_Leave.find().populate({
			path: "staff",
			select: "empCode empNames phone email gender currentAppointment.department"
		});
		let foundLeaves = [];
		if (leaves && leaves.length > 0) {
			for (let i = 0; i < leaves.length; i++) {
				const currentLeave = leaves[i];
				if (currentLeave.actualLeaves && currentLeave.actualLeaves.length > 0) {
					for (let j = 0; j < currentLeave.actualLeaves.length; j++) {
						const currentActualLeave = currentLeave.actualLeaves[j];
						if (currentActualLeave.lineManagerApproval.lineManager.empCode === linemanagerid) {
							const found = {
								actualLeave: currentActualLeave,
								leaveInfo: {
									leaveid: currentLeave._id,
									staff: {
										_id: currentLeave.staff._id,
										empCode: currentLeave.staff.empCode,
										empNames: currentLeave.staff.empNames,
										email: currentLeave.staff.email,
										phone: currentLeave.staff.phone,
										gender: currentLeave.staff.gender,
										department: currentLeave.staff.currentAppointment.department
									},
									planYear: currentLeave.planYear,
									yearsOfService: currentLeave.yearsOfService,
									daysEligible: currentLeave.daysEligible,
									totalDaysTaken: currentLeave.totalDaysTaken,
									daysRemaining: currentLeave.daysRemaining,
									plannedDates: currentLeave.plannedDates,

								}
							}
							foundLeaves.push(found);
						}
					}
				}
			}
		}
		if (foundLeaves.length > 0) {
			return res.status(200).json({ leave: foundLeaves, dataPresent: true });
		} else {
			return res.status(200).json({ message: "No data found", dataPresent: false });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
}

exports.getHRManagerRequestInfo = async (req, res) => {
	const hrmanagerid = Number(req.params.hrmanagerid);
	try {
		const leaves = await Tb01_Leave.find().populate({
			path: "staff",
			select: "empCode empNames phone email gender currentAppointment.department"
		});
		let foundLeaves = [];
		if (leaves && leaves.length > 0) {
			for (let i = 0; i < leaves.length; i++) {
				const currentLeave = leaves[i];
				if (currentLeave.actualLeaves && currentLeave.actualLeaves.length > 0) {
					for (let j = 0; j < currentLeave.actualLeaves.length; j++) {
						const currentActualLeave = currentLeave.actualLeaves[j];
						if (currentActualLeave.hrManagerApproval.hrManager.empCode === hrmanagerid) {
							const found = {
								actualLeave: currentActualLeave,
								leaveInfo: {
									leaveid: currentLeave._id,
									staff: {
										_id: currentLeave.staff._id,
										empCode: currentLeave.staff.empCode,
										empNames: currentLeave.staff.empNames,
										email: currentLeave.staff.email,
										phone: currentLeave.staff.phone,
										gender: currentLeave.staff.gender,
										department: currentLeave.staff.currentAppointment.department
									},
									planYear: currentLeave.planYear,
									yearsOfService: currentLeave.yearsOfService,
									daysEligible: currentLeave.daysEligible,
									totalDaysTaken: currentLeave.totalDaysTaken,
									daysRemaining: currentLeave.daysRemaining,
									plannedDates: currentLeave.plannedDates,

								}
							}
							foundLeaves.push(found);
						}
					}
				}
			}
		}
		if (foundLeaves.length > 0) {
			return res.status(200).json({ leave: foundLeaves, dataPresent: true });
		} else {
			return res.status(200).json({ message: "No data found", dataPresent: false });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
}

exports.getPersonInfo = async (req, res) => {
	const employeeCode = req.body.empCode;
	try {
		const employee = await Tb01_Employee.findOne({ empCode: employeeCode })
		res.status(200).json(employee)
	} catch (error) {
		res.status(500).json(error)
	}
}

exports.getActingPersonDetails = async (req, res) => {
	try {
		const employees = await Tb01_Employee.find().select('empNames empCode');
		return res.status(200).json(employees)
	} catch (error) {
		res.status(500).json(error)
	}
}

// exports.getActingPersonDetails = async (req, res) => {
// 	try {
// 		const departmentMembers = await Tb01_Employee.find({ "currentAppointment.branch": req.body.branch, "currentAppointment.department": req.body.department }).select('empNames empCode');
// 		return res.status(200).json(departmentMembers)
// 	} catch (error) {
// 		res.status(500).json(error)
// 	}
// }

exports.getExecutives = async (req, res) => {
	try {
		const executiveMembers = await Tb01_Employee.find({ "currentAppointment.department": "Executive" }).select('empNames empCode');
		return res.status(200).json(executiveMembers)
	} catch (error) {
		res.status(500).json(error)
	}
}

exports.getHRstaff = async (req, res) => {
	try {
		const executiveMembers = await Tb01_Employee.find({ "currentAppointment.department": "Human Resources" }).select('empNames empCode');
		return res.status(200).json(executiveMembers)
	} catch (error) {
		res.status(500).json(error)
	}
}


exports.addOffDays = async (req, res) => {
	try {
		if (!Array.isArray(req.body)) {
			return res.status(400).json({ error: "Dates should be provided as an array" });
		}

		const offDaysArray = [];
		const duplicateDates = [];
		for (const data of req.body) {
			const day = new Date(data.day);
			const isDuplicate = await Tb00_OffDays.exists({ day });
			if (isDuplicate) {
				duplicateDates.push(day);
			} else {
				offDaysArray.push({ day, comment: data.comment });
			}
		}
		await Tb00_OffDays.insertMany(offDaysArray);
		if (duplicateDates.length > 0) {
			return res.status(200).json({ duplicatesPresent: true, duplicates: duplicateDates });
		}
		else {
			return res.status(200).json({ duplicatesPresent: false });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};


exports.getAllOff = async (req, res) => {
	try {
		const data = await Tb00_OffDays.find();
		if (data.length > 0) {
			return res.status(200).json({ alloff: data, dataPresent: true })
		}
		else {
			return res.status(200).json({ dataPresent: false })
		}

	} catch (error) {
		res.status(500).json(error)
	}
}

exports.updateOneOffDay = async (req, res) => {
	try {
		const data = await Tb00_OffDays.findOne({ _id: req.body._id });
		data.comment = req.body.comment;
		data.day = req.body.day
		await Tb00_OffDays.findOneAndUpdate({ _id: data._id }, data)
		return res.status(200).json({ "message": "successfully saved" })
	} catch (error) {
		res.status(500).json(error)
	}
}

exports.updateManyOffDays = async (req, res) => {
	try {
		const updates = req.body;
		const updatePromises = updates.map(async (update) => {
			const data = await Tb00_OffDays.findOne({ _id: update._id });
			data.comment = update.comment;
			data.day = update.day;
			await Tb00_OffDays.findOneAndUpdate({ _id: data._id }, data);
		});
		await Promise.all(updatePromises);
		return res.status(200).json({ message: "Successfully updated multiple records" });
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.LeaveStatistics = async (req, res) => {
	const empid = req.params.empid;
	console.log(empid);
	try {
		const leaveData = await Tb01_Leave.findOne({ staff: empid })
		if (leaveData == null) {

			return res.status(200).json({ "total_annual_leave": 0, "all_leave_taken": 0, "other_leaves": 0 })
		}
		else {
			const total_annual_leave_days = leaveData.daysEligible + leaveData.carriedOndays.numberOfDays
			const all_leave = leaveData.actualLeaves.length
			let daysTaken = 0
			leaveData.actualLeaves.forEach((leave, i) => {
				if (leave.leaveType !== "Annual Leave" && leave.supervisorApproval?.requestStatus === "APPROVED") {
					daysTaken += leave.daysTaken;
				}
			});
			return res.status(200).json({ "total_annual_leave": total_annual_leave_days, "all_leave_taken": all_leave, "other_leaves": daysTaken })
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
}

exports.LeaveDashboardStatsPerLeave = async (req, res) => {
	const empid = req.params.empid;
	try {
		const leaveData = await Tb01_Leave.findOne({ staff: empid })
		if (leaveData == null) {

			return res.status(200).json({ "dataPresent": false })
		}
		else {
			let annualLeave = 0;
			let sickLeave = 0;
			let circumstantialLeave = 0;
			for (let a = 0; a < leaveData.actualLeaves.length; a++) {
				if (leaveData.actualLeaves[a].leaveType === "Annual Leave" && leaveData.actualLeaves[a].supervisorApproval?.requestStatus === "APPROVED") {
					annualLeave += leaveData.actualLeaves[a].daysTaken
				}
				else if (leaveData.actualLeaves[a].leaveType === "Circumstantial Leave" && leaveData.actualLeaves[a].supervisorApproval?.requestStatus === "APPROVED") {
					circumstantialLeave += leaveData.actualLeaves[a].daysTaken
				}
				else if (leaveData.actualLeaves[a].leaveType === "Sick Leave" && leaveData.actualLeaves[a].supervisorApproval?.requestStatus === "APPROVED") {
					sickLeave += leaveData.actualLeaves[a].daysTaken
				}
			}
			return res.status(200).json({ "dataPresent": true, annualLeave, sickLeave, circumstantialLeave })
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
}

exports.AnnualLeaveStats = async (req, res) => {
	const empid = req.params.empid;
	try {
		const leaveData = await Tb01_Leave.findOne({ staff: empid })
		if (leaveData == null) {

			return res.status(200).json({ "dataPresent": false })
		}
		else {
			let daysTaken = 0
			let percentage = 0;
			let totalDaysEligible = leaveData.daysEligible + leaveData.carriedOndays.numberOfDays;
			for (let a = 0; a < leaveData.actualLeaves.length; a++) {
				if (leaveData.actualLeaves[a].leaveType === "Annual Leave" && leaveData.actualLeaves[a].supervisorApproval?.requestStatus === "APPROVED") {
					daysTaken += leaveData.actualLeaves[a].daysTaken
				}
			}
			percentage = Math.floor((daysTaken * 100) / totalDaysEligible);
			return res.status(200).json({ "dataPresent": true, percentage })
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
}

exports.SupervisorStatistics = async (req, res) => {
	const empid = req.params.empid;

	try {
		const AnnualLeaveData = await Tb01_Leave.find({ supervisorCode: empid })
		let totalEligibleDays = 0
		let totalAnnualLeaveTaken = 0
		if (AnnualLeaveData == null) {
			return res.status(200).json({ "total_annual_leave": 0, "all_leave_taken": 0, "number_of_staff": 0 })
		}
		else {
			for (let i = 0; i < AnnualLeaveData.length; i++) {
				totalEligibleDays += AnnualLeaveData[i].daysEligible + AnnualLeaveData[i].carriedOndays.numberOfDays
			}

			for (let i = 0; i < AnnualLeaveData.length; i++) {
				for (let a = 0; a < AnnualLeaveData[i].actualLeaves.length; a++ && AnnualLeaveData[i].actualLeaves[a]?.supervisorApproval?.requestStatus === "APPROVED") {
					if (AnnualLeaveData[i].actualLeaves[a]?.leaveType === "Annual Leave") {
						totalAnnualLeaveTaken += AnnualLeaveData[i].actualLeaves[a].daysTaken
					}
				}
			}
			return res.status(200).json({ "total_annual_leave": totalEligibleDays, "all_leave_taken": totalAnnualLeaveTaken, "number_of_staff": AnnualLeaveData.length })
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
}

exports.supervisorAnnualLeaveStatistics = async (req, res) => {
	const empid = req.params.empid;
	try {
		let totalEligibleDays = 0
		let totalAnnualLeaveTaken = 0
		const staffUnderSupervision = await Tb01_Leave.find({ supervisorCode: empid })
		if (staffUnderSupervision == null) {

			return res.status(200).json({ "dataPresent": false })
		}
		else {
			for (let i = 0; i < staffUnderSupervision.length; i++) {
				totalEligibleDays += staffUnderSupervision[i].daysEligible + staffUnderSupervision[i].carriedOndays.numberOfDays
			}
			for (let i = 0; i < staffUnderSupervision.length; i++) {
				for (let a = 0; a < staffUnderSupervision[i].actualLeaves.length; a++) {
					if (staffUnderSupervision[i].actualLeaves[a]?.leaveType === "Annual Leave" && staffUnderSupervision[i].actualLeaves[a]?.supervisorApproval?.requestStatus === "APPROVED") {
						totalAnnualLeaveTaken += staffUnderSupervision[i].actualLeaves[a].daysTaken
					}
				}
			}
			if (totalEligibleDays === 0) {
				return res.status(200).json({ "dataPresent": false })
			} else {
				percentage = Math.floor((totalAnnualLeaveTaken * 100) / totalEligibleDays);
				return res.status(200).json({ "dataPresent": true, percentage })
			}
		}
	}
	catch (error) {
		console.log(error);
		return res.status(500).json(error)
	}
}

exports.testSupervisorMonthlyAnnualLeaveReport = async (req, res) => {
	const empid = req.params.empid;
	try {
		const allOffDays = await Tb00_OffDays.find()
		const staffUnderSupervision = await Tb01_Leave.find({ supervisorCode: empid });
		if (staffUnderSupervision.length === 0) {
			const countsPerMonth = [
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 }
			];
			return res.status(200).json({ countsPerMonth });
		} else {
			const countsPerMonth = Array.from({ length: 12 }, () => ({ planned: 0, actual: 0 })); //const countsPerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			staffUnderSupervision.forEach(leave => {
				if (leave.supervisorValidated === true) {
					leave.plannedDates.forEach(plannedDate => {
						const startDate = plannedDate.startDate;
						const endDate = plannedDate.endDate;
						const startMonth = startDate.getMonth() + 1;
						const endMonth = endDate.getMonth() + 1;
						const daysPlanned = plannedDate.daysPlanned;
						let remainingDays = 0
						if (startMonth !== endMonth) {
							let howManyDaysToAdd = 0;
							const offdays = calculateOffDays(allOffDays, startDate, (new Date(startDate.getFullYear(), startMonth, 0)))
							const howManyWeekendDays = calculateWeekendDaysInDates(startDate, (new Date(startDate.getFullYear(), startMonth, 0)))
							const checkEndDateIsWeekend = checkIfIsAWeekendHowManyDaysShouldBeAdded((new Date(startDate.getFullYear(), startMonth, 0)))
							if (checkEndDateIsWeekend.check) {
								howManyDaysToAdd = checkEndDateIsWeekend.addOnDays
							}
							remainingDays = daysPlanned - (new Date(startDate.getFullYear(), startMonth, 0).getDate() - startDate.getDate());
							remainingDays = remainingDays + offdays.length + howManyDaysToAdd + howManyWeekendDays
							countsPerMonth[endMonth].planned += remainingDays;
						}
						if (remainingDays > 0) {
							countsPerMonth[startMonth].planned += daysPlanned - remainingDays;
						}
						else {
							if (!countsPerMonth[startMonth]) {
								countsPerMonth[startMonth] = { planned: 0 }; 
							}
							countsPerMonth[startMonth].planned += daysPlanned;
						}
					});
					leave.actualLeaves.forEach(actualLeave => {
						if (actualLeave.supervisorApproval?.requestStatus === "APPROVED") {
							const startDate = actualLeave.startDate;
							const endDate = actualLeave.endDate;
							const startMonth = startDate.getMonth() + 1;
							const endMonth = endDate.getMonth() + 1;
							const daysPlanned = actualLeave.daysTaken;
							let remainingDays = 0
							if (startMonth !== endMonth) {
								let howManyDaysToAdd = 0;
								const offdays = calculateOffDays(allOffDays, startDate, (new Date(startDate.getFullYear(), startMonth, 0)))
								const howManyWeekendDays = calculateWeekendDaysInDates(startDate, (new Date(startDate.getFullYear(), startMonth, 0)))
								const checkEndDateIsWeekend = checkIfIsAWeekendHowManyDaysShouldBeAdded((new Date(startDate.getFullYear(), startMonth, 0)))
								if (checkEndDateIsWeekend.check) {
									howManyDaysToAdd = checkEndDateIsWeekend.addOnDays
								}
								remainingDays = daysPlanned - (new Date(startDate.getFullYear(), startMonth, 0).getDate() - startDate.getDate());
								remainingDays = remainingDays + offdays.length + howManyDaysToAdd + howManyWeekendDays
								countsPerMonth[endMonth].actual += remainingDays;
							}
							if (remainingDays > 0) {
								countsPerMonth[startMonth].actual += daysPlanned - remainingDays;
							}
							else {
								try {
									countsPerMonth[startMonth].actual += daysPlanned;
								} catch (error) {
									console.log(error)
								}
							}
						}
					})
				}
			});
			return res.status(200).json({ countsPerMonth });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
}


exports.DepartmentMonthlyAnnualLeaveReport = async (req, res) => {
	const role = req.body.role
	const category = req.body.category
	try {
		const allOffDays = await Tb00_OffDays.find()
		const leaves = await Tb01_Leave.find().populate("staff");
		const staffUnderSupervision = leaves.filter(leave => leave.staff.currentAppointment[role] === category)
		if (staffUnderSupervision.length === 0) {
			const countsPerMonth = [
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 },
				{ planned: 0, actual: 0 }
			];
			return res.status(200).json({ countsPerMonth });
		} else {
			const countsPerMonth = Array.from({ length: 12 }, () => ({ planned: 0, actual: 0 })); //const countsPerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			staffUnderSupervision.forEach(leave => {
				if (leave.supervisorValidated === true) {
					leave.plannedDates.forEach(plannedDate => {
						const startDate = plannedDate.startDate;
						const endDate = plannedDate.endDate;
						const startMonth = startDate.getMonth() + 1;
						const endMonth = endDate.getMonth() + 1;
						const daysPlanned = plannedDate.daysPlanned;
						let remainingDays = 0
						if (startMonth !== endMonth) {
							let howManyDaysToAdd = 0;
							const offdays = calculateOffDays(allOffDays, startDate, (new Date(startDate.getFullYear(), startMonth, 0)))
							const howManyWeekendDays = calculateWeekendDaysInDates(startDate, (new Date(startDate.getFullYear(), startMonth, 0)))
							const checkEndDateIsWeekend = checkIfIsAWeekendHowManyDaysShouldBeAdded((new Date(startDate.getFullYear(), startMonth, 0)))
							if (checkEndDateIsWeekend.check) {
								howManyDaysToAdd = checkEndDateIsWeekend.addOnDays
							}
							remainingDays = daysPlanned - (new Date(startDate.getFullYear(), startMonth, 0).getDate() - startDate.getDate());
							remainingDays = remainingDays + offdays.length + howManyDaysToAdd + howManyWeekendDays
							countsPerMonth[endMonth].planned += remainingDays;
						}
						if (remainingDays > 0) {
							countsPerMonth[startMonth].planned += daysPlanned - remainingDays;
						}
						else {
							countsPerMonth[startMonth].planned += daysPlanned;
						}
					});
					leave.actualLeaves.forEach(actualLeave => {
						if (actualLeave.supervisorApproval?.requestStatus === "APPROVED") {
							const startDate = actualLeave.startDate;
							const endDate = actualLeave.endDate;
							const startMonth = startDate.getMonth() + 1;
							const endMonth = endDate.getMonth() + 1;
							const daysPlanned = actualLeave.daysTaken;
							let remainingDays = 0
							if (startMonth !== endMonth) {
								let howManyDaysToAdd = 0;
								const offdays = calculateOffDays(allOffDays, startDate, (new Date(startDate.getFullYear(), startMonth, 0)))
								const howManyWeekendDays = calculateWeekendDaysInDates(startDate, (new Date(startDate.getFullYear(), startMonth, 0)))
								const checkEndDateIsWeekend = checkIfIsAWeekendHowManyDaysShouldBeAdded((new Date(startDate.getFullYear(), startMonth, 0)))
								if (checkEndDateIsWeekend.check) {
									howManyDaysToAdd = checkEndDateIsWeekend.addOnDays
								}
								remainingDays = daysPlanned - (new Date(startDate.getFullYear(), startMonth, 0).getDate() - startDate.getDate());
								remainingDays = remainingDays + offdays.length + howManyDaysToAdd + howManyWeekendDays
								countsPerMonth[endMonth].actual += remainingDays;
							}
							if (remainingDays > 0) {
								countsPerMonth[startMonth].actual += daysPlanned - remainingDays;
							}
							else {
								countsPerMonth[startMonth].actual += daysPlanned;
							}
						}
					})
				}
			});
			return res.status(200).json({ countsPerMonth });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
}


exports.DepartmentalStatisticsAnnualLeaveReport = async (req, res) => {
	try {
		const role = req.body.role
		const category = req.body.category
		const allEmployees = await Tb01_Employee.find({ [`currentAppointment.${role}`]: category });
		const leave = await Tb01_Leave.find();
		let percentage = 0
		let staffWithinDepartment = [];
		for (let i = 0; i < allEmployees.length; i++) {
			for (let a = 0; a < leave.length; a++) {
				if (leave[a].staff.toString() === allEmployees[i]._id.toString() && leave[a].supervisorValidated === true) {
					staffWithinDepartment.push(leave[a])
				}
			}
		}
		let count = 0
		for (let i = 0; i < staffWithinDepartment.length; i++) {
			for (let a = 0; a < staffWithinDepartment[i].actualLeaves?.length; a++) {
				if (staffWithinDepartment[i].actualLeaves[a]?.leaveType === "Annual Leave" && staffWithinDepartment[i].actualLeaves[a]?.supervisorApproval?.requestStatus === "APPROVED") {
					count++
					break;
				}
			}
		}
		let totalDaysTaken = 0;
		for (let i = 0; i < staffWithinDepartment.length; i++) {
			for (let a = 0; a < staffWithinDepartment[i].actualLeaves?.length; a++) {
				if (staffWithinDepartment[i].actualLeaves[a]?.leaveType === "Annual Leave" && staffWithinDepartment[i].actualLeaves[a]?.supervisorApproval?.requestStatus === "APPROVED") {
					totalDaysTaken += staffWithinDepartment[i].actualLeaves[a].daysTaken;
				}
			}
		}
		let totalPlannedDays = 0;
		for (let i = 0; i < staffWithinDepartment.length; i++) {
			for (let a = 0; a < staffWithinDepartment[i].plannedDates?.length; a++) {
				totalPlannedDays += staffWithinDepartment[i].plannedDates[a]?.daysPlanned;
			}
		}
		percentage = Math.floor((totalDaysTaken * 100) / totalPlannedDays);
		const percentagePeoplePlan = Math.floor((count * 100) / allEmployees.length);
		let dataPresent;
		let departmentDataPresent;
		if (totalPlannedDays !== 0) {
			dataPresent = true
		}
		else {
			dataPresent = false
		}
		if (count !== 0) {
			departmentDataPresent = true
		}
		else {
			departmentDataPresent = false
		}
		return res.status(200).json({ dataPresent, percentage, "numberOfEmployees": allEmployees.length, "numberOfWhoTookLeave": count, totalDaysTaken, totalPlannedDays, departmentDataPresent, percentagePeoplePlan })
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
}

exports.RecallLeave = async (req, res) => {
	const actualLeaveId = req.body.actualLeavedId
	const annualLeaveId = req.body.annualLeaveId
	const startDate = req.body.startDate;
	try {
		const today = new Date();
		today.setUTCHours(0, 0, 0, 0);
		const leave = await Tb01_Leave.findOne({ _id: actualLeaveId })
		const timeDiff = Math.max(Math.abs(new Date(startDate).getTime() - today.getTime()));
		let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
		diffDays = diffDays + 1;
		const weekendDays = calculateWeekendDaysInDates(new Date(startDate), today)
		const daysTaken = diffDays - weekendDays;
		for (let i = 0; i < leave.actualLeaves.length; i++) {
			if (leave.actualLeaves[i]._id.toString() === annualLeaveId) {
				leave.actualLeaves[i].endDate = today
				leave.actualLeaves[i].returnDate = today
				leave.actualLeaves[i].daysTaken = daysTaken
				break;
			}
		}
		leave.daysRemaining = leave.daysRemaining + daysTaken
		await Tb01_Leave.findOneAndUpdate({ _id: leave._id }, leave)
		res.status(200).json({ "message": "succesfully recalled leave" })
	} catch (error) {
		console.log(error);
		res.status(500).json(error)
	}
}

exports.addSupervisor = async (req, res) => {
	try {
		const { staff, role } = req.body;
		const employee = await Tb01_Employee.findOne({ empCode: staff });

		if (!employee) {
			return res.status(405).json({ error: "Employee not found" });
		}
		const existingSupervisor = await Tb01_Leave_Supervisor.findOne({ staff: employee._id });

		if (existingSupervisor) {
			return res.status(400).json({ error: "Supervisor with this role already exists for the employee" });
		}
		let supervisor;
		if (req.body.responsability) {
			supervisor = new Tb01_Leave_Supervisor({
				staff: employee._id,
				role,
			});
		}
		else {
			supervisor = new Tb01_Leave_Supervisor({
				staff: employee._id,
				role,
				responsability: req.body?.responsability
			});
		}
		await supervisor.save();
		return res.status(201).json({ message: "Supervisor added successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

exports.deleteSupervisor = async (req, res) => {
	try {
		const { id } = req.params;
		const supervisor = await Tb01_Leave_Supervisor.findByIdAndDelete(id);
		if (!supervisor) {
			return res.status(404).json({ error: "Supervisor not found" });
		}
		return res.status(200).json({ message: "Supervisor deleted successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

exports.updateSupervisor = async (req, res) => {
	try {
		const { id, role, status } = req.body;
		const updateFields = {};
		if (role) updateFields.role = role;
		if (status) updateFields.state = status;
		const supervisor = await Tb01_Leave_Supervisor.findByIdAndUpdate(
			id,
			{ $set: updateFields },
			{ new: true }
		);
		if (!supervisor) {
			return res.status(404).json({ error: "Supervisor not found" });
		}
		return res.status(200).json({ message: "Supervisor updated successfully", supervisor });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

exports.getAllStaffSupervisors = async (req, res) => {
	try {
		const supervisors = await Tb01_Leave_Supervisor.find().populate({
			path: 'staff',
			select: 'empNames currentAppointment.jobTitle currentAppointment.department',
		})
		if (!supervisors) {
			return res.status(404).json({ error: "No supervisors found" });
		}
		return res.status(200).json(supervisors);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

exports.getAllEmployees = async (req, res) => {
	try {
		const employees = await Tb01_Employee.find().select('empNames empCode');
		return res.status(200).json(employees);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

exports.getSupervisorDetails = async (req, res) => {
	try {
		const staff = req.body.staff;
		const employee = await Tb01_Employee.findOne({ empCode: staff });
		if (!employee) {
			return res.status(404).json({ error: "Employee not found" });
		}
		const supervisor = await Tb01_Leave_Supervisor.findOne({ staff: employee._id });
		let dataPresent
		if (!supervisor) {
			dataPresent = false
		}
		else {
			dataPresent = true
		}
		return res.status(200).json({ "dataPresent": dataPresent, supervisor });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};


exports.getCEODetails = async (req, res) => {
	try {
		const { email, role } = req.body
		if (email === CEO.email && role === CEO.currentAppointment.jobTitle) {
			return res.status(200).json({ CEO })
		}
		else {
			return res.status(304).json({ "message": "ISSUE CONTACT ADMIN" })
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
}







