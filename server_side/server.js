const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// connect to db
mongoose
	.connect(process.env.DATABASE_LOCAL)
	.then(() => console.log("DB connected"))
	.catch((err) => console.log(err));

//import routes
const authRoutes = require("./routes/authRoute");
const basicDataRoutes = require("./routes/basicDateRoute");
const staffRoutes = require("./routes/staffRoute");
const employeeRoutes = require("./routes/employeeRoute");
const salaryRoutes = require("./routes/salaryRoute");
const incentiveRoutes = require("./routes/incentiveRoute");
const publicDocuments = require("./routes/publicDocumentRoute");
const inflationAllowanceRoutes = require("./routes/inflationAllowanceRoute");
const cashProjectionRoures = require("./routes/cashProjectionRoute");
const leaveRoutes=require("./routes/leaveRoute")
const archiveRoute=require("./routes/archivingRoutes")
const dataTools = require("./routes/dataTools");

//app middlewares
app.use(morgan("dev"));
// app.use(bodyParser.json())
app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));
app.use(cors({ origin: "*" }));

//middleware
app.use("/api", authRoutes);
app.use("/api", basicDataRoutes);
app.use("/api", employeeRoutes);
app.use("/api", staffRoutes);
app.use("/api", salaryRoutes);
app.use("/api", incentiveRoutes);
app.use("/api", publicDocuments);
app.use("/api", inflationAllowanceRoutes);
app.use("/api", cashProjectionRoures);
app.use("/api", dataTools);
app.use("/api", leaveRoutes);
app.use("/api",archiveRoute)

app.use((err, req, res, next) => {
	if (err.name === "UnauthorizedError") {
		res.status(401).json({ error: err.name + ": " + err.message });
	}
});

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`API is running on port ${port}`));
