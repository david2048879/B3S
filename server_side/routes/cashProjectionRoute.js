const express = require("express");
const router = express.Router();

//import controller methods
const {
	requireSignin,
	staffMiddleware,
	financeMiddleware,
} = require("../controllers/authController");

const {
	addCashRequest,
	editCashRequest,
	deleteCashRequest,
	listAllCashRequest,
	listOwnCashRequest,
	listSearchedOwnRequests,
	listSearchedRequests,
	readCashRequest,
	processCashRequest,
	updateRequestsWeekDates,
	reportRequestDates,
	exportReportRequestDates,
	listCurrentWeekRequests,
	addFinanceDocument,
	listUpdatedCashRequests,
} = require("../controllers/cashProjectionController");

router.put(
	"/editCashRequest/:cashRequestID",
	requireSignin,
	staffMiddleware,
	editCashRequest
);

router.put(
	"/deleteCashRequest/:cashRequestID",
	requireSignin,
	staffMiddleware,
	deleteCashRequest
);

router.post("/newCashRequest", requireSignin, staffMiddleware, addCashRequest);

router.get(
	"/ownCashRequest",
	requireSignin,
	staffMiddleware,
	listOwnCashRequest
);
router.put(
	"/searchOwnCashRequest",
	requireSignin,
	staffMiddleware,
	listSearchedOwnRequests
);

router.get(
	"/oneCashRequest/:cashRequestID",
	requireSignin,
	staffMiddleware,
	readCashRequest
);
////////////////////==================Finance===================////////////////
router.get(
	"/allCashRequest",
	requireSignin,
	financeMiddleware,
	listAllCashRequest
);
router.get(
	"/updatedCashRequest",
	requireSignin,
	financeMiddleware,
	listUpdatedCashRequests
);

router.get(
	"/currentWeekRequests",
	requireSignin,
	financeMiddleware,
	listCurrentWeekRequests
);
router.get(
	"/changeRequestDates",
	requireSignin,
	financeMiddleware,
	updateRequestsWeekDates
);

router.put(
	"/searchCashRequest",
	requireSignin,
	financeMiddleware,
	listSearchedRequests
);
router.put(
	"/cashProjectionReport",
	requireSignin,
	financeMiddleware,
	reportRequestDates
);

router.put(
	"/exportCashProjection",
	requireSignin,
	financeMiddleware,
	exportReportRequestDates
);

router.put(
	"/cancelPayCashRequest/:cashRequestID",
	requireSignin,
	financeMiddleware,
	processCashRequest
);

router.post(
	"/addFinanceDocument",
	requireSignin,
	financeMiddleware,
	addFinanceDocument
);

module.exports = router;
