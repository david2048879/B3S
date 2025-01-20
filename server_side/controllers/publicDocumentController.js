const Tb01_PublicDocument = require("../models/tb01_publicDocument");
const formidable = require("formidable");
const fs = require("fs");

exports.addPublicDocument = async (req, res) => {
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
			const { title, description } = fields;
			// console.log(title)

			const { document } = files;
			if (document.size > 24000000) {
				return res.status(400).json({
					error: "Document must be less that 24Mb",
				});
			} else {
				let oldPath = files.document.filepath;
				const newPath =
					process.env.UPLOAD_FILES_PATH +
					timestamp +
					"_" +
					files.document.newFilename +
					".pdf";
				let rawData = fs.readFileSync(oldPath);
				fs.writeFile(newPath, rawData, function (err) {
					if (err) {
						console.log(err);
						return res
							.status(400)
							.json({ error: "Could not upload the document!" });
					}
				});

				// save to database
				let newContent = {
					url:
						"/uploads/" +
						timestamp +
						"_" +
						files.document.newFilename +
						".pdf",
					key: timestamp + "_" + files.document.newFilename + ".pdf",
				};
				const newPublicDocument = new Tb01_PublicDocument({
					title,
					description,
					content: newContent,
				});
				newPublicDocument.save((err, result) => {
					if (err) {
						console.log(err);
						return res
							.status(400)
							.json({ error: "Could not upload the document!" });
					} else {
						return res
							.status(200)
							.json({ message: "Document uploaded!" });
					}
				});
			}
		}
	});
};

exports.deletePublicDocument = (req, res) => {
	const { documentKey } = req.body;
	Tb01_PublicDocument.deleteOne({ "content.key": documentKey }).exec(
		(err, doc) => {
			if (err) {
				return res.status(400).json({
					error: "Unable to delete the document!",
				});
			}
			const filePathDel = process.env.UPLOAD_FILES_PATH + documentKey;

			fs.rmSync(filePathDel, {
				force: true,
			});

			res.json({
				message: "Document deleted successfully",
			});
		}
	);
};

exports.listPublicDocuments = async (req, res) => {
	const myPublicDocs = await Tb01_PublicDocument.find()
		.limit(25)
		.sort({ createdAt: -1 });
	return res.json({ myPublicDocs });
};

exports.listSearchPublicDocs = async (req, res) => {
	const { searchText } = req.body;
	const myPublicDocs = await Tb01_PublicDocument.find({
		$or: [
			{ title: { $regex: ".*(?i)" + searchText + ".*(?i)" } },
			{ description: { $regex: ".*(?i)" + searchText + ".*(?i)" } },
		],
	})
		.limit(25)
		.sort({ createdAt: -1 });
	return res.json({ myPublicDocs });
};
