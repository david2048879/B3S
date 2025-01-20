const express = require("express");
const router = express.Router();
const uploadDocument = require("../middlewares/eFilingUpload")

const {
	requireSignin,
	staffMiddleware,
} = require("../controllers/authController");

const { addDocument,
	saveDocument,
	deleteDocumentType,
	getDocumentType,
	updateOneDocumentType,
	addDocumentType,
	getScannedDocuments,
	modifyDocument,
	deleteScannedDocument,
	getMyScannedDocuments,
	countDocumentScannedPerMonth,
	getScannedDocumentStats,
	getAllEmployees,
	addScanningRoles,
	getAllStaffRoles,
	deleteUserRole,
	getSupervisorRole,
	getAllScannedDocuments,
	getOneDocument
} = require("../controllers/archivingController");

router.post("/archive/save/document", requireSignin, staffMiddleware, uploadDocument, saveDocument)
router.post("/archive/add/documenttype", requireSignin, staffMiddleware, addDocumentType)
router.post("/archive/delete/documenttype/:id", requireSignin, staffMiddleware, deleteDocumentType)
router.get("/archive/documenttype", requireSignin, staffMiddleware, getDocumentType)
router.put("/archive/document/type/modify", requireSignin, staffMiddleware, updateOneDocumentType)
router.post("/archive/scanned/documents", requireSignin, staffMiddleware, getScannedDocuments)
router.post("/archive/scanned/documents/me", requireSignin, staffMiddleware, getMyScannedDocuments)
router.post("/archive/scanned/update", requireSignin, staffMiddleware, modifyDocument)
router.post("/archive/scanned/delete", requireSignin, staffMiddleware, deleteScannedDocument)
router.post("/archive/stats/scanpermonth", requireSignin, staffMiddleware, countDocumentScannedPerMonth)
router.post("/archive/stats/mystats", requireSignin, staffMiddleware, getScannedDocumentStats)
router.get("/archive/admin/employees", requireSignin, staffMiddleware, getAllEmployees)
router.post("/archive/admin/addscanroles", requireSignin, staffMiddleware, addScanningRoles)
router.get("/archive/admin/userroles", requireSignin, staffMiddleware, getAllStaffRoles)
router.get("/archive/admin/deleterole", requireSignin, staffMiddleware, getAllStaffRoles)
router.delete("/archive/admin/deleterole/:id", requireSignin, staffMiddleware, deleteUserRole)
router.post("/archive/admin/getuserroledetails", requireSignin, staffMiddleware, getSupervisorRole)
router.get("/archive/admin/alldocs", requireSignin, staffMiddleware, getAllScannedDocuments)
router.get("/archive/scanned/file/get/:id", requireSignin,staffMiddleware, getOneDocument);
module.exports = router;

