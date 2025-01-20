const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

const fileUploadMiddleware = (req, res, next) => {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        if (err) {
	    console.log(err)
            return res.status(500).json({ error:err });
        }
        req.body=fields;
        if(req.body.file==="")
        {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const uploadedFile = files.file;
        console.log(uploadedFile.originalFilename);
        if (!files) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Move the uploaded file to a specified destination directory
        const newPath = path.join(__dirname, 'uploads', uploadedFile.originalFilename.split(".")[0] + uploadedFile.newFilename + "." + uploadedFile.originalFilename.split('.')[1]);
        fs.rename(uploadedFile.filepath, newPath, (err) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            req.uploadedFile = {
                name: uploadedFile.name,
                path: newPath,
            };

            next();
        });
    });
};

module.exports = fileUploadMiddleware;
