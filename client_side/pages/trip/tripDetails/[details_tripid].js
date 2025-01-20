import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import withStaff from "../../staff/withStaff";
import { API } from "../../../config";
import { formatDate } from "../../../helpers/dateFormatter";
import { formatNumber } from "../../../helpers/numberFormatter";

const detailsTrip = ({ token }) => {
	const router = useRouter();
	const { details_tripid } = router.query;
	const [loading, setLoading] = useState(false);
	const [currentTrip, setCurrentTrip] = useState({});
	const [tripDocuments, setTripDocuments] = useState([]);

	useEffect(() => {
		getTrip();
	}, [router]);

	const getTrip = async () => {
		setLoading(true);
		const response = await axios.get(
			`${API}/oneTripRequest/${details_tripid}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setCurrentTrip(response.data.tripRequest);
		setTripDocuments(response.data.tripRequest.tripDocuments);
		setLoading(false);
	};

	const viewTripForm = () => (
		<Fragment>
			<div className="row">
				<button
					className="btn btn-info btn-block"
					onClick={() =>
						router.push(`/trip/${currentTrip.staffEmpCode}`)
					}
				>
					Back
				</button>
			</div>
			<div className="row alert alert-secondary">
				<div className="col-md-12 mt-3">
					<label style={{ color: "purple", fontWeight: "bold" }}>
						Trip{" "}
					</label>{" "}
				</div>
				<div className="col-md-12 mb-1">
					<span style={{ fontWeight: "bold" }}>
						&emsp;&emsp;&emsp;Dates:&emsp;
					</span>{" "}
					<span>
						{formatDate(currentTrip.startDate)} -{" "}
						{formatDate(currentTrip.endDate)}
					</span>
				</div>
				<div className="col-md-12 mb-1">
					<span style={{ fontWeight: "bold" }}>
						&emsp;&emsp;&emsp;Destination:&emsp;
					</span>{" "}
					<span>{currentTrip.tripDestination}</span>
				</div>
				<div className="col-md-12 mb-1">
					<span style={{ fontWeight: "bold" }}>
						&emsp;&emsp;&emsp;Objective:&emsp;
					</span>{" "}
					<span>{currentTrip.tripObjective}</span>
				</div>
				<div className="col-md-12 mb-1">
					<span style={{ fontWeight: "bold" }}>
						&emsp;&emsp;&emsp;Status:&emsp;
					</span>{" "}
					<span>{currentTrip.requestStatus}</span>
				</div>
				{currentTrip.perdiemAmount > 0 && (
					<div className="col-md-12 mb-1">
						<span style={{ fontWeight: "bold" }}>
							&emsp;&emsp;&emsp;Perdiem:&emsp;
						</span>
						<span>{formatNumber(currentTrip.perdiemAmount)}</span>
						&emsp;
						<span>&emsp;{currentTrip.perdiemCurrency}</span>
					</div>
				)}
				{currentTrip.transportCostamount > 0 && (
					<div className="col-md-12 mb-1">
						<span style={{ fontWeight: "bold" }}>
							&emsp;&emsp;&emsp;Transport Fee:&emsp;
						</span>{" "}
						<span>
							{formatNumber(currentTrip.transportCostamount)}
						</span>
						&emsp;
						<span>{currentTrip.transportCostCurrency}</span>
					</div>
				)}
				{currentTrip.lineManagerTripComment && (
					<div className="col-md-12 mb-1">
						<span style={{ fontWeight: "bold" }}>
							&emsp;&emsp;&emsp;Line manager's Comment:&emsp;
						</span>{" "}
						<span>{currentTrip.lineManagerTripComment}</span>
					</div>
				)}
				{currentTrip.destinationManagerComment && (
					<div className="col-md-12 mb-1">
						<span style={{ fontWeight: "bold" }}>
							&emsp;&emsp;&emsp;Destination authority's
							Comment:&emsp;
						</span>{" "}
						<span>{currentTrip.destinationManagerComment}</span>
					</div>
				)}

				{currentTrip.lineManagerReportComment && (
					<div className="col-md-12 mb-1">
						<span style={{ fontWeight: "bold" }}>
							&emsp;&emsp;&emsp;Line manager's comment on the trip
							report:&emsp;
						</span>{" "}
						<span>{currentTrip.lineManagerReportComment}</span>
					</div>
				)}
				{/* ======================================================================= */}
				<div className="col-md-12 mt-3">
					<label style={{ color: "purple", fontWeight: "bold" }}>
						Line Manager{" "}
					</label>{" "}
				</div>
				<div className="col-md-12 mb-1">
					<span style={{ fontWeight: "bold" }}>
						&emsp;&emsp;&emsp;Names:&emsp;
					</span>{" "}
					<span>{currentTrip.lineManagerNames}</span>
				</div>
				<div className="col-md-12 mb-1">
					<span style={{ fontWeight: "bold" }}>
						&emsp;&emsp;&emsp;Email:&emsp;
					</span>{" "}
					<span>{currentTrip.lineManagerEmail}</span>
				</div>
				<div className="col-md-12 mb-1">
					<span style={{ fontWeight: "bold" }}>
						&emsp;&emsp;&emsp;Phone:&emsp;
					</span>{" "}
					<span>{currentTrip.lineManagerPhone}</span>
				</div>
				<div className="col-md-12 mb-1">
					<span style={{ fontWeight: "bold" }}>
						&emsp;&emsp;&emsp;Employe Code:&emsp;
					</span>{" "}
					<span>{currentTrip.lineManagerEmpCode}</span>
				</div>
				{/* ======================================================================= */}
				<div className="col-md-12 mt-3">
					<label style={{ color: "purple", fontWeight: "bold" }}>
						Destination Authority{" "}
					</label>{" "}
				</div>
				<div className="col-md-12 mb-1">
					<span style={{ fontWeight: "bold" }}>
						&emsp;&emsp;&emsp;Names:&emsp;
					</span>{" "}
					<span>{currentTrip.destinationManagerNames}</span>
				</div>
				<div className="col-md-12 mb-1">
					<span style={{ fontWeight: "bold" }}>
						&emsp;&emsp;&emsp;Email:&emsp;
					</span>{" "}
					<span>{currentTrip.destinationManagerEmail}</span>
				</div>
				<div className="col-md-12 mb-1">
					<span style={{ fontWeight: "bold" }}>
						&emsp;&emsp;&emsp;Phone:&emsp;
					</span>{" "}
					<span>{currentTrip.destinationManagerPhone}</span>
				</div>
				<div className="col-md-12 mb-1">
					<span style={{ fontWeight: "bold" }}>
						&emsp;&emsp;&emsp;Employe Code:&emsp;
					</span>{" "}
					<span>{currentTrip.destinationManagerEmpCode}</span>
				</div>
				{/* ======================================================================= */}

				{currentTrip.tripReport &&
					currentTrip.tripReport.length > 0 && (
						<div className="col-md-12 mt-3">
							<label
								style={{ color: "purple", fontWeight: "bold" }}
							>
								Summary of field visit report{" "}
							</label>{" "}
						</div>
					)}
				{currentTrip.tripReport &&
					currentTrip.tripReport.length > 0 && (
						<div className="col-md-12 mt-1">
							<span>{currentTrip.tripReport}</span>
						</div>
					)}
				{/* ======================================================================= */}
			</div>
			{currentTrip.tripDocuments &&
				currentTrip.tripDocuments.length > 0 && (
					<div className="col-md-12 mt-3">
						<label style={{ color: "purple", fontWeight: "bold" }}>
							Attached Documents{" "}
						</label>{" "}
					</div>
				)}
			{tripDocuments && tripDocuments.length > 0 && listTripDocument()}

			{currentTrip.requestStatus === "PENDING" && (
				<div className="row mt-1">
					<button
						className="btn  btn-primary btn-block"
						onClick={() =>
							router.push(`/trip/lineManager/${details_tripid}`)
						}
					>
						This request is not yet approved. Therefore, you can
						change Line manager, if needed.
					</button>
				</div>
			)}

			{!currentTrip.destinationManagerComment && (
				<div className="row mt-1">
					<button
						className="btn  btn-success btn-block"
						onClick={() =>
							router.push(
								`/trip/destinationManager/${details_tripid}`
							)
						}
					>
						No comment from destination authority yet. Therefore,
						you can change that person if needed.
					</button>
				</div>
			)}
			<div className="row mt-1">
				<button
					className="btn  btn-info btn-block"
					onClick={() =>
						router.push(`/trip/tripReport/${details_tripid}`)
					}
				>
					Add field visit report and upload necessary documents.
				</button>
			</div>
		</Fragment>
	);

	const listTripDocument = () =>
		tripDocuments &&
		tripDocuments.map((doc, i) => (
			<div key={i} className="row p-1">
				<div className="col">
					{doc.content ? (
						<a
							href={doc.content.url}
							target="_blank"
							className="text-info"
							rel="noopener noreferrer"
						>
							{doc.title.length <= 500
								? doc.title
								: doc.title.substring(0, 500) + "..."}
						</a>
					) : (
						""
					)}
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Details of Field Visit</h4>
				</div>

				{loading && (
					<div class="text-center">
						<div
							class="spinner-border spinner-border-sm text-primary"
							role="status"
						>
							<span class="sr-only">Loading...</span>
						</div>
					</div>
				)}
				{viewTripForm()}
			</div>
			{/* {JSON.stringify(state)} */}
		</Layout>
	);
};
export default withStaff(detailsTrip);
