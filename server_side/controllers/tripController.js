const Tb01_Trip = require("../models/tb01_trip");
const Tb01_Employee = require("../models/tb01_employee");
const User = require("../models/user");
const { isNumeric, monthDiff } = require("../helpers/utilityFunctions");
const formidable = require("formidable");
const fs = require("fs");

exports.addTrip = async (req, res) => {
	const { startDate, endDate, tripObjective, tripDestination } = req.body;
	const staffUserId = req.user._id;
	const currentUser = await User.findOne({ _id: staffUserId }).exec();
	const currentEmployee = await Tb01_Employee.findOne({
		email: currentUser.email,
	}).exec();

	let startDateMonth;
	let endDateMonth;
	let startDateDay;
	let endDateDay;
	let monthNumber;

	if (new Date(startDate).getMonth() + 1 < 10) {
		monthNumber = new Date(startDate).getMonth() + 1;
		startDateMonth = "0" + monthNumber;
	} else {
		monthNumber = new Date(startDate).getMonth() + 1;
		startDateMonth = "" + monthNumber;
	}
	if (new Date(endDate).getMonth() + 1 < 10) {
		monthNumber = new Date(endDate).getMonth() + 1;
		endDateMonth = "0" + monthNumber;
	} else {
		monthNumber = new Date(endDate).getMonth() + 1;
		endDateMonth = "" + monthNumber;
	}
	if (new Date(startDate).getDate() + 1 < 10) {
		startDateDay = "0" + new Date(startDate).getDate();
	} else {
		startDateDay = "" + new Date(startDate).getDate();
	}
	if (new Date(endDate).getDate() + 1 < 10) {
		endDateDay = "0" + new Date(endDate).getDate();
	} else {
		endDateDay = "" + new Date(endDate).getDate();
	}

	const startYearMonthDay =
		"" +
		new Date(startDate).getFullYear() +
		startDateMonth +
		startDateDay +
		"";
	const endYearMonthDay =
		"" + new Date(endDate).getFullYear() + endDateMonth + endDateDay + "";

	if (currentEmployee && currentEmployee.email) {
		Tb01_Trip.findOne({
			requestStatus: "PENDING",
			staffEmpCode: currentEmployee.empCode,
			tripDestination,
			startYearMonthDay,
			endYearMonthDay,
		}).exec((err, trip) => {
			if (err) {
				return res.status(400).json({
					error: "Error occured while checking if the request is already posted!",
				});
			} else if (trip) {
				return res.status(400).json({
					error: "Looks like this trip is already posted!",
				});
			} else {
				const newTrip = new Tb01_Trip({
					staffNames: currentEmployee.empNames,
					staffEmpCode: currentEmployee.empCode,
					staffEmail: currentEmployee.email,
					staffPhone: currentEmployee.phone,
					staffJobPosition:
						currentEmployee.currentAppointment.jobTitle,
					staffBranch: currentEmployee.currentAppointment.branch,
					staffDepartment:
						currentEmployee.currentAppointment.department,
					startDate: new Date(startDate),
					endDate: new Date(endDate),
					tripObjective,
					staffLocation: currentEmployee.currentAppointment.location,
					tripDestination,
					requestStatus: "PENDING",
					tripRequestDate: new Date(),
					startYearMonthDay,
					endYearMonthDay,
				});
				newTrip.save((err, result) => {
					if (err) {
						return res.status(401).json({
							error: "Unable to post the trip request!",
						});
					} else {
						return res.status(200).json({
							message: "Trip request is posted!",
						});
					}
				});
			}
		});
	} else {
		return res.status(401).json({
			error: "Unable to post the trip request. Staff not found!",
		});
	}
};

exports.editTrip = async (req, res) => {
	const { startDate, endDate, tripObjective, tripDestination } = req.body;
	let startDateMonth;
	let endDateMonth;
	let startDateDay;
	let endDateDay;
	let monthNumber;

	if (new Date(startDate).getMonth() + 1 < 10) {
		monthNumber = new Date(startDate).getMonth() + 1;
		startDateMonth = "0" + monthNumber;
	} else {
		monthNumber = new Date(startDate).getMonth() + 1;
		startDateMonth = "" + monthNumber;
	}
	if (new Date(endDate).getMonth() + 1 < 10) {
		monthNumber = new Date(endDate).getMonth() + 1;
		endDateMonth = "0" + monthNumber;
	} else {
		monthNumber = new Date(endDate).getMonth() + 1;
		endDateMonth = "" + monthNumber;
	}
	if (new Date(startDate).getDate() + 1 < 10) {
		startDateDay = "0" + new Date(startDate).getDate();
	} else {
		startDateDay = "" + new Date(startDate).getDate();
	}
	if (new Date(endDate).getDate() + 1 < 10) {
		endDateDay = "0" + new Date(endDate).getDate();
	} else {
		endDateDay = "" + new Date(endDate).getDate();
	}
	const startYearMonthDay =
		"" + new Date(startDate).getFullYear() + startDateMonth + startDateDay;
	const endYearMonthDay =
		new Date(endDate).getFullYear() + endDateMonth + endDateDay;

	Tb01_Trip.findOne({ _id: req.params.tripID }).exec((err, trip) => {
		if (!trip || trip === null) {
			return res.status(400).json({
				error: "Trip not found!",
			});
		} else if (trip.requestStatus !== "PENDING") {
			return res.status(400).json({
				error: "The request is either approved or cancelled. It can no longer be updated!",
			});
		} else {
			Tb01_Trip.findOneAndUpdate(
				{ _id: req.params.tripID },
				{
					startDate: new Date(startDate),
					endDate: new Date(endDate),
					tripObjective,
					tripDestination,
					startYearMonthDay,
					endYearMonthDay,
				},
				{ new: true }
			).exec((err, updated) => {
				if (err) {
					return res.status(400).json({
						error: "Error updating trip",
					});
				}
				res.json({
					message: "Trip updated successfully!",
				});
			});
		}
	});
};

exports.listDmtEmployees = async (req, res) => {
	const currentUser = await User.findOne({ _id: req.user._id }).exec();
	const currentEmployee = await Tb01_Employee.findOne({
		email: currentUser.email,
	}).exec();
	const myProfiles = await Tb01_Employee.find(
		{
			"currentAppointment.active": true,
			"currentAppointment.department":
				currentEmployee.currentAppointment.department,
		},
		"empCode officerCode empNames email phone idDetails nationality gender maritalStatus dob picture loanAccount currentAppointment currentMonthSalary"
	).sort({ empNames: 1 });
	return res.json({ myProfiles });
};

exports.listBranchManagers = async (req, res) => {
	const currentUser = await User.findOne({ _id: req.user._id }).exec();
	const currentEmployee = await Tb01_Employee.findOne({
		email: currentUser.email,
	}).exec();
	const myProfiles = await Tb01_Employee.find(
		{
			"currentAppointment.active": true,
			"currentAppointment.jobTitle": {
				$in: [
					"Branch Manager",
					"Branch Network Assistant Manager",
					"Non-Lending Product Manager",
				],
			},
		},
		"empCode officerCode empNames email phone idDetails nationality gender maritalStatus dob picture loanAccount currentAppointment currentMonthSalary"
	).sort({ empNames: 1 });
	return res.json({ myProfiles });
};

exports.selectLineManager = async (req, res) => {
	const { linemanagerID } = req.body;
	const lineManager = await Tb01_Employee.findOne(
		{
			"currentAppointment.active": true,
			empCode: linemanagerID,
		},
		"empCode empNames email phone"
	);

	return res.json({ lineManager });
};
exports.selectDestinationManager = async (req, res) => {
	const { destinationManagerID } = req.body;
	const destinationManager = await Tb01_Employee.findOne(
		{
			"currentAppointment.active": true,
			empCode: destinationManagerID,
		},
		"empCode empNames email phone"
	);
	// console.log(destionationManager);
	return res.json({ destinationManager });
};

exports.listSearchedProfilesStaff = async (req, res) => {
	const { searchValue } = req.body;
	const myProfiles = await Tb01_Employee.find(
		{
			"currentAppointment.active": true,
			$or: [
				{ empCode: isNumeric(searchValue) ? searchValue : -1 },
				{ empNames: { $regex: ".*(?i)" + searchValue + ".*(?i)" } },
				{ email: { $regex: ".*(?i)" + searchValue + ".*(?i)" } },
			],
		},
		"empCode officerCode empNames email phone idDetails nationality gender maritalStatus dob picture loanAccount currentAppointment currentMonthSalary inflationAllowance"
	).sort({ empNames: 1 });
	return res.json({ myProfiles });
};

exports.editLineManager = async (req, res) => {
	const { lineManagerEmpCode } = req.body;

	console.log(lineManagerEmpCode);
	const lineManager = await Tb01_Employee.findOne({
		empCode: lineManagerEmpCode,
	}).exec();

	Tb01_Trip.findOne({ _id: req.params.tripID }).exec((err, trip) => {
		if (!trip || trip === null) {
			return res.status(400).json({
				error: "Trip not found!",
			});
		} else {
			Tb01_Trip.findOneAndUpdate(
				{ _id: req.params.tripID },
				{
					lineManagerTripDate: new Date(),
					lineManagerEmpCode: lineManager.empCode,
					lineManagerNames: lineManager.empNames,
					lineManagerEmail: lineManager.email,
					lineManagerPhone: lineManager.phone,
				},
				{ new: true }
			).exec((err, updated) => {
				if (err) {
					return res.status(400).json({
						error: "Error updating line manager",
					});
				}
				res.json({
					message: "Line manager updated successfully!",
				});
			});
		}
	});
};

exports.editDestinationManager = async (req, res) => {
	const { destinationManagerEmpCode } = req.body;

	const destinationManager = await Tb01_Employee.findOne({
		empCode: destinationManagerEmpCode,
	}).exec();

	Tb01_Trip.findOne({ _id: req.params.tripID }).exec((err, trip) => {
		if (!trip || trip === null) {
			return res.status(400).json({
				error: "Trip not found!",
			});
		} else {
			Tb01_Trip.findOneAndUpdate(
				{ _id: req.params.tripID },
				{
					destinationManagerDate: new Date(),
					destinationManagerEmpCode: destinationManager.empCode,
					destinationManagerNames: destinationManager.empNames,
					destinationManagerEmail: destinationManager.email,
					destinationManagerPhone: destinationManager.phone,
				},
				{ new: true }
			).exec((err, updated) => {
				if (err) {
					return res.status(400).json({
						error: "Error updating destination manager",
					});
				}
				res.json({
					message: "Destination manager updated successfully!",
				});
			});
		}
	});
};

exports.readTripRequest = async (req, res) => {
	const tripRequest = await Tb01_Trip.findOne({
		_id: req.params.tripID,
	});
	if (!tripRequest || tripRequest === null) {
		return res.json({
			message: "Trip request not found!",
		});
	}
	return res.json({ tripRequest });
};

exports.deleteTripRequest = async (req, res) => {
	Tb01_Trip.findOne({ _id: req.params.tripID }).exec((err, tripRequest) => {
		if (!tripRequest || tripRequest === null) {
			return res.status(400).json({
				error: "Trip request not found!",
			});
		} else if (tripRequest.requestStatus !== "PENDING") {
			return res.status(400).json({
				error: "The request is either approved or rejected. It can no longer be deleted!",
			});
		} else {
			Tb01_Trip.findOneAndDelete({
				_id: req.params.tripID,
			}).exec((err, deleted) => {
				if (err) {
					return res.status(400).json({
						error: "Error deleting trip request",
					});
				}
				res.json({
					message: "Trip request deleted successfully!",
				});
			});
		}
	});
};

exports.listOwnTripRequest = async (req, res) => {
	const currentUser = await User.findOne({ _id: req.user._id }).exec();
	const tripRequests = await Tb01_Trip.find({
		staffEmail: currentUser.email,
	})
		.sort({ startDate: -1 })
		.exec();
	if (tripRequests.lengh <= 0) {
		return res.status(400).json({
			error: "No trip requests found",
		});
	} else {
		return res.json({ tripRequests });
	}
};

exports.listSearchedOwnRequests = async (req, res) => {
	let { searchText } = req.body;

	searchText = searchText.toUpperCase();
	let requestStatus = ["PENDING", "APPROVED", "REJECTED"];

	const staffUserId = req.user._id;
	const currentUser = await User.findOne({ _id: staffUserId }).exec();

	let tripRequests;

	if (requestStatus.includes(searchText)) {
		tripRequests = await Tb01_Trip.find({
			requestStatus: searchText,
			staffEmail: currentUser.email,
		}).sort({ startDate: 1 });
	} else {
		tripRequests = await Tb01_Trip.find({
			staffEmail: currentUser.email,
			$or: [
				{ tripObjective: { $regex: ".*(?i)" + searchText + ".*(?i)" } },
				{
					tripDestination: {
						$regex: ".*(?i)" + searchText + ".*(?i)",
					},
				},
			],
		}).sort({ startDate: 1 });
	}
	return res.json({ tripRequests });
};

exports.listSearchedRequests = async (req, res) => {
	const { searchValue } = req.body;
	let requestStatus = ["PENDING", "APPROVED", "REJECTED"];
	let tripRequests;
	if (searchValue && requestStatus.includes(searchValue.toUpperCase())) {
		tripRequests = await Tb01_Trip.find({
			requestStatus: searchValue.toUpperCase(),
		}).sort({ requestDate: 1 });
	} else {
		tripRequests = await Tb01_Trip.find({
			requestStatus: { $ne: "REJECTED" },
			$or: [
				{
					tripDestination: {
						$regex: ".*(?i)" + searchValue + ".*(?i)",
					},
				},
				{
					tripObjective: {
						$regex: ".*(?i)" + searchValue + ".*(?i)",
					},
				},
				{
					staffLocation: {
						$regex: ".*(?i)" + searchValue + ".*(?i)",
					},
				},
				{ staffEmail: { $regex: ".*(?i)" + searchValue + ".*(?i)" } },
				{ staffNames: { $regex: ".*(?i)" + searchValue + ".*(?i)" } },
				{ staffEmpCode: isNumeric(searchValue) ? searchValue : -1 },
			],
		}).sort({ startDate: -1 });
	}
	return res.json({ tripRequests });
};

exports.editTripReport = async (req, res) => {
	const { tripReport } = req.body;
	Tb01_Trip.findOne({ _id: req.params.tripID }).exec((err, trip) => {
		if (!trip || trip === null) {
			return res.status(400).json({
				error: "Trip not found!",
			});
		} else {
			Tb01_Trip.findOneAndUpdate(
				{ _id: req.params.tripID },
				{
					tripReport,
				},
				{ new: true }
			).exec((err, updated) => {
				if (err) {
					return res.status(400).json({
						error: "Error updating field visit report",
					});
				}
				res.json({
					message: "Field visit report updated successfully!",
				});
			});
		}
	});
};

///////////Line manager approval=================================
exports.listManagerApprovalPending = async (req, res) => {
	const currentUser = await User.findOne({ _id: req.user._id }).exec();
	const tripRequests = await Tb01_Trip.find({
		lineManagerEmail: currentUser.email,
		requestStatus: "PENDING",
	})
		.sort({ startDate: -1 })
		.exec();
	if (tripRequests.lengh <= 0) {
		return res.status(400).json({
			error: "No trip requests found",
		});
	} else {
		return res.json({ tripRequests });
	}
};

exports.listTripRequestsPerManager = async (req, res) => {
	const currentUser = await User.findOne({ _id: req.user._id }).exec();
	const tripRequests = await Tb01_Trip.find({
		lineManagerEmail: currentUser.email,
	})
		.sort({ startDate: -1 })
		.exec();
	if (tripRequests.length <= 0) {
		return res.status(400).json({
			error: "No trip requests found",
		});
	} else {
		return res.json({ tripRequests });
	}
};

exports.editRequestStatus = async (req, res) => {
	const { requestStatus, lineManagerTripComment } = req.body;
	Tb01_Trip.findOne({ _id: req.params.tripID }).exec((err, trip) => {
		if (!trip || trip === null) {
			return res.status(400).json({
				error: "Trip not found!",
			});
		} else {
			Tb01_Trip.findOneAndUpdate(
				{ _id: req.params.tripID },
				{
					dateApproval: new Date(),
					lineManagerTripComment,
					requestStatus,
				},
				{ new: true }
			).exec((err, updated) => {
				if (err) {
					return res.status(400).json({
						error: "Error updating request status",
					});
				}
				res.json({
					message: "Request status updated successfully!",
				});
			});
		}
	});
};

exports.editTripReportComment = async (req, res) => {
	const { lineManagerReportComment } = req.body;
	Tb01_Trip.findOne({ _id: req.params.tripID }).exec((err, trip) => {
		if (!trip || trip === null) {
			return res.status(400).json({
				error: "Trip not found!",
			});
		} else {
			Tb01_Trip.findOneAndUpdate(
				{ _id: req.params.tripID },
				{
					lineManagerReportComment,
				},
				{ new: true }
			).exec((err, updated) => {
				if (err) {
					return res.status(400).json({
						error: "Error updating report comment",
					});
				}
				res.json({
					message: "Report comment updated successfully!",
				});
			});
		}
	});
};

//////////=================Destination manager comment==============================
exports.listDestManagerTrips = async (req, res) => {
	const currentUser = await User.findOne({ _id: req.user._id }).exec();
	const tripRequests = await Tb01_Trip.find({
		destinationManagerEmail: currentUser.email,
		requestStatus: { $ne: "REJECTED" },
	})
		.sort({ startDate: -1 })
		.exec();
	if (tripRequests.lengh <= 0) {
		return res.status(400).json({
			error: "No trip requests found",
		});
	} else {
		return res.json({ tripRequests });
	}
};

exports.editDestinationManagerComment = async (req, res) => {
	const { destinationManagerComment } = req.body;

	Tb01_Trip.findOne({ _id: req.params.tripID }).exec((err, trip) => {
		if (!trip || trip === null) {
			return res.status(400).json({
				error: "Trip not found!",
			});
		} else {
			Tb01_Trip.findOneAndUpdate(
				{ _id: req.params.tripID },
				{
					destinationManagerDate: new Date(),
					destinationManagerComment,
				},
				{ new: true }
			).exec((err, updated) => {
				if (err) {
					return res.status(400).json({
						error: "Error updating destination manager comment",
					});
				}
				res.status(200).json({
					message:
						"Destination manager comment updated successfully!",
				});
			});
		}
	});
};

//////////=================Logistic==============================

exports.editTripTransport = async (req, res) => {
	const { transportCostamount, transportCostCurrency } = req.body;
	// console.table({ transportCostamount, transportCostCurrency });

	const currentUser = await User.findOne({ _id: req.user._id }).exec();
	const currentEmployee = await Tb01_Employee.findOne({
		email: currentUser.email,
	}).exec();

	Tb01_Trip.findOne({ _id: req.params.tripID }).exec((err, trip) => {
		if (!trip || trip === null) {
			return res.status(400).json({
				error: "Trip not found!",
			});
		} else {
			Tb01_Trip.findOneAndUpdate(
				{ _id: req.params.tripID },
				{
					transportCostChangedDate: new Date(),
					transportCostamount,
					transportCostCurrency,
					transportCostChangedUserStaffID: currentEmployee.empCode,
					transportCostChangedUserStaffNames:
						currentEmployee.empNames,
				},
				{ new: true }
			).exec((err, updated) => {
				if (err) {
					return res.status(400).json({
						error: "Error updating transport cost of the trip",
					});
				}
				res.json({
					message:
						"Transport cost of the trip is updated successfully!",
				});
			});
		}
	});
};

exports.listLogisticTrips = async (req, res) => {
	const tripRequests = await Tb01_Trip.find({
		requestStatus: { $ne: "REJECTED" },
	})
		.sort({ startDate: -1 })
		.exec();
	if (tripRequests.length <= 0) {
		return res.status(400).json({
			error: "No trip requests found",
		});
	} else {
		return res.json({ tripRequests });
	}
};

//////////=================HR Staff==============================

exports.editTripPerdiem = async (req, res) => {
	const { perdiemAmount, perdiemCurrency } = req.body;
	console.table({ perdiemAmount, perdiemCurrency });
	const currentUser = await User.findOne({ _id: req.user._id }).exec();
	const currentEmployee = await Tb01_Employee.findOne({
		email: currentUser.email,
	}).exec();

	Tb01_Trip.findOne({ _id: req.params.tripID }).exec((err, trip) => {
		if (!trip || trip === null) {
			return res.status(400).json({
				error: "Trip not found!",
			});
		} else {
			Tb01_Trip.findOneAndUpdate(
				{ _id: req.params.tripID },
				{
					perdiemChangedDate: new Date(),
					perdiemAmount,
					perdiemCurrency,
					perdiemChangedUserStaffID: currentEmployee.empCode,
					perdiemChangedUserStaffNames: currentEmployee.empNames,
				},
				{ new: true }
			).exec((err, updated) => {
				if (err) {
					return res.status(400).json({
						error: "Error updating perdiem of the trip",
					});
				}
				res.json({
					message: "Perdiem of the trip is updated successfully!",
				});
			});
		}
	});
};

//==============================================Documents===================================================================================
exports.createTripDocument = async (req, res) => {
	
	const currentDate = new Date();
	const timestamp = currentDate.getTime();
	let currentTrip = await Tb01_Trip.findOne({
		_id: req.params.tripid,
	}).exec();
	let tripDocs = currentTrip.tripDocuments;

	let form = new formidable.IncomingForm();
	form.parse(req, (err, fields, files) => {
		if (err) {
			return res.status(400).json({
				error: "Document could not upload",
			});
		} else {
			const { title } = fields;
			const { document } = files;
			// console.log(document.size);
			if (document.size > 2400000) {
				return res.status(400).json({
					error: "Document must be less that 24Mb",
				});
			} else {
				let oldPath = files.document.filepath;
				// let newPath =
				// 	"C:/Users/buwimana/Documents/IT/UrwegoOBF_Local/client_side/public/uploads/" + req.params.employeeid + "_" + files.document.newFilename + ".pdf";
				const newPath =
					process.env.UPLOAD_FILES_PATH +
					"Trip_" +
					timestamp +
					"_" +
					req.params.tripid +
					".pdf";
					
				let rawData = fs.readFileSync(oldPath);
				fs.writeFile(newPath, rawData, function (err) {
					if (err) {
						console.log("Reached here....")
						console.log(err)
						return res
							.status(400)
							.json({ error: "Could not upload the document!" });
					} else {
						// save to database
						let newTripDoc = { title };
						let newContent = {
							url:
								"/uploads/Trip_" +
								timestamp +
								"_" +
								req.params.tripid +
								".pdf",
							key:
								"Trip_" +
								timestamp +
								"_" +
								req.params.tripid +
								".pdf",
						};
						newTripDoc.content = newContent;
						tripDocs.push(newTripDoc);
						
						Tb01_Trip.findByIdAndUpdate(
							{ _id: req.params.tripid },
							{
								tripDocuments: tripDocs,
							}
						).exec((err, savedDoc) => {
							if (err) {
								console.log(err)
								return res.status(400).json({
									error: "Could not upload the document!",
								});
							}
							return res.json({
								message: "Successfully uploaded",
							});
						});
					}
				});
			}
		}
	});
};

exports.deleteTripDocument = (req, res) => {
	const { tripDocuments, documentKey } = req.body;
	Tb01_Trip.findOneAndUpdate(
		{ _id: req.params.tripid },
		{ tripDocuments }
	).exec((err, emp) => {
		if (err) {
			return res.status(400).json({
				error: "Unable to delete staff document!",
			});
		}
		// Deleting physical file
		// let filePathDel =
		// 	"C:/Users/buwimana/Documents/IT/UrwegoOBF_Local/client_side/public/uploads/" + documentKey;
		const filePathDel = process.env.UPLOAD_FILES_PATH + documentKey;

		fs.rmSync(filePathDel, {
			force: true,
		});

		res.json({
			message: "Document deleted successfully",
		});
	});
};
