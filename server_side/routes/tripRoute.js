const express = require("express");
const router = express.Router();

//import controller methods
const {
	requireSignin,
	staffMiddleware,
	logisticsMiddleware,
	hrMiddleware,
} = require("../controllers/authController");

const {
	addTrip,
	editTrip,
	editTripReport,
	editTripPerdiem,
	editLineManager,
	editDestinationManager,
	readTripRequest,
	deleteTripRequest,
	listOwnTripRequest,
	listSearchedRequests,
	listSearchedOwnRequests,
	listManagerApprovalPending,
	listTripRequestsPerManager,
	editRequestStatus,
	editTripReportComment,
	listDestManagerTrips,
	editDestinationManagerComment,
	listDmtEmployees,
	listSearchedProfilesStaff,
	selectLineManager,
	selectDestinationManager,
	listBranchManagers,
	editTripTransport,
	listLogisticTrips,
	createTripDocument,
	deleteTripDocument,
} = require("../controllers/tripController");

router.post("/newTrip/", requireSignin, staffMiddleware, addTrip);
router.put("/editTrip/:tripID", requireSignin, staffMiddleware, editTrip);
router.put(
	"/editTripReport/:tripID",
	requireSignin,
	staffMiddleware,
	editTripReport
);

router.put(
	"/lineManager/:tripID",
	requireSignin,
	staffMiddleware,
	editLineManager
);

router.put(
	"/destinationManager/:tripID",
	requireSignin,
	staffMiddleware,
	editDestinationManager
);

router.put(
	"/deleteTrip/:tripID",
	requireSignin,
	staffMiddleware,
	deleteTripRequest
);

router.get(
	"/oneTripRequest/:tripID",
	requireSignin,
	staffMiddleware,
	readTripRequest
);

router.get(
	"/ownTripRequest",
	requireSignin,
	staffMiddleware,
	listOwnTripRequest
);

router.get(
	"/departmentEmployees",
	requireSignin,
	staffMiddleware,
	listDmtEmployees
);
router.get(
	"/branchManagerEmployees",
	requireSignin,
	staffMiddleware,
	listBranchManagers
);

router.put(
	"/searchOwnTripRequest",
	requireSignin,
	staffMiddleware,
	listSearchedOwnRequests
);
router.post(
	"/searchTripRequest",
	requireSignin,
	staffMiddleware,
	listSearchedRequests
);

router.post(
	"/tripDocument/:tripid",
	requireSignin,
	staffMiddleware,
	createTripDocument
);

router.put(
	"/delTripDocument/:tripid",
	requireSignin,
	staffMiddleware,
	deleteTripDocument
);

//==========Line manager===============
router.get(
	"/pendingRequestsPerManager",
	requireSignin,
	staffMiddleware,
	listManagerApprovalPending
);

router.get(
	"/allTripRequestsPerManager",
	requireSignin,
	staffMiddleware,
	listTripRequestsPerManager
);

router.put(
	"/editRequestStatus/:tripID",
	requireSignin,
	staffMiddleware,
	editRequestStatus
);
router.put(
	"/selectLineManager/",
	requireSignin,
	staffMiddleware,
	selectLineManager
);
router.put(
	"/selectDestinationManager/",
	requireSignin,
	staffMiddleware,
	selectDestinationManager
);

router.put(
	"/editTripReportComment/:tripID",
	requireSignin,
	staffMiddleware,
	editTripReportComment
);

router.post(
	"/searchProfilesStaff",
	requireSignin,
	staffMiddleware,
	listSearchedProfilesStaff
);

//==========Destination manager===============
router.get(
	"/destinationManagerTrips",
	requireSignin,
	staffMiddleware,
	listDestManagerTrips
);

router.put(
	"/destinationManagerComment/:tripID",
	requireSignin,
	staffMiddleware,
	editDestinationManagerComment
);
//==========Logistic===============
router.get("/logisticTrips", requireSignin, staffMiddleware, listLogisticTrips);

router.put(
	"/tripTransport/:tripID",
	requireSignin,
	logisticsMiddleware,
	editTripTransport
);
//==========HR Staff===============
router.get("/perdiemTrips", requireSignin, staffMiddleware, listLogisticTrips);

router.put(
	"/tripPerdiem/:tripID",
	requireSignin,
	hrMiddleware,
	editTripPerdiem
);

module.exports = router;
