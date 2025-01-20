const Tb01_DocType = require("../models/tb01_docType")
const Tb01_Document = require("../models/tb01_document")
const userModel = require("../models/user")
const Tb01_Employee = require("../models/tb01_employee")
const Tb01_Scanning_Roles = require("../models/tb01_scanning_roles")
const path = require("path")
const fs=require("fs")
const {formatArchiveFileDates}=require("../helpers/dateHelper")


exports.addDocument = async (req, res) => {
    const document = new Tb01_Document(req.body)
    try {
        await document.save();
        res.status(200).json({ message: "successfully saved document" })
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

exports.addDocumentType = async (req, res) => {
    const documentType = new Tb01_DocType(req.body)
    try {
        await documentType.save()
        res.status(200).json({ message: "successfully saved document type" })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error })
    }
}

exports.updateOneDocumentType = async (req, res) => {
    try {
        const data = await Tb01_DocType.findOne({ _id: req.body.id });
        data.searchFields.forEach(type => {
            if (type._id.toString() === req.body.data._id) {
                type.maxLength = req.body.data.maxLength;
                type.minLength = req.body.data.minLength;
                type.docDataType = req.body.data.docDataType;
                type.name = req.body.data.name;
            }
        })
        await Tb01_DocType.findOneAndUpdate({ _id: data._id }, data)
        return res.status(200).json({ "message": "successfully saved" })
    } catch (error) {
        res.status(500).json(error)
    }
}


exports.getDocumentType = async (req, res) => {
    try {
        const docTypes = await Tb01_DocType.find()
        if (docTypes.length === 0) {
            return res.status(200).json({ dataPresent: false })
        }
        return res.status(200).json({ docTypes, dataPresent: true })
    } catch (error) {
        return res.status(500).json({ error })
    }
}

exports.deleteDocumentType = async (req, res) => {
    const id = req.params.id
    try {
        const docType = await Tb01_DocType.findOne({ _id: id });
        if (!docType) {
            return res.status(404).json({ message: 'document type not found' });
        }
        await Tb01_DocType.findOneAndDelete({ _id: docType._id });
        res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        res.status(500).json(error);
    }
}

exports.saveDocument = async (req, res) => {
    try {
        const filePath = path.resolve(req.files[0].path);
        const fields = JSON.parse(req.body.documentFields);
        const user = await userModel.findOne({ _id: req.user._id });
        const employee = await Tb01_Employee.findOne({ email: user.email });
        const docType = await Tb01_DocType.findById(req.body.docTypeId);

        if (!docType) {
            return res.status(404).json({ "message": "Document type not found" });
        }

        const dynamicFields = {};
        const validationErrors = [];

        docType.searchFields.forEach(field => {
            const value = fields[field.name];
            if (!value) {
                validationErrors.push(`Missing value for field: ${field.name}`);
            } else {
                dynamicFields[field.name] = value;
            }
        });

        if (validationErrors.length > 0) {
            return res.status(400).json({ "message": "Validation errors", errors: validationErrors });
        }

        let titleParts = [];
        docType.searchFields.forEach(field => {
            if (field.inTitle) {
                titleParts[field.titlePosition - 1] = dynamicFields[field.name] || '';
            }
        });
        const documentTitle = titleParts.filter(part => part !== '').map(part => part.trim().replace(/\s+/g, '-')).join('-')
        const fullTitle = `${docType.department.trim().replace(/\s+/g, '-')}-${docType.docType.trim().replace(/\s+/g, '-')}-${documentTitle}`        
        const originalFilePath = path.resolve(filePath);
        const directory = path.dirname(originalFilePath);
        const fileExtension = path.extname(filePath);
        const newFilePath = path.join(directory, fullTitle+'-'+formatArchiveFileDates(Date.now())+'-'+Math.round(Math.random() * 1E4)+fileExtension);
        fs.rename(filePath, newFilePath, (err) => {
            if (err) {

              console.error('Error renaming the file:', err);
              return res.status(500).send('Error renaming file');
            }
        })
        const document = new Tb01_Document({
            docType: docType._id,
            documentFields: dynamicFields,
            scannedBy: {
                empCode: employee.empCode,
                empNames: employee.empNames,
                email: employee.email
            },
            documentTitle: fullTitle,
            file: newFilePath
        });
        docType.count = docType.count + 1;
        await document.save();
        document.index=docType.count
        await Tb01_Document.findOneAndUpdate({ _id: document._id }, document)
        await Tb01_DocType.findOneAndUpdate({ _id: docType._id }, docType)
        return res.status(200).json({ message: "Successfully saved","index":document.index });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};


exports.getScannedDocuments = async (req, res) => {
    try {
        const docType = await Tb01_DocType.findOne({
            department: req.body.department,
            docType: req.body.docType
        });
        if (!docType) {
            return res.status(200).json({ dataPresent: false });
        }
        const documents = await Tb01_Document.find({ docType: docType._id }).populate('docType');
        if (documents.length === 0) {
            return res.status(200).json({ dataPresent: false });
        }
        return res.status(200).json({ documents, dataPresent: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching documents' });
    }
};

exports.getMyScannedDocuments = async (req, res) => {
    try {
        const docType = await Tb01_DocType.findOne({
            department: req.body.department,
            docType: req.body.docType,
        });
        if (!docType) {
            return res.status(200).json({ dataPresent: false });
        }
        const documents = await Tb01_Document.find({ docType: docType._id, "scannedBy.empCode": req.body.empCode }).populate('docType');
        if (documents.length === 0) {
            return res.status(200).json({ dataPresent: false });
        }
        return res.status(200).json({ documents, dataPresent: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching documents' });
    }
};


exports.modifyDocument = async (req, res) => {
    try {
        const { id, processData } = req.body;
        const document = await Tb01_Document.findById(id);
        if (!document) {
            return res.status(404).json({ success: false, message: 'Document not found' });
        }
        Object.keys(processData).forEach((key) => {
            if (document.documentFields.has(key)) {
                document.documentFields.set(key, processData[key]);
            }
        });
        await document.save();
        return res.status(200).json({ success: true, message: 'Document updated successfully', document });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while modifying the document' });
    }
};

exports.deleteScannedDocument = async (req, res) => {
    const id = req.body.id
    try {
        const document = await Tb01_Document.findOne({ _id: id });
        if (!document) {
            return res.status(404).json({ message: 'document type not found' });
        }
        await Tb01_Document.findOneAndDelete({ _id: document._id });
        res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        console.log("error", error);

        res.status(500).json(error);
    }
}


exports.countDocumentScannedPerMonth = async (req, res) => {
    try {
        const scannedPerMonth = await Tb01_Document.find({ "scannedBy.empCode": req.body.empCode });
        if (scannedPerMonth.length === 0) {
            const countsPerMonth = Array.from({ length: 12 }, () => ({ count: 0 }));
            return res.status(200).json({ countsPerMonth });
        } else {
            const countsPerMonth = Array.from({ length: 12 }, () => ({ count: 0 }));
            scannedPerMonth.forEach(scanned => {
                const scannedMonth = scanned.createdAt.getMonth();
                countsPerMonth[scannedMonth].count++;
            });
            return res.status(200).json({ countsPerMonth });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
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


exports.getScannedDocumentStats = async (req, res) => {
    try {
        const scannedDocuments = await Tb01_Document.find();
        const userScannedDocuments = await Tb01_Document.find({ "scannedBy.empCode": req.body.empCode });
        if (!scannedDocuments || scannedDocuments.length === 0) {
            return res.status(404).json({ message: 'No documents found' });
        }
        const documentsByDate = scannedDocuments.reduce((acc, doc) => {
            const date = new Date(doc.createdAt).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = 0;
            }
            acc[date] += 1;
            return acc;
        }, {});
        const totalDays = Object.keys(documentsByDate).length;
        const totalDocuments = scannedDocuments.length;
        const averageDocumentsPerDay = totalDocuments / totalDays;
        res.status(200).json({
            allScannedDocuments: scannedDocuments.length,
            "userScannedDocuments":userScannedDocuments.length,
            averageDocumentsPerDay,
            message: "Statistics calculated successfully"
        });

    } catch (error) {
        console.log("error", error);
        res.status(500).json(error);
    }
}


exports.addScanningRoles = async (req, res) => {
	try {
		const { empCode, role } = req.body;
		const employee = await Tb01_Employee.findOne({ empCode: empCode });

		if (!employee) {
			return res.status(400).json({ error: "Employee not found" });
		}
		const existingSupervisor = await Tb01_Scanning_Roles.findOne({ staff: employee._id });

		if (existingSupervisor) {
			return res.status(402).json({ error: "Supervisor with this role already exists for the employee" });
		}
		let userRole;
		if (req.body.role) {
			userRole = new Tb01_Scanning_Roles({
				staff: employee._id,
				role,
			});
		}
		await userRole.save();
		return res.status(200).json({ message: "Supervisor added successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

exports.getAllStaffRoles = async (req, res) => {
	try {
		const userRoles  = await Tb01_Scanning_Roles.find().populate({
			path: 'staff',
			select: 'empNames currentAppointment.jobTitle currentAppointment.department',
		})
		if (!userRoles) {
			return res.status(404).json({ error: "No supervisors found" });
		}
		return res.status(200).json(userRoles);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};
exports.deleteUserRole = async (req, res) => {
	try {
		const { id } = req.params;
		const userRole = await Tb01_Scanning_Roles.findByIdAndDelete(id);
		if (!userRole) {
			return res.status(404).json({ error: "user role not found" });
		}
		return res.status(200).json({ message: "user role deleted successfully" });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

exports.getSupervisorRole = async (req, res) => {
	try {
		const staff = req.body.staff;
		const employee = await Tb01_Employee.findOne({ empCode: staff });
		if (!employee) {
			return res.status(404).json({ error: "Employee not found" });
		}
		const userRole = await Tb01_Scanning_Roles.findOne({ staff: employee._id });
		let dataPresent
		if (!userRole) {
			dataPresent = false
		}
		else {
			dataPresent = true
		}
        console.log("user role",userRole);
        
		return res.status(200).json({ "dataPresent": dataPresent, userRole });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

exports.getAllScannedDocuments = async (req, res) => {
	try {
		const allDocs = await Tb01_Document.find()
		return res.status(200).json(allDocs);
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: "Internal server error" });
	}
};

exports.getOneDocument = async (req, res) => {
    const id = req.params.id
    try {
        const document = await Tb01_Document.findOne({ _id: id });
        const documentUrl = document.file;        
        res.status(200).sendFile(documentUrl)
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: err })
    }
}