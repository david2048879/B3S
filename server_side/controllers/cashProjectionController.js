const Tb01_CashProjection = require("../models/tb01_cashProjection");
const Tb01_Employee = require("../models/tb01_employee");
const User = require("../models/user");
const { isNumeric, monthDiff } = require("../helpers/utilityFunctions");
const formidable = require("formidable");
const fs = require("fs");

exports.addCashRequest = async (req, res) => {
	const { bankName, requestAmount, currencyCode, description, supplierName } =
		req.body;

	if (
		new Date().getDay() === "Saturday" ||
		new Date().getDay() === "Sunday"
	) {
		return res.status(401).json({
			error: "No cash projection posting are allowed on Saturdays and Sundays!",
		});
	} else {
		//Setting starting and ending dates of next week
		let date = new Date();
		let nextWeekStart = date.getDate() - date.getDay() + 7;
		let nextWeekFrom = new Date(date.setDate(nextWeekStart));
		let nextWeekEnd = date.getDate() - date.getDay() + 6;
		let nextWeekTo = new Date(date.setDate(nextWeekEnd));

		const staffUserId = req.user._id;
		const currentUser = await User.findOne({ _id: staffUserId }).exec();
		const currentEmployee = await Tb01_Employee.findOne({
			email: currentUser.email,
		}).exec();

		if (currentEmployee && currentEmployee.email) {
			Tb01_CashProjection.findOne({
				bankName,
				currencyCode,
				requestAmount,
				currentRequestStatus: "PENDING",
				requesterEmail: currentEmployee.email,
				supplierName,
			}).exec((err, cashRequest) => {
				if (err) {
					return res.status(400).json({
						error: "Error occured while checking if the request is already posted!",
					});
				} else if (cashRequest) {
					return res.status(400).json({
						error: "Looks like this cash request is already posted!",
					});
				} else {
					const newCashRequest = new Tb01_CashProjection({
						weekStartDate: nextWeekFrom,
						weekEndDate: nextWeekTo,
						requestDate: new Date(),
						requesterName: currentEmployee.empNames,
						requesterEmail: currentEmployee.email,
						branchName: currentEmployee.currentAppointment.branch,
						departmentName:
							currentEmployee.currentAppointment.department,
						bankName,
						currencyCode,
						requestAmount,
						description,
						supplierName,
						currentRequestStatus: "PENDING",
						currentRequestStatusDate: new Date(),
					});
					newCashRequest.save((err, result) => {
						if (err) {
							return res.status(401).json({
								error: "Unable to post the cash request!",
							});
						} else {
							return res.status(200).json({
								message: "Cash request is posted!",
							});
						}
					});
				}
			});
		} else {
			return res.status(401).json({
				error: "Unable to post the cash request. Staff not found!",
			});
		}
	}
};

exports.editCashRequest = async (req, res) => {
	const { bankName, currencyCode, requestAmount, description, supplierName } =
		req.body;
	Tb01_CashProjection.findOne({ _id: req.params.cashRequestID }).exec(
		(err, cashRequest) => {
			if (!cashRequest || cashRequest === null) {
				return res.status(400).json({
					error: "Cash request not found!",
				});
			} else if (cashRequest.currentRequestStatus !== "PENDING") {
				return res.status(400).json({
					error: "The request is either processed or cancelled. It can no longer be updated!",
				});
			} else {
				Tb01_CashProjection.findOneAndUpdate(
					{ _id: req.params.cashRequestID },
					{
						bankName,
						currencyCode,
						requestAmount,
						description,
						supplierName,
					},
					{ new: true }
				).exec((err, updated) => {
					if (err) {
						return res.status(400).json({
							error: "Error updating cash request",
						});
					}
					res.json({
						message: "Cash request updated successfully!",
					});
				});
			}
		}
	);
};

exports.processCashRequest = async (req, res) => {
	const { currentRequestStatus, currentStatusComment } = req.body;

	const staffUserId = req.user._id;
	const currentUser = await User.findOne({ _id: staffUserId }).exec();
	const currentEmployee = await Tb01_Employee.findOne({
		email: currentUser.email,
	}).exec();

	Tb01_CashProjection.findOne({ _id: req.params.cashRequestID }).exec(
		(err, cashRequest) => {
			if (!cashRequest || cashRequest === null) {
				return res.status(400).json({
					error: "Cash request not found!",
				});
			} else if (cashRequest.currentRequestStatus !== "PENDING") {
				return res.status(400).json({
					error: "The request is either processed or cancelled. It can no longer be updated!",
				});
			} else {
				let currentStatus = {};
				currentStatus.requestStatus = cashRequest.currentRequestStatus;
				currentStatus.statusDate = cashRequest.currentRequestStatusDate;
				currentStatus.changedBy = currentEmployee.email;
				currentStatus.currentStatusComment =
					cashRequest.currentStatusComment;

				let passedStatus = cashRequest.requestStatusHistory;
				passedStatus.push(currentStatus);

				let combinedComments = cashRequest.currentStatusComment;

				if (combinedComments && combinedComments.length > 1) {
					combinedComments =
						combinedComments + " | " + currentStatusComment;
				} else {
					combinedComments = currentStatusComment;
				}
				Tb01_CashProjection.findOneAndUpdate(
					{ _id: req.params.cashRequestID },
					{
						currentRequestStatus,
						currentStatusComment: combinedComments,
						currentRequestStatusDate: new Date(),
						requestStatusHistory: passedStatus,
					},
					{ new: true }
				).exec((err, updated) => {
					if (err) {
						return res.status(400).json({
							error: "Error updating cash request",
						});
					}
					res.json({
						message: "Cash request updated successfully!",
					});
				});
			}
		}
	);
};

exports.readCashRequest = async (req, res) => {
	const cashProjection = await Tb01_CashProjection.findOne({
		_id: req.params.cashRequestID,
	});
	// console.log("My request: ", cashProjection);
	if (!cashProjection || cashProjection === null) {
		return res.json({
			message: "Cash projection not found!",
		});
	}
	return res.json({ cashProjection });
};

exports.deleteCashRequest = async (req, res) => {
	Tb01_CashProjection.findOne({ _id: req.params.cashRequestID }).exec(
		(err, cashRequest) => {
			if (!cashRequest || cashRequest === null) {
				return res.status(400).json({
					error: "Cash request not found!",
				});
			} else if (cashRequest.currentRequestStatus !== "PENDING") {
				return res.status(400).json({
					error: "The request is either processed or cancelled. It can no longer be deleted!",
				});
			} else {
				Tb01_CashProjection.findOneAndDelete({
					_id: req.params.cashRequestID,
				}).exec((err, deleted) => {
					if (err) {
						return res.status(400).json({
							error: "Error deleting cash request",
						});
					}
					res.json({
						message: "Cash request deleted successfully!",
					});
				});
			}
		}
	);
};

exports.listAllCashRequest = async (req, res) => {
	Tb01_CashProjection.find({ currentRequestStatus: "PENDING" })
		.sort({ requestDate: -1, requesterName: 1 })
		.exec((err, cashRequests) => {
			if (err || !cashRequests) {
				return res.status(400).json({
					error: "No cash requests found",
				});
			}
			return res.json({ cashRequests });
		});
};

exports.listUpdatedCashRequests = async (req, res) => {
	Tb01_CashProjection.find({})
		.sort({ updatedAt: -1 })
		.limit(7)
		.exec((err, cashRequests) => {
			if (err || !cashRequests) {
				return res.status(400).json({
					error: "No cash requests found",
				});
			}
			return res.json({ cashRequests });
		});
};

exports.listSearchedRequests = async (req, res) => {
	const { searchText } = req.body;
	let requestStatus = ["PENDING", "PROCESSED", "CANCELLED"];
	let cashRequests;

	if (searchText && requestStatus.includes(searchText.toUpperCase())) {
		cashRequests = await Tb01_CashProjection.find({
			currentRequestStatus: searchText.toUpperCase(),
		}).sort({ requestDate: 1 });
	} else {
		cashRequests = await Tb01_CashProjection.find({
			$or: [
				{ requestAmount: isNumeric(searchText) ? searchText : -1 },
				{
					requesterName: {
						$regex: ".*(?i)" + searchText + ".*(?i)",
					},
				},
				{
					supplierName: {
						$regex: ".*(?i)" + searchText + ".*(?i)",
					},
				},
				{
					requesterEmail: {
						$regex: ".*(?i)" + searchText + ".*(?i)",
					},
				},
				{
					departmentName: {
						$regex: ".*(?i)" + searchText + ".*(?i)",
					},
				},
				{ description: { $regex: ".*(?i)" + searchText + ".*(?i)" } },
				{ branchName: { $regex: ".*(?i)" + searchText + ".*(?i)" } },
				{ bankName: { $regex: ".*(?i)" + searchText + ".*(?i)" } },
			],
		}).sort({ requestDate: -1 });
	}
	return res.json({ cashRequests });
};

exports.listOwnCashRequest = async (req, res) => {
	const staffUserId = req.user._id;
	const currentUser = await User.findOne({ _id: staffUserId }).exec();

	const cashRequests = await Tb01_CashProjection.find({
		requesterEmail: currentUser.email,
	})
		.sort({ requestDate: -1 })
		.exec();
	if (cashRequests.lengh <= 0) {
		return res.status(400).json({
			error: "No cash requests found",
		});
	} else {
		return res.json({ cashRequests });
	}
};

exports.listSearchedOwnRequests = async (req, res) => {
	let { searchText } = req.body;

	searchText = searchText.toUpperCase();
	let requestStatus = ["PENDING", "PROCESSED", "CANCELED"];

	const staffUserId = req.user._id;
	const currentUser = await User.findOne({ _id: staffUserId }).exec();

	let cashRequests;

	if (requestStatus.includes(searchText)) {
		cashRequests = await Tb01_CashProjection.find({
			currentRequestStatus: searchText,
			requesterEmail: currentUser.email,
		}).sort({ requestDate: 1 });
		// console.log(cashRequests.length);
	} else {
		cashRequests = await Tb01_CashProjection.find({
			requesterEmail: currentUser.email,
			$or: [
				{ requestAmount: isNumeric(searchText) ? searchText : -1 },
				{ bankName: { $regex: ".*(?i)" + searchText + ".*(?i)" } },
				{ supplierName: { $regex: ".*(?i)" + searchText + ".*(?i)" } },
			],
		}).sort({ requestDate: 1 });
	}
	return res.json({ cashRequests });
};

exports.updateRequestsWeekDates = async (req, res) => {
	const cashRequests = await Tb01_CashProjection.find({
		currentRequestStatus: "PENDING",
	}).sort({ requestDate: -1 });
	let updatableRequests = [];
	if (cashRequests.length > 0) {
		// Changing week dates for pending requests that were not processed in due week
		for (crequest in cashRequests) {
			if (cashRequests[crequest].weekEndDate < new Date()) {
				updatableRequests.push(cashRequests[crequest]._id);
			}
		}
		const today = new Date();
		await Tb01_CashProjection.updateMany(
			{ _id: { $in: updatableRequests } },
			{
				weekStartDate: new Date(
					today.setDate(today.getDate() - today.getDay())
				),
				weekEndDate: new Date(
					today.setDate(today.getDate() - today.getDay() + 6)
				),
			}
		).exec();
		// Deleting requests that are pending for 14 days or more
		let deletableRequests = [];
		const cashRequestsDelete = await Tb01_CashProjection.find({
			currentRequestStatus: "PENDING",
		}).sort({ requestDate: -1 });
		for (crequest in cashRequestsDelete) {
			let dateRequestPost = cashRequestsDelete[crequest].requestDate;

			let initialNextWeekStart =
				dateRequestPost.getDate() - dateRequestPost.getDay() + 7;
			let initialNextWeekFrom = new Date(
				dateRequestPost.setDate(initialNextWeekStart)
			);

			let Difference_In_Days =
				(new Date() - initialNextWeekFrom) / (1000 * 3600 * 24);
			if (Difference_In_Days >= 14) {
				deletableRequests.push(cashRequestsDelete[crequest]._id);
			}
		}
		if (cashRequestsDelete.length > 0) {
			await Tb01_CashProjection.deleteMany({
				_id: { $in: deletableRequests },
			}).exec();
		}

		return res.status(200).json({
			message: "Projection dates are successfully updated!",
		});
	} else {
		return res.status(400).json({
			error: "No cash requests to update!",
		});
	}
};

exports.listCurrentWeekRequests = async (req, res) => {
	let date_today = new Date();
	let first_day_of_the_week = new Date(
		date_today.setDate(date_today.getDate() - date_today.getDay())
	);
	let last_day_of_the_week = new Date(
		date_today.setDate(date_today.getDate() - date_today.getDay() + 6)
	);
	const startDate = new Date(first_day_of_the_week).getTime() - 86400000; //a day has 86400000 milliseconds
	const endDate = new Date(last_day_of_the_week).getTime() + 86400000;

	const relevantRequests = await Tb01_CashProjection.find({}).sort({
		requestDate: 1,
	});

	let cashRequests = [];
	for (req in relevantRequests) {
		if (
			relevantRequests[req].weekStartDate > startDate &&
			relevantRequests[req].weekEndDate < endDate &&
			relevantRequests[req].currentRequestStatus === "PENDING"
		) {
			cashRequests.push(relevantRequests[req]);
		}
	}

	return res.json({ cashRequests });
};

exports.reportRequestDates = async (req, res) => {
	let { weekStartDate, weekEndDate } = req.body;
	const startDate = new Date(weekStartDate).getTime() - 86400000;
	const endDate = new Date(weekEndDate).getTime() + 86400000;

	const relevantRequests = await Tb01_CashProjection.find({}).sort({
		requestDate: 1,
	});

	let cashRequests = [];
	for (req in relevantRequests) {
		if (
			relevantRequests[req].weekStartDate > startDate &&
			relevantRequests[req].weekEndDate < endDate
		) {
			cashRequests.push(relevantRequests[req]);
		}
	}
	return res.json({ cashRequests });
};

exports.exportReportRequestDates = async (req, res) => {
	const { weekStartDate, weekEndDate } = req.body;
	const startDate = new Date(weekStartDate).getTime() - 86400000;
	const endDate = new Date(weekEndDate).getTime() + 86400000;
	const relevantRequests = await Tb01_CashProjection.find({}).sort({
		requestDate: 1,
	});

	let cashRequestData = [];
	for (req in relevantRequests) {
		if (
			relevantRequests[req].weekStartDate > startDate &&
			relevantRequests[req].weekEndDate < endDate
		) {
			cashRequestData.push(relevantRequests[req]);
		}
	}

	let cashRequests = [
		[
			"REQUESTER NAME",
			"REQUESTER EMAIL",
			"PAYING BANK",
			"AMOUNT",
			"CURRENCY",
			"SUPPLIER",
			"DATE REQUEST",
			"STATUS",
			"DEPARTMENT",
			"BRANCH",
			"DATE STARTING WEEK",
			"DATE ENDING WEEK",
		],
	];
	//.toLocaleDateString()
	try {
		for (rec in cashRequestData) {
			let supplierNames = cashRequestData[rec].supplierName
				? cashRequestData[rec].supplierName
				: "";
			let record = [
				'"' +
					cashRequestData[rec].requesterName +
					'","' +
					cashRequestData[rec].requesterEmail +
					'","' +
					cashRequestData[rec].bankName +
					'","' +
					cashRequestData[rec].requestAmount +
					'","' +
					cashRequestData[rec].currencyCode +
					'","' +
					supplierNames +
					'","' +
					new Date(cashRequestData[rec].requestDate)
						.toISOString()
						.slice(0, 10) +
					'","' +
					cashRequestData[rec].currentRequestStatus +
					'","' +
					cashRequestData[rec].departmentName +
					'","' +
					cashRequestData[rec].branchName +
					'","' +
					new Date(cashRequestData[rec].weekStartDate)
						.toISOString()
						.slice(0, 10) +
					'","' +
					new Date(cashRequestData[rec].weekEndDate)
						.toISOString()
						.slice(0, 10) +
					'"',
			];
			cashRequests.push(record);
		}
	} catch (error) {
		console.log(error);
	}
	return res.json({ cashRequests });
};

exports.addFinanceDocument = async (req, res) => {
	const currentDate = new Date();
	const timestamp = currentDate.getTime();
	let form = new formidable.IncomingForm();

	form.parse(req, (err, fields, files) => {
		if (err) {
			console.log(err);
			return res.status(400).json({
				error: "Document could not upload",
			});
		} else {
			const { requestID } = fields;
			const { document } = files;

			Tb01_CashProjection.findOne({
				_id: requestID,
			}).exec((err, cashReq) => {
				let documentKey;
				if (document.size > 25000000) {
					return res.status(400).json({
						error: "Document must be less that 25Mb",
					});
				} else {
					//Delete previous document
					if (cashReq.content && cashReq.content.key) {
						documentKey = cashReq.content.key;
						try {
							Tb01_CashProjection.findOneAndUpdate(
								{ _id: requestID },
								{ content: undefined }
							).exec((err, doc) => {
								if (documentKey) {
									const filePathDel =
										process.env.UPLOAD_FILES_PATH +
										documentKey;

									fs.rmSync(filePathDel, {
										force: true,
									});
								}
							});
						} catch (error) {
							console.log(error);
						}
					}
					//Uploading the new selected document
					let oldPath = files.document.filepath;
					const newPath =
						process.env.UPLOAD_FILES_PATH +
						"Finance_" +
						timestamp +
						"_" +
						requestID +
						".pdf";
					let rawData = fs.readFileSync(oldPath);
					fs.writeFile(newPath, rawData, function (err) {
						if (err) {
							console.log(err);
							return res.status(400).json({
								error: "Could not upload the document!",
							});
						} else {
							// save to database
							let newContent = {
								url:
									"/uploads/Finance_" +
									timestamp +
									"_" +
									requestID +
									".pdf",
								key:
									"Finance_" +
									timestamp +
									"_" +
									requestID +
									".pdf",
							};
							try {
								Tb01_CashProjection.findOneAndUpdate(
									{ _id: requestID },
									{ content: newContent }
								).exec((err, doc) => {
									res.json({
										message:
											"Document uploaded successfully",
									});
								});
							} catch (error) {
								return res.status(400).json({
									error: "Could not upload the document!",
								});
							}
						}
					});
				}
			});
		}
	});
};
