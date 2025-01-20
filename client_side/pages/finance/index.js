import React, { Fragment } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
	CloseSquareOutlined,
	CheckSquareOutlined,
	ReadOutlined,
	UploadOutlined,
} from "@ant-design/icons";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Layout from "../../components/Layout";
import withStaff from "./withFinance";
import { API } from "../../config";
import { formatNumber } from "../../helpers/numberFormatter";
import { formatDate } from "../../helpers/dateFormatter";
import { showErrorMessage, showSuccessMessage } from "../../helpers/alerts";

const CashProjection = ({ token }) => {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const [modalPay, setModalPay] = useState(false);
	const [currentProjection, setCurrentProjection] = useState({});
	const [cashProjection, setCashProjection] = useState([]);
	const [searchText, setSearchText] = useState("");
	const [state, setState] = useState({
		currentRequestStatus: "",
		currentStatusComment: "",
		formData: process.browser && new FormData(),
		documentUploadText: "Choose a PDF Document",
		error: "",
		success: "",
	});
	const {
		currentRequestStatus,
		currentStatusComment,
		formData,
		documentUploadText,
		error,
		success,
	} = state;

	useEffect(() => {
		getAllCashProjection();
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => {
			setState({ ...state, error: "", success: "" });
		}, 7000);
		return () => clearTimeout(timer);
	}, [state]);

	const getAllCashProjection = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API}/allCashRequest/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setCashProjection(response.data);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};
	const getUpdatedCashProjection = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API}/updatedCashRequest/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setCashProjection(response.data);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const listCurrentWeekRequests = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API}/currentWeekRequests/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setCashProjection(response.data);
			setLoading(false);
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const updateProjectionDates = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${API}/changeRequestDates/`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			getAllCashProjection();
			setLoading(false);
			setState({
				...state,
				success: response && response.data && response.data.message,
			});
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const handleSearchChange = (e) => {
		setSearchText(e.target.value);
	};

	const handleChange = (name) => (e) => {
		setState({
			...state,
			[name]: e.target.value,
			error: "",
			success: "",
		});
	};

	const handleChangeDoc = (reqID) => (e) => {
		formData.set("document", e.target.files[0]);
		formData.set("requestID", reqID);
		setState({
			...state,
			error: "",
			success: e.target.files[0].name,
			// documentUploadText: e.target.files[0].name,
		});
		{
			success && showSuccessMessage(success);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.has("requestID")) {
			window.scroll(0, 0);
			return setState({
				...state,
				error: "Please, choose a document to upload!",
			});
		}
		setState({ ...state, documentUploadText: "Choose a PDF Document" });
		setLoading(true);
		try {
			const response = await axios.post(
				`${API}/addFinanceDocument`,
				formData,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			getUpdatedCashProjection();
			setLoading(false);
			setState({
				...state,
				formData: process.browser && new FormData(),
				documentUploadText: "Choose a PDF Document",
				success: response && response.data && response.data.message,
			});
		} catch (error) {
			setLoading(false);
			setState({
				...state,
				error:
					error &&
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const handleSearch = async (e) => {
		e.preventDefault();
		setLoading(true);
		const response = await axios.put(
			`${API}/searchCashRequest`,
			{ searchText },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		setCashProjection(response.data);
		setLoading(false);
		setSearchText("");
	};

	const toggle = (projection) => {
		setModal(!modal);
		setState({
			...state,
			currentRequestStatus: "CANCELLED",
		});
		setCurrentProjection(projection);
	};

	const togglePay = (projection) => {
		setModalPay(!modalPay);
		setState({
			...state,
			currentRequestStatus: "PROCESSED",
		});
		setCurrentProjection(projection);
	};

	const modalDialog = () => {
		return (
			<div>
				<Modal isOpen={modal} toggle={toggle}>
					<ModalHeader className="text-warning" toggle={toggle}>
						CANCELLING A CASH REQUEST
					</ModalHeader>
					<ModalBody>
						<div>
							Amount:&emsp;
							<strong>
								{currentProjection &&
									formatNumber(
										currentProjection.requestAmount
									)}{" "}
								{currentProjection &&
									currentProjection.currencyCode}
							</strong>
							<br />
							Bank:&emsp;
							<strong>
								{currentProjection &&
									currentProjection.bankName}
							</strong>
							<br />
							<br />
							<span className="text-danger">
								You're about to CANCEL the selected cash
								projection!
							</span>
						</div>

						<br />
						<textarea
							rows="3"
							onChange={handleChange("currentStatusComment")}
							className="form-control"
							value={currentStatusComment}
							placeholder="Enter your comment here"
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							color="warning"
							onClick={cancelPayCashRequest}
							title="Mark the request as CANCELLED."
						>
							Continue
						</Button>{" "}
						<Button color="secondary" onClick={toggle}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	};

	const modalPayDialog = () => {
		return (
			<div>
				<Modal isOpen={modalPay} toggle={togglePay}>
					<ModalHeader className="text-success" toggle={togglePay}>
						PROCESSING A CASH REQUEST
					</ModalHeader>
					<ModalBody>
						<div>
							Amount:&emsp;
							<strong>
								{currentProjection &&
									formatNumber(
										currentProjection.requestAmount
									)}{" "}
								{currentProjection &&
									currentProjection.currencyCode}
							</strong>
							<br />
							Bank:&emsp;
							<strong>
								{currentProjection &&
									currentProjection.bankName}
							</strong>
							<br />
							<br />
							{/* <span className="text-danger">
								You're about to APPROVE the selected cash
								projection!
							</span> */}
						</div>
						<br />
						<textarea
							rows="3"
							onChange={handleChange("currentStatusComment")}
							className="form-control"
							value={currentStatusComment}
							placeholder="Enter your comment here"
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							color="success"
							onClick={cancelPayCashRequest}
							title="Mark the request as APPROVED for payment."
						>
							Continue
						</Button>{" "}
						<Button
							color="warning"
							onClick={saveComment}
							title="Save the comment and leave the request as PENDING."
						>
							Save
						</Button>{" "}
						<Button color="secondary" onClick={togglePay}>
							Cancel
						</Button>
					</ModalFooter>
				</Modal>
			</div>
		);
	};

	const cancelPayCashRequest = async () => {
		setLoading(true);
		// setState({ ...state, buttonText: "Cancelling..." });
		try {
			const response = await axios.put(
				`${API}/cancelPayCashRequest/${currentProjection._id}`,
				{
					currentRequestStatus,
					currentStatusComment,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			getAllCashProjection();
			setLoading(false);
			setState({
				...state,
				currentRequestStatus: "",
				buttonText: "Save",
				success: response.data && response.data.message,
			});
			setModal(false);
			setModalPay(false);
		} catch (error) {
			setLoading(false);
			setModal(false);
			setModalPay(false);
			setState({
				...state,
				currentRequestStatus: "",
				buttonText: "Save",
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const saveComment = async () => {
		setLoading(true);
		try {
			const response = await axios.put(
				`${API}/cancelPayCashRequest/${currentProjection._id}`,
				{
					currentRequestStatus: "PENDING",
					currentStatusComment,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);
			getAllCashProjection();
			setLoading(false);
			setState({
				...state,
				currentRequestStatus: "",
				success: response.data && response.data.message,
			});
			setModal(false);
			setModalPay(false);
		} catch (error) {
			setLoading(false);
			setModal(false);
			setModalPay(false);
			setState({
				...state,
				currentRequestStatus: "",
				error:
					error.response &&
					error.response.data &&
					error.response.data.error,
			});
		}
	};

	const listAllCashRequests = () =>
		cashProjection &&
		cashProjection.cashRequests &&
		cashProjection.cashRequests.length > 0 &&
		cashProjection.cashRequests.map((cp, i) => (
			<div key={i} className="row alert alert-dark p-1">
				<div className="col-md-12">
					<span>{cp.bankName}</span>
					&emsp; &emsp;
					<span className="text-danger" style={{ fontSize: "13px" }}>
						{formatNumber(cp.requestAmount)} {cp.currencyCode}
					</span>
					&emsp; &emsp;
					<span className="text-muted" style={{ fontSize: "13px" }}>
						Posted on {formatDate(cp.requestDate)}
					</span>
					&emsp; &emsp;
					<span style={{ fontSize: "13px", fontWeight: "bold" }}>
						{cp.currentRequestStatus}
					</span>
					<br />
					<span>{cp.requesterName}</span>
					&emsp; &emsp;
					<span style={{ fontSize: "13px" }}>{cp.branchName}</span>
					&emsp; &emsp;
					<span style={{ fontSize: "13px" }}>
						{cp.departmentName}
					</span>
					<br />
					<span className="text-muted" style={{ fontSize: "13px" }}>
						Cash projection week of {formatDate(cp.weekStartDate)}{" "}
						to {formatDate(cp.weekEndDate)}
					</span>
					{cp.currentRequestStatus === "PROCESSED" && (
						<span
							className="text-primary"
							style={{ fontSize: "13px" }}
						>
							&emsp; &emsp; Processed on{" "}
							{formatDate(cp.currentRequestStatusDate)}
						</span>
					)}
					{cp.supplierName && <br />}
					{cp.supplierName && (
						<span
							className="text-danger"
							style={{ fontSize: "16px" }}
						>
							{cp.supplierName}
						</span>
					)}
					{cp.description && <br />}
					{cp.description && (
						<span style={{ fontSize: "16px" }}>
							{cp.description}
						</span>
					)}
					{cp.currentStatusComment && <br />}
					{cp.currentStatusComment && <br />}
					{cp.currentStatusComment && (
						<span style={{ fontSize: "16px", fontStyle: "italic" }}>
							{cp.currentStatusComment}
						</span>
					)}
					<hr />
					<div className="col-md-12">
						{cp.currentRequestStatus === "PENDING" && (
							<span
								className="btn float-left"
								onClick={() => toggle(cp)}
								title="Mark as cancelled"
							>
								<CloseSquareOutlined className="text-danger" />
							</span>
						)}

						{cp.currentRequestStatus === "PENDING" && (
							<span
								className="btn float-left"
								onClick={() => togglePay(cp)}
								title="Mark as processed"
							>
								<CheckSquareOutlined className="text-success" />
							</span>
						)}

						{cp.content && cp.content.url && (
							<span
								className="btn float-right"
								title="Read attached document"
							>
								<a
									href={cp.content.url}
									target="_blank"
									className="text-info"
									rel="noopener noreferrer"
								>
									Read
								</a>
							</span>
						)}
						{(!cp.content || !cp.content.url) && (
							<span
								className="btn float-right"
								onClick={handleSubmit}
								title="Upload selected document"
							>
								<UploadOutlined className="text-primary" />
							</span>
						)}
						{(!cp.content || !cp.content.url) && (
							<span
								className="btn float-right"
								title="Attach relevant documents (all combined in one PDF document)"
							>
								<label className="btn btn-sm">
									{documentUploadText}
									<input
										onChange={handleChangeDoc(cp._id)}
										type="file"
										accept="application/pdf"
										className="form-control"
										hidden
									/>
								</label>
							</span>
						)}
					</div>
					{/* )} */}
				</div>
			</div>
		));

	return (
		<Layout>
			<div className="col-md-10 offset-md-1 pt-2">
				<div className="row">
					<h4>Processing Cash Projection Requests</h4>
				</div>
				{cashProjection &&
					cashProjection.cashRequests &&
					cashProjection.cashRequests.length > 0 && (
						<span
							style={{
								fontSize: "14px",
								fontWeight: "bold",
								color: "purple",
							}}
						>
							{cashProjection.cashRequests.length > 1
								? cashProjection.cashRequests.length +
								  " requests found"
								: cashProjection.cashRequests.length +
								  " request found"}
						</span>
					)}
				{error && showErrorMessage(error)}
				{success && showSuccessMessage(success)}
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
				<div className="row ">
					<button
						className="btn btn-info btn-sm mr-1 form-group"
						onClick={() => router.push("/dashboard/")}
						title="Go back to main menu"
					>
						Back
					</button>
					<form
						className="form-inline col bg-info mb-3 px-1"
						onSubmit={handleSearch}
					>
						<input
							onChange={handleSearchChange}
							type="search"
							value={searchText}
							className="form-control my-1"
							placeholder='Type here part of paying bank or status of request or requester name, then press "Enter" to search.'
							style={{ width: "100%" }}
							title='Type here part of paying bank (Urwego, RIPPS, Transfer, etc.) or status of request (PENDING, PROCESSED or CANCELLED), or requester then press "Enter" to search.'
						/>
					</form>
					<button
						className="btn btn-success btn-sm ml-1 form-group"
						onClick={listCurrentWeekRequests}
						title="List requests pending for the current week"
					>
						Current
					</button>
					<button
						className="btn btn-primary btn-sm ml-1 form-group"
						onClick={updateProjectionDates}
						title="Move pending cash requests to new projection weeks and remove those that have been pending for more than 14 days."
					>
						Update
					</button>
					<button
						className="btn btn-primary btn-sm ml-1 form-group"
						onClick={() =>
							router.push("/finance/projectionReports/")
						}
						title="Download reports"
					>
						Reports
					</button>
				</div>

				{listAllCashRequests()}
			</div>
			{modalDialog()}
			{modalPayDialog()}
			{/* {JSON.stringify(currentRequestStatus)} */}
		</Layout>
	);
};
export default withStaff(CashProjection);
