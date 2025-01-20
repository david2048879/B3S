const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
    {
        docType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tb01_DocType",
            required: true,
        },
        documentFields: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            default: {}
        },
        documentTitle: {
            type: String,
            required: true
        },
        file: {
            type: String,
            required: true
        },
        index:{
            type:Number,
			default:0
        },
        scannedBy: {
            empCode: {
                type: Number,
                required: true,
                // unique: true,
                index: true,
            },
            empNames: {
                type: String,
                trim: true,
                required: true,
                max: 150,
            },
            email: {
                type: String,
                // unique: true,
                trim: true,
                lowercase: true,
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Tb01_Document_test", documentSchema);
