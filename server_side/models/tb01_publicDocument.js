const mongoose = require("mongoose");

const publicDocumentSchema = new mongoose.Schema(
	{
		title: {
            type: String,
            trim: true,
            required: true,
            max: 350,
        },
        description: {
            type: String,
            trim: true,
        },
        content: {
            url: String,
            key: String,
        },
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Tb01_PublicDocument", publicDocumentSchema);