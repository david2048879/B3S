const express = require("express");
const router = express.Router();

//import controller methods
const {
	requireSignin,
	hrMiddleware,
	staffMiddleware,
	infoSharingMiddleware,
} = require("../controllers/authController");

const {
	addPublicDocument,
	deletePublicDocument,
	listPublicDocuments,
	listSearchPublicDocs,
} = require("../controllers/publicDocumentController");

router.get(
	"/listPublicDocuments",
	requireSignin,
	staffMiddleware,
	listPublicDocuments
);

router.put(
	"/listSearchedPublicDocuments",
	requireSignin,
	staffMiddleware,
	listSearchPublicDocs
);

router.post(
	"/addPublicDocument",
	requireSignin,
	hrMiddleware,
	addPublicDocument
);

router.post(
	"/addPublicDocumentInfoSharing",
	requireSignin,
	infoSharingMiddleware,
	addPublicDocument
);

router.put(
	"/delPublicDocument",
	requireSignin,
	hrMiddleware,
	deletePublicDocument
);
router.put(
	"/delPublicDocumentInfoSharing",
	requireSignin,
	infoSharingMiddleware,
	deletePublicDocument
);

module.exports = router;
